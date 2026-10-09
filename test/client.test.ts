import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import type {
  CustomValue,
  CustomValueOf,
  FetchFilterOptions,
  GenericDataElement,
  GetOptions,
  SavedItemReference,
} from '../src/index';
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

  it('authenticates with client credentials and requests a refresh token', async () => {
    const { getLastRequest } = mockFetchJson({});

    await client.authenticate({ clientId: 'c', clientSecret: 's', withRefreshToken: true });

    expect(String(getLastRequest().init.body)).toBe(
      'grant_type=client_credentials&client_secret=s&client_id=c&with_refresh_token=true',
    );
  });

  it('maps nested filter groups and array values', async () => {
    const { getLastRequest } = mockFetchJson([]);

    await client.fetch({
      accessToken,
      entityId: 'e',
      viewId: 'v',
      filter: {
        logic: 'OR',
        groups: [
          { genericName: 'Custom_001', compareOperator: CompareOperator.In, value: ['a', 'b'] },
          {
            logic: 'AND',
            groups: [
              { genericName: 'Custom_004_DisplayValue', compareOperator: CompareOperator.IsNull },
            ],
          },
        ],
      },
    });

    const body = JSON.parse(getLastRequest().init.body as string);
    expect(body.ViewId).toBe('v');
    expect(body.Filter).toEqual({
      Logic: 'OR',
      Groups: [
        { GenericName: 'Custom_001', CompareOperator: 'IN', Value: '["a","b"]' },
        {
          Logic: 'AND',
          Groups: [{ GenericName: 'Custom_004_DisplayValue', CompareOperator: 'ISNULL' }],
        },
      ],
    });
  });

  it('requests typed custom values', async () => {
    const { getLastRequest } = mockFetchJson({ Custom_001: 12 });

    const typed = await client.get({
      accessToken,
      entityId: 'e',
      dataId: 'd',
      convertAllCustomDataToStrings: false,
    });

    expect(getLastRequest().url).toBe(
      'https://example.engine4.io/webapi/external/get?entityId=e&dataId=d&convertAllCustomDataToStrings=false',
    );
    expectTypeOf(typed.item).toEqualTypeOf<GenericDataElement<CustomValue>>();
    const untyped = await client.get({ accessToken, entityId: 'e', dataId: 'd' });
    expectTypeOf(untyped.item).toEqualTypeOf<GenericDataElement<string>>();
  });

  it('types custom values as typed whenever strings may be disabled', () => {
    expectTypeOf<CustomValueOf<{ convertAllCustomDataToStrings: true }>>().toEqualTypeOf<string>();
    expectTypeOf<
      CustomValueOf<{ convertAllCustomDataToStrings: false }>
    >().toEqualTypeOf<CustomValue>();
    expectTypeOf<CustomValueOf<GetOptions>>().toEqualTypeOf<CustomValue>();
  });

  it('requires a filter value matching the operator', () => {
    const filters: FetchFilterOptions[] = [
      // @ts-expect-error `In` requires an array
      { genericName: 'Custom_001', compareOperator: CompareOperator.In, value: 'a' },
      // @ts-expect-error `Equal` requires a value
      { genericName: 'Custom_001', compareOperator: CompareOperator.Equal },
      // @ts-expect-error `IsNull` takes no value
      { genericName: 'Custom_001', compareOperator: CompareOperator.IsNull, value: 'a' },
    ];
    expect(filters).toHaveLength(3);
  });

  it('types the saveAll result by return type', async () => {
    mockFetchJson([]);
    const items = [{ EntityId: 'e', Custom_001: 1 }];

    const none = await client.saveAll({ accessToken, items });
    const dataId = await client.saveAll({ accessToken, items, returnType: 'dataId' });
    const full = await client.saveAll({ accessToken, items, returnType: 'full' });

    expectTypeOf(none.items).toEqualTypeOf<[]>();
    expectTypeOf(dataId.items).toEqualTypeOf<SavedItemReference[]>();
    expectTypeOf(full.items).toEqualTypeOf<GenericDataElement[]>();
  });

  it('returns attachments with file metadata', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Uint8Array([1, 2, 3]))),
    );

    const result = await client.fetchAttachment({ accessToken, dataId: 'd' });

    expect(result.item).toEqual(Buffer.from([1, 2, 3]));
  });

  it('falls back to the plain filename on malformed encoding', async () => {
    const headers = {
      'content-disposition': `attachment; filename="a.pdf"; filename*=UTF-8''%E0%A4%A.pdf`,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Uint8Array(), { headers })),
    );

    const result = await client.fetchAttachment({ accessToken, dataId: 'd' });

    expect(result.filename).toBe('a.pdf');
  });

  it('uploads attachments as multipart form data', async () => {
    const { getLastRequest } = mockFetchJson({ DataId: 'a' });

    const result = await client.saveAttachment({
      accessToken,
      parentEntityId: 'e',
      parentDataId: 'd',
      file: new Uint8Array([1, 2, 3]),
      filename: 'a.txt',
      mimeType: 'text/plain',
    });

    const { url, init } = getLastRequest();
    const form = init.body as FormData;
    const file = form.get('file') as File;
    expect(url).toBe('https://example.engine4.io/webapi/external/saveAttachmentFormData');
    expect(JSON.parse(form.get('input') as string)).toEqual({
      ParentEntityId: 'e',
      ParentDataId: 'd',
      Filename: 'a.txt',
      MimeType: 'text/plain',
    });
    expect(file.name).toBe('a.txt');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    expect(result).toEqual({ dataId: 'a' });
  });

  it('uploads single documents', async () => {
    const { getLastRequest } = mockFetchJson({ DataId: 'a' });

    await client.saveSingleDocument({
      accessToken,
      entityId: 'e',
      dataId: 'd',
      columnName: 'Custom_021',
      file: new Blob(['x']),
      filename: 'a.txt',
      mimeType: 'text/plain',
      expectedHash: 'h',
    });

    const form = getLastRequest().init.body as FormData;
    expect(JSON.parse(form.get('input') as string)).toEqual({
      EntityId: 'e',
      DataId: 'd',
      ColumnName: 'Custom_021',
      Filename: 'a.txt',
      MimeType: 'text/plain',
      ExpectedHash: 'h',
    });
  });

  it('fetches single documents', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Uint8Array([1]))),
    );

    const result = await client.fetchSingleDocument({
      accessToken,
      entityId: 'e',
      dataId: 'd',
      columnName: 'Custom_021',
    });

    expect(result.item).toEqual(Buffer.from([1]));
  });

  it('fetches entity metadata', async () => {
    const { getLastRequest } = mockFetchJson([{ PropertyName: 'Name' }]);

    const properties = await client.getGenericProperties({ accessToken, entityId: 'e' });
    expect(getLastRequest().url).toBe(
      'https://example.engine4.io/webapi/external/GetGenericProperties?entityId=e',
    );
    expect(properties.items).toEqual([{ PropertyName: 'Name' }]);

    await client.getGenericEntities({ accessToken });
    expect(getLastRequest().url).toBe(
      'https://example.engine4.io/webapi/external/GetGenericEntities',
    );

    await client.getGenericViews({ accessToken, entityId: 'e', viewType: 'List' });
    expect(getLastRequest().url).toBe(
      'https://example.engine4.io/webapi/external/GetGenericViews?entityId=e&viewType=List',
    );

    await client.getGenericViewFields({ accessToken, viewId: 'v' });
    expect(getLastRequest().url).toBe(
      'https://example.engine4.io/webapi/external/GetGenericViewFields?viewId=v',
    );
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
