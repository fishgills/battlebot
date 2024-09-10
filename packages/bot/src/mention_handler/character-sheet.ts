import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher.js';
import { Logger } from '../logger.js';
import { sdk } from '../utils/gql.js';
import { editCharacterModal } from '../views/character.js';
import { tl } from '../i18n.js';

export function characterSheet(app: App) {
  onCommand('character').subscribe(async ({ userId, flags: args, payload }) => {
    Logger.info(`requested character sheet`);
    try {
      const char = (
        await sdk.getCharactersByOwner({
          userId: payload.user_id,
          teamId: payload.team,
        })
      ).getCharactersByOwner;

      await app.client.views.open({
        token: payload.token,
        trigger_id: payload.trigger_id,
        view: editCharacterModal(char[0]),
      });
    } catch (e) {
      Logger.info(`character not found`);
      await app.client.chat.postMessage({
        token: payload.token,
        channel: userId,
        text: tl.t('common:sheet_no_character'),
      });
    }
  });
}

//   const char = (
//     await api.characters.charactersControllerFindByOwner(
//       userId,
//       args.team_id,
//     )
//   ).data;
//   await app.client.views.open({
//     token: args.token,
//     trigger_id: args.trigger_id,
//     view: editCharacterModal(char),
//   });
// } catch (e) {
//   Logger.info(`character not found`);
//   await app.client.chat.postMessage({
//     token: args.token,
//     channel: userId,
//     text: t('sheet_no_character'),
//   });
// }

// export class SheetObserver implements MentionObserver {
//   constructor() {
//     super('resume');
//   }

//   getHelpBlocks: BlockFn = (e: AllMiddlewareArgs): SectionBuilder[] => {
//     return [
//       Blocks.Section({
//         text: t('sheet_help_description'),
//       }),
//       Blocks.Section({
//         text: t('sheet_help_command', t('command')),
//       }),
//     ];
//   };

//   async update(
//     event: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
//   ): Promise<void> {
//     this.log(`requested character sheet`);
//     try {
//       const char = (
//         await api.characters.charactersControllerFindByOwner(
//           event.payload.user_id,
//           event.payload.team_id,
//         )
//       ).data;
//       await this.msgUser(event, editCharacterModal(char));
//     } catch (e) {
//       this.log(`character not found`);
//       await this.msgUser(event, t('sheet_no_character'));
//     }
//   }
// }
