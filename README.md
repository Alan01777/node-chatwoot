# Node Chatwoot

A TypeScript-first Chatwoot API client for Node.js (18+). Zero runtime dependencies, multi-account support, fully testable.

## Installation

```bash
npm install @alan01777/node-chatwoot
```

## Quick Start

```ts
import { ChatwootManager, createMessageDTO, createContactDTO } from '@alan01777/node-chatwoot';

const chatwoot = new ChatwootManager({
  default: 'main',
  accounts: {
    main: {
      baseUrl: 'https://app.chatwoot.com',
      accountId: process.env.CHATWOOT_ACCOUNT_ID!,
      apiAccessToken: process.env.CHATWOOT_API_ACCESS_TOKEN!,
    },
  },
});

// Send a message
await chatwoot.sendMessage(42, createMessageDTO({ content: 'Hello!' }));

// Create a contact
await chatwoot.createContact(createContactDTO({
  name: 'John Doe',
  email: 'john@example.com',
}));

// Multi-account
const marketing = chatwoot.account('marketing');
await marketing.getInboxes();

// List conversations
const convos = await chatwoot.getConversations({ status: 'open', page: 1 });
```

## Testing

```ts
import { ChatwootManager, createContactDTO, createMessageDTO } from '@alan01777/node-chatwoot';
import { describe, it } from 'vitest';

describe('Chatwoot', () => {
  it('sends messages', async () => {
    const chatwoot = new ChatwootManager({ accounts: { default: { baseUrl: '', accountId: '', apiAccessToken: '' } } });
    const fake = chatwoot.fake();

    await chatwoot.sendMessage(1, createMessageDTO({ content: 'Hi' }));

    fake.assertMessageSent((msg, convId) => {
      return msg.content === 'Hi' && convId === 1;
    });
  });

  it('creates contacts', async () => {
    const chatwoot = new ChatwootManager({ accounts: { default: { baseUrl: '', accountId: '', apiAccessToken: '' } } });
    const fake = chatwoot.fake();

    await chatwoot.createContact(createContactDTO({ name: 'Jane' }));

    fake.assertContactCreated((dto) => dto.name === 'Jane');
  });
});
```

## API Reference

### DTOs

| Factory | Description |
|---|---|
| `createContactDTO({ name, email?, ... })` | Contact data |
| `createConversationDTO({ sourceId?, inboxId?, ... })` | Conversation data |
| `createMessageDTO({ content, messageType?, ... })` | Message with optional template params |
| `createAgentDTO({ email, name, ... })` | Agent data |
| `createTeamDTO({ name, description?, ... })` | Team data |
| `createReportCriteriaDTO({ since?, until?, ... })` | Report filter criteria |

### Enums

```ts
import { ConversationStatus, ConversationPriority, ReportType } from '@alan01777/node-chatwoot';

ConversationStatus.OPEN     // 'open'
ConversationPriority.URGENT // 'urgent'
ReportType.ACCOUNT          // 'account'
```

### Fake Assertions

```ts
fake.assertMessageSent((msg: MessageDTO, convId: number) => boolean)
fake.assertContactCreated((dto: ContactDTO) => boolean)
fake.assertFileSent((file: unknown, convId: number, content?: string) => boolean)
fake.assertConversationUpdated((dto: ConversationDTO, id: number) => boolean)
fake.getCallHistory()  // readonly MethodCall[]
fake.findCall('sendMessage')  // unknown[][]
```

### Full Method List

| Domain | Methods |
|---|---|
| **Contacts** | `getContacts`, `getContact`, `createContact`, `updateContact`, `deleteContact`, `searchContacts`, `getContactLabels`, `setContactLabels` |
| **Conversations** | `getConversations`, `getConversation`, `createConversation`, `updateConversation`, `toggleConversationPriority`, `getConversationMeta`, `getConversationLabels`, `setConversationLabels`, `updateConversationCustomAttributes` |
| **Messages** | `getMessages`, `sendMessage`, `sendFile` |
| **Inboxes** | `getInboxes`, `getInbox`, `getInboxAgents`, `getInboxTemplates` |
| **Agents** | `getAgents`, `addAgent`, `updateAgent`, `removeAgent` |
| **Teams** | `getTeams`, `createTeam`, `deleteTeam`, `getTeamMembers`, `addTeamMember`, `removeTeamMember` |
| **Labels** | `getLabels` |
| **Reports** | `getAccountSummary`, `getAgentSummary`, `getInboxSummary`, `getMetrics`, `getConversationStats`, `getSummaryReport` |

## Environment

- Node.js >= 18 (native `fetch`, `Blob`, `FormData`)
- ESM + CJS dual export
- TypeScript declarations included

## License

MIT
