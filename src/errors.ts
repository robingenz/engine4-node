/**
 * Error thrown when the ENGINE4 API responds with a non-2xx status code.
 */
export class ENGINE4Error extends Error {
  /**
   * The HTTP status code of the response.
   */
  public readonly status: number;
  /**
   * The HTTP status text of the response.
   */
  public readonly statusText: string;
  /**
   * The parsed response body, if any.
   */
  public readonly body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(extractMessage(body) ?? `ENGINE4 API error: ${status} ${statusText}`);
    this.name = 'ENGINE4Error';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (typeof body === 'string') {
    return body || undefined;
  }
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    // `error_description` and `error` are used by OAuth 2.0 error responses (e.g. `/token`).
    for (const key of ['message', 'error_description', 'error']) {
      const value = record[key];
      if (typeof value === 'string') {
        return value;
      }
    }
  }
  return undefined;
}
