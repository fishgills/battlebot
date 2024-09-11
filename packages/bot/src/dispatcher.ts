import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { filter, map, Subject, tap } from 'rxjs';
import { Logger } from './logger';

type Command = {
  action: string;
  flags: string[];
  userId: string;
  triggerId: string;
  args: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>;
};

export const commandSubject = new Subject<Command>();

export function dispatchCommand(
  action: string,
  flags: string[],
  userId: string,
  triggerId: string,
  args: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>,
) {
  commandSubject.next({ action, flags: flags, userId, triggerId, args });
}

export function onCommand(actionName: string) {
  Logger.debug(`Subscribing to command: ${actionName}`);
  return commandSubject.pipe(
    tap((command) => Logger.debug(`Received command: ${command.action}`)),
    filter((command) => command.action === actionName),
    map((command) => command),
  );
}
