import { Block, ModalView, RespondFn } from '@slack/bolt';
import {
  AttackLog,
  Character,
  CombatEnd,
  CombatLogType,
  CombatMutation,
  InitiativeLog,
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
import { nextLevel } from '../utils/helpers.js';

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
}) => {
  let blocks: BlockBuilder[] = [];

  options.combat.logs.forEach((log) => {
    if (log.type === CombatLogType.Attack) {
      log = log as AttackLog;
    }

    if (log.type === CombatLogType.Initiative) {
      log = log as InitiativeLog;
      blocks.push(
        Blocks.Header({
          text: tl.t('ns1:battlelog_header'),
        }),
      );

      blocks.push(
        Blocks.Section({
          text: tl.t('ns1:battlelog_initiative_header', {
            actor: log.actor.name,
            target: log.target.name,
          }),
        }),
      );
    }
  });

  // const attacker = options.combat.logs[0].type
  // const defender = options.combat.logs[0].target;
  // const blocks = [
  //   Blocks.Header({
  //     text: tl.t('ns1:battlelog_header'),
  //   }),
  //   Blocks.Section({
  //     text: tl.t('ns1:battlelog_initiative_header', {
  //       actor: options.combat.logs[0].actor,
  //       target: options.combat.logs[0].target,
  //     }),
  //   }),
  // ];

  // for (const log of options.combat.logs) {
  //   let blockStr: string;

  //   if (log.type !== CombatLogType.Attack) {
  //     continue;
  //   }
  //   const attackLog = log as AttackLog;

  //   if (attackLog.details.attackRoll === 20) {
  //     blockStr = tl.t('ns1:battlelog_critical_roll');
  //   } else {
  //     blockStr = tl.t('battlelog_attack_roll');
  //   }

  //   if (attackLog.details.hit) {
  //     blockStr += tl.t('battlelog_hit');
  //   } else {
  //     blockStr += ' ' + tl.t('ns1:battlelog_miss');
  //   }
  //   blocks.push(
  //     Blocks.Section({
  //       text: blockStr,
  //     }),
  //   );

  //   if (attackLog.details.damage > 0) {
  //     blocks.push(
  //       Blocks.Section({
  //         text: tl.t('battlelog_hp_report'),
  //       }),
  //     );
  //   } else {
  //     blocks.push(
  //       Blocks.Section({
  //         text: tl.t('ns1:battlelog_defeated', attackLog.target.name),
  //       }),
  //       Blocks.Section({
  //         text: tl.t('battlelog_gold_report'),
  //       }),
  //     );
  //   }
  // }

  return Message()
    .channel(options.channel)
    .text(
      `${options.combat.winner.name} has defeated ${options.combat.loser.name}`,
    )
    .blocks(...blocks)
    .buildToObject();
};
