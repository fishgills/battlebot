import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '../../base/entity';
import { CombatEntity } from '../../combat/entities/combat.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/gamerules';

@Entity()
@Unique(['owner'])
export class CharacterEntity extends MyBaseEntity {
  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @Column()
  owner: string;

  @OneToMany(() => CombatEntity, (combat) => combat.attacker, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    type: () => [CombatEntity],
  })
  attacking: CombatEntity[];

  @OneToMany(() => CombatEntity, (combat) => combat.defender, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    type: () => [CombatEntity],
  })
  defending: CombatEntity[];

  @Column({
    default: 0,
  })
  strength: number;

  @Column({
    default: 0,
  })
  defense: number;

  @Column({
    default: 0,
  })
  vitality: number;

  @Column({
    default: 1,
  })
  level: number;

  @Column({
    default: 0,
  })
  xp: number;

  @Column({
    default: 0,
  })
  hp: number;

  @Column({
    default: 0,
  })
  rolls: number;

  @Column({
    default: 0,
  })
  gold: number;

  @Column({
    nullable: false,
  })
  teamId: string;

  @Column({
    default: 0,
  })
  extraPoints: number;

  @Column({
    default: false,
  })
  active: boolean;

  public rollCharacter() {
    this.strength = new DiceRoll('4d6kh3').total;
    this.defense = new DiceRoll('4d6kh3').total;
    this.vitality = new DiceRoll('4d6kh3').total;
    this.rolls = this.rolls ? ++this.rolls : 1;
    this.hp = 10 + modifier(this.vitality);
  }
}
