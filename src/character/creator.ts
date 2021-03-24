import { KnownBlock, SlashCommand } from '@slack/bolt';
import { ViewsOpenArguments, WebClient } from '@slack/web-api';
import Roll from 'roll';
import { titleCase } from '../utils/helpers';

class Ability {
  public value: number | boolean = false;

  public constructor(public key: string, public name: string) {}
}
class CharStats {
  public values = {
    con: new Ability('con', 'Constitution'),
    dex: new Ability('dex', 'Dexterity'),
    str: new Ability('str', 'Strength'),
  };
  private roller = new Roll();

  private rollAbility() {
    let random_number: number;
    let sum = 0;
    let min_roll = 99;

    for (let count = 0; count < 4; count++) {
      random_number = this.roller.roll(`1d6`).result;
      if (random_number < min_roll) min_roll = random_number;
      sum += random_number;
    }
    sum -= min_roll;
    return sum;
  }
  public randomStats(): void {
    this.values.con.value = this.rollAbility();
    this.values.dex.value = this.rollAbility();
    this.values.str.value = this.rollAbility();
  }
}

class Character {
  private name = '';
  public stats = new CharStats();

  public setName(name: string) {
    this.name = name;
  }
}

export class CharacterWizard {
  private roll = new Roll();
  constructor(private client: WebClient, private body: SlashCommand) {}

  public start() {
    const tempChar = new Character();
    tempChar.stats.randomStats();
    return this.client.views.open(this.getCharacterForm(tempChar));
  }

  private getCharacterForm(char: Character): ViewsOpenArguments {
    const statsFields: KnownBlock[] = [];

    for (const [key, value] of Object.entries(char.stats.values)) {
      statsFields.push({
        type: 'section',
        text: {
          text: `${titleCase(value.name)}: *${value.value}*`,
          type: 'mrkdwn',
        },
      });
    }

    return {
      trigger_id: this.body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'character_name',
        title: {
          type: 'plain_text',
          text: 'Make your character!!',
        },
        blocks: [
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
                value: 'reroll_stats',
                action_id: 'reroll',
              },
            ],
          },
        ],
        submit: {
          type: 'plain_text',
          text: 'Save',
        },
      },
    };
  }
}
