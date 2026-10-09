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
    const message = (body as Record<string, unknown>).message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return undefined;
}
