interface AgentDTOData {
  email: string;
  name: string;
  role?: string;
  availabilityStatus?: string | null;
}

export interface AgentDTO extends Readonly<AgentDTOData> {}

export function createAgentDTO(data: AgentDTOData): AgentDTO {
  return Object.freeze({
    role: 'agent',
    availabilityStatus: null,
    ...data,
  });
}
