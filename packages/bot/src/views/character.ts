import { RespondFn } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { Blocks, Elements, Message, setIfTruthy } from 'slack-block-builder';
import {
  CharacterType,
  CombatLog,
  CombatModel,
  StartCombatMutation,
} from '../generated/graphql';
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
      text: 'You have levelled up! Check your character sheet.',
    }).then();
  }

  if (winner.id === org_defender.id && winner.level > org_defender.level) {
    return event.chat
      .postMessage({
        channel: org_def_slack_id,
        text: 'You have levelled up! Check your character sheet.',
      })
      .then();
  }
};

const statBlock = (character: Partial<CharacterType>) => {
  const stats = [
    {
      id: 'strength',
      emoji: ':muscle:',
      value: character.strength,
    },
    {
      id: 'defense',
      emoji: ':shield:',
      value: character.defense,
    },
    {
      id: 'vitality',
      emoji: ':european_castle:',
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
export const editCharacterModal = (character: Partial<CharacterType>) => {
  return Message()
    .blocks(
      Blocks.Section({
        text: `*Name*: ${character.name}`,
      }),
      Blocks.Divider(),
      setIfTruthy(character.rolls < 5, [
        Blocks.Section({
          text: `You have ${
            5 - character.rolls
          } ability rolls left. Choose wisely. *18* is the highest you can roll.`,
        }),
      ]),
      statBlock(character),
      Blocks.Section({
        text: `:heart:: ${character.hp}`,
      }),
      Blocks.Section({
        text: `:moneybag: ${character.gold}`,
      }),
      setIfTruthy(character.rolls < 5, [
        Blocks.Actions().elements(
          Elements.Button({
            actionId: 'reroll',
            text: 'ReRoll',
          }),
        ),
      ]),
      Blocks.Divider(),
      Blocks.Section({
        text: `${character.name}, who is level ${character.level}, has *${
          character.xp
        }/${nextLevel(character.level)}* experience points towards level ${
          character.level + 1
        }`,
      }),
      Blocks.Divider(),
    )
    .getBlocks();
};

export const battleLog = (options: {
  combat: StartCombatMutation;
  channel: string;
}) => {
  const blocks = [
    Blocks.Header({
      text: `${options.combat.start.attacker.name} wants to fight ${options.combat.start.defender.name}!`,
    }),
    Blocks.Section({
      text: `:crossed_swords: ${options.combat.start.log.combat[0].attacker.name} has the initiative! Look out ${options.combat.start.log.combat[0].defender.name}`,
    }),
  ];

  for (const log of options.combat.start.log.combat) {
    let blockStr: string;
    if (log.attackRoll === 20) {
      blockStr = `*${log.attacker.name}* rolls a critical hit!`;
    } else {
      blockStr = `*${
        log.attacker.name
      }* rolls their attack dice and gets ${numToEmoji(
        log.attackRoll,
      )}, then adds their attack modifier of ${numToEmoji(
        log.attackBonus,
      )} for a total of ${numToEmoji(log.attackBonus + log.attackRoll)}. *${
        log.defender.name
      }* has a defense score of ${numToEmoji(log.defenderDefense)}.`;
    }

    if (log.hit) {
      blockStr += ` ${log.attacker.name} hits for ${numToEmoji(
        log.damage,
      )} :heart: damage!`;
    } else {
      blockStr += ` ${log.attacker.name} misses!`;
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
          )} :heart: points left.`,
        }),
      );
    } else {
      blocks.push(
        Blocks.Section({
          text: `*${log.defender.name}* has been defeated. :cry:`,
        }),
        Blocks.Section({
          text: `*${log.attacker.name}* receives ${options.combat.start.rewardGold} :moneybag:!`,
        }),
      );
    }
  }

  return Message()
    .channel(options.channel)
    .blocks(...blocks)
    .buildToObject();
};
