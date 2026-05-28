import { ContactDTO, ConversationDTO, MessageDTO, AgentDTO, TeamDTO, ReportCriteriaDTO } from './dtos/index.js';
import { ConversationStatus } from './enums/ConversationStatus.js';
import { ConversationPriority } from './enums/ConversationPriority.js';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const camelToSnake = (key: string): string =>
  key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

function stripNulls(obj: Record<string, unknown>): Record<string, JsonValue> {
  const out: Record<string, JsonValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) {
      out[k] = v as JsonValue;
    }
  }
  return out;
}

export function contactDTOToPayload(dto: ContactDTO): Record<string, JsonValue> {
  return stripNulls({
    name: dto.name,
    email: dto.email ?? null,
    phone_number: dto.phoneNumber ?? null,
    custom_attributes: dto.customAttributes ?? null,
    avatar_url: dto.avatarUrl ?? null,
    identifier: dto.identifier ?? null,
  });
}

export function conversationDTOToPayload(dto: ConversationDTO): Record<string, JsonValue> {
  return stripNulls({
    source_id: dto.sourceId ?? null,
    inbox_id: dto.inboxId ?? null,
    contact_id: dto.contactId ?? null,
    status: dto.status instanceof ConversationStatus ? dto.status : (dto.status ?? null),
    assignee_id: dto.assigneeId ?? null,
    team_id: dto.teamId ?? null,
    labels: dto.labels ?? null,
    custom_attributes: dto.customAttributes ?? null,
    priority: dto.priority instanceof ConversationPriority ? dto.priority : (dto.priority ?? null),
  });
}

export function messageDTOToPayload(dto: MessageDTO): Record<string, JsonValue> {
  const data: Record<string, unknown> = {
    content: dto.content,
    message_type: dto.messageType ?? 'outgoing',
    private: dto.private ?? false,
    attachments: dto.attachments ?? [],
  };

  if (dto.templateParams != null) {
    const tp = { ...dto.templateParams };
    if (tp.processed_params == null) {
      tp.processed_params = {};
    }
    if (Array.isArray(tp.processed_params)) {
      tp.processed_params = Object.fromEntries(
        tp.processed_params.map((item: Record<string, string>, i: number) => [String(i + 1), item]),
      );
    }
    data.template_params = tp;
  }

  return stripNulls(data as Record<string, JsonValue | null>);
}

export function agentDTOToPayload(dto: AgentDTO): Record<string, JsonValue> {
  return stripNulls({
    email: dto.email,
    name: dto.name,
    role: dto.role ?? 'agent',
    availability_status: dto.availabilityStatus ?? null,
  });
}

export function teamDTOToPayload(dto: TeamDTO): Record<string, JsonValue> {
  return stripNulls({
    name: dto.name,
    description: dto.description ?? null,
    allow_auto_assign: dto.allowAutoAssign ?? null,
  });
}

export function reportCriteriaDTOToPayload(dto: ReportCriteriaDTO): Record<string, JsonValue> {
  const data: Record<string, unknown> = {};

  if (dto.type != null && typeof dto.type !== 'string') {
    data.type = dto.type;
  } else if (dto.type != null) {
    data.type = dto.type;
  }

  if (dto.id != null) {
    data.id = dto.id;
  }

  if (dto.since != null) {
    data.since = dto.since instanceof Date ? Math.floor(dto.since.getTime() / 1000) : dto.since;
  }
  if (dto.until != null) {
    data.until = dto.until instanceof Date ? Math.floor(dto.until.getTime() / 1000) : dto.until;
  }

  return stripNulls(data as Record<string, JsonValue | null>);
}

export function objectToSnakeCase(obj: Record<string, unknown>): Record<string, JsonValue> {
  const out: Record<string, JsonValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[camelToSnake(k)] = v as JsonValue;
  }
  return out;
}
