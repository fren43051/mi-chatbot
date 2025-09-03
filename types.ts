
export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export enum MessageType {
  STANDARD,
  WARNING,
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: MessageSender;
  type?: MessageType;
}