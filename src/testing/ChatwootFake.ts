import type { ChatwootClientInterface } from '../contracts/ChatwootClientInterface.js';
import type {
  ContactDTO,
  ConversationDTO,
  MessageDTO,
  AgentDTO,
  TeamDTO,
  ReportCriteriaDTO,
} from '../dtos/index.js';

type MethodCall = { method: string; args: unknown[] };

export class ChatwootFake implements ChatwootClientInterface {
  private calls: MethodCall[] = [];

  private record(method: string, args: unknown[]): void {
    this.calls.push({ method, args });
  }

  getCallHistory(): readonly MethodCall[] {
    return this.calls;
  }

  findCall(method: string): unknown[][] {
    return this.calls.filter((c) => c.method === method).map((c) => c.args);
  }

  assertMessageSent(callback: (message: MessageDTO, conversationId: number) => boolean): void {
    const sent = this.findCall('sendMessage');
    for (const args of sent) {
      if (callback(args[1] as MessageDTO, args[0] as number)) return;
    }
    throw new Error('The expected message was not sent.');
  }

  assertContactCreated(callback: (data: ContactDTO) => boolean): void {
    const created = this.findCall('createContact');
    for (const args of created) {
      if (callback(args[0] as ContactDTO)) return;
    }
    throw new Error('The expected contact was not created.');
  }

  assertFileSent(
    callback: (file: unknown, conversationId: number, content?: string | null) => boolean,
  ): void {
    const sent = this.findCall('sendFile');
    for (const args of sent) {
      if (callback(args[1], args[0] as number, args[2] as string | null | undefined)) return;
    }
    throw new Error('The expected file was not sent.');
  }

  assertConversationUpdated(
    callback: (dto: ConversationDTO, id: number) => boolean,
  ): void {
    const updated = this.findCall('updateConversation');
    for (const args of updated) {
      if (callback(args[1] as ConversationDTO, args[0] as number)) return;
    }
    throw new Error('The expected conversation was not updated.');
  }

  // ── Contacts ────────────────────────────────

  getContacts(params?: Record<string, unknown>): Promise<unknown> {
    this.record('getContacts', [params]);
    return Promise.resolve([]);
  }
  getContact(id: number): Promise<unknown> {
    this.record('getContact', [id]);
    return Promise.resolve(null);
  }
  createContact(data: ContactDTO): Promise<unknown> {
    this.record('createContact', [data]);
    return Promise.resolve(null);
  }
  updateContact(id: number, data: ContactDTO): Promise<unknown> {
    this.record('updateContact', [id, data]);
    return Promise.resolve(null);
  }
  deleteContact(id: number): Promise<unknown> {
    this.record('deleteContact', [id]);
    return Promise.resolve(null);
  }
  searchContacts(query: string): Promise<unknown> {
    this.record('searchContacts', [query]);
    return Promise.resolve([]);
  }
  getContactLabels(contactId: number): Promise<unknown> {
    this.record('getContactLabels', [contactId]);
    return Promise.resolve([]);
  }
  setContactLabels(contactId: number, labels: string[]): Promise<unknown> {
    this.record('setContactLabels', [contactId, labels]);
    return Promise.resolve(null);
  }

  // ── Conversations ────────────────────────────

  getConversations(params?: Record<string, unknown>): Promise<unknown> {
    this.record('getConversations', [params]);
    return Promise.resolve([]);
  }
  getConversation(id: number): Promise<unknown> {
    this.record('getConversation', [id]);
    return Promise.resolve(null);
  }
  createConversation(data: ConversationDTO): Promise<unknown> {
    this.record('createConversation', [data]);
    return Promise.resolve(null);
  }
  updateConversation(id: number, data: ConversationDTO): Promise<unknown> {
    this.record('updateConversation', [id, data]);
    return Promise.resolve(null);
  }
  toggleConversationPriority(id: number): Promise<unknown> {
    this.record('toggleConversationPriority', [id]);
    return Promise.resolve(null);
  }
  getConversationMeta(): Promise<unknown> {
    this.record('getConversationMeta', []);
    return Promise.resolve(null);
  }
  getConversationLabels(conversationId: number): Promise<unknown> {
    this.record('getConversationLabels', [conversationId]);
    return Promise.resolve([]);
  }
  setConversationLabels(conversationId: number, labels: string[]): Promise<unknown> {
    this.record('setConversationLabels', [conversationId, labels]);
    return Promise.resolve(null);
  }
  updateConversationCustomAttributes(conversationId: number, customAttributes: Record<string, unknown>): Promise<unknown> {
    this.record('updateConversationCustomAttributes', [conversationId, customAttributes]);
    return Promise.resolve(null);
  }

  // ── Messages ─────────────────────────────────

  getMessages(conversationId: number): Promise<unknown> {
    this.record('getMessages', [conversationId]);
    return Promise.resolve([]);
  }
  sendMessage(conversationId: number, message: MessageDTO): Promise<unknown> {
    this.record('sendMessage', [conversationId, message]);
    return Promise.resolve(null);
  }
  sendFile(conversationId: number, file: unknown, content?: string | null, additionalData?: Record<string, unknown>): Promise<unknown> {
    this.record('sendFile', [conversationId, file, content, additionalData]);
    return Promise.resolve(null);
  }

  // ── Inboxes ──────────────────────────────────

  getInboxes(params?: Record<string, unknown>): Promise<unknown> {
    this.record('getInboxes', [params]);
    return Promise.resolve([]);
  }
  getInbox(id: number): Promise<unknown> {
    this.record('getInbox', [id]);
    return Promise.resolve(null);
  }
  getInboxAgents(id: number): Promise<unknown> {
    this.record('getInboxAgents', [id]);
    return Promise.resolve([]);
  }
  getInboxTemplates(id: number): Promise<unknown> {
    this.record('getInboxTemplates', [id]);
    return Promise.resolve([]);
  }

  // ── Agents ───────────────────────────────────

  getAgents(): Promise<unknown> {
    this.record('getAgents', []);
    return Promise.resolve([]);
  }
  addAgent(data: AgentDTO): Promise<unknown> {
    this.record('addAgent', [data]);
    return Promise.resolve(null);
  }
  updateAgent(id: number, data: AgentDTO): Promise<unknown> {
    this.record('updateAgent', [id, data]);
    return Promise.resolve(null);
  }
  removeAgent(id: number): Promise<unknown> {
    this.record('removeAgent', [id]);
    return Promise.resolve(null);
  }

  // ── Teams ────────────────────────────────────

  getTeams(): Promise<unknown> {
    this.record('getTeams', []);
    return Promise.resolve([]);
  }
  createTeam(data: TeamDTO): Promise<unknown> {
    this.record('createTeam', [data]);
    return Promise.resolve(null);
  }
  deleteTeam(id: number): Promise<unknown> {
    this.record('deleteTeam', [id]);
    return Promise.resolve(null);
  }
  getTeamMembers(teamId: number): Promise<unknown> {
    this.record('getTeamMembers', [teamId]);
    return Promise.resolve([]);
  }
  addTeamMember(teamId: number, userId: number): Promise<unknown> {
    this.record('addTeamMember', [teamId, userId]);
    return Promise.resolve(null);
  }
  removeTeamMember(teamId: number, userId: number): Promise<unknown> {
    this.record('removeTeamMember', [teamId, userId]);
    return Promise.resolve(null);
  }

  // ── Labels ───────────────────────────────────

  getLabels(): Promise<unknown> {
    this.record('getLabels', []);
    return Promise.resolve([]);
  }

  // ── Reports ──────────────────────────────────

  getAccountSummary(params?: ReportCriteriaDTO | null): Promise<unknown> {
    this.record('getAccountSummary', [params]);
    return Promise.resolve(null);
  }
  getAgentSummary(agentId: number, params?: ReportCriteriaDTO | null): Promise<unknown> {
    this.record('getAgentSummary', [agentId, params]);
    return Promise.resolve(null);
  }
  getInboxSummary(inboxId: number, params?: ReportCriteriaDTO | null): Promise<unknown> {
    this.record('getInboxSummary', [inboxId, params]);
    return Promise.resolve(null);
  }
  getMetrics(metric: string, params?: ReportCriteriaDTO | null): Promise<unknown> {
    this.record('getMetrics', [metric, params]);
    return Promise.resolve(null);
  }
  getConversationStats(params?: ReportCriteriaDTO | null): Promise<unknown> {
    this.record('getConversationStats', [params]);
    return Promise.resolve(null);
  }
  getSummaryReport(type: string, params?: ReportCriteriaDTO | null): Promise<unknown> {
    this.record('getSummaryReport', [type, params]);
    return Promise.resolve(null);
  }
}
