# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of engine4-node.

## Versions

- [Version 0.1.x](#version-01x)

## Version 0.1.x

### ESM-only

The package is now published as ES module only. Use `import { ENGINE4 } from 'engine4-node'` instead of `require('engine4-node')`.

### Node.js 22.12

The minimum supported Node.js version is now 22.12. The package now uses the native `fetch` API instead of `node-fetch`.

### `ENGINE4Error`

Failed requests now throw an `ENGINE4Error` with the HTTP `status`, `statusText` and the parsed response `body`. The error message is taken from the response body if available.

### `ENGINE4Interface`

The `ENGINE4Interface` type has been removed. Use the `ENGINE4` class type instead.

### `authenticate`

`AuthenticateOptions` is now a union of `PasswordAuthenticateOptions` and `ClientCredentialsAuthenticateOptions`. `AuthenticateResult.refreshToken` is now optional and only returned if `withRefreshToken` is `true`.

### `saveAll`

The type of `SaveAllResult.items` now depends on `returnType`: an empty array for `none` (default), `SavedItemReference[]` (`DataId` and `EntityId`) for `dataId`, and `GenericDataElement[]` for `full`. Input items only require `EntityId`.

### `FetchFilterOptions`

`FetchFilterOptions` is now a union of `FetchFilterCondition` and `FetchFilterGroup` to support nested filter groups. The type of `value` now depends on `compareOperator`: `string[]` for `In`, no value for `IsNull` and `IsNotNull`, and `string` otherwise.

### `CompareOperator.IsNull`

The value of `CompareOperator.IsNull` changed from `isNull` to `ISNULL` to match the API documentation.
