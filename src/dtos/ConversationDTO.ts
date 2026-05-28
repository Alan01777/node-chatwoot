import { ConversationStatus } from '../enums/ConversationStatus.js';
import { ConversationPriority } from '../enums/ConversationPriority.js';

interface ConversationDTOData {
  sourceId?: number | null;
  inboxId?: number | null;
  contactId?: number | null;
  status?: ConversationStatus | null;
  assigneeId?: number | null;
  teamId?: number | null;
  labels?: string[] | null;
  customAttributes?: Record<string, unknown> | null;
  priority?: ConversationPriority | null;
}

export interface ConversationDTO extends Readonly<ConversationDTOData> {}

export function createConversationDTO(data: ConversationDTOData = {}): ConversationDTO {
  return Object.freeze({
    sourceId: null,
    inboxId: null,
    contactId: null,
    status: null,
    assigneeId: null,
    teamId: null,
    labels: null,
    customAttributes: null,
    priority: null,
    ...data,
  });
}
