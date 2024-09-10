// import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
// import { Blocks } from 'slack-block-builder';
// import { t } from '../locale';
// import { MentionObserver } from './observer';
// import api from '../utils/api';

import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { Logger } from '../logger';
import { msgUser } from '../utils/helpers';

export function createCharacter(app: App) {
  onCommand('create').subscribe(async ({ userId, flags: args, payload }) => {
    Logger.info(`requested character sheet`);
    if (args.length !== 1) {
      msgUser();
    }
    Logger.info(args);
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
