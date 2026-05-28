interface ContactDTOData {
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  customAttributes?: Record<string, unknown> | null;
  avatarUrl?: string | null;
  identifier?: string | null;
}

export interface ContactDTO extends Readonly<ContactDTOData> {}

export function createContactDTO(data: ContactDTOData): ContactDTO {
  return Object.freeze({ ...data });
}
