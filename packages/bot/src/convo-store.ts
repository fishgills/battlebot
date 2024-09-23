import { ConversationStore } from '@slack/bolt';
import { sdk } from './utils/gql';
import { Logger } from './logger';
export class BotStore implements ConversationStore {
  set(conversationId: string, value: any, expiresAt?: number) {
    Logger.info(
      `Setting convo ${conversationId} to ${value} expires at ${expiresAt}`,
    );
    return sdk.CreateConversation({
      body: value,
      expiresAt,
      id: conversationId,
    });
  }
  async get(conversationId: string) {
    const { getConversation } = await sdk.GetConversation({
      id: conversationId,
    });

    if (getConversation) {
      Logger.info(`SQL Convo found: ${conversationId}`);
      if (getConversation.expiresAt && Date.now() > getConversation.expiresAt) {
        await sdk.DeleteConversation({
          id: conversationId,
        });
        throw new Error('Convo expired, deleted');
      }
      return getConversation.body;
    } else {
      Logger.info(`SQL Convo not found: ${conversationId}`);
      throw new Error(`SQL Convo not found: ${conversationId}`);
    }
  }
}
