import { RespondFn } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import {
  ActionsBuilder,
  Blocks,
  Elements,
  Message,
  setIfTruthy,
} from 'slack-block-builder';
import { CharacterType, StartCombatMutation } from '../generated/graphql';
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
      text: "Your presentation software has received a free upgrade! Check your presentation's settings.",
    }).then();
  }

  if (winner.id === org_defender.id && winner.level > org_defender.level) {
    return event.chat
      .postMessage({
        channel: org_def_slack_id,
        text: "Your presentation software has received a free upgrade! Check your presentation's settings.",
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
        text: 'Redo Abilities',
      }),
    );
  }

  block.elements(
    Elements.Button({
      actionId: 'complete',
      text: 'Done',
    }),
  );

  return block;
};

export const statBlock = (character: Partial<CharacterType>) => {
  const stats = [
    {
      id: 'strength',
      emoji: ':loudspeaker:',
      value: character.strength,
    },
    {
      id: 'defense',
      emoji: ':hear_no_evil:',
      value: character.defense,
    },
    {
      id: 'vitality',
      emoji: ':coffee:',
      value: character.vitality,
    },
  ];

  return stats.map((stat) => {
    const block = Blocks.Section({
      text: `${stat.emoji}: ${stat.value}`,
    });
    if (character.extraPoints > 0) {
      block.accessory(
        Elements.Button({
          text: ':heavy_plus_sign:',
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
      text: `*Name*: ${character.name}`,
    }),
    Blocks.Divider(),
    setIfTruthy(character.rolls < 5 && !character.active, [
      Blocks.Section({
        text: `You can redownload the Presentator software ${
          5 - character.rolls
        } times. Choose wisely. *18* is the highest versions you can get.`,
      }),
    ]),
    statBlock(character),
    Blocks.Section({
      text: `:astonished:: ${character.hp}`,
    }),
    Blocks.Section({
      text: `:moneybag: ${character.gold}`,
    }),
    saveBlock(character),
    Blocks.Divider(),
    Blocks.Section({
      text: `${character.name}, which is currently version ${
        character.level
      }, has *${character.xp}/${nextLevel(
        character.level,
      )}* kudo points towards update ${character.level + 1}`,
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
      text: `${options.combat.start.attacker.name} is presenting to ${options.combat.start.defender.name}!`,
    }),
    Blocks.Section({
      text: `:crossed_swords: ${options.combat.start.log.combat[0].attacker.name} gets to start their deck first! Pay attention ${options.combat.start.log.combat[0].defender.name}!`,
    }),
  ];

  for (const log of options.combat.start.log.combat) {
    let blockStr: string;
    if (log.attackRoll === 20) {
      blockStr = `*${log.attacker.name}* creates an epic slide!`;
    } else {
      blockStr = `*${log.attacker.name}* displays a slide and gets ${numToEmoji(
        log.attackRoll,
      )} long blinks of attention, then adds ${numToEmoji(
        log.attackBonus,
      )} GIFs for a total slide power of ${numToEmoji(
        log.attackBonus + log.attackRoll,
      )}. *${log.defender.name}* has read ${numToEmoji(
        log.defenderDefense,
      )} emails of information beforehand.`;
    }

    if (log.hit) {
      blockStr += ` ${log.attacker.name} gives ${numToEmoji(
        log.damage,
      )} points of :astonished: damage!`;
    } else {
      blockStr += ` ${log.attacker.name} gets distracted by a squirrel!`;
    }
    blocks.push(
      Blocks.Section({
        text: blockStr,
      }),
    );

    if (log.defenderHealth > 0) {
      blocks.push(
        Blocks.Section({
          text: `*${log.defender.name}* has ${numToEmoji(
            log.defenderHealth,
          )} :astonished: points left.`,
        }),
      );
    } else {
      blocks.push(
        Blocks.Section({
          text: `*${log.defender.name}* leaves the room :astonished: first.`,
        }),
        Blocks.Section({
          text: `*${log.attacker.name}* gets a bonus of ${options.combat.start.rewardGold} :moneybag:!`,
        }),
      );
    }
  }

  return Message()
    .channel(options.channel)
    .blocks(...blocks)
    .buildToObject();
};
