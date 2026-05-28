import type { ChatwootClientInterface } from './contracts/ChatwootClientInterface.js';
import type { ContactDTO } from './dtos/ContactDTO.js';
import type { ConversationDTO } from './dtos/ConversationDTO.js';
import type { MessageDTO } from './dtos/MessageDTO.js';
import type { AgentDTO } from './dtos/AgentDTO.js';
import type { TeamDTO } from './dtos/TeamDTO.js';
import type { ReportCriteriaDTO } from './dtos/ReportCriteriaDTO.js';
import { ChatwootClient } from './ChatwootClient.js';
import { ChatwootFake } from './testing/ChatwootFake.js';

interface AccountConfig {
  baseUrl: string;
  accountId: string;
  apiAccessToken: string;
}

interface ChatwootConfig {
  default?: string;
  accounts: Record<string, AccountConfig>;
}

export class ChatwootManager implements ChatwootClientInterface {
  private readonly accounts = new Map<string, ChatwootClientInterface>();
  private fakeInstance: ChatwootClientInterface | null = null;
  private readonly config: ChatwootConfig;

  constructor(config: ChatwootConfig) {
    this.config = config;
  }

  account(name?: string): ChatwootClientInterface {
    if (this.fakeInstance) return this.fakeInstance;

    const key = name ?? this.config.default ?? 'default';

    let client = this.accounts.get(key);
    if (!client) {
      const cfg = this.config.accounts[key];
      if (!cfg) {
        throw new Error(`Chatwoot account [${key}] is not defined.`);
      }
      client = new ChatwootClient(cfg.baseUrl, cfg.accountId, cfg.apiAccessToken);
      this.accounts.set(key, client);
    }

    return client;
  }

  fake(): ChatwootFake {
    const fake = new ChatwootFake();
    this.fakeInstance = fake;
    return fake;
  }

  getFake(): ChatwootFake | null {
    return this.fakeInstance instanceof ChatwootFake ? this.fakeInstance : null;
  }

  getDefaultAccount(): string {
    return this.config.default ?? 'default';
  }

  // ── Delegates ─────────────────────────────────────────────

  getContacts(params?: Record<string, unknown>): Promise<unknown> {
    return this.account().getContacts(params);
  }
  getContact(id: number): Promise<unknown> {
    return this.account().getContact(id);
  }
  createContact(data: ContactDTO): Promise<unknown> {
    return this.account().createContact(data);
  }
  updateContact(id: number, data: ContactDTO): Promise<unknown> {
    return this.account().updateContact(id, data);
  }
  deleteContact(id: number): Promise<unknown> {
    return this.account().deleteContact(id);
  }
  searchContacts(query: string): Promise<unknown> {
    return this.account().searchContacts(query);
  }
  getConversations(params?: Record<string, unknown>): Promise<unknown> {
    return this.account().getConversations(params);
  }
  getConversation(id: number): Promise<unknown> {
    return this.account().getConversation(id);
  }
  createConversation(data: ConversationDTO): Promise<unknown> {
    return this.account().createConversation(data);
  }
  updateConversation(id: number, data: ConversationDTO): Promise<unknown> {
    return this.account().updateConversation(id, data);
  }
  toggleConversationPriority(id: number): Promise<unknown> {
    return this.account().toggleConversationPriority(id);
  }
  getConversationMeta(): Promise<unknown> {
    return this.account().getConversationMeta();
  }
  getMessages(conversationId: number): Promise<unknown> {
    return this.account().getMessages(conversationId);
  }
  sendMessage(conversationId: number, message: MessageDTO): Promise<unknown> {
    return this.account().sendMessage(conversationId, message);
  }
  sendFile(conversationId: number, file: Blob | Buffer | string, content?: string | null, additionalData?: Record<string, unknown>): Promise<unknown> {
    return this.account().sendFile(conversationId, file, content, additionalData);
  }
  getInboxes(params?: Record<string, unknown>): Promise<unknown> {
    return this.account().getInboxes(params);
  }
  getInbox(id: number): Promise<unknown> {
    return this.account().getInbox(id);
  }
  getInboxAgents(id: number): Promise<unknown> {
    return this.account().getInboxAgents(id);
  }
  getInboxTemplates(id: number): Promise<unknown> {
    return this.account().getInboxTemplates(id);
  }
  getAgents(): Promise<unknown> {
    return this.account().getAgents();
  }
  addAgent(data: AgentDTO): Promise<unknown> {
    return this.account().addAgent(data);
  }
  updateAgent(id: number, data: AgentDTO): Promise<unknown> {
    return this.account().updateAgent(id, data);
  }
  removeAgent(id: number): Promise<unknown> {
    return this.account().removeAgent(id);
  }
  getTeams(): Promise<unknown> {
    return this.account().getTeams();
  }
  createTeam(data: TeamDTO): Promise<unknown> {
    return this.account().createTeam(data);
  }
  deleteTeam(id: number): Promise<unknown> {
    return this.account().deleteTeam(id);
  }
  getTeamMembers(teamId: number): Promise<unknown> {
    return this.account().getTeamMembers(teamId);
  }
  addTeamMember(teamId: number, userId: number): Promise<unknown> {
    return this.account().addTeamMember(teamId, userId);
  }
  removeTeamMember(teamId: number, userId: number): Promise<unknown> {
    return this.account().removeTeamMember(teamId, userId);
  }
  getLabels(): Promise<unknown> {
    return this.account().getLabels();
  }
  getConversationLabels(conversationId: number): Promise<unknown> {
    return this.account().getConversationLabels(conversationId);
  }
  setConversationLabels(conversationId: number, labels: string[]): Promise<unknown> {
    return this.account().setConversationLabels(conversationId, labels);
  }
  updateConversationCustomAttributes(conversationId: number, customAttributes: Record<string, unknown>): Promise<unknown> {
    return this.account().updateConversationCustomAttributes(conversationId, customAttributes);
  }
  getContactLabels(contactId: number): Promise<unknown> {
    return this.account().getContactLabels(contactId);
  }
  setContactLabels(contactId: number, labels: string[]): Promise<unknown> {
    return this.account().setContactLabels(contactId, labels);
  }
  getAccountSummary(params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.account().getAccountSummary(params);
  }
  getAgentSummary(agentId: number, params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.account().getAgentSummary(agentId, params);
  }
  getInboxSummary(inboxId: number, params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.account().getInboxSummary(inboxId, params);
  }
  getMetrics(metric: string, params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.account().getMetrics(metric, params);
  }
  getConversationStats(params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.account().getConversationStats(params);
  }
  getSummaryReport(type: string, params?: ReportCriteriaDTO | null): Promise<unknown> {
    return this.account().getSummaryReport(type, params);
  }
}
