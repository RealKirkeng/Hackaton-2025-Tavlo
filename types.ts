
export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}
