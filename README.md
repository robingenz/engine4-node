# engine4-node

⚙️ Node.js library for the ENGINE4 API.

## Installation

```bash
npm install @robingenz/engine4-node
npx cap sync
```

## Usage

```typescript
import { ENGINE4 } from '@robingenz/engine4-node';

const engine4 = new ENGINE4({ baseUrl: 'https://dev.engine4.io' });

const fetch = async () => {
  await engine4.fetch();
};
```

## Changelog

See [CHANGELOG.md](https://github.com/robingenz/engine4-node/blob/main/CHANGELOG.md).

## License

See [LICENSE](https://github.com/robingenz/engine4-node/blob/main/LICENSE).
