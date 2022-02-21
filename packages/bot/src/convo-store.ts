import { ConversationStore } from '@slack/bolt';
import { sdk } from './utils/gql';
export class BotStore implements ConversationStore {
  set(conversationId: string, value: any, expiresAt?: number) {
    return sdk.CreateConvo({
      input: {
        convoId: conversationId,
        value,
        expiresAt,
      },
    });
  }
  async get(conversationId: string) {
    try {
      const { convo: entry } = await sdk.Convo({
        convoId: conversationId,
      });
      if (Date.now() > entry.expiresAt) {
        await sdk.DeleteConvo({
          convoId: conversationId,
        });
        throw new Error('Convo expired, deleted');
      }
      return entry.value;
    } catch (e) {
      return new Error(`SQL Convo not found: ${conversationId}`);
    }
  }
}
