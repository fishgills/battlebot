import { CharacterByOwnerQuery } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { getTeamInfo, to } from '../utils/helpers';
import { battleLog } from '../views/character';
import { MentionObserver } from './observer';

export class CombatObserver extends MentionObserver {
  async update() {
    this.log(`starting combat`);

    const char = (
      await sdk.characterByOwner({
        owner: this.event.payload.user,
        teamId: this.event.context.teamId,
      })
    ).findByOwner;

    if (!char.id) {
      this.msgUser('You need to create a character.');
      this.log('no character');
      return;
    }

    const targetUser = (this.event.payload.blocks[0] as any).elements[0]
      .elements[2].user_id;

    let target: CharacterByOwnerQuery;
    try {
      target = await sdk.characterByOwner({
        owner: targetUser,
        teamId: this.event.context.teamId,
      });
    } catch (e) {
      this.log('target has no character');
      this.msgUser(
        `<@${targetUser}> does not have a character yet. Tell them to make one!`,
      );
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
    const info = await getTeamInfo(this.event.context.teamId);

    const notification = await this.event.client.chat.postMessage({
      channel: this.event.payload.channel,
      token: info.token,
      text: `<@${this.event.payload.user}> has started fighting <@${targetUser}>`,
    });

    await this.event.client.chat.postMessage({
      ...battleLog({
        attacker: char,
        defender: target.findByOwner,
        log: combatLog.start,
        ts: notification.ts,
        channel: this.event.payload.channel,
      }),
      text: `${char.name} is attacking ${target.findByOwner.name}. They may have won... I dunno yet.`,
      token: this.event.context.botToken,
    });
  }
  action?(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
