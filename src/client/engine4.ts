import fetch from 'node-fetch';
import { ENDPOINTS } from '../constants';
import { AuthenticateOptions, AuthenticateResult, ENGINE4Options } from '../types';
import { HttpResponseError } from './http-response-error';

export default class ENGINE4 {
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

  // private createAuthorizationHeader(): string {
  //   return `Bearer ${this.token}`;
  // }
}
