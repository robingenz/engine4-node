import { afterEach, describe, expect, it, vi } from 'vitest';
import { CompareOperator, ENGINE4, ENGINE4Error } from '../src/index';
import { mockFetchJson } from './helpers';

const BASE_URL = 'https://example.engine4.io/';
const accessToken = 'test-token';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ENGINE4', () => {
  const client = new ENGINE4({ baseUrl: BASE_URL });

  it('authenticates with form-encoded credentials', async () => {
    const { getLastRequest } = mockFetchJson({
      access_token: 'a',
      expires_in: 3600,
      token_type: 'Bearer',
      refresh_token: 'r',
      scope: 's',
    });

    const result = await client.authenticate({ username: 'u', password: 'p', clientId: 'c' });

    const { url, init } = getLastRequest();
    expect(url).toBe('https://example.engine4.io/token');
    expect(init.method).toBe('POST');
    expect(String(init.body)).toBe('grant_type=password&username=u&password=p&client_id=c');
    expect(result).toEqual({
      accessToken: 'a',
      expiresIn: 3600,
      tokenType: 'Bearer',
      refreshToken: 'r',
      scope: 's',
    });
  });

  it('sends the bearer token', async () => {
    const { getLastRequest } = mockFetchJson({});

    await client.get({ accessToken, entityId: 'e', dataId: 'd' });

    const { url, init } = getLastRequest();
    expect(url).toBe('https://example.engine4.io/webapi/external/get?entityId=e&dataId=d');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
  });

  it('deletes a data element', async () => {
    const { getLastRequest } = mockFetchJson(null);

    await client.delete({ accessToken, entityId: 'e', dataId: 'd' });

    const { url, init } = getLastRequest();
    expect(url).toBe('https://example.engine4.io/webapi/external/delete?entityId=e&dataId=d');
    expect(init.method).toBe('DELETE');
  });

  it('repeats array query parameters', async () => {
    const { getLastRequest } = mockFetchJson([]);

    await client.getMultiple({ accessToken, entityId: 'e', dataIds: ['1', '2'] });

    expect(getLastRequest().url).toBe(
      'https://example.engine4.io/webapi/external/getMultiple?entityId=e&dataIds=1&dataIds=2',
    );
  });

  it('maps fetch options to the API body', async () => {
    const { getLastRequest } = mockFetchJson([{ DataId: '1' }]);

    const result = await client.fetch({
      accessToken,
      entityId: 'e',
      take: 10,
      filter: { genericName: 'Custom_001', compareOperator: CompareOperator.Equal, value: 'x' },
      sorting: [{ genericName: 'Custom_002', sort: 'desc' }],
    });

    expect(JSON.parse(getLastRequest().init.body as string)).toEqual({
      EntityId: 'e',
      Take: 10,
      Filter: { GenericName: 'Custom_001', CompareOperator: '=', Value: 'x' },
      Sortings: [{ GenericName: 'Custom_002', Descending: true }],
    });
    expect(result.items).toEqual([{ DataId: '1' }]);
  });

  it('returns no items when saving with return type none', async () => {
    const { getLastRequest } = mockFetchJson([{ DataId: '1' }]);

    const result = await client.saveAll({ accessToken, items: [] });

    expect(JSON.parse(getLastRequest().init.body as string)).toEqual({
      items: [],
      returnType: 'none',
    });
    expect(result.items).toEqual([]);
  });

  it('returns saved items for other return types', async () => {
    mockFetchJson([{ DataId: '1' }]);

    const result = await client.saveAll({ accessToken, items: [], returnType: 'dataId' });

    expect(result.items).toEqual([{ DataId: '1' }]);
  });

  it('returns attachments as buffer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Uint8Array([1, 2, 3]))),
    );

    const result = await client.fetchAttachment({ accessToken, dataId: 'd' });

    expect(result.item).toEqual(Buffer.from([1, 2, 3]));
  });

  it('throws an ENGINE4Error with the parsed body on failure', async () => {
    mockFetchJson({ message: 'Not found' }, 404);

    const error = await client.get({ accessToken, entityId: 'e', dataId: 'd' }).catch((e) => e);

    expect(error).toBeInstanceOf(ENGINE4Error);
    expect(error).toMatchObject({
      status: 404,
      message: 'Not found',
      body: { message: 'Not found' },
    });
  });
});
