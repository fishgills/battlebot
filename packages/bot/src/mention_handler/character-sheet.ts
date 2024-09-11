import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher.js';
import { Logger } from '../logger.js';
import { sdk } from '../utils/gql.js';
import { editCharacterModal } from '../views/character.js';
import { tl } from '../i18n.js';
import { Blocks, SectionBuilder } from 'slack-block-builder';

export function characterSheet(app: App) {
  onCommand('sheet').subscribe(async (command) => {
    Logger.info(`requested character sheet`);
    Logger.debug(command.args.payload);
    try {
      const char = (
        await sdk.getCharacterByOwner({
          userId: command.args.payload.user_id,
          teamId: command.args.payload.team_id,
        })
      ).getCharacterByOwner;

      app.client.views.open({
        trigger_id: command.args.payload.trigger_id,
        view: editCharacterModal(char),
      });
    } catch (e) {
      Logger.info(`character not found`);
      command.args.respond(tl.t('ns1:sheet_no_character'));
    }
  });

  return new Promise<SectionBuilder[]>((resolve) => {
    const help = [
      Blocks.Section({
        text: tl.t('ns1:sheet_help_description'),
      }),
      Blocks.Section({
        text: tl.t('sheet_help_command'),
      }),
    ];
    resolve(help);
  });
}
