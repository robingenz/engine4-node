# engine4-node

[![Build](https://img.shields.io/github/workflow/status/robingenz/engine4-node/CI/main)](https://github.com/robingenz/engine4-node/actions?query=workflow%3A%22CI%22)
[![License](https://img.shields.io/npm/l/engine4-node)](https://github.com/robingenz/engine4-node/blob/main/LICENSE)
[![npm (version)](https://img.shields.io/npm/v/engine4-node)](https://www.npmjs.com/package/engine4-node)
[![npm (downloads)](https://img.shields.io/npm/dm/engine4-node)](https://www.npmjs.com/package/engine4-node)

⚙️ Node.js library for the ENGINE4 API.

## Installation

Use [npm](https://docs.npmjs.com/cli/) to install the package:

```bash
npm install engine4-node
```

## Usage

First of all, you import `ENGINE4` so that you can create an instance of the class.
You need to pass the `baseUrl` of the API server:

```typescript
import { ENGINE4 } from 'engine4-node';

const engine4 = new ENGINE4({ baseUrl: 'https://test.engine4.io' });
```

Now you can authenticate yourself with `username`, `password` and `clientId`:

```typescript
const authenticate = async () => {
  const { accessToken } = await engine4.authenticate({
    username: 'my_username',
    password: 'my_password',
    clientId: 'my_client_id',
  });
  return accessToken;
};
```

The access token is required for the following calls.

Here you can find examples for deleting, querying, inserting and updating records:

```typescript
import { ENGINE4, CompareOperator } from 'engine4-node';

const accessToken = await authenticate();

const delete = async () => {
  await engine4.delete({
    accessToken,
    entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
    dataId: '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
  });
};

const deleteMultiple = async () => {
  await engine4.deleteMultiple({
    accessToken,
    entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
    dataIds: [
      '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
      '7130fa8b-4040-40d0-b97b-a9006fc140ec',
    ],
  });
};

const fetch = async () => {
  const { items } = await engine4.fetch({
    accessToken,
    entityId: '7130fa8b-4040-40d0-b97b-a9006fc140ec',
    take: 10,
    skip: 20,
    filter: {
      genericName: 'Custom_001',
      compareOperator: CompareOperator.Equal,
      value: 'my_value',
    },
    sorting: [
      {
        genericName: 'Custom_001',
        sort: 'desc',
      },
    ],
  });
  return items;
};

const get = async () => {
  const { item } = await engine4.get({
    accessToken,
    entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
    dataId: '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
  });
  return item;
};

const getMultiple = async () => {
  const { items } = await engine4.getMultiple({
    accessToken,
    entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
    dataIds: [
      '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
      '7130fa8b-4040-40d0-b97b-a9006fc140ec',
    ],
  });
  return items;
};

const saveAll = async () => {
  const { items } = await engine4.saveAll({
    accessToken,
    items: [
      {
        EntityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
        DataId: '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
        Custom_001: 'my_value',
      }
    ],
    returnType: 'dataId',
  });
  return items;
};
```

## Changelog

See [CHANGELOG.md](https://github.com/robingenz/engine4-node/blob/main/CHANGELOG.md).

## License

See [LICENSE](https://github.com/robingenz/engine4-node/blob/main/LICENSE).
