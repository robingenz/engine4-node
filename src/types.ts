export interface ENGINE4Options {
  /**
   * The base URL of the ENGINE4 server.
   *
   * @since 0.0.1
   * @example https://prod.engine4.io/
   */
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
  /**
   * The type of token.
   *
   * @since 0.0.1
   */
  tokenType: 'Bearer';
}

/**
 * @since 0.0.1
 */
export interface FetchOptions {
  /**
   * The access token to use to authenticate the request.
   *
   * This token can be generated by calling the `authenticate` method.
   *
   * @since 0.0.1
   */
  accessToken: string;
  /**
   * The ID of the entity to retrieve data from.
   *
   * @since 0.0.1
   */
  entityId: string;
  /**
   * @since 0.0.1
   */
  filter?: FetchFilterOptions;
  /**
   * If `false`, only deleted records will be returned.
   *
   * @since 0.0.1
   */
  isActive?: boolean;
  /**
   * The number of records to skip.
   *
   * @since 0.0.1
   */
  skip?: number;
  /**
   * @since 0.0.1
   */
  sorting?: FetchSortingOptions[];
  /**
   * The maximum number of records to return.
   *
   * @since 0.0.1
   */
  take?: number;
  /**
   * @since 0.0.1
   */
  withLongValues?: boolean;
}

/**
 * @since 0.0.1
 */
export interface FetchFilterOptions {
  /**
   * The name of the generc column to filter on.
   *
   * @since 0.0.1
   */
  genericName: GenericColumnName;
  /**
   * The operator to use to filter the results.
   *
   * @since 0.0.1
   */
  compareOperator: CompareOperator;
  /**
   * The value to compare against.
   *
   * @since 0.0.1
   */
  value: string;
}

/**
 * @since 0.0.1
 */
export interface FetchSortingOptions {
  /**
   * The name of the generc column to sort by.
   *
   * @since 0.0.1
   */
  genericName: GenericColumnName;
  /**
   * The direction to sort by.
   *
   * @since 0.0.1
   * @default 'asc'
   */
  sort: 'asc' | 'desc';
}

/**
 * @since 0.0.1
 */
export interface FetchResult {
  /**
   * The fetched generic data elements.
   *
   * @since 0.0.1
   */
  items: GenericDataElement[];
}

/**
 * @since 0.0.1
 */
export type GenericColumnName = keyof GenericDataElement;

/**
 * @since 0.0.1
 */
export interface GenericDataElement {
  /**
   * @since 0.0.1
   */
  CreatedBy?: string;
  /**
   * @since 0.0.1
   */
  CreatedById?: string;
  /**
   * @since 0.0.1
   */
  Custom_001?: string;
  /**
   * @since 0.0.1
   */
  Custom_002?: string;
  /**
   * @since 0.0.1
   */
  Custom_003?: string;
  /**
   * @since 0.0.1
   */
  Custom_004?: string;
  /**
   * @since 0.0.1
   */
  Custom_005?: string;
  /**
   * @since 0.0.1
   */
  Custom_006?: string;
  /**
   * @since 0.0.1
   */
  Custom_007?: string;
  /**
   * @since 0.0.1
   */
  Custom_008?: string;
  /**
   * @since 0.0.1
   */
  Custom_009?: string;
  /**
   * @since 0.0.1
   */
  Custom_010?: string;
  /**
   * @since 0.0.1
   */
  Custom_011?: string;
  /**
   * @since 0.0.1
   */
  Custom_012?: string;
  /**
   * @since 0.0.1
   */
  Custom_013?: string;
  /**
   * @since 0.0.1
   */
  Custom_014?: string;
  /**
   * @since 0.0.1
   */
  Custom_015?: string;
  /**
   * @since 0.0.1
   */
  Custom_016?: string;
  /**
   * @since 0.0.1
   */
  Custom_017?: string;
  /**
   * @since 0.0.1
   */
  Custom_018?: string;
  /**
   * @since 0.0.1
   */
  Custom_019?: string;
  /**
   * @since 0.0.1
   */
  Custom_020?: string;
  /**
   * @since 0.0.1
   */
  Custom_021?: string;
  /**
   * @since 0.0.1
   */
  Custom_022?: string;
  /**
   * @since 0.0.1
   */
  Custom_023?: string;
  /**
   * @since 0.0.1
   */
  Custom_024?: string;
  /**
   * @since 0.0.1
   */
  Custom_025?: string;
  /**
   * @since 0.0.1
   */
  Custom_026?: string;
  /**
   * @since 0.0.1
   */
  Custom_027?: string;
  /**
   * @since 0.0.1
   */
  Custom_028?: string;
  /**
   * @since 0.0.1
   */
  Custom_029?: string;
  /**
   * @since 0.0.1
   */
  Custom_030?: string;
  /**
   * @since 0.0.1
   */
  Custom_031?: string;
  /**
   * @since 0.0.1
   */
  Custom_032?: string;
  /**
   * @since 0.0.1
   */
  Custom_033?: string;
  /**
   * @since 0.0.1
   */
  Custom_034?: string;
  /**
   * @since 0.0.1
   */
  Custom_035?: string;
  /**
   * @since 0.0.1
   */
  Custom_036?: string;
  /**
   * @since 0.0.1
   */
  Custom_037?: string;
  /**
   * @since 0.0.1
   */
  Custom_038?: string;
  /**
   * @since 0.0.1
   */
  Custom_039?: string;
  /**
   * @since 0.0.1
   */
  Custom_040?: string;
  /**
   * @since 0.0.1
   */
  Custom_041?: string;
  /**
   * @since 0.0.1
   */
  Custom_042?: string;
  /**
   * @since 0.0.1
   */
  Custom_043?: string;
  /**
   * @since 0.0.1
   */
  Custom_044?: string;
  /**
   * @since 0.0.1
   */
  Custom_045?: string;
  /**
   * @since 0.0.1
   */
  Custom_046?: string;
  /**
   * @since 0.0.1
   */
  Custom_047?: string;
  /**
   * @since 0.0.1
   */
  Custom_048?: string;
  /**
   * @since 0.0.1
   */
  Custom_049?: string;
  /**
   * @since 0.0.1
   */
  Custom_050?: string;
  /**
   * @since 0.0.1
   */
  Custom_051?: string;
  /**
   * @since 0.0.1
   */
  Custom_052?: string;
  /**
   * @since 0.0.1
   */
  Custom_053?: string;
  /**
   * @since 0.0.1
   */
  Custom_054?: string;
  /**
   * @since 0.0.1
   */
  Custom_055?: string;
  /**
   * @since 0.0.1
   */
  Custom_056?: string;
  /**
   * @since 0.0.1
   */
  Custom_057?: string;
  /**
   * @since 0.0.1
   */
  Custom_058?: string;
  /**
   * @since 0.0.1
   */
  Custom_059?: string;
  /**
   * @since 0.0.1
   */
  Custom_060?: string;
  /**
   * @since 0.0.1
   */
  Custom_061?: string;
  /**
   * @since 0.0.1
   */
  Custom_062?: string;
  /**
   * @since 0.0.1
   */
  Custom_063?: string;
  /**
   * @since 0.0.1
   */
  Custom_064?: string;
  /**
   * @since 0.0.1
   */
  Custom_065?: string;
  /**
   * @since 0.0.1
   */
  Custom_066?: string;
  /**
   * @since 0.0.1
   */
  Custom_067?: string;
  /**
   * @since 0.0.1
   */
  Custom_068?: string;
  /**
   * @since 0.0.1
   */
  Custom_069?: string;
  /**
   * @since 0.0.1
   */
  Custom_070?: string;
  /**
   * @since 0.0.1
   */
  Custom_071?: string;
  /**
   * @since 0.0.1
   */
  Custom_072?: string;
  /**
   * @since 0.0.1
   */
  Custom_073?: string;
  /**
   * @since 0.0.1
   */
  Custom_074?: string;
  /**
   * @since 0.0.1
   */
  Custom_075?: string;
  /**
   * @since 0.0.1
   */
  Custom_076?: string;
  /**
   * @since 0.0.1
   */
  Custom_077?: string;
  /**
   * @since 0.0.1
   */
  Custom_078?: string;
  /**
   * @since 0.0.1
   */
  Custom_079?: string;
  /**
   * @since 0.0.1
   */
  Custom_080?: string;
  /**
   * @since 0.0.1
   */
  Custom_081?: string;
  /**
   * @since 0.0.1
   */
  Custom_082?: string;
  /**
   * @since 0.0.1
   */
  Custom_083?: string;
  /**
   * @since 0.0.1
   */
  Custom_084?: string;
  /**
   * @since 0.0.1
   */
  Custom_085?: string;
  /**
   * @since 0.0.1
   */
  Custom_086?: string;
  /**
   * @since 0.0.1
   */
  Custom_087?: string;
  /**
   * @since 0.0.1
   */
  Custom_088?: string;
  /**
   * @since 0.0.1
   */
  Custom_089?: string;
  /**
   * @since 0.0.1
   */
  Custom_090?: string;
  /**
   * @since 0.0.1
   */
  Custom_091?: string;
  /**
   * @since 0.0.1
   */
  Custom_092?: string;
  /**
   * @since 0.0.1
   */
  Custom_093?: string;
  /**
   * @since 0.0.1
   */
  Custom_094?: string;
  /**
   * @since 0.0.1
   */
  Custom_095?: string;
  /**
   * @since 0.0.1
   */
  Custom_096?: string;
  /**
   * @since 0.0.1
   */
  Custom_097?: string;
  /**
   * @since 0.0.1
   */
  Custom_098?: string;
  /**
   * @since 0.0.1
   */
  Custom_099?: string;
  /**
   * @since 0.0.1
   */
  Custom_100?: string;
  /**
   * @since 0.0.1
   */
  Custom_101?: string;
  /**
   * @since 0.0.1
   */
  Custom_102?: string;
  /**
   * @since 0.0.1
   */
  Custom_103?: string;
  /**
   * @since 0.0.1
   */
  Custom_104?: string;
  /**
   * @since 0.0.1
   */
  Custom_105?: string;
  /**
   * @since 0.0.1
   */
  Custom_106?: string;
  /**
   * @since 0.0.1
   */
  Custom_107?: string;
  /**
   * @since 0.0.1
   */
  Custom_108?: string;
  /**
   * @since 0.0.1
   */
  Custom_109?: string;
  /**
   * @since 0.0.1
   */
  Custom_110?: string;
  /**
   * @since 0.0.1
   */
  Custom_111?: string;
  /**
   * @since 0.0.1
   */
  Custom_112?: string;
  /**
   * @since 0.0.1
   */
  Custom_113?: string;
  /**
   * @since 0.0.1
   */
  Custom_114?: string;
  /**
   * @since 0.0.1
   */
  Custom_115?: string;
  /**
   * @since 0.0.1
   */
  Custom_116?: string;
  /**
   * @since 0.0.1
   */
  Custom_117?: string;
  /**
   * @since 0.0.1
   */
  Custom_118?: string;
  /**
   * @since 0.0.1
   */
  Custom_119?: string;
  /**
   * @since 0.0.1
   */
  Custom_120?: string;
  /**
   * @since 0.0.1
   */
  Custom_121?: string;
  /**
   * @since 0.0.1
   */
  Custom_122?: string;
  /**
   * @since 0.0.1
   */
  Custom_123?: string;
  /**
   * @since 0.0.1
   */
  Custom_124?: string;
  /**
   * @since 0.0.1
   */
  Custom_125?: string;
  /**
   * @since 0.0.1
   */
  Custom_126?: string;
  /**
   * @since 0.0.1
   */
  Custom_127?: string;
  /**
   * @since 0.0.1
   */
  Custom_128?: string;
  /**
   * @since 0.0.1
   */
  Custom_129?: string;
  /**
   * @since 0.0.1
   */
  Custom_130?: string;
  /**
   * @since 0.0.1
   */
  Custom_131?: string;
  /**
   * @since 0.0.1
   */
  Custom_132?: string;
  /**
   * @since 0.0.1
   */
  Custom_133?: string;
  /**
   * @since 0.0.1
   */
  Custom_134?: string;
  /**
   * @since 0.0.1
   */
  Custom_135?: string;
  /**
   * @since 0.0.1
   */
  Custom_136?: string;
  /**
   * @since 0.0.1
   */
  Custom_137?: string;
  /**
   * @since 0.0.1
   */
  Custom_138?: string;
  /**
   * @since 0.0.1
   */
  Custom_139?: string;
  /**
   * @since 0.0.1
   */
  Custom_140?: string;
  /**
   * @since 0.0.1
   */
  Custom_141?: string;
  /**
   * @since 0.0.1
   */
  Custom_142?: string;
  /**
   * @since 0.0.1
   */
  Custom_143?: string;
  /**
   * @since 0.0.1
   */
  Custom_144?: string;
  /**
   * @since 0.0.1
   */
  Custom_145?: string;
  /**
   * @since 0.0.1
   */
  Custom_146?: string;
  /**
   * @since 0.0.1
   */
  Custom_147?: string;
  /**
   * @since 0.0.1
   */
  Custom_148?: string;
  /**
   * @since 0.0.1
   */
  Custom_149?: string;
  /**
   * @since 0.0.1
   */
  Custom_150?: string;
  /**
   * @since 0.0.1
   */
  Custom_151?: string;
  /**
   * @since 0.0.1
   */
  Custom_152?: string;
  /**
   * @since 0.0.1
   */
  Custom_153?: string;
  /**
   * @since 0.0.1
   */
  Custom_154?: string;
  /**
   * @since 0.0.1
   */
  Custom_155?: string;
  /**
   * @since 0.0.1
   */
  Custom_156?: string;
  /**
   * @since 0.0.1
   */
  Custom_157?: string;
  /**
   * @since 0.0.1
   */
  Custom_158?: string;
  /**
   * @since 0.0.1
   */
  Custom_159?: string;
  /**
   * @since 0.0.1
   */
  Custom_160?: string;
  /**
   * @since 0.0.1
   */
  Custom_161?: string;
  /**
   * @since 0.0.1
   */
  Custom_162?: string;
  /**
   * @since 0.0.1
   */
  Custom_163?: string;
  /**
   * @since 0.0.1
   */
  Custom_164?: string;
  /**
   * @since 0.0.1
   */
  Custom_165?: string;
  /**
   * @since 0.0.1
   */
  Custom_166?: string;
  /**
   * @since 0.0.1
   */
  Custom_167?: string;
  /**
   * @since 0.0.1
   */
  Custom_168?: string;
  /**
   * @since 0.0.1
   */
  Custom_169?: string;
  /**
   * @since 0.0.1
   */
  Custom_170?: string;
  /**
   * @since 0.0.1
   */
  Custom_171?: string;
  /**
   * @since 0.0.1
   */
  Custom_172?: string;
  /**
   * @since 0.0.1
   */
  Custom_173?: string;
  /**
   * @since 0.0.1
   */
  Custom_174?: string;
  /**
   * @since 0.0.1
   */
  Custom_175?: string;
  /**
   * @since 0.0.1
   */
  Custom_176?: string;
  /**
   * @since 0.0.1
   */
  Custom_177?: string;
  /**
   * @since 0.0.1
   */
  Custom_178?: string;
  /**
   * @since 0.0.1
   */
  Custom_179?: string;
  /**
   * @since 0.0.1
   */
  Custom_180?: string;
  /**
   * @since 0.0.1
   */
  Custom_181?: string;
  /**
   * @since 0.0.1
   */
  Custom_182?: string;
  /**
   * @since 0.0.1
   */
  Custom_183?: string;
  /**
   * @since 0.0.1
   */
  Custom_184?: string;
  /**
   * @since 0.0.1
   */
  Custom_185?: string;
  /**
   * @since 0.0.1
   */
  Custom_186?: string;
  /**
   * @since 0.0.1
   */
  Custom_187?: string;
  /**
   * @since 0.0.1
   */
  Custom_188?: string;
  /**
   * @since 0.0.1
   */
  Custom_189?: string;
  /**
   * @since 0.0.1
   */
  Custom_190?: string;
  /**
   * @since 0.0.1
   */
  Custom_191?: string;
  /**
   * @since 0.0.1
   */
  Custom_192?: string;
  /**
   * @since 0.0.1
   */
  Custom_193?: string;
  /**
   * @since 0.0.1
   */
  Custom_194?: string;
  /**
   * @since 0.0.1
   */
  Custom_195?: string;
  /**
   * @since 0.0.1
   */
  Custom_196?: string;
  /**
   * @since 0.0.1
   */
  Custom_197?: string;
  /**
   * @since 0.0.1
   */
  Custom_198?: string;
  /**
   * @since 0.0.1
   */
  Custom_199?: string;
  /**
   * @since 0.0.1
   */
  Custom_200?: string;
  /**
   * @since 0.0.1
   */
  CustomMax_001?: string;
  /**
   * @since 0.0.1
   */
  CustomMax_002?: string;
  /**
   * @since 0.0.1
   */
  CustomMax_003?: string;
  /**
   * @since 0.0.1
   */
  CustomMax_004?: string;
  /**
   * @since 0.0.1
   */
  CustomMax_005?: string;
  /**
   * @since 0.0.1
   */
  CustomMax_006?: string;
  /**
   * @since 0.0.1
   */
  DataId: string;
  /**
   * @since 0.0.1
   */
  EntityId: string;
  /**
   * @since 0.0.1
   */
  IsActive: boolean;
  /**
   * @since 0.0.1
   */
  ModifiedBy?: string;
  /**
   * @since 0.0.1
   */
  ModifiedById?: string;
  /**
   * @since 0.0.1
   */
  UserId: string;
}

export enum CompareOperator {
  Equal = '=',
  NotEqual = '!=',
  LessThan = '<',
  GreaterThan = '>',
  LessThanOrEqualTo = '<=',
  GreaterThanOrEqualTo = '>=',
  Like = 'LIKE',
  Contains = 'CONTAINS',
  IsNull = 'isNull',
  IsNotNull = 'ISNOTNULL',
  In = 'IN',
}
