import {
  AgentDTO,
  ContactDTO,
  ConversationDTO,
  MessageDTO,
  ReportCriteriaDTO,
  TeamDTO,
} from '../dtos/index.js';

export interface ChatwootClientInterface {
  getContacts(params?: Record<string, unknown>): Promise<unknown>;
  getContact(id: number): Promise<unknown>;
  createContact(data: ContactDTO): Promise<unknown>;
  updateContact(id: number, data: ContactDTO): Promise<unknown>;
  deleteContact(id: number): Promise<unknown>;
  searchContacts(query: string): Promise<unknown>;

  getConversations(params?: Record<string, unknown>): Promise<unknown>;
  getConversation(id: number): Promise<unknown>;
  createConversation(data: ConversationDTO): Promise<unknown>;
  updateConversation(id: number, data: ConversationDTO): Promise<unknown>;
  toggleConversationPriority(id: number): Promise<unknown>;
  getConversationMeta(): Promise<unknown>;

  getMessages(conversationId: number): Promise<unknown>;
  sendMessage(conversationId: number, message: MessageDTO): Promise<unknown>;
  sendFile(
    conversationId: number,
    file: Blob | Buffer | string,
    content?: string | null,
    additionalData?: Record<string, unknown>,
  ): Promise<unknown>;

  getInboxes(params?: Record<string, unknown>): Promise<unknown>;
  getInbox(id: number): Promise<unknown>;
  getInboxAgents(id: number): Promise<unknown>;
  getInboxTemplates(id: number): Promise<unknown>;

  getAgents(): Promise<unknown>;
  addAgent(data: AgentDTO): Promise<unknown>;
  updateAgent(id: number, data: AgentDTO): Promise<unknown>;
  removeAgent(id: number): Promise<unknown>;

  getTeams(): Promise<unknown>;
  createTeam(data: TeamDTO): Promise<unknown>;
  deleteTeam(id: number): Promise<unknown>;
  getTeamMembers(teamId: number): Promise<unknown>;
  addTeamMember(teamId: number, userId: number): Promise<unknown>;
  removeTeamMember(teamId: number, userId: number): Promise<unknown>;

  getLabels(): Promise<unknown>;

  getConversationLabels(conversationId: number): Promise<unknown>;
  setConversationLabels(conversationId: number, labels: string[]): Promise<unknown>;
  updateConversationCustomAttributes(conversationId: number, customAttributes: Record<string, unknown>): Promise<unknown>;

  getContactLabels(contactId: number): Promise<unknown>;
  setContactLabels(contactId: number, labels: string[]): Promise<unknown>;

  getAccountSummary(params?: ReportCriteriaDTO | null): Promise<unknown>;
  getAgentSummary(agentId: number, params?: ReportCriteriaDTO | null): Promise<unknown>;
  getInboxSummary(inboxId: number, params?: ReportCriteriaDTO | null): Promise<unknown>;
  getMetrics(metric: string, params?: ReportCriteriaDTO | null): Promise<unknown>;
  getConversationStats(params?: ReportCriteriaDTO | null): Promise<unknown>;
  getSummaryReport(type: string, params?: ReportCriteriaDTO | null): Promise<unknown>;
}
