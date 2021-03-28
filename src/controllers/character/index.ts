import { BlockAction, KnownBlock, SlashCommand } from '@slack/bolt';
import { ViewsOpenArguments, WebClient } from '@slack/web-api';
import Roll from 'roll';
import logger from '../../logger';
import Abilities from '../../models/abilities';
import Character from '../../models/character';
import { titleCase } from '../../utils/helpers';

// class Ability {
//   public value: number | boolean = false;

//   public constructor(public key: string, public name: string) {}
// }
// class CharStats {
//   public values = {
//     con: new Ability('con', 'Constitution'),
//     dex: new Ability('dex', 'Dexterity'),
//     str: new Ability('str', 'Strength'),
//   };
//   private roller = new Roll();

//   private rollAbility() {
//     let random_number: number;
//     let sum = 0;
//     let min_roll = 99;

//     for (let count = 0; count < 4; count++) {
//       random_number = this.roller.roll(`1d6`).result;
//       if (random_number < min_roll) min_roll = random_number;
//       sum += random_number;
//     }
//     sum -= min_roll;
//     return sum;
//   }
//   public randomStats(): void {
//     this.values.con.value = this.rollAbility();
//     this.values.dex.value = this.rollAbility();
//     this.values.str.value = this.rollAbility();
//   }
// }

// class Character {
//   private name = '';
//   public stats = new CharStats();

//   public setName(name: string) {
//     this.name = name;
//   }
// }

export class CharacterController {
  private roll = new Roll();
  constructor() {}

  public async create(client: WebClient, body: SlashCommand) {
    const tempChar = await Character.create(
      {
        owner: body.user_id,
        abilities: {
          dex: this.rollAbility(),
          con: this.rollAbility(),
          str: this.rollAbility(),
        },
      },
      {
        include: [
          {
            model: Abilities,
            as: 'abilities',
          },
        ],
      },
    );

    return client.views.open(this.getCharacterForm(tempChar, body));
  }
  private rollAbility() {
    let random_number: number;
    let sum = 0;
    let min_roll = 99;

    for (let count = 0; count < 4; count++) {
      random_number = this.roll.roll(`1d6`).result;
      if (random_number < min_roll) min_roll = random_number;
      sum += random_number;
    }
    sum -= min_roll;
    return sum;
  }
  public async reroll(client: WebClient, body: BlockAction) {
    if (!body.view) {
      return false;
    }

    const char = await Character.findOne({
      where: {
        id: 1,
      },
    });

    if (char === null) {
      logger.error(`No character found during reroll`);
      return;
    }

    return client.views.update({
      view_id: body.view.id,
      has: body.view.hash,
      view: {
        type: 'modal',
        callback_id: 'character_form',
        title: {
          text: 'Abilities rolled!',
          type: 'plain_text',
        },
        blocks: this.getFormBlocks(char),
      },
    });
  }
  private getFormBlocks(char: Character) {
    const statsFields = char.abilities.form();
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Character Sheet',
          emoji: true,
        },
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'Name',
        },
        hint: {
          text: 'What people will see during battles',
          type: 'plain_text',
        },
        element: {
          type: 'plain_text_input',
        },
      },
      ...statsFields,
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Reroll',
            },
            value: char.owner,
            action_id: 'reroll',
          },
        ],
      },
    ];
  }
  private getCharacterForm(
    char: Character,
    body: SlashCommand,
  ): ViewsOpenArguments {
    return {
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: char.id + '',
        title: {
          type: 'plain_text',
          text: 'Make your character!!',
        },
        blocks: this.getFormBlocks(char),
        submit: {
          type: 'plain_text',
          text: 'Save',
        },
      },
    };
  }
}
