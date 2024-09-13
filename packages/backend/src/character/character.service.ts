import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/gamerules';
import {
  AttackDetails,
  AttackLog,
  CombatEnd,
  CombatLog,
  CombatLogType,
} from './combat-type.dto';

@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);
  constructor(
    @InjectRepository(Character)
    protected charactersRepository: Repository<Character>,
  ) {}

  async createCharacter(name: string, userId: string, teamId: string) {
    const character = this.charactersRepository.create({
      name,
      userId,
      teamId,
    });
    character.rollCharacter();

    return this.charactersRepository.save(character);
  }

  async findAllCharacters() {
    return this.charactersRepository.find();
  }

  async findCharacterByOwner(userId: string, teamId: string) {
    return this.charactersRepository.findOneOrFail({
      where: { userId, teamId },
    });
  }

  async findCharacterById(id: string) {
    return this.charactersRepository.findOne({ where: { id } });
  }

  async updateCharacterStats(
    id: string,
    updates: Partial<Character>,
  ): Promise<Character> {
    await this.charactersRepository.update(id, updates);
    return this.findCharacterById(id);
  }

  async deleteCharacter(id: string) {
    return await this.charactersRepository.delete(id);
  }

  async combat(characterId: string, character2Id: string): Promise<CombatEnd> {
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

    logs.push({
      type: CombatLogType.INITIATIVE,
      actor: attacker,
      target: defender,
      round: 0,
    });

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

    logs.push({
      type: CombatLogType.XPGAIN,
      actor: winner,
      target: loser,
      round: rounds,
      details: {
        xp: xpGain,
      },
    });

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
    const attackRecord: AttackDetails = {
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
    combatLog.push({
      type: CombatLogType.ATTACK,
      actor: attacker,
      target: defender,
      round,
      details: attackRecord,
    });
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
      log.push({
        type: CombatLogType.LEVELUP,
        actor: character,
        target: null,
        round: 0,
        details: {
          newLevel: character.level,
        },
      });
    }
  }

  private experienceToLevelUp(level: number): number {
    let toLevel = Math.pow(10, 1.4) * Math.pow(level, 3.5);
    if (level > 10) toLevel = Math.pow(10, 1.4) * Math.pow(level, 2.4);
    return Math.floor(toLevel);
  }
}
