import { ConversationStore } from '@slack/bolt';
import logger from './logger';
import Conversation from './models/conversation';

export class DynamoStore<ConversationState = any>
  implements ConversationStore<ConversationState> {
  set(
    conversationId: string,
    value: ConversationState,
    expiresAt?: number,
  ): Promise<unknown> {
    return Conversation.create({
      id: conversationId,
      value: value,
      expires: expiresAt,
    });
  }
  get(conversationId: string): Promise<ConversationState> {
    return new Promise(async (resolve, reject) => {
      const entry = await Conversation.findOne({
        where: {
          id: conversationId,
        },
      });
      if (entry) {
        // if (entry.expiresAt !== undefined && Date.now() > entry.expiresAt) {
        //   reject(new Error('Conversation expired'));
        // }
        resolve(entry as any);
      }
      reject(new Error('Conversation not found'));
    });
  }

  // set(conversationId: string, value: ConversationState, expiresAt?: number): Promise<unknown>;
  // get(conversationId: string): Promise<ConversationState>;
}
