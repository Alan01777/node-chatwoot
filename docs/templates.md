# WhatsApp / Meta Templates

Send Meta/WhatsApp Business templates via Chatwoot's API.

## Fetching Templates

Get templates associated with a WhatsApp inbox:

```ts
const templates = await chatwoot.getInboxTemplates(inboxId);

for (const t of templates as any[]) {
  console.log(t.name);
}
```

## Sending Template Messages

Use the `templateParams` property on `MessageDTO`:

```ts
import { createMessageDTO } from '@alan01777/node-chatwoot';

await chatwoot.sendMessage(conversationId, createMessageDTO({
  content: 'Fallback text for non-WhatsApp channels',
  templateParams: {
    name: 'hello_world',
    category: 'MARKETING',
    language: 'en_US',
    processed_params: {
      body: { '1': 'Customer Name' },
    },
  },
}));
```

### `templateParams` structure

| Key | Type | Required |
|---|---|---|
| `name` | `string` | yes |
| `category` | `string` | yes |
| `language` | `string` | yes |
| `processed_params` | `object` | no |
| `namespace` | `string` | no |

`processed_params` maps variable placeholders (`{{1}}`, `{{2}}`) to actual values:
- `body` — variables in message body
- `header` — variables in template header (if applicable)

If `processed_params` is omitted or `null`, it defaults to `{}` automatically to satisfy Chatwoot's API requirements.
