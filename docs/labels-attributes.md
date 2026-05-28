# Labels & Custom Attributes

## Labels (Tags)

Labels are account-wide. The `setLabels` methods **overwrite** the existing list — fetch first if you want to append.

### Conversation Labels

```ts
const labels = await chatwoot.getConversationLabels(conversationId);
await chatwoot.setConversationLabels(conversationId, ['support', 'urgent']);
```

### Contact Labels

```ts
const labels = await chatwoot.getContactLabels(contactId);
await chatwoot.setContactLabels(contactId, ['premium-user', 'lead']);
```

## Custom Attributes

### Contacts

Pass `customAttributes` via the DTO:

```ts
await chatwoot.createContact(createContactDTO({
  name: 'John Doe',
  customAttributes: { order_id: '12345', is_active: true },
}));

await chatwoot.updateContact(42, createContactDTO({
  customAttributes: { plan: 'enterprise' },
}));
```

### Conversations

Use the dedicated method:

```ts
await chatwoot.updateConversationCustomAttributes(conversationId, {
  priority: 'high',
  sla_plan: 'gold',
});
```

### Conversations (via DTO)

Or via the `ConversationDTO`:

```ts
await chatwoot.updateConversation(10, createConversationDTO({
  customAttributes: { resolved_by: 'bot' },
}));
```
