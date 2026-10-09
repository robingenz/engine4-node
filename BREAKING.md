# Breaking Changes

This is a comprehensive list of the breaking changes introduced in the major version releases of engine4-node.

## Versions

- [Version 0.1.x](#version-01x)

## Version 0.1.x

### ESM-only

The package is now published as ES module only. Use `import { ENGINE4 } from 'engine4-node'` instead of `require('engine4-node')`.

### Node.js 20.19

The minimum supported Node.js version is now 20.19. The package now uses the native `fetch` API instead of `node-fetch`.

### `ENGINE4Error`

Failed requests now throw an `ENGINE4Error` with the HTTP `status`, `statusText` and the parsed response `body`. The error message is taken from the response body if available.

### `ENGINE4Interface`

The `ENGINE4Interface` type has been removed. Use the `ENGINE4` class type instead.
