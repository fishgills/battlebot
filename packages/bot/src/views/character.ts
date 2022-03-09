import { RespondFn } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Blocks, Elements, Message, setIfTruthy } from 'slack-block-builder';
import { CharacterType, StartCombatMutation } from '../generated/graphql';
import { t } from '../locale';
import { nextLevel, numToEmoji } from '../utils/helpers';

export const notifyLevelUp = (
  winner: Pick<CharacterType, 'level' | 'id'>,
  org_attacker: CharacterType,
  org_defender: CharacterType,
  attacker_resp: RespondFn,
  org_def_slack_id: string,
  event: WebClient,
) => {
  if (winner.id === org_attacker.id && winner.level > org_attacker.level) {
    return attacker_resp({
      response_type: 'ephemeral',
      text: t('character_level_up'),
    }).then();
  }

  if (winner.id === org_defender.id && winner.level > org_defender.level) {
    return event.chat
      .postMessage({
        channel: org_def_slack_id,
        text: t('character_level_up'),
      })
      .then();
  }
};

const saveBlock = (char: Partial<CharacterType>) => {
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
        text: t('character_reroll_button'),
      }),
    );
  }

  block.elements(
    Elements.Button({
      actionId: 'complete',
      text: t('character_done_button'),
    }),
  );

  return block;
};

export const statBlock = (character: Partial<CharacterType>) => {
  const stats = [
    {
      id: 'strength',
      emoji: t('character_strength_emoji'),
      value: character.strength,
    },
    {
      id: 'defense',
      emoji: t('character_defense_emoji'),
      value: character.defense,
    },
    {
      id: 'vitality',
      emoji: t('character_vitality_emoji'),
      value: character.vitality,
    },
  ];

  return stats.map((stat) => {
    const block = Blocks.Section({
      text: t('key_pair', stat.emoji, stat.value),
    });
    if (character.extraPoints > 0) {
      block.accessory(
        Elements.Button({
          text: t('character_stat_incr_button'),
        })
          .value(stat.id)
          .actionId('stat-incr'),
      );
    }
    return block;
  });
};

export const characterSheetBlocks = (character: Partial<CharacterType>) => {
  return [
    Blocks.Section({
      text: t('character_name', character.name),
    }),
    Blocks.Divider(),
    setIfTruthy(character.rolls < 5 && !character.active, [
      Blocks.Section({
        text: t('character_reroll', 5 - character.rolls),
      }),
    ]),
    statBlock(character),
    Blocks.Section({
      text: t('key_pair', t('character_hp_emoji'), character.hp),
    }),
    Blocks.Section({
      text: t('key_pair', t('character_gold_emoji'), character.gold),
    }),
    saveBlock(character),
    Blocks.Divider(),
    Blocks.Section({
      text: t(
        `character_level_stats`,
        character.name,
        character.level,
        character.xp,
        nextLevel(character.level),
        character.level,
        character.level + 1,
      ),
    }),
    Blocks.Divider(),
  ];
};
export const editCharacterModal = (character: Partial<CharacterType>) => {
  return Message()
    .blocks(...characterSheetBlocks(character))
    .getBlocks();
};

export const battleLog = (options: {
  combat: StartCombatMutation;
  channel: string;
}) => {
  const blocks = [
    Blocks.Header({
      text: t(
        'battlelog_header',
        options.combat.start.attacker.name,
        options.combat.start.defender.name,
      ),
    }),
    Blocks.Section({
      text: t(
        'battlelog_initiative_header',
        options.combat.start.log.combat[0].attacker.name,
        options.combat.start.log.combat[0].defender.name,
      ),
    }),
  ];

  for (const log of options.combat.start.log.combat) {
    let blockStr: string;
    if (log.attackRoll === 20) {
      blockStr = t('battlelog_critical_roll', log.attacker.name);
    } else {
      blockStr = t(
        'battlelog_attack_roll',
        log.attacker.name,
        numToEmoji(log.attackRoll),
        numToEmoji(log.attackBonus),
        numToEmoji(log.attackBonus + log.attackRoll),
        log.defender.name,
        numToEmoji(log.defenderDefense),
      );
    }

    if (log.hit) {
      blockStr += t(
        'battlelog_hit',
        log.attacker.name,
        numToEmoji(log.damage),
        t('character_hp_emoji'),
      );
    } else {
      blockStr += ' ' + t('battlelog_miss', log.attacker.name);
    }
    blocks.push(
      Blocks.Section({
        text: blockStr,
      }),
    );

    if (log.defenderHealth > 0) {
      blocks.push(
        Blocks.Section({
          text: t(
            'battlelog_hp_report',
            log.defender.name,
            numToEmoji(log.defenderHealth),
            t('character_hp_emoji'),
          ),
        }),
      );
    } else {
      blocks.push(
        Blocks.Section({
          text: t('battlelog_defeated', log.defender.name),
        }),
        Blocks.Section({
          text: t(
            'battlelog_gold_report',
            log.attacker.name,
            options.combat.start.rewardGold,
            t('character_gold_emoji'),
          ),
        }),
      );
    }
  }

  return Message()
    .channel(options.channel)
    .blocks(...blocks)
    .buildToObject();
};
