import { Message, BlocksEntity, ElementsEntity } from './interfaces/messages';
import logger from './logger';

abstract class BaseMessage {
  public constructor() {
    logger.debug(`Handler created for ${this.constructor.name}`);
  }
  abstract event(msg: Message): void;

  protected blockParse(blocks: BlocksEntity[]): void {
    if (blocks.length > 1) {
      throw new Error('blocks too long');
    }
    this.flattenElements(blocks[0].elements);
  }

  private flattenElements(elements: ElementsEntity[]) {
    logger.debug(elements);
    // let newObject = []
    // this.flattenHelper(elements, newObject, "");
    // return newObject;
  }

  // private flattenHelper(currentElements: ElementsEntity[], newObject: [], previousKey) {
  //   // for (let key in currentElements) {
  //   //   let value = currentElements[key];
  //   // }

  // }
}

class JoinMessage extends BaseMessage {
  event(msg: Message) {
    logger.info(msg);
  }
}

class DirectMessage extends BaseMessage {
  event(msg: Message) {
    logger.info(`Received direct message`);
    this.action(msg);
  }

  private action(msg: Message) {
    const parts = msg.text.split(' ');
    switch (parts[0]) {
      case 'create':
        logger.info(`${msg.user} wants to create a character.`);
        break;
      case 'fight':
        logger.info(`${msg.user} wants to fight ${parts[1]}.`);
        break;
      default:
        logger.info(`Unknown action: ${parts[0]}.`);
    }
  }
}

interface IBaseMessageContainer {
  [key: string]: BaseMessage;
}
export class MessageHandler {
  static handlers: IBaseMessageContainer = {};

  public static init(): void {
    MessageHandler.register('default', new DirectMessage());
    MessageHandler.register('join', new JoinMessage());
  }

  public static register(name: string, handler: BaseMessage): void {
    MessageHandler.handlers[name] = handler;
  }

  public static event(msg: Message): void {
    if (msg.subtype && MessageHandler.handlers[msg.subtype]) {
      MessageHandler.handlers[msg.subtype].event(msg);
    } else {
      MessageHandler.handlers['default'].event(msg);
    }
  }
}
