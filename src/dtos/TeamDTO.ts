interface TeamDTOData {
  name: string;
  description?: string | null;
  allowAutoAssign?: boolean | null;
}

export interface TeamDTO extends Readonly<TeamDTOData> {}

export function createTeamDTO(data: TeamDTOData): TeamDTO {
  return Object.freeze({
    description: null,
    allowAutoAssign: null,
    ...data,
  });
}
