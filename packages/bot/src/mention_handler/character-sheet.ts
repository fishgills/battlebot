import { App, BlockButtonAction } from '@slack/bolt';
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

  app.action<BlockButtonAction>('complete', async (args) => {
    if (!args.context.teamId) {
      return;
    }
    const char = (
      await sdk.getCharacterByOwner({
        userId: args.body.user.id,
        teamId: args.context.teamId,
      })
    ).getCharacterByOwner;

    if (char.active) {
      return;
    }

    char.active = new Date();
    await sdk.updateCharacter({
      id: char.id,
      input: {
        active: char.active,
      },
    });
    args.client.views.update({
      view_id: args.body.view?.id,
      hash: args.body.view?.hash,
      view: editCharacterModal(char),
    });
  });

  app.action<BlockButtonAction>('reroll', async (args) => {
    await args.ack();

    Logger.info(`Rerolling character`);

    if (!args.context.teamId) {
      return;
    }
    let char = (
      await sdk.getCharacterByOwner({
        userId: args.body.user.id,
        teamId: args.context.teamId,
      })
    ).getCharacterByOwner;

    if (!char) {
      args.client.chat.postMessage({
        channel: args.body.user.id,
        text: tl.t('ns1:character_not_found'),
      });
      return;
    }

    char = (
      await sdk.rerollCharacter({
        id: char.id,
      })
    ).reroll;

    args.client.views.update({
      view_id: args.body.view?.id,
      hash: args.body.view?.hash,
      view: editCharacterModal(char),
    });
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
