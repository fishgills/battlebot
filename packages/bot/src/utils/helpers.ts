import {
  AllMiddlewareArgs,
  GenericMessageEvent,
  Installation,
  MessageEvent,
  ReactionAddedEvent,
  ReactionMessageItem,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';

import { Logger } from '../logger';
import api from './api';
import { SlackMessageDto } from 'slack-block-builder';

export const isGenericMessageEvent = (
  msg: MessageEvent,
): msg is GenericMessageEvent => {
  const test = (msg as GenericMessageEvent).subtype === undefined;
  if (!test) Logger.error(`Got a non-generic message`);
  return test;
};

export const isMessageItem = (
  item: ReactionAddedEvent['item'],
): item is ReactionMessageItem => {
  return (item as ReactionMessageItem).type === 'message';
};

export const titleCase = (str: string): string => {
  return str[0].toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
};
export function extract<T>(properties: Record<keyof T, true>) {
  return function <TActual extends T>(value: TActual) {
    const result = {} as T;
    for (const property of Object.keys(properties) as Array<keyof T>) {
      result[property] = value[property];
    }
    return result;
  };
}

export const getTeamInfo = async (
  team_id: string,
): Promise<{ token: string }> => {
  const { data } = await api.install.installControllerFindOne(team_id);
  const token = (data.installObj as Installation).bot.token;

  return {
    token,
  };
};

type base = AllMiddlewareArgs &
  (SlackActionMiddlewareArgs | SlackCommandMiddlewareArgs);

export async function msgUser<R extends base>(
  event: R,
  content: SlackMessageDto | string,
) {
  return await event.respond({
    response_type: 'ephemeral',
    text: typeof content === 'string' ? content : content.text,
    ...(typeof content !== 'string' && { blocks: content.blocks }),
  });
}

export const numToEmoji = (str: number) => {
  if (!str) {
    return str;
  }

  return (str + '')
    .replace(/-/g, ':heavy_minus_sign:')
    .replace(/0/g, ':zero:')
    .replace(/1/g, ':one:')
    .replace(/2/g, ':two:')
    .replace(/3/g, ':three:')
    .replace(/4/g, ':four:')
    .replace(/5/g, ':five:')
    .replace(/6/g, ':six:')
    .replace(/7/g, ':seven:')
    .replace(/8/g, ':eight:')
    .replace(/9/g, ':nine:');
};

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

export function getUsernames(text: string) {
  const rawUsers = text.match(new RegExp(/(<@[\S]{2,}>)/g));
  if (!rawUsers) return [];
  const users = rawUsers.map((u) => {
    const uu = u.replace(/<|@|>/g, '');
    const parts = uu.split('|');
    return {
      id: parts[0],
      display: parts[1] || undefined,
    };
  });

  const unique_users = users.filter((v, i, arr) => arr.indexOf(v) === i);
  return unique_users.length ? unique_users : [];
}

export const nextLevel = (level: number) => level * 300;
