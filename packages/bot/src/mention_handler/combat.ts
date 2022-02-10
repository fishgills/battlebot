import { Blocks } from 'slack-block-builder';
import { CharacterByOwnerQuery } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { getUsernames, to } from '../utils/helpers';
import { battleLog } from '../views/character';
import { MentionObserver } from './observer';

export class CombatObserver extends MentionObserver {
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: 'To start combat.',
      }),
      Blocks.Section({
        text: '`/battlebot fight @Someone`',
      }),
    ];
  }

  async update() {
    this.log(`starting combat`);

    const char = (
      await sdk.characterByOwner({
        owner: this.event.payload.user_id,
        teamId: this.event.payload.team_id,
      })
    ).findByOwner;

    if (!char.id) {
      this.msgUser('You need to create a character.');
      this.log('no character');
      return;
    }
    const targets = getUsernames(this.event.payload.text);

    if (targets.length > 1) {
      this.msgUser('Can only attack one person.');
      return;
    }

    const targetUser = targets[0];

    let target: CharacterByOwnerQuery;
    try {
      target = await sdk.characterByOwner({
        owner: targetUser.id,
        teamId: this.event.payload.team_id,
      });
    } catch (e) {
      this.log('target has no character');
      this.msgUser(`<@${targetUser.id}> does not have a character yet.`);
      this.event.client.chat.postMessage({
        channel: targetUser.id,
        text: `${this.event.payload.user_name} tried to fight you but you have no character. :cry: Type \`/battlebot\` to get started.`,
      });
    }

    if (!target) {
      return;
    }

    const [err, combatLog] = await to(
      sdk.startCombat({
        attackerId: char.id,
        defenderId: target.findByOwner.id,
      }),
    );
    if (err) {
      if (err.message.indexOf('Combat started too fast') > -1) {
        this.msgUser('Please wait a bit before initiating another fight.');
        return;
      }
      this.logger(err.message);
      return;
    }
    // const info = await getTeamInfo(this.event.payload.team_id);

    const notification = await this.event.respond({
      // channel: this.event.payload.channel,
      // token: info.token,
      text: `<@${this.event.payload.user_id}> has started fighting <@${targetUser.id}>`,
    });

    const log = battleLog({
      attacker: char,
      defender: target.findByOwner,
      log: combatLog.start,
      ts: notification.ts,
      channel: this.event.payload.channel,
    });

    await this.event.respond({
      ...log,
      text: `${char.name} is attacking ${target.findByOwner.name}. They may have won... I dunno yet.`,
    });

    await this.event.client.chat.postMessage({
      channel: targetUser.id,
      ...log,
    });
  }
  action?(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
