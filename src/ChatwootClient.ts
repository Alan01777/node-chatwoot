import type { ChatwootClientInterface } from './contracts/ChatwootClientInterface.js';
import type {
  ContactDTO,
  ConversationDTO,
  MessageDTO,
  AgentDTO,
  TeamDTO,
  ReportCriteriaDTO,
} from './dtos/index.js';
import {
  contactDTOToPayload,
  conversationDTOToPayload,
  messageDTOToPayload,
  agentDTOToPayload,
  teamDTOToPayload,
  reportCriteriaDTOToPayload,
} from './utils.js';

export class ChatwootClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ChatwootClientError';
  }
}

export class ChatwootClient implements ChatwootClientInterface {
  private readonly apiUrl: string;
  private readonly apiUrlV2: string;

  constructor(
    private readonly baseUrl: string,
    private readonly accountId: string,
    private readonly apiAccessToken: string,
  ) {
    const normalized = this.baseUrl.replace(/\/+$/, '');
    this.apiUrl = `${normalized}/api/v1/accounts/${this.accountId}`;
    this.apiUrlV2 = `${normalized}/api/v2/accounts/${this.accountId}`;
  }

  private async request<T = unknown>(
    method: string,
    path: string,
    options: { body?: unknown; params?: Record<string, unknown>; version?: 'v1' | 'v2' } = {},
  ): Promise<T> {
    const version = options.version ?? 'v1';
    const base = version === 'v2' ? this.apiUrlV2 : this.apiUrl;
    const qs = options.params
      ? '?' + new URLSearchParams(
          Object.entries(options.params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : '';

    const url = `${base}/${path.replace(/^\//, '')}${qs}`;

    const headers: Record<string, string> = {
      api_access_token: this.apiAccessToken,
      Accept: 'application/json',
    };

    const init: RequestInit = { method, headers };

    if (options.body !== undefined && options.body !== null) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }

    const res = await fetch(url, init);

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }
      throw new ChatwootClientError(
        `Chatwoot API error: ${res.status} ${res.statusText}`,
        res.status,
        body,
      );
    }

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }

  private post<T = unknown>(path: string, body?: unknown, version?: 'v1' | 'v2'): Promise<T> {
    return this.request('POST', path, { body, version });
  }

  private get<T = unknown>(path: string, params?: Record<string, unknown>, version?: 'v1' | 'v2'): Promise<T> {
    return this.request('GET', path, { params, version });
  }

  private patch<T = unknown>(path: string, body: unknown, version?: 'v1' | 'v2'): Promise<T> {
    return this.request('PATCH', path, { body, version });
  }

  private del<T = unknown>(path: string, version?: 'v1' | 'v2'): Promise<T> {
    return this.request('DELETE', path, { version });
  }

  // ── Contacts ──────────────────────────────────────────────

  getContacts(params?: Record<string, unknown>): Promise<unknown> {
    return this.get('contacts', params);
  }
  getContact(id: number): Promise<unknown> {
    return this.get(`contacts/${id}`);
  }
  createContact(data: ContactDTO): Promise<unknown> {
    return this.post('contacts', contactDTOToPayload(data));
  }
  updateContact(id: number, data: ContactDTO): Promise<unknown> {
    return this.patch(`contacts/${id}`, contactDTOToPayload(data));
  }
  deleteContact(id: number): Promise<unknown> {
    return this.del(`contacts/${id}`);
  }
  searchContacts(query: string): Promise<unknown> {
    return this.get('contacts/search', { q: query });
  }
  getContactLabels(contactId: number): Promise<unknown> {
    return this.get(`contacts/${contactId}/labels`);
  }
  setContactLabels(contactId: number, labels: string[]): Promise<unknown> {
    return this.post(`contacts/${contactId}/labels`, { labels });
  }

  // ── Conversations ─────────────────────────────────────────

  getConversations(params?: Record<string, unknown>): Promise<unknown> {
    return this.get('conversations', params);
  }
  getConversation(id: number): Promise<unknown> {
    return this.get(`conversations/${id}`);
  }
  createConversation(data: ConversationDTO): Promise<unknown> {
    return this.post('conversations', conversationDTOToPayload(data));
  }
  updateConversation(id: number, data: ConversationDTO): Promise<unknown> {
    return this.patch(`conversations/${id}`, conversationDTOToPayload(data));
  }
  toggleConversationPriority(id: number): Promise<unknown> {
    return this.post(`conversations/${id}/toggle_priority`);
  }
  getConversationMeta(): Promise<unknown> {
    return this.get('conversations/meta');
  }
  getConversationLabels(conversationId: number): Promise<unknown> {
    return this.get(`conversations/${conversationId}/labels`);
  }
  setConversationLabels(conversationId: number, labels: string[]): Promise<unknown> {
    return this.post(`conversations/${conversationId}/labels`, { labels });
  }
  updateConversationCustomAttributes(conversationId: number, customAttributes: Record<string, unknown>): Promise<unknown> {
    return this.post(`conversations/${conversationId}/custom_attributes`, { custom_attributes: customAttributes });
  }

  // ── Messages ──────────────────────────────────────────────

  getMessages(conversationId: number): Promise<unknown> {
    return this.get(`conversations/${conversationId}/messages`);
  }
  sendMessage(conversationId: number, message: MessageDTO): Promise<unknown> {
    return this.post(`conversations/${conversationId}/messages`, messageDTOToPayload(message));
  }
  async sendFile(
    conversationId: number,
    file: Blob | Buffer | string,
    content?: string | null,
    additionalData: Record<string, unknown> = {},
  ): Promise<unknown> {
    const normalized = this.baseUrl.replace(/\/+$/, '');
    const url = `${normalized}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/messages`;

    const form = new FormData();

    if (content) {
      form.append('content', content);
    }

    form.append('message_type', 'outgoing');
    form.append('private', 'false');

    for (const [key, value] of Object.entries(additionalData)) {
      form.append(key, typeof value === 'boolean' ? String(value) : String(value));
    }

    if (typeof file === 'string') {
      form.append('attachments[]', new Blob([file], { type: 'application/octet-stream' }), 'file');
    } else if (Buffer.isBuffer(file)) {
      form.append('attachments[]', new (Blob as any)([file], { type: 'application/octet-stream' }) as Blob, 'file');
    } else {
      form.append('attachments[]', file, (file as any).name ?? 'file');
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        api_access_token: this.apiAccessToken,
        Accept: 'application/json',
      },
      body: form,
    });

    if (!res.ok) {
      let body: unknown;
      try { body = await res.json(); } catch { body = await res.text(); }
      throw new ChatwootClientError(`Chatwoot API error: ${res.status} ${res.statusText}`, res.status, body);
    }

    return res.json();
  }

  // ── Inboxes ───────────────────────────────────────────────

  getInboxes(params?: Record<string, unknown>): Promise<unknown> {
    return this.get('inboxes', params);
  }
  getInbox(id: number): Promise<unknown> {
    return this.get(`inboxes/${id}`);
  }
  getInboxAgents(id: number): Promise<unknown> {
    return this.get(`inboxes/${id}/assignable_agents`);
  }
  async getInboxTemplates(id: number): Promise<unknown> {
    const inbox = await this.getInbox(id) as Record<string, unknown>;
    return (inbox as any).message_templates ?? [];
  }

  // ── Agents ────────────────────────────────────────────────

  getAgents(): Promise<unknown> {
    return this.get('agents');
  }
  addAgent(data: AgentDTO): Promise<unknown> {
    return this.post('agents', agentDTOToPayload(data));
  }
  updateAgent(id: number, data: AgentDTO): Promise<unknown> {
    return this.patch(`agents/${id}`, agentDTOToPayload(data));
  }
  removeAgent(id: number): Promise<unknown> {
    return this.del(`agents/${id}`);
  }

  // ── Teams ─────────────────────────────────────────────────

  getTeams(): Promise<unknown> {
    return this.get('teams');
  }
  createTeam(data: TeamDTO): Promise<unknown> {
    return this.post('teams', teamDTOToPayload(data));
  }
  deleteTeam(id: number): Promise<unknown> {
    return this.del(`teams/${id}`);
  }
  getTeamMembers(teamId: number): Promise<unknown> {
    return this.get(`teams/${teamId}/team_members`);
  }
  addTeamMember(teamId: number, userId: number): Promise<unknown> {
    return this.post(`teams/${teamId}/team_members`, { user_id: userId });
  }
  removeTeamMember(teamId: number, userId: number): Promise<unknown> {
    return this.del(`teams/${teamId}/team_members`);
  }

  // ── Labels ────────────────────────────────────────────────

  getLabels(): Promise<unknown> {
    return this.get('labels');
  }

  // ── Reports (v2) ──────────────────────────────────────────

  getAccountSummary(params?: ReportCriteriaDTO | null): Promise<unknown> {
    const payload = { type: 'account', ...(params ? reportCriteriaDTOToPayload(params) : {}) };
    return this.get('reports/summary', payload, 'v2');
  }
  getAgentSummary(agentId: number, params?: ReportCriteriaDTO | null): Promise<unknown> {
    const payload = { type: 'agent', id: agentId, ...(params ? reportCriteriaDTOToPayload(params) : {}) };
    return this.get('reports/summary', payload, 'v2');
  }
  getInboxSummary(inboxId: number, params?: ReportCriteriaDTO | null): Promise<unknown> {
    const payload = { type: 'inbox', id: inboxId, ...(params ? reportCriteriaDTOToPayload(params) : {}) };
    return this.get('reports/summary', payload, 'v2');
  }
  getMetrics(metric: string, params?: ReportCriteriaDTO | null): Promise<unknown> {
    const payload = { metric, ...(params ? reportCriteriaDTOToPayload(params) : {}) };
    return this.get('reports', payload, 'v2');
  }
  getConversationStats(params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.get('reports/conversations', params ? reportCriteriaDTOToPayload(params) : {}, 'v2');
  }
  getSummaryReport(type: string, params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.get(`summary_reports/${type}`, params ? reportCriteriaDTOToPayload(params) : {}, 'v2');
  }
}

export { ChatwootClientError as ChatwootError };
