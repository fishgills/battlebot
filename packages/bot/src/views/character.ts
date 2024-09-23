import { Block, Logger, ModalView, RespondFn } from '@slack/bolt';
import {
  AttackLog,
  Character,
  CombatEnd,
  CombatLogType,
  CombatMutation,
  InitiativeLog,
  LevelUpLog,
  XpGainLog,
} from '../generated/graphql.js';
import { tl } from '../i18n.js';
import {
  BlockBuilder,
  Blocks,
  Elements,
  Message,
  Modal,
  ModalBuilder,
  setIfTruthy,
} from 'slack-block-builder';
import { nextLevel, numToEmoji } from '../utils/helpers.js';

export const notifyLevelUp = (
  winner: Character,
  org_attacker: Character,
  org_defender: Character,
  attacker_resp: RespondFn,
  org_def_slack_id: string,
  event: any,
) => {
  if (winner.id === org_attacker.id && winner.level > org_attacker.level) {
    return attacker_resp({
      response_type: 'ephemeral',
      text: tl.t('ns1:character_level_up'),
    }).then();
  }

  if (winner.id === org_defender.id && winner.level > org_defender.level) {
    return event.chat
      .postMessage({
        channel: org_def_slack_id,
        text: tl.t('ns1:character_level_up'),
      })
      .then();
  }
};

const saveBlock = (char: Character) => {
  if (char.active) {
    return;
  }

  const block = Blocks.Actions({
    blockId: 'save-actions',
  });

  if (char.rolls < 5) {
    block.elements(
      Elements.Button({
        actionId: 'reroll',
        text: tl.t('ns1:character_reroll_button'),
      }),
    );
  }

  block.elements(
    Elements.Button({
      actionId: 'complete',
      text: tl.t('ns1:character_done_button'),
    }),
  );

  return block;
};

export const deleteCharacterModal = (char: Character) => {
  const modal = Modal({
    title: tl.t('ns1:character_delete_title'),
    submit: tl.t('ns1:character_delete_submit'),
    close: tl.t('ns1:character_delete_close'),
  })
    .callbackId('delete-char')
    .blocks(
      Blocks.Section({
        text: tl.t('ns1:character_delete_confirm', char),
      }),
    );
  return modal.buildToObject();
};
export const statBlock = (character: Partial<Character>) => {
  const stats = [
    {
      id: 'strength',
      emoji: tl.t('ns1:character_strength_emoji'),
      value: character.strength,
    },
    {
      id: 'dexterity',
      emoji: tl.t('ns1:character_defense_emoji'),
      value: character.dexterity,
    },
    {
      id: 'constitution',
      emoji: tl.t('ns1:character_vitality_emoji'),
      value: character.constitution,
    },
  ];

  return stats.map((stat) => {
    const block = Blocks.Section({
      text: tl.t('ns1:key_pair', {
        key: stat.emoji,
        value: stat.value,
      }),
    });
    if (character.extraPoints !== undefined && character.extraPoints > 0) {
      block.accessory(
        Elements.Button({
          text: tl.t('ns1:character_stat_incr_button'),
        })
          .value(stat.id)
          .actionId('stat-incr'),
      );
    }
    return block;
  });
};

export const characterSheetBlocks = (character: Character) => {
  return [
    setIfTruthy(character.rolls < 5 && !character.active, [
      Blocks.Section({
        text: tl.t('ns1:character_reroll', {
          character,
          left: 5 - character.rolls,
        }),
      }),
    ]),
    statBlock(character),
    Blocks.Section({
      text: tl.t('ns1:key_pair', {
        key: tl.t('ns1:character_hp_emoji'),
        value: character.hitPoints,
      }),
    }),
    Blocks.Section({
      text: tl.t('ns1:key_pair', {
        key: tl.t('ns1:character_gold_emoji'),
        value: character.gold,
      }),
    }),
    saveBlock(character),
    Blocks.Divider(),
    Blocks.Section({
      text: tl.t(`ns1:character_level_stats`, {
        character,
        nextLevelXp: nextLevel(character.level),
        nextLevel: character.level + 1,
      }),
    }),
    Blocks.Divider(),
  ];
};
export const editCharacterModal = (character: Character): ModalView => {
  return Modal()
    .blocks(...characterSheetBlocks(character))
    .title(character.name)
    .buildToObject();
};

export const battleLog = (options: {
  combat: CombatMutation['combat'];
  channel: string;
  logger: Logger;
}) => {
  let blocks: BlockBuilder[] = [];

  options.combat.logs.forEach((log) => {
    switch (log.type) {
      case CombatLogType.Initiative:
        const initLog = log as InitiativeLog;
        options.logger.info('initiative log');
        blocks.push(
          Blocks.Section({
            text: tl.t('ns1:battlelog_initiative_header', {
              actor: initLog.actor,
              target: initLog.target,
            }),
          }),
        );

        break;
      case CombatLogType.Attack:
        const attackLog = log as AttackLog;
        options.logger.info('attack log');

        if (attackLog.details.attackRoll === 20) {
          blocks.push(
            Blocks.Section({
              text: tl.t('ns1:battlelog_critical_roll', {
                target: attackLog.target,
                actor: attackLog.actor,
              }),
            }),
          );
        } else {
          blocks.push(
            Blocks.Section({
              text: tl.t('ns1:battlelog_attack_roll', {
                actor: attackLog.actor,
                target: attackLog.target,
                attackEmoji: numToEmoji(attackLog.details.attackRoll),
                attackBonusEmoji: numToEmoji(attackLog.details.attackModifier),
                targetDefenseEmoji: numToEmoji(attackLog.details.defenderAc),
                attackTotalEmoji: numToEmoji(
                  attackLog.details.attackModifier +
                    attackLog.details.attackRoll,
                ),
              }),
            }),
          );
        }

        if (attackLog.details.hit) {
          blocks.push(
            Blocks.Section({
              text: tl.t('ns1:battlelog_hit', {
                target: attackLog.target,
                actor: attackLog.actor,
                damage: attackLog.details.damage,
              }),
            }),
          );
        } else {
          blocks.push(
            Blocks.Section({
              text: tl.t('ns1:battlelog_miss', {
                target: attackLog.target,
                actor: attackLog.actor,
              }),
            }),
          );
        }
        break;
      case CombatLogType.Levelup:
        const levelUp = log as LevelUpLog;
        options.logger.info('level up log');
        blocks.push(
          Blocks.Section({
            text: tl.t('ns1:character_level_up', { actor: log.actor }),
          }),
        );
        break;
      case CombatLogType.Xpgain:
        const xpLog = log as XpGainLog;
        options.logger.info('xp gain log', xpLog.details.xp);
        blocks.push(
          Blocks.Section({
            text: tl.t('ns1:xp_gain', {
              actor: xpLog.actor,
              xp: xpLog.details.xp,
            }),
          }),
        );
        break;
    }
  });

  return Message()
    .channel(options.channel)
    .text(
      `${options.combat.winner.name} has defeated ${options.combat.loser.name}`,
    )
    .blocks(...blocks)
    .buildToObject();
};
