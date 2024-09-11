import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { Logger } from '../logger';
import { tl } from '../i18n';
import { sdk } from '../utils/gql';
import { Blocks, SectionBuilder } from 'slack-block-builder';

export function createCharacter(app: App) {
  onCommand('create').subscribe(async (value) => {
    Logger.info(`Creating a character...`);
    if (value.flags.length !== 1) {
      return await value.args.respond(tl.t('ns1:create_update_invalid'));
    }
    try {
      const char = (
        await sdk.getCharacterByOwner({
          userId: value.args.payload.user_id,
          teamId: value.args.payload.team_id,
        })
      ).getCharacterByOwner;

      if (char) {
        return await value.args.respond(
          tl.t('ns1:create_update_already_have_char'),
        );
      }
    } catch (err) {
      await sdk.createCharacter({
        input: {
          userId: value.args.payload.user_id,
          name: value.flags[0],
          teamId: value.args.payload.team_id,
        },
      });

      await value.args.respond(tl.t('ns1:create_update_char_created'));
    }
  });

  return new Promise<SectionBuilder[]>((resolve) => {
    const help = [
      Blocks.Section({
        text: tl.t('create_help_description'),
      }),
      Blocks.Section({
        text: tl.t('create_help_command', tl.t('command')),
      }),
    ];
    resolve(help);
  });
}
