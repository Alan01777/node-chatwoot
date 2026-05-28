# Reporting API (v2)

All reporting methods use API v2 and accept an optional `ReportCriteriaDTO`.

## ReportCriteriaDTO

```ts
import { createReportCriteriaDTO, ReportType } from '@alan01777/node-chatwoot';

const criteria = createReportCriteriaDTO({
  since: new Date('2024-01-01'),  // or a Unix timestamp (number)
  until: new Date(),
  type: ReportType.ACCOUNT,
});
```

`since` and `until` accept `Date` (converted to Unix timestamp) or raw `number`.

## Metrics Summaries

### Account Summary

```ts
const summary = await chatwoot.getAccountSummary(criteria);
// { avg_resolution_time: ..., conversations_count: ... }
```

### Agent & Inbox Summaries

```ts
const agentSummary = await chatwoot.getAgentSummary(agentId, criteria);
const inboxSummary = await chatwoot.getInboxSummary(inboxId, criteria);
```

## Metrics Series (Timeline)

```ts
const metrics = await chatwoot.getMetrics('conversations_count', criteria);
```

## Real-time Statistics

### Conversation Stats

```ts
const stats = await chatwoot.getConversationStats(criteria);
```

### Leaderboards

```ts
const ranking = await chatwoot.getSummaryReport('agent', criteria);
```

Valid types: `'account'`, `'agent'`, `'inbox'`, `'team'` (also available as `ReportType` enum values).
