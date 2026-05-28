# Testing

The package includes `ChatwootFake` — a full mock implementation for unit and integration tests.

## `chatwoot.fake()`

Calling `fake()` replaces all account clients with an in-memory fake. No HTTP requests are sent.

```ts
import { ChatwootManager, createMessageDTO, createContactDTO } from '@alan01777/node-chatwoot';
import { describe, it, expect } from 'vitest';

describe('ChatwootService', () => {
  it('sends a welcome message', async () => {
    const chatwoot = new ChatwootManager({
      accounts: { default: { baseUrl: '', accountId: '', apiAccessToken: '' } },
    });
    const fake = chatwoot.fake();

    // Your application code
    await yourService.sendWelcome(user);

    fake.assertMessageSent((msg, convId) => msg.content === 'Welcome!');
  });
});
```

## Assertions

### `assertMessageSent(callback)`

Callback receives `(MessageDTO, conversationId: number)`. Return `true` to pass.

```ts
fake.assertMessageSent((msg) => msg.content === 'Hello');
```

### `assertContactCreated(callback)`

Callback receives `(ContactDTO)`.

```ts
fake.assertContactCreated((dto) => dto.email === 'test@example.com');
```

### `assertFileSent(callback)`

Callback receives `(file: unknown, conversationId: number, content?: string | null)`.

```ts
fake.assertFileSent((file, convId, content) => convId === 123);
```

### `assertConversationUpdated(callback)`

Callback receives `(ConversationDTO, id: number)`.

```ts
fake.assertConversationUpdated((dto, id) => dto.status === ConversationStatus.RESOLVED);
```

## Low-level Inspection

```ts
// Read every call recorded
fake.getCallHistory();
// [{ method: 'sendMessage', args: [1, { content: 'Hi' }] }, ...]

// Filter by method name
fake.findCall('sendMessage');
// [[1, { content: 'Hi' }]]
```
