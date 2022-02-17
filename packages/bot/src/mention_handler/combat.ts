import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { CharacterByOwnerQuery } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { getUsernames, to } from '../utils/helpers';
import { battleLog, notifyLevelUp } from '../views/character';
import { MentionObserver } from './observer';

export class CombatObserver extends MentionObserver {
  constructor() {
    super('fight');
  }
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: 'To start a presentation:',
      }),
      Blocks.Section({
        text: '`/presentor fight @Someone`',
      }),
    ];
  }

  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    this.log(`starting combat`);

    const char = (
      await sdk.characterByOwner({
        owner: e.payload.user_id,
        teamId: e.payload.team_id,
      })
    ).findByOwner;

    if (!char.id) {
      this.msgUser(e, 'You need to create a presentation.');
      this.log('no character');
      return;
    }

    if (!char.active) {
      this.msgUser(
        e,
        'You need to finish your presentation. Check your presentation stats.',
      );
      return;
    }
    const targets = getUsernames(e.payload.text);

    if (targets.length > 1) {
      this.msgUser(e, 'Can only present to one person at a time.');
      return;
    }

    const targetUser = targets[0];

    let target: CharacterByOwnerQuery;
    try {
      target = await sdk.characterByOwner({
        owner: targetUser.id,
        teamId: e.payload.team_id,
      });
    } catch (e) {
      this.log('target has no character');
      this.msgUser(
        e,
        `<@${targetUser.id}> does not have a presentation to counter yours with.`,
      );
      e.client.chat.postMessage({
        channel: targetUser.id,
        text: `${e.payload.user_name} tried to show you their presentation but you need a counter-presentation. :cry: Type \`/presentor\` to get started.`,
      });
    }

    if (!target) {
      return;
    }

    const [err, combatLog] = await to(
      sdk.startCombat({
        input: {
          attackerId: char.id,
          defenderId: target.findByOwner.id,
        },
      }),
    );
    if (err) {
      if (err.message.indexOf('Combat started too fast') > -1) {
        this.msgUser(e, 'Please wait a bit before initiating another fight.');
        return;
      }
      this.logger(err.message);
      return;
    }

    const log = battleLog({
      combat: combatLog,
      channel: e.payload.channel,
    });

    await e.respond({
      ...log,
      text: `${char.name} is presenting to ${target.findByOwner.name}. ${combatLog.start.winner.name} has won!.`,
    });

    await e.client.chat.postMessage({
      channel: targetUser.id,
      ...log,
    });
    await notifyLevelUp(
      combatLog.start.winner,
      char,
      target.findByOwner,
      e.respond,
      targetUser.id,
      e.client,
    );
  }
  action?(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
