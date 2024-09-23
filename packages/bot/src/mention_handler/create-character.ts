import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { tl } from '../i18n';
import { sdk } from '../utils/gql';
import { Blocks, SectionBuilder } from 'slack-block-builder';

export function createCharacter(app: App) {
  onCommand('create').subscribe(async (args) => {
    args.args.logger.info(`Creating a character...`);
    if (args.flags.length !== 1) {
      return await args.args.respond(tl.t('ns1:create_update_invalid'));
    }
    try {
      const char = (
        await sdk.getCharacterByOwner({
          userId: args.args.payload.user_id,
          teamId: args.args.payload.team_id,
        })
      ).getCharacterByOwner;

      if (char) {
        return await args.args.respond(
          tl.t('ns1:create_update_already_have_char'),
        );
      }
    } catch (err) {
      await sdk.createCharacter({
        input: {
          userId: args.args.payload.user_id,
          name: args.flags[0],
          teamId: args.args.payload.team_id,
        },
      });

      await args.args.respond(tl.t('ns1:create_update_char_created'));
    }
  });

  return new Promise<SectionBuilder[]>((resolve) => {
    const help = [
      Blocks.Section({
        text: tl.t('ns1:create_help_description'),
      }),
      Blocks.Section({
        text: tl.t('ns1:create_help_command'),
      }),
    ];
    resolve(help);
  });
}
