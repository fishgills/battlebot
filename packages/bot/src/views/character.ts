import { Blocks, Elements, Message, setIfTruthy } from 'slack-block-builder';
import { CharacterModel, CombatLog } from '../generated/graphql';
import { numToEmoji } from '../utils/helpers';

export const editCharacterModal = (character: Partial<CharacterModel>) => {
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
          } ability rolls left. Choose wisely.`,
        }),
      ]),
      Blocks.Section({
        text: `*Strength*: ${character.strength}`,
      }),
      Blocks.Section({
        text: `*Defense*: ${character.defense}`,
      }),
      Blocks.Section({
        text: `*Vitality*: ${character.vitality}`,
      }),
      Blocks.Section({
        text: `*Health*: ${character.hp}`,
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
        text: `${character.name}, who is level ##, has *##/###* experience points towards level #`,
      }),
      Blocks.Divider(),
    )
    .getBlocks();
};

export const battleLog = (options: {
  log: CombatLog;
  attacker: CharacterModel;
  defender: CharacterModel;
  channel: string;
  ts: string;
}) => {
  const blocks = [
    Blocks.Header({
      text: `${options.attacker.name} wants to fight ${options.defender.name}!`,
    }),
    Blocks.Section({
      text: `:crossed_swords: ${options.log.combat[0].attacker.name} has the initiative! Look out ${options.log.combat[0].defender.name}`,
    }),
  ];

  for (const log of options.log.combat) {
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
      );
    }
  }

  return Message()
    .channel(options.channel)
    .threadTs(options.ts)
    .blocks(...blocks)
    .buildToObject();
};
