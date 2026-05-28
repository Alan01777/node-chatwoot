# Node Chatwoot — Documentation

TypeScript-first Chatwoot API client for Node.js (18+). Zero runtime dependencies.

## Index

- [Configuration](configuration.md) — Single and multi-account setup
- [Basic Usage](usage.md) — API calls, DTOs, and the Manager
- [Media & Attachments](attachments.md) — Sending files to conversations
- [WhatsApp / Meta Templates](templates.md) — Template messages via API
- [Labels & Custom Attributes](labels-attributes.md) — Tags and custom fields
- [Reporting API (v2)](reporting.md) — Metrics, summaries, and real-time stats
- [Testing](testing.md) — Fakes and assertions

## Quick Example

```ts
import { ChatwootManager, createMessageDTO } from '@alan01777/node-chatwoot';

const chatwoot = new ChatwootManager({
  accounts: {
    default: {
      baseUrl: 'https://app.chatwoot.com',
      accountId: process.env.CHATWOOT_ACCOUNT_ID!,
      apiAccessToken: process.env.CHATWOOT_API_ACCESS_TOKEN!,
    },
  },
});

const conversations = await chatwoot.getConversations({ status: 'open' });
await chatwoot.sendMessage(42, createMessageDTO({ content: 'Hello!' }));
```
