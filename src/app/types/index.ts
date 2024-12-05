import { Message } from "ai";

export interface StreamContextType {
  storeMessage: (message: Message) => Promise<void>;
  getAllMessages: () => Promise<Message[]>;
}
