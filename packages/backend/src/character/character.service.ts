import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { User } from 'src/user/user.entity';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/gamerules';
import { CombatLog } from './combat-log-types';

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
    this.logger.log(`Combat between ${characterId} and ${character2Id}`);
    const character1 = await this.findCharacterById(characterId);
    const character2 = await this.findCharacterById(character2Id);

    if (!character1 || !character2) {
      throw new Error('Character not found');
    }

    character1.initCombat();
    character2.initCombat();

    let logs: CombatLog[] = [];

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

    logs.push(
      this.createLogEntry('initiative', 0, character1, character2, {
        winner: attacker.name,
      }),
    );

    this.logger.log(`Attacker: ${attacker.name}`);
    this.logger.log(`Defender: ${defender.name}`);

    let rounds = 0;
    while (character1.combatHitPoints > 0 && character2.combatHitPoints > 0) {
      rounds += 1;
      this.logger.log(`Round ${rounds}`);

      this.attack(attacker, defender, logs, rounds);
      [attacker, defender] = [defender, attacker];
    }

    this.logger.log(`Combat ended in ${rounds} rounds`);

    let winner: Character, loser: Character;

    if (character1.combatHitPoints > 0) {
      winner = character1;
      loser = character2;
    } else {
      winner = character2;
      loser = character1;
    }

    this.logger.log(`Winner: ${winner.name}`);
    this.logger.log(`Loser: ${loser.name}`);

    winner.wins += 1;
    const xpGain = Math.floor(
      (loser.level / winner.level) * new DiceRoll('20d10').total,
    );
    winner.experiencePoints += xpGain;
    logs.push(this.createLogEntry('xp-gain', rounds, winner, null, { xpGain }));
    this.logger.log(`${winner.name} gained ${xpGain} experience points`);

    loser.losses += 1;

    this.checkLevelUp(winner, logs);

    await this.charactersRepository.save(winner);
    await this.charactersRepository.save(loser);

    return {
      winner,
      loser,
      logs,
    };
  }

  private attack(
    attacker: Character,
    defender: Character,
    combatLog: CombatLog[],
    round: number,
  ) {
    const attackRecord = {
      attacker: attacker.name,
      defender: defender.name,
      attackRoll: 0,
      attackModifier: 0,
      defenderAc: 0,
      hit: false,
      damage: 0,
      defenderHitPoints: defender.combatHitPoints,
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
      defender.combatHitPoints -= damage;
      attackRecord.defenderHitPoints = defender.combatHitPoints;
      this.logger.log(
        `${defender.name} has ${defender.combatHitPoints} hit points remaining`,
      );
    } else {
      attackRecord.hit = false;

      this.logger.log('Miss!');
    }
    combatLog.push(
      this.createLogEntry('attack', round, attacker, defender, attackRecord),
    );
  }

  private checkLevelUp(character: Character, log: CombatLog[]) {
    const experienceToLevelUp = this.experienceToLevelUp(character.level);
    this.logger.log(`Experience to level up: ${experienceToLevelUp}`);
    this.logger.log(`Current experience: ${character.experiencePoints}`);
    if (character.experiencePoints >= experienceToLevelUp) {
      character.level += 1;
      this.logger.debug(
        `${character.name} leveled up to level ${character.level}`,
      );
      character.experiencePoints = 0;

      if (character.level % 2 === 0) character.extraPoints += 1;
      const hitPoints = 6 + modifier(character.constitution);
      character.hitPoints += hitPoints;
      this.logger.debug(`${character.name} gained ${hitPoints} hit points`);
      log.push(
        this.createLogEntry('level-up', 0, character, null, {
          newLevel: character.level,
        }),
      );
    }
  }

  private experienceToLevelUp(level: number): number {
    let toLevel = Math.pow(10, 1.4) * Math.pow(level, 3.5);
    if (level > 10) toLevel = Math.pow(10, 1.4) * Math.pow(level, 2.4);
    return Math.floor(toLevel);
  }

  private createLogEntry(
    type: CombatLog['type'],
    round: CombatLog['round'],
    actor: Character,
    target: Character | null,
    details: any = {},
  ): CombatLog {
    return {
      type,
      round,
      actor: {
        id: actor.id,
        name: actor.name,
      },
      target: target
        ? {
            id: target.id,
            name: target.name,
          }
        : null,
      details,
    };
  }
}
