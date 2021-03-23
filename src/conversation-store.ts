import { ConversationStore } from "@slack/bolt";
import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export class DynamoStore<ConversationState = any>
  implements ConversationStore<ConversationState> {
  private docClient: DocumentClient;

  private table = "conversations";

  constructor() {
    AWS.config.update({
      region: "us-west-2",
    });

    this.docClient = new AWS.DynamoDB.DocumentClient();
  }
  // set(conversationId: string, value: ConversationState, expiresAt?: number): Promise<unknown>;
  // get(conversationId: string): Promise<ConversationState>;
  public async set(id: string, value: ConversationState): Promise<boolean> {
    console.log(`set`, id, value);
    try {
      const result = await this.docClient.put({
        TableName: this.table,
        Item: {
          id: id,
          value,
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public get(id: string): Promise<ConversationState> {
    console.log("get", id);
    return new Promise((resolve, reject) => {
      this.docClient.get(
        {
          TableName: this.table,
          Key: {
            id,
          },
        },
        (err, data) => {
          if (err) {
            reject(err);
          }
          console.log(data);
          resolve((data as unknown) as ConversationState);
        }
      );
    });
  }
}
