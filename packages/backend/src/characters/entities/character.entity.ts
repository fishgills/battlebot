import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../base/entity';
import { CombatEntity } from '../../combat/entities/combat.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['owner'])
export class CharacterEntity extends BaseEntity {
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
}
