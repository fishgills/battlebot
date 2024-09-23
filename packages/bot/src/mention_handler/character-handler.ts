import { App, BlockButtonAction, HTTPResponseAck } from '@slack/bolt';
import { onCommand } from '../dispatcher.js';
import { Logger } from '../logger.js';
import { sdk } from '../utils/gql.js';
import { editCharacterModal } from '../views/character.js';
import { tl } from '../i18n.js';
import { Blocks, SectionBuilder } from 'slack-block-builder';

export function characterHandler(app: App) {
  onCommand('sheet').subscribe(async (args) => {
    args.args.logger.info(`requested character sheet`);
    args.args.logger.debug(args.args.payload);
    try {
      const char = (
        await sdk.getCharacterByOwner({
          userId: args.args.payload.user_id,
          teamId: args.args.payload.team_id,
        })
      ).getCharacterByOwner;

      app.client.views.open({
        trigger_id: args.args.payload.trigger_id,
        view: editCharacterModal(char),
      });

      await args.args.ack();
    } catch (e) {
      args.args.logger.info(`character not found`);
      args.args.respond(tl.t('ns1:sheet_no_character'));
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

  app.action('stat-incr', async (args) => {
    args.logger.info(`Incrementing stat`);
    args.ack();

    if (args.body.type !== 'block_actions' || !args.body.view) {
      return;
    }

    if (args.action.type !== 'button') {
      return;
    }

    if (!args.context.teamId) {
      return;
    }

    if (!args.action.value) {
      Logger.error('No action value');
      return;
    }
    let char = (
      await sdk.getCharacterByOwner({
        userId: args.body.user.id,
        teamId: args.context.teamId,
      })
    ).getCharacterByOwner;

    if (char.extraPoints <= 0) {
      Logger.error('No extra points');
      return;
    }

    args.logger.debug(`Character Points: ${char.extraPoints}`);

    const statKey = args.action.value as
      | 'constitution'
      | 'strength'
      | 'dexterity';

    char[statKey] += 1;
    char.extraPoints -= 1;
    await sdk.updateCharacter({
      id: char.id,
      input: {
        [statKey]: char[statKey],
        extraPoints: char.extraPoints,
      },
    });
    await args.client.views.update({
      view_id: args.body.view?.id,
      hash: args.body.view?.hash,
      view: editCharacterModal(char),
    });
  });

  app.action<BlockButtonAction>('reroll', async (args) => {
    args.logger.info(`Rerolling character`);

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
    await args.ack();
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
