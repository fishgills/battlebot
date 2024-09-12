import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { sdk } from '../utils/gql';
import { Logger } from '../logger';
import { tl } from '../i18n';
import { Character } from '../generated/graphql';
import { BlockBuilder, Blocks, SectionBuilder } from 'slack-block-builder';
import { deleteCharacterModal } from '../views/character';
import { env } from '../env';

export function deleteCharacter(app: App) {
  onCommand('delete').subscribe(async (value) => {
    Logger.info(`Delete Character Prompt...`);
    let char: Character;
    try {
      char = (
        await sdk.getCharacterByOwner({
          userId: value.args.payload.user_id,
          teamId: value.args.payload.team_id,
        })
      ).getCharacterByOwner;

      await app.client.views.open({
        trigger_id: value.args.command.trigger_id,
        view: deleteCharacterModal(char),
      });
    } catch (err) {
      value.args.respond(tl.t('ns1:character_not_found'));
      return;
    }
  });

  Logger.info(`Registering delete character view`);
  app.view(
    {
      callback_id: 'delete-char',
      type: 'view_closed',
    },
    async ({ ack }) => {
      Logger.info(`Delete character view closed`);
      ack();
    },
  );
  app.view('delete-char', async (args) => {
    Logger.info(`Deleting character `);
    args.ack();

    console.log(args);

    const char = (
      await sdk.getCharacterByOwner({
        userId: args.body.user.id,
        teamId: args.payload.team_id,
      })
    ).getCharacterByOwner;

    if (!char) {
      args.client.chat.postMessage({
        channel: args.body.user.id,
        text: tl.t('ns1:character_not_found'),
      });
      return;
    }

    await sdk.deleteCharacter({
      id: char.id,
    });

    args.client.chat.postMessage({
      channel: args.body.user.id,
      text: tl.t('ns1:character_deleted'),
    });
  });

  return new Promise<SectionBuilder[]>((resolve) => {
    const help = [
      Blocks.Section({
        text: tl.t('delete_help_description'),
      }),
      Blocks.Section({
        text: tl.t('delete_help_command', tl.t('command')),
      }),
    ];
    resolve(help);
  });
}
