import {
  AnyMiddlewareArgs,
  Middleware,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';

function isCommandMW(
  args: AnyMiddlewareArgs,
): args is SlackCommandMiddlewareArgs {
  return (args as SlackCommandMiddlewareArgs).command !== undefined;
}

function isActionMW(
  args: AnyMiddlewareArgs,
): args is SlackActionMiddlewareArgs {
  return (args as SlackActionMiddlewareArgs).action !== undefined;
}
const mw: Middleware<AnyMiddlewareArgs> = async (args) => {
  let id = '';
  if (isCommandMW(args)) {
    id = args.payload.user_id;
  }

  if (isActionMW(args)) {
    id = args.body.user.id;
  }

  console.log('user', id);
  await args.next!();
};

export default mw;
