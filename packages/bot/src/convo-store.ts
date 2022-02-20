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
  get(conversationId: string) {
    return new Promise<string>((resolve, reject) => {
      sdk
        .Convo({
          convoId: conversationId,
        })
        .then(({ convo }) => {
          if (convo) {
            if (convo.expiresAt !== undefined && Date.now() > convo.expiresAt) {
              sdk
                .DeleteConvo({
                  convoId: convo.convoId,
                })
                .then(() => {
                  reject(new Error('Conversation expired'));
                });
            }
            resolve(convo.value);
          } else {
            reject(new Error(`Convo not found: ${conversationId}`));
          }
        });
    });
  }
}
