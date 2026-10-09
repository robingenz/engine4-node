import { ENGINE4Error } from './errors';

export type QueryParams = Record<string, string | string[] | boolean | undefined>;

export interface RequestOptions {
  method: string;
  path: string;
  accessToken?: string;
  query?: QueryParams;
  /**
   * Sent as is if `URLSearchParams` or `FormData`, otherwise as JSON.
   */
  body?: unknown;
}

/**
 * Thin wrapper around `fetch` that handles authentication, query/body
 * serialization, and error mapping. Used internally by the client.
 */
export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Performs a request and parses the JSON response body.
   */
  public async requestJson<T>(options: RequestOptions): Promise<T> {
    const response = await this.request(options, { Accept: 'application/json' });
    return (await response.json()) as T;
  }

  /**
   * Performs a request and returns the successful response.
   */
  public async request(
    options: RequestOptions,
    headers: Record<string, string> = {},
  ): Promise<Response> {
    if (options.accessToken) {
      headers.Authorization = `Bearer ${options.accessToken}`;
    }
    let body: URLSearchParams | FormData | string | undefined;
    if (options.body instanceof URLSearchParams || options.body instanceof FormData) {
      body = options.body;
    } else if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
    const response = await fetch(this.createUrl(options.path, options.query), {
      method: options.method,
      headers,
      body,
    });
    if (!response.ok) {
      throw await this.createError(response);
    }
    return response;
  }

  private createUrl(path: string, query?: QueryParams): string {
    const url = new URL(path, this.baseUrl);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined) {
        continue;
      }
      for (const item of Array.isArray(value) ? value : [value]) {
        url.searchParams.append(key, String(item));
      }
    }
    return url.toString();
  }

  private async createError(response: Response): Promise<ENGINE4Error> {
    const text = await response.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      body = text;
    }
    return new ENGINE4Error(response.status, response.statusText, body);
  }
}
