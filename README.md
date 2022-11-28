# engine4-node

⚙️ Node.js library for the ENGINE4 API.

## Installation

```bash
npm install @robingenz/engine4-node
npx cap sync
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

const fetch = async () => {
  const accessToken = await authenticate();

  const { items } = await engine4.fetch({
    accessToken,
    entityId: '868d3b4e-cf31-4c33-8462-e16837c06706',
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
```

## Changelog

See [CHANGELOG.md](https://github.com/robingenz/engine4-node/blob/main/CHANGELOG.md).

## License

See [LICENSE](https://github.com/robingenz/engine4-node/blob/main/LICENSE).
