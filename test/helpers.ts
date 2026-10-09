import { vi } from 'vitest';

export interface MockFetchResult {
  fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;
  getLastRequest: () => { url: string; init: RequestInit };
}

/**
 * Replaces the global `fetch` with a mock returning the given JSON body.
 */
export function mockFetchJson(body: unknown, status = 200): MockFetchResult {
  const fetchMock = vi.fn<typeof fetch>(async () => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return {
    fetchMock,
    getLastRequest: () => {
      const [url, init = {}] = fetchMock.mock.calls.at(-1) ?? [];
      return { url: String(url), init };
    },
  };
}
