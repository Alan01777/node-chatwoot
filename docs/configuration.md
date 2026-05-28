# Configuration

## Setup

The `ChatwootManager` accepts a configuration object with one or more accounts:

```ts
import { ChatwootManager } from '@alan01777/node-chatwoot';

const chatwoot = new ChatwootManager({
  accounts: {
    default: {
      baseUrl: process.env.CHATWOOT_BASE_URL!,
      accountId: process.env.CHATWOOT_ACCOUNT_ID!,
      apiAccessToken: process.env.CHATWOOT_API_ACCESS_TOKEN!,
    },
  },
});
```

Each account requires:

| Key | Description |
|---|---|
| `baseUrl` | Chatwoot instance URL |
| `accountId` | Your Chatwoot account ID |
| `apiAccessToken` | API access token from Chatwoot profile settings |

## Multi-account

Define multiple accounts and switch at runtime:

```ts
const chatwoot = new ChatwootManager({
  default: 'main',
  accounts: {
    main: {
      baseUrl: 'https://app.chatwoot.com',
      accountId: '1',
      apiAccessToken: 'tok_main',
    },
    marketing: {
      baseUrl: 'https://chat.yourdomain.com',
      accountId: '2',
      apiAccessToken: 'tok_marketing',
    },
  },
});

// Uses default ('main')
await chatwoot.getContacts();

// Uses 'marketing'
await chatwoot.account('marketing').getInboxes();
```

All methods on the manager delegate to the default account. Use `.account(name)` to target a specific one.
