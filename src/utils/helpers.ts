import {
  GenericMessageEvent,
  MessageEvent,
  ReactionAddedEvent,
  ReactionMessageItem,
} from '@slack/bolt';

export const isGenericMessageEvent = (
  msg: MessageEvent,
): msg is GenericMessageEvent => {
  return (msg as GenericMessageEvent).subtype === undefined;
};

export const isMessageItem = (
  item: ReactionAddedEvent['item'],
): item is ReactionMessageItem => {
  return (item as ReactionMessageItem).type === 'message';
};

export const titleCase = (str: string) => {
  return str[0].toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
};
