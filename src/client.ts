import { ENDPOINTS } from './constants';
import { HttpClient } from './http-client';
import type {
  AuthenticateOptions,
  AuthenticateResult,
  DeleteMultipleOptions,
  DeleteOptions,
  ENGINE4Options,
  FetchAttachmentOptions,
  FetchAttachmentResult,
  FetchOptions,
  FetchResult,
  GenericDataElement,
  GetMultipleOptions,
  GetMultipleResult,
  GetOptions,
  GetResult,
  SaveAllOptions,
  SaveAllResult,
} from './types';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  refresh_token: string;
  scope: string;
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
   * @since 0.0.1
   */
  public async authenticate(options: AuthenticateOptions): Promise<AuthenticateResult> {
    const result = await this.http.requestJson<TokenResponse>({
      method: 'POST',
      path: ENDPOINTS.TOKEN,
      body: new URLSearchParams({
        grant_type: 'password',
        username: options.username,
        password: options.password,
        client_id: options.clientId,
      }),
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
  public async fetch(options: FetchOptions): Promise<FetchResult> {
    const filter = options.filter && {
      GenericName: options.filter.genericName,
      CompareOperator: options.filter.compareOperator,
      Value: options.filter.value,
    };
    const sortings = (options.sorting ?? []).map((item) => ({
      GenericName: item.genericName,
      Descending: item.sort === 'desc',
    }));
    const items = await this.http.requestJson<GenericDataElement[]>({
      method: 'POST',
      path: ENDPOINTS.FETCH,
      accessToken: options.accessToken,
      body: {
        EntityId: options.entityId,
        Take: options.take,
        Skip: options.skip,
        WithLongValues: options.withLongValues,
        IsActive: options.isActive,
        Filter: filter ?? null,
        Sortings: sortings,
      },
    });
    return { items };
  }

  /**
   * Fetch a single generic data element.
   *
   * @since 0.0.1
   */
  public async get(options: GetOptions): Promise<GetResult> {
    const item = await this.http.requestJson<GenericDataElement>({
      method: 'GET',
      path: ENDPOINTS.GET,
      accessToken: options.accessToken,
      query: { entityId: options.entityId, dataId: options.dataId },
    });
    return { item };
  }

  /**
   * Fetch multiple generic data elements by their IDs.
   *
   * @since 0.0.3
   */
  public async getMultiple(options: GetMultipleOptions): Promise<GetMultipleResult> {
    const items = await this.http.requestJson<GenericDataElement[]>({
      method: 'GET',
      path: ENDPOINTS.GET_MULTIPLE,
      accessToken: options.accessToken,
      query: { entityId: options.entityId, dataIds: options.dataIds },
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
  public async saveAll(options: SaveAllOptions): Promise<SaveAllResult> {
    const returnType = options.returnType ?? 'none';
    const request = {
      method: 'POST',
      path: ENDPOINTS.SAVE_ALL,
      accessToken: options.accessToken,
      body: { items: options.items, returnType },
    };
    if (returnType === 'none') {
      await this.http.request(request);
      return { items: [] };
    }
    const items = await this.http.requestJson<GenericDataElement[]>(request);
    return { items };
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
    return { item: Buffer.from(await response.arrayBuffer()) };
  }
}
