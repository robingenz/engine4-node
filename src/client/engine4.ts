import fetch from 'node-fetch';
import { ENDPOINTS } from '../constants';
import {
  AuthenticateOptions,
  AuthenticateResult,
  DeleteOptions,
  ENGINE4Interface,
  ENGINE4Options,
  FetchOptions,
  FetchResult,
  GetOptions,
  GetResult,
  SaveAllOptions,
  SaveAllResult,
} from '../types';
import { HttpResponseError } from './http-response-error';

export default class ENGINE4 implements ENGINE4Interface {
  private readonly baseUrl: string;

  constructor(options: ENGINE4Options) {
    this.baseUrl = options.baseUrl;
  }

  public async authenticate(options: AuthenticateOptions): Promise<AuthenticateResult> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = new URLSearchParams({
      grant_type: 'password',
      username: options.username,
      password: options.password,
      client_id: options.clientId,
    });
    const method = 'POST';
    const url = new URL(ENDPOINTS.TOKEN, this.baseUrl).toString();
    const response = await fetch(url, { method, body, headers });
    if (!response.ok) {
      throw new HttpResponseError(response.status, response.statusText, await response.json());
    }
    const result: {
      access_token: string;
      expires_in: number;
      token_type: 'Bearer';
      refresh_token: string;
      scope: string;
    } = await response.json();
    return {
      accessToken: result.access_token,
      expiresIn: result.expires_in,
      tokenType: result.token_type,
      refreshToken: result.refresh_token,
      scope: result.scope,
    };
  }

  public async delete(options: DeleteOptions): Promise<void> {
    const headers = {
      Accept: 'application/json',
      Authorization: this.createAuthorizationHeader(options.accessToken),
    };
    const params = new URLSearchParams({
      entityId: options.entityId,
      dataId: options.dataId,
    });
    const method = 'DELETE';
    const url = new URL(`${ENDPOINTS.DELETE}?${params}`, this.baseUrl).toString();
    const response = await fetch(url, { method, headers });
    if (!response.ok) {
      throw new HttpResponseError(response.status, response.statusText, await response.text());
    }
  }

  public async fetch(options: FetchOptions): Promise<FetchResult> {
    const headers = {
      Accept: 'application/json',
      Authorization: this.createAuthorizationHeader(options.accessToken),
      'Content-Type': 'application/json',
    };
    let filter = null;
    if (options.filter) {
      filter = {
        GenericName: options.filter.genericName,
        CompareOperator: options.filter.compareOperator,
        Value: options.filter.value,
      };
    }
    let sorting: { GenericName: string; Descending: boolean }[] = [];
    if (options.sorting) {
      sorting = options.sorting.map(item => {
        return {
          GenericName: item.genericName,
          Descending: item.sort === 'desc' ? true : false,
        };
      });
    }
    const body = JSON.stringify({
      EntityId: options.entityId,
      Take: options.take,
      Skip: options.skip,
      WithLongValues: options.withLongValues,
      IsActive: options.isActive,
      Filter: filter,
      Sortings: sorting,
    });
    const method = 'POST';
    const url = new URL(ENDPOINTS.FETCH, this.baseUrl).toString();
    const response = await fetch(url, { method, body, headers });
    if (!response.ok) {
      throw new HttpResponseError(response.status, response.statusText, await response.text());
    }
    return {
      items: await response.json(),
    };
  }

  public async get(options: GetOptions): Promise<GetResult> {
    const headers = {
      Accept: 'application/json',
      Authorization: this.createAuthorizationHeader(options.accessToken),
    };
    const params = new URLSearchParams({
      entityId: options.entityId,
      dataId: options.dataId,
    });
    const method = 'GET';
    const url = new URL(`${ENDPOINTS.GET}?${params}`, this.baseUrl).toString();
    const response = await fetch(url, { method, headers });
    if (!response.ok) {
      throw new HttpResponseError(response.status, response.statusText, await response.text());
    }
    return {
      item: await response.json(),
    };
  }

  public async saveAll(options: SaveAllOptions): Promise<SaveAllResult> {
    const headers = {
      Accept: 'application/json',
      Authorization: this.createAuthorizationHeader(options.accessToken),
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      items: options.items,
      returnType: options.returnType || 'none',
    });
    const method = 'POST';
    const url = new URL(ENDPOINTS.SAVE_ALL, this.baseUrl).toString();
    const response = await fetch(url, { method, body, headers });
    if (!response.ok) {
      throw new HttpResponseError(response.status, response.statusText, await response.text());
    }
    return {
      items: options.returnType === 'none' ? [] : await response.json(),
    };
  }

  private createAuthorizationHeader(token: string): string {
    return `Bearer ${token}`;
  }
}
