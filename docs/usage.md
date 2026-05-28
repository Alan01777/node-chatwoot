# Basic Usage

## DTOs (Data Transfer Objects)

All create and update operations use typed DTOs created via factory functions:

```ts
import {
  createContactDTO,
  createConversationDTO,
  createMessageDTO,
  createAgentDTO,
  createTeamDTO,
} from '@alan01777/node-chatwoot';
```

Each factory returns an immutable, frozen object. DTOs are automatically serialized to the Chatwoot API format (camelCase → snake_case) when sent.

## Contacts

```ts
import { createContactDTO } from '@alan01777/node-chatwoot';

const contact = await chatwoot.createContact(createContactDTO({
  name: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+123456789',
  customAttributes: { source: 'web_app' },
}));

// Update
await chatwoot.updateContact(42, createContactDTO({ name: 'John Edited' }));
```

## Conversations

```ts
import { createConversationDTO, ConversationStatus, ConversationPriority } from '@alan01777/node-chatwoot';

// Create
const conv = await chatwoot.createConversation(createConversationDTO({
  sourceId: 1,
  inboxId: 1,
  contactId: 1,
  status: ConversationStatus.PENDING,
}));

// Update (assign + resolve)
await chatwoot.updateConversation(10, createConversationDTO({
  status: ConversationStatus.RESOLVED,
  assigneeId: 42,
  priority: ConversationPriority.HIGH,
}));
```

## Messages

```ts
import { createMessageDTO } from '@alan01777/node-chatwoot';

await chatwoot.sendMessage(conversationId, createMessageDTO({
  content: 'Hello! How can I help?',
  private: false,
}));
```

## Inboxes & Agents

```ts
const inboxes = await chatwoot.getInboxes();
const agents = await chatwoot.getInboxAgents(inboxId);
const allAgents = await chatwoot.getAgents();
```

## Teams

```ts
const teams = await chatwoot.getTeams();
await chatwoot.addTeamMember(teamId, userId);
```
