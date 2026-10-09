import { ENDPOINTS } from './constants';
import { HttpClient } from './http-client';
import type {
  AuthenticateOptions,
  AuthenticateResult,
  BaseOptions,
  CustomValueOf,
  DeleteMultipleOptions,
  DeleteOptions,
  ENGINE4Options,
  FetchAttachmentOptions,
  FetchAttachmentResult,
  FetchFilterOptions,
  FetchOptions,
  FetchResult,
  FetchSingleDocumentOptions,
  FetchSingleDocumentResult,
  GenericDataElement,
  GenericEntity,
  GenericProperty,
  GenericView,
  GenericViewField,
  GetGenericEntitiesResult,
  GetGenericPropertiesOptions,
  GetGenericPropertiesResult,
  GetGenericViewFieldsOptions,
  GetGenericViewFieldsResult,
  GetGenericViewsOptions,
  GetGenericViewsResult,
  GetMultipleOptions,
  GetMultipleResult,
  GetOptions,
  GetResult,
  SaveAllOptions,
  SaveAllResult,
  SaveAttachmentOptions,
  SaveAttachmentResult,
  SavedItemReference,
  SaveSingleDocumentOptions,
  SaveSingleDocumentResult,
  UploadFileOptions,
  UploadFileResult,
} from './types';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  refresh_token?: string;
  scope: string;
}

interface UploadResponse {
  DataId: string;
}

interface ApiFilter {
  GenericName?: string;
  CompareOperator?: string;
  Value?: string;
  Logic?: 'AND' | 'OR';
  Groups?: ApiFilter[];
}

/**
 * Client for the ENGINE4 External API.
 *
 * @example
 * ```ts
 * import { ENGINE4 } from 'engine4-node';
 *
 * const engine4 = new ENGINE4({ baseUrl: 'https://prod.engine4.io/' });
 * const { accessToken } = await engine4.authenticate({ username, password, clientId });
 * const { items } = await engine4.fetch({ accessToken, entityId });
 * ```
 */
export class ENGINE4 {
  private readonly http: HttpClient;

  constructor(options: ENGINE4Options) {
    this.http = new HttpClient(options.baseUrl);
  }

  /**
   * Authenticate with the ENGINE4 External API.
   *
   * Pass `username` and `password` to authenticate as a user,
   * or `clientSecret` to authenticate with client credentials.
   *
   * @since 0.0.1
   */
  public async authenticate(options: AuthenticateOptions): Promise<AuthenticateResult> {
    const body = new URLSearchParams(
      'clientSecret' in options
        ? { grant_type: 'client_credentials', client_secret: options.clientSecret }
        : { grant_type: 'password', username: options.username, password: options.password },
    );
    body.set('client_id', options.clientId);
    if (options.withRefreshToken) {
      body.set('with_refresh_token', 'true');
    }
    const result = await this.http.requestJson<TokenResponse>({
      method: 'POST',
      path: ENDPOINTS.TOKEN,
      body,
    });
    return {
      accessToken: result.access_token,
      expiresIn: result.expires_in,
      tokenType: result.token_type,
      refreshToken: result.refresh_token,
      scope: result.scope,
    };
  }

  /**
   * Delete a generic data element.
   *
   * @since 0.0.1
   */
  public async delete(options: DeleteOptions): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: ENDPOINTS.DELETE,
      accessToken: options.accessToken,
      query: { entityId: options.entityId, dataId: options.dataId },
    });
  }

  /**
   * Delete multiple generic data elements.
   *
   * @since 0.0.3
   */
  public async deleteMultiple(options: DeleteMultipleOptions): Promise<void> {
    await this.http.request({
      method: 'DELETE',
      path: ENDPOINTS.DELETE_MULTIPLE,
      accessToken: options.accessToken,
      query: { entityId: options.entityId, dataIds: options.dataIds },
    });
  }

  /**
   * Fetch multiple generic data elements.
   *
   * @since 0.0.1
   */
  public async fetch<T extends FetchOptions>(options: T): Promise<FetchResult<CustomValueOf<T>>> {
    const sortings = (options.sorting ?? []).map((item) => ({
      GenericName: item.genericName,
      Descending: item.sort === 'desc',
    }));
    const items = await this.http.requestJson<GenericDataElement<CustomValueOf<T>>[]>({
      method: 'POST',
      path: ENDPOINTS.FETCH,
      accessToken: options.accessToken,
      body: {
        EntityId: options.entityId,
        ViewId: options.viewId,
        Take: options.take,
        Skip: options.skip,
        WithLongValues: options.withLongValues,
        IsActive: options.isActive,
        Filter: options.filter ? toApiFilter(options.filter) : null,
        Sortings: sortings,
        ConvertAllCustomDataToStrings: options.convertAllCustomDataToStrings,
      },
    });
    return { items };
  }

  /**
   * Fetch a single generic data element.
   *
   * @since 0.0.1
   */
  public async get<T extends GetOptions>(options: T): Promise<GetResult<CustomValueOf<T>>> {
    const item = await this.http.requestJson<GenericDataElement<CustomValueOf<T>>>({
      method: 'GET',
      path: ENDPOINTS.GET,
      accessToken: options.accessToken,
      query: {
        entityId: options.entityId,
        dataId: options.dataId,
        convertAllCustomDataToStrings: options.convertAllCustomDataToStrings,
      },
    });
    return { item };
  }

  /**
   * Fetch multiple generic data elements by their IDs.
   *
   * @since 0.0.3
   */
  public async getMultiple<T extends GetMultipleOptions>(
    options: T,
  ): Promise<GetMultipleResult<CustomValueOf<T>>> {
    const items = await this.http.requestJson<GenericDataElement<CustomValueOf<T>>[]>({
      method: 'GET',
      path: ENDPOINTS.GET_MULTIPLE,
      accessToken: options.accessToken,
      query: {
        entityId: options.entityId,
        dataIds: options.dataIds,
        convertAllCustomDataToStrings: options.convertAllCustomDataToStrings,
      },
    });
    return { items };
  }

  /**
   * Insert or update generic data elements.
   *
   * If a `DataId` is provided, the existing generic data element will be updated.
   * If no `DataId` is provided, a new generic data element will be created.
   *
   * @since 0.0.1
   */
  public async saveAll<T extends SaveAllOptions>(
    options: T,
  ): Promise<SaveAllResult<T['returnType']>> {
    const returnType = options.returnType ?? 'none';
    const request = {
      method: 'POST',
      path: ENDPOINTS.SAVE_ALL,
      accessToken: options.accessToken,
      body: { items: options.items, returnType },
    };
    if (returnType === 'none') {
      await this.http.request(request);
      return { items: [] } as SaveAllResult<T['returnType']>;
    }
    const items = await this.http.requestJson<GenericDataElement[] | SavedItemReference[]>(request);
    return { items } as SaveAllResult<T['returnType']>;
  }

  /**
   * Fetch the binary content of an attachment.
   *
   * @since 0.0.4
   */
  public async fetchAttachment(options: FetchAttachmentOptions): Promise<FetchAttachmentResult> {
    const response = await this.http.request({
      method: 'GET',
      path: ENDPOINTS.FETCH_ATTACHMENT,
      accessToken: options.accessToken,
      query: { dataId: options.dataId },
    });
    return toFetchAttachmentResult(response);
  }

  /**
   * Upload a file and attach it to a record.
   *
   * @since 0.1.1
   */
  public async saveAttachment(options: SaveAttachmentOptions): Promise<SaveAttachmentResult> {
    return this.upload(ENDPOINTS.SAVE_ATTACHMENT, options, {
      ParentEntityId: options.parentEntityId,
      ParentDataId: options.parentDataId,
      DataId: options.dataId,
    });
  }

  /**
   * Fetch the binary content of a single document column.
   *
   * @since 0.1.1
   */
  public async fetchSingleDocument(
    options: FetchSingleDocumentOptions,
  ): Promise<FetchSingleDocumentResult> {
    const response = await this.http.request({
      method: 'GET',
      path: ENDPOINTS.FETCH_SINGLE_DOCUMENT,
      accessToken: options.accessToken,
      query: {
        entityId: options.entityId,
        dataId: options.dataId,
        columnName: options.columnName,
      },
    });
    return toFetchAttachmentResult(response);
  }

  /**
   * Upload a file to a single document column.
   *
   * @since 0.1.1
   */
  public async saveSingleDocument(
    options: SaveSingleDocumentOptions,
  ): Promise<SaveSingleDocumentResult> {
    return this.upload(ENDPOINTS.SAVE_SINGLE_DOCUMENT, options, {
      EntityId: options.entityId,
      DataId: options.dataId,
      ColumnName: options.columnName,
    });
  }

  /**
   * List the entities the user has access to.
   *
   * @since 0.1.1
   */
  public async getGenericEntities(options: BaseOptions): Promise<GetGenericEntitiesResult> {
    const items = await this.http.requestJson<GenericEntity[]>({
      method: 'GET',
      path: ENDPOINTS.GET_GENERIC_ENTITIES,
      accessToken: options.accessToken,
    });
    return { items };
  }

  /**
   * List the properties of an entity.
   *
   * @since 0.1.1
   */
  public async getGenericProperties(
    options: GetGenericPropertiesOptions,
  ): Promise<GetGenericPropertiesResult> {
    const items = await this.http.requestJson<GenericProperty[]>({
      method: 'GET',
      path: ENDPOINTS.GET_GENERIC_PROPERTIES,
      accessToken: options.accessToken,
      query: { entityId: options.entityId },
    });
    return { items };
  }

  /**
   * List the views of an entity.
   *
   * @since 0.1.1
   */
  public async getGenericViews(options: GetGenericViewsOptions): Promise<GetGenericViewsResult> {
    const items = await this.http.requestJson<GenericView[]>({
      method: 'GET',
      path: ENDPOINTS.GET_GENERIC_VIEWS,
      accessToken: options.accessToken,
      query: { entityId: options.entityId, viewType: options.viewType },
    });
    return { items };
  }

  /**
   * List the fields of a view.
   *
   * @since 0.1.1
   */
  public async getGenericViewFields(
    options: GetGenericViewFieldsOptions,
  ): Promise<GetGenericViewFieldsResult> {
    const items = await this.http.requestJson<GenericViewField[]>({
      method: 'GET',
      path: ENDPOINTS.GET_GENERIC_VIEW_FIELDS,
      accessToken: options.accessToken,
      query: { viewId: options.viewId },
    });
    return { items };
  }

  private async upload(
    path: string,
    options: UploadFileOptions,
    target: Record<string, string | undefined>,
  ): Promise<UploadFileResult> {
    const input = {
      ...target,
      Filename: options.filename,
      MimeType: options.mimeType,
      MaxWidth: options.maxWidth,
      ExpectedHash: options.expectedHash,
    };
    const body = new FormData();
    body.append('input', JSON.stringify(input));
    body.append('file', new Blob([options.file], { type: options.mimeType }), options.filename);
    const result = await this.http.requestJson<UploadResponse>({
      method: 'POST',
      path,
      accessToken: options.accessToken,
      body,
    });
    return { dataId: result.DataId };
  }
}

async function toFetchAttachmentResult(response: Response): Promise<FetchAttachmentResult> {
  return {
    item: Buffer.from(await response.arrayBuffer()),
    filename: parseFilename(response.headers.get('content-disposition')),
    mimeType: response.headers.get('content-type') ?? undefined,
  };
}

function toApiFilter(filter: FetchFilterOptions): ApiFilter {
  if ('groups' in filter) {
    return { Logic: filter.logic, Groups: filter.groups.map(toApiFilter) };
  }
  const value = 'value' in filter ? filter.value : undefined;
  return {
    GenericName: filter.genericName,
    CompareOperator: filter.compareOperator,
    Value: Array.isArray(value) ? JSON.stringify(value) : value,
  };
}

function parseFilename(contentDisposition: string | null): string | undefined {
  if (!contentDisposition) {
    return undefined;
  }
  // RFC 6266: prefer the UTF-8 encoded `filename*` over the plain `filename`.
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      // Malformed percent-encoding: fall back to the plain `filename`.
    }
  }
  return /filename="?([^";]+)"?/i.exec(contentDisposition)?.[1];
}
