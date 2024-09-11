import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { Logger } from '../logger';
import { tl } from '../i18n';
import { sdk } from '../utils/gql';

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
}
//   async update(
//     e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
//   ): Promise<void> {
//     if (
//       !e.payload.text ||
//       e.payload.text.trim().split(' ').length !== 2 ||
//       e.payload.text.length > 100
//     ) {
//       await this.msgUser(e, t('create_update_invalid'));
//       return;
//     }
//     try {
//       const char = (
//         await api.characters.charactersControllerFindByOwner(
//           e.payload.user_id,
//           e.payload.team_id,
//         )
//       ).data;
//       if (char.id) {
//         await this.msgUser(e, t('create_update_already_have_char'));
//         return;
//       }
//     } catch (err) {
//       await api.characters.charactersControllerCreate({
//         owner: e.payload.user_id,
//         name: e.payload.text.trim().split(' ')[1],
//         teamId: e.payload.team_id,
//       });

//       await this.msgUser(e, t('create_update_char_created'));
//     }
//   }
// }
