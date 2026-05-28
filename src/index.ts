export { ChatwootManager } from './ChatwootManager.js';
export { ChatwootClient, ChatwootClientError, ChatwootError } from './ChatwootClient.js';
export { ChatwootFake } from './testing/ChatwootFake.js';
export type { ChatwootClientInterface } from './contracts/ChatwootClientInterface.js';

export {
  createContactDTO,
  createConversationDTO,
  createMessageDTO,
  createAgentDTO,
  createTeamDTO,
  createReportCriteriaDTO,
} from './dtos/index.js';

export type {
  ContactDTO,
  ConversationDTO,
  MessageDTO,
  AgentDTO,
  TeamDTO,
  ReportCriteriaDTO,
} from './dtos/index.js';

export {
  ReportType,
  ConversationPriority,
  ConversationStatus,
} from './enums/index.js';
