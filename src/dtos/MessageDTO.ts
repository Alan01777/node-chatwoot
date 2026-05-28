interface MessageDTOData {
  content: string;
  messageType?: string;
  private?: boolean;
  attachments?: Array<{
    fileType?: string;
    fileUrl?: string;
    thumbUrl?: string;
    dataUrl?: string;
    [key: string]: unknown;
  }>;
  templateParams?: {
    name: string;
    category: string;
    language: string;
    processed_params?: Record<string, string> | Record<string, string>[];
    namespace?: string;
  } | null;
}

export interface MessageDTO extends Readonly<MessageDTOData> {}

export function createMessageDTO(data: MessageDTOData): MessageDTO {
  return Object.freeze({
    messageType: 'outgoing',
    private: false,
    attachments: [],
    templateParams: null,
    ...data,
  });
}
