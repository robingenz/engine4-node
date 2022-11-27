export interface ENGINE4Options {
  baseUrl: string;
}

/**
 * @since 0.0.1
 */
export interface AuthenticateOptions {
  /**
   * The username of the user to authenticate.
   *
   * @since 0.0.1
   */
  username: string;
  /**
   * The password of the user to authenticate.
   *
   * @since 0.0.1
   */
  password: string;
  /**
   * The client id of the user to authenticate.
   *
   * @since 0.0.1
   */
  clientId: string;
}

/**
 * @since 0.0.1
 */
export interface AuthenticateResult {
  /**
   * The access token.
   *
   * @since 0.0.1
   */
  accessToken: string;
  /**
   * The amount of time in seconds that the access token is valid for.
   *
   * @since 0.0.1
   */
  expiresIn: number;
  /**
   * The type of token.
   *
   * @since 0.0.1
   */
  tokenType: 'Bearer';
  /**
   * The refresh token.
   *
   * @since 0.0.1
   */
  refreshToken: string;
  /**
   * The scope of the token.
   *
   * @since 0.0.1
   */
  scope: string;
}
