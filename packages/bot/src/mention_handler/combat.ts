import { App } from '@slack/bolt';
import { onCommand } from '../dispatcher';
import { getUsernames } from '../utils/helpers';
import { battleLogJson } from '../views/character';
import { Character } from '../generated/graphql';
import { tl } from '../i18n';
import { sdk } from '../utils/gql';
import { Blocks, SectionBuilder } from 'slack-block-builder';
import { gptSlackCombatResponse, gptSlackMessage } from '../chat-gpt';
export function combatHandler(app: App) {
  onCommand('fight').subscribe(async (args) => {
    args.args.logger.info(`requested combat`);

    const payload = args.args.payload;
    const userId = args.userId;

    const targets = getUsernames(payload.text);
    const targetUser = targets[0];

    await args.args.ack();
    if (payload.user_id === targetUser.id) {
      const blocks = await gptSlackMessage(
        'Generate a message that a user cannot fight themselves.'
      );

      args.args.respond(blocks);

      return;
    }

    let char: Character;

    try {
      char = (
        await sdk.getCharacterByOwner({
          userId: payload.user_id,
          teamId: payload.team_id,
        })
      ).getCharacterByOwner;
    } catch (e) {
      args.args.logger.info(`character not found`);
      app.client.chat.postMessage({
        token: payload.token,
        channel: userId,
        ...(await gptSlackMessage(
          'A character was not found for the current user.'
        )),
      });
      return;
    }

    if (!char.active) {
      app.client.chat.postMessage({
        token: payload.token,
        channel: userId,
        text: tl.t('ns1:combat_update_unfinished_character'),
      });
    }

    if (targets.length > 1) {
      app.client.chat.postMessage({
        token: payload.token,
        channel: userId,
        text: tl.t('ns1:combat_update_too_many_targets'),
      });
      return;
    }

    if (targets.length === 0) {
      app.client.chat.postMessage({
        token: payload.token,
        channel: userId,
        text: tl.t('ns1:combat_no_target'),
      });
      return;
    }
    let target: Character;

    try {
      target = (
        await sdk.getCharacterByOwner({
          userId: targetUser.id,
          teamId: payload.team_id,
        })
      ).getCharacterByOwner;
    } catch (exception) {
      args.args.logger.info('target has no character');

      args.args.respond(
        tl.t('ns1:combat_update_target_no_char', targetUser.id)
      );
      args.args.say({
        channel: targetUser.id,
        text: tl.t('ns1:combat_update_target_nochar_dm', userId),
      });
      return;
    }

    if (!target) {
      return;
    }

    if (!target.active)
      args.args.respond(
        tl.t('ns1:combat_update_target_unfinished', targetUser.id)
      );

    args.args.respond(
      await gptSlackMessage(
        `Generate a short message that the combat is starting while you do the math between ${char.name} and ${target.name}`
      )
    );

    const combat = (
      await sdk.Combat({
        input: {
          attackerId: char.id,
          defenderId: target.id,
        },
      })
    ).combat;

    const log = battleLogJson({
      combat,
      channel: payload.channel,
      logger: args.args.logger,
    });

    args.args.logger.debug(log);
    const message = await gptSlackCombatResponse(log);

    args.args.respond(message);

    app.client.chat.postMessage({
      channel: targetUser.id,
      text: `You have been challenged to a fight by <@${userId}>`,
      ...message,
    });
  });

  return new Promise<SectionBuilder[]>((resolve) => {
    const help = [
      Blocks.Section({
        text: tl.t('ns1:combat_help_description'),
      }),
      Blocks.Section({
        text: tl.t('ns1:combat_help_command'),
      }),
    ];
    resolve(help);
  });
}

// export class CombatObserver
//   extends MentionObserver
//   implements IMentionObserver
// {
//   constructor() {
//     super('with');
//   }

//   getHelpBlocks() {
//     return [
//       Blocks.Section({
//         text: t('combat_help_description'),
//       }),
//       Blocks.Section({
//         text: t('combat_help_command', t('command')),
//       }),
//     ];
//   }

//   async update(
//     e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
//   ): Promise<void> {
//     this.log(`starting combat`);

//     let char: CharacterEntity;
//     try {
//       const char = (
//         await api.characters.charactersControllerFindByOwner(
//           e.payload.user_id,
//           e.payload.team_id,
//         )
//       ).data;
//     } catch (err) {
//       this.msgUser(e, t('combat_update_no_character'));
//       return;
//     }

//     if (!char.active) {
//       this.msgUser(e, t('combat_update_unfinished_character'));
//       return;
//     }
//     const targets = getUsernames(e.payload.text);

//     if (targets.length > 1) {
//       this.msgUser(e, t('combat_update_too_many_targets'));
//       return;
//     }

//     if (targets.length === 0) {
//       this.msgUser(e, t('combat_no_target'));
//       return;
//     }

//     const targetUser = targets[0];

//     let target: CharacterEntity;
//     try {
//       target = (
//         await api.characters.charactersControllerFindByOwner(
//           targetUser.id,
//           e.payload.team_id,
//         )
//       ).data;
//     } catch (exception) {
//       this.debug('target has no character');
//       this.msgUser(e, t('combat_update_target_no_char', targetUser.id));
//       e.client.chat.postMessage({
//         channel: targetUser.id,
//         text: t('combat_update_target_nochar_dm', e.payload.user_id),
//       });
//     }

//     if (!target) {
//       return;
//     }

//     const [err, combatLog] = await to(
//       api.combat.combatControllerStart({
//         attackerId: char.id,
//         defenderId: target.id,
//       }),
//     );

//     // const [err, combatLog] = await to(
//     //   sdk.startCombat({
//     //     input: {
//     //       attackerId: char.id,
//     //       defenderId: target.findByOwner.id,
//     //     },
//     //   }),
//     // );
//     if (err) {
//       if (err.message.indexOf('Combat started too fast') > -1) {
//         this.msgUser(e, t('combat_update_throttle'));
//         return;
//       }
//       this.debug(err.message);
//       return;
//     }

//     const log = battleLog({
//       combat: combatLog.data,
//       channel: e.payload.channel,
//     });

//     await e.respond({
//       ...log,
//     });

//     await e.client.chat.postMessage({
//       channel: targetUser.id,
//       ...log,
//     });
//     await notifyLevelUp(
//       combatLog.data.winner,
//       char,
//       target,
//       e.respond,
//       targetUser.id,
//       e.client,
//     );
//   }
//   action?(): Promise<void> {
//     throw new Error('Method not implemented.');
//   }
// }
