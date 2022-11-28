# engine4-node

[![Build](https://img.shields.io/github/workflow/status/robingenz/engine4-node/CI/main)](https://github.com/robingenz/engine4-node/actions?query=workflow%3A%22CI%22)
[![License](https://img.shields.io/github/license/robingenz/engine4-node)](https://github.com/robingenz/engine4-node/blob/main/LICENSE)
[![npm (version)](https://img.shields.io/npm/v/@robingenz/engine4-node)](https://www.npmjs.com/package/@robingenz/engine4-node)
[![npm (downloads)](https://img.shields.io/npm/dm/@robingenz/engine4-node)](https://www.npmjs.com/package/@robingenz/engine4-node)

⚙️ Node.js library for the ENGINE4 API.

## Installation

```bash
npm install @robingenz/engine4-node
```

## Usage

```typescript
import { ENGINE4, CompareOperator } from '@robingenz/engine4-node';

const engine4 = new ENGINE4({ baseUrl: 'https://dev.engine4.io' });

const authenticate = async () => {
  const { accessToken } = await engine4.authenticate({
    username: 'my_username',
    password: 'my_password',
    clientId: 'my_client_id',
  });
  return accessToken;
};

const delete = async () => {
  const accessToken = await authenticate();

  await engine4.delete({
    accessToken,
    entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
    dataId: '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
  });
};

const fetch = async () => {
  const accessToken = await authenticate();

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
  const accessToken = await authenticate();

  const { item } = await engine4.get({
    accessToken,
    entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
    dataId: '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
  });
  return item;
};

const saveAll = async () => {
  const accessToken = await authenticate();

  const { item } = await engine4.saveAll({
    accessToken,
    items: [
      {
        entityId: '39aeedee-91e3-4ec4-b7bb-b5a036601f9f',
        dataId: '3c7d04f7-74e6-4cfd-9fd6-233c6f4ded8a',
        custom_001: 'my_value',
      }
    ],
    returnType: 'dataId',
  });
  return item;
};
```

## Changelog

See [CHANGELOG.md](https://github.com/robingenz/engine4-node/blob/main/CHANGELOG.md).

## License

See [LICENSE](https://github.com/robingenz/engine4-node/blob/main/LICENSE).
