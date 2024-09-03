import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { User } from 'src/user/user.entity';
import { Dice, DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/gamerules';

@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);
  constructor(
    @InjectRepository(Character)
    protected charactersRepository: Repository<Character>,
  ) {}

  async createCharacter(user: User, name: string) {
    const con = new DiceRoll('4d6kh3').total;
    const character = this.charactersRepository.create({
      name,
      strength: new DiceRoll('4d6kh3').total,
      constitution: con,
      dexterity: new DiceRoll('4d6kh3').total,
      hitPoints: 10 + modifier(con),
      user,
    });
    return this.charactersRepository.save(character);
  }

  async findAllCharacters() {
    return this.charactersRepository.find();
  }

  async findCharacterById(id: number) {
    return this.charactersRepository.findOne({ where: { id } });
  }

  async updateCharacterStats(
    id: number,
    updates: Partial<Character>,
  ): Promise<Character> {
    await this.charactersRepository.update(id, updates);
    return this.findCharacterById(id);
  }

  async deleteCharacter(id: number) {
    return this.charactersRepository.delete(id);
  }
  async combat(characterId: number, character2Id: number) {
    let logs: any[] = [];

    this.logger.log(`Combat between ${characterId} and ${character2Id}`);
    const character1 = await this.findCharacterById(characterId);
    const character2 = await this.findCharacterById(character2Id);

    const character1Initiative =
      new DiceRoll('1d20').total + character1.dexterity;
    const character2Initiative =
      new DiceRoll('1d20').total + character2.dexterity;

    this.logger.log(`Character 1 Initiative: ${character1Initiative}`);
    this.logger.log(`Character 2 Initiative: ${character2Initiative}`);

    let attacker: Character, defender: Character;
    if (character1Initiative > character2Initiative) {
      attacker = character1;
      defender = character2;
    } else {
      attacker = character2;
      defender = character1;
    }

    this.logger.log(`Attacker: ${attacker.name}`);
    this.logger.log(`Defender: ${defender.name}`);

    let rounds = 0;
    while (character1.hitPoints > 0 && character2.hitPoints > 0) {
      rounds += 1;
      this.logger.log(`Round ${rounds}`);

      logs.push(this.attack(attacker, defender));
      [attacker, defender] = [defender, attacker];
    }

    this.logger.log(`Combat ended in ${rounds} rounds`);

    let winner: Character, loser: Character;

    if (character1.hitPoints > 0) {
      winner = character1;
      loser = character2;
    } else {
      winner = character2;
      loser = character1;
    }

    this.logger.log(`Winner: ${winner.name}`);
    this.logger.log(`Loser: ${loser.name}`);

    winner.wins += 1;
    winner.experiencePoints =
      winner.experiencePoints +
      Math.floor((loser.level / winner.level) * new DiceRoll('20d10').total);

    loser.losses += 1;

    delete winner.hitPoints;
    delete loser.hitPoints;

    await this.charactersRepository.save(winner);
    await this.charactersRepository.save(loser);

    return {
      winner,
      loser,
      logs,
    };
  }

  private attack(attacker: Character, defender: Character) {
    const attackRecord = {
      attacker: attacker.name,
      defender: defender.name,
      attackRoll: 0,
      attackModifier: 0,
      defenderAc: 0,
      hit: false,
      damage: 0,
      defenderHitPoints: 0,
    };

    this.logger.log(`${attacker.name} attacks ${defender.name}`);
    const attackRoll = new DiceRoll('1d20').total;
    const attackModifer = modifier(attacker.strength);
    const defenderAc = 10 + modifier(defender.dexterity);
    this.logger.log(`Attack Roll: ${attackRoll}`);
    this.logger.log(`Attack Modifier: ${attackModifer}`);
    this.logger.log(`Defender AC: ${defenderAc}`);

    attackRecord.attackRoll = attackRoll;
    attackRecord.attackModifier = attackModifer;
    attackRecord.defenderAc = defenderAc;

    if (attackRoll + attackModifer > defenderAc || attackRoll == 20) {
      this.logger.log('Hit!');
      let roll = '1d6';

      if (attackRoll == 20) roll = '2d6';

      const damage = Math.max(new DiceRoll(roll).total + attackModifer, 0);

      attackRecord.hit = true;
      attackRecord.damage = damage;

      this.logger.log(`Damage: ${damage}`);
      defender.hitPoints -= damage;
      attackRecord.defenderHitPoints = defender.hitPoints;
      this.logger.log(
        `${defender.name} has ${defender.hitPoints} hit points remaining`,
      );
    } else {
      attackRecord.hit = false;

      this.logger.log('Miss!');
    }

    return attackRecord;
  }
}
