# Media & Attachments

Send files (images, documents, audio, video) to Chatwoot conversations via the `sendFile` method.

## Sending Files

`sendFile` builds a `multipart/form-data` request using the native `FormData` API:

```ts
import { ChatwootManager } from '@alan01777/node-chatwoot';

const chatwoot = new ChatwootManager({ ... });

// From a file path (reads from disk)
await chatwoot.sendFile(conversationId, '/path/to/image.png');

// From a Buffer
const buffer = fs.readFileSync('/path/to/invoice.pdf');
await chatwoot.sendFile(conversationId, buffer);

// From a Blob (e.g. fetched from a URL)
const blob = await fetch('https://example.com/image.jpg').then(r => r.blob());
await chatwoot.sendFile(conversationId, blob);

// With caption and metadata
await chatwoot.sendFile(conversationId, '/path/to/file.pdf', 'Here is your invoice', {
  private: true,  // sends as internal note
});
```

### Signature

```ts
sendFile(
  conversationId: number,
  file: Blob | Buffer | string,
  content?: string | null,
  additionalData?: Record<string, unknown>,
): Promise<unknown>
```

- `string` — treated as file path and read via `fs.readFileSync`
- `Buffer` — converted to Blob internally
- `Blob` — passed directly to FormData

## Testing

```ts
const fake = chatwoot.fake();
await chatwoot.sendFile(123, 'file.txt', 'caption');

fake.assertFileSent((file, convId, content) => {
  return convId === 123 && content === 'caption';
});
```
