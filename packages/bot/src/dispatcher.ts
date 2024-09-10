import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { filter, map, Subject } from 'rxjs';

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
  return commandSubject.pipe(
    filter((command) => command.action === actionName),
    map((command) => command),
  );
}
