import { BaseMessage } from 'src/message/handlers/base';

export interface IBaseMessageContainer {
  [key: string]: BaseMessage;
}
