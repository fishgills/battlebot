import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { t } from '../locale';
import { getUsernames, to } from '../utils/helpers';
import { battleLog, notifyLevelUp } from '../views/character';
import { MentionObserver } from './observer';
import { CharacterEntity } from '../swagger/Bot';
import api from '../utils/api';

export class CombatObserver extends MentionObserver {
  constructor() {
    super('with');
  }

  getHelpBlocks() {
    return [
      Blocks.Section({
        text: t('combat_help_description'),
      }),
      Blocks.Section({
        text: t('combat_help_command', t('command')),
      }),
    ];
  }

  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    this.log(`starting combat`);

    let char: CharacterEntity;
    try {
      const char = (
        await api.characters.charactersControllerFindByOwner(
          e.payload.user_id,
          e.payload.team_id,
        )
      ).data;
    } catch (err) {
      this.msgUser(e, t('combat_update_no_character'));
      return;
    }

    if (!char.active) {
      this.msgUser(e, t('combat_update_unfinished_character'));
      return;
    }
    const targets = getUsernames(e.payload.text);

    if (targets.length > 1) {
      this.msgUser(e, t('combat_update_too_many_targets'));
      return;
    }

    if (targets.length === 0) {
      this.msgUser(e, t('combat_no_target'));
      return;
    }

    const targetUser = targets[0];

    let target: CharacterEntity;
    try {
      target = (
        await api.characters.charactersControllerFindByOwner(
          targetUser.id,
          e.payload.team_id,
        )
      ).data;
    } catch (exception) {
      this.debug('target has no character');
      this.msgUser(e, t('combat_update_target_no_char', targetUser.id));
      e.client.chat.postMessage({
        channel: targetUser.id,
        text: t('combat_update_target_nochar_dm', e.payload.user_id),
      });
    }

    if (!target) {
      return;
    }

    const [err, combatLog] = await to(
      api.combat.combatControllerStart({
        attackerId: char.id,
        defenderId: target.id,
      }),
    );

    // const [err, combatLog] = await to(
    //   sdk.startCombat({
    //     input: {
    //       attackerId: char.id,
    //       defenderId: target.findByOwner.id,
    //     },
    //   }),
    // );
    if (err) {
      if (err.message.indexOf('Combat started too fast') > -1) {
        this.msgUser(e, t('combat_update_throttle'));
        return;
      }
      this.debug(err.message);
      return;
    }

    const log = battleLog({
      combat: combatLog.data,
      channel: e.payload.channel,
    });

    await e.respond({
      ...log,
    });

    await e.client.chat.postMessage({
      channel: targetUser.id,
      ...log,
    });
    await notifyLevelUp(
      combatLog.data.winner,
      char,
      target,
      e.respond,
      targetUser.id,
      e.client,
    );
  }
  action?(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
