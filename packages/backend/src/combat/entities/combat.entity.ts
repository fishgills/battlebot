import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../base/entity';
import { CharacterEntity } from '../../characters/entities/character.entity';
import { CombatLog } from '../../gamerules';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class CombatEntity extends BaseEntity {
  @ManyToOne(() => CharacterEntity, (character) => character.attacking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attacker_id' })
  attacker: CharacterEntity;

  @Column({ type: 'uuid', name: 'attacker_id' })
  attackerId: string;

  @ManyToOne(() => CharacterEntity, (character) => character.defending, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'defender_id' })
  defender: CharacterEntity;

  @Column({ type: 'uuid', name: 'defender_id' })
  defenderId: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  @ApiProperty({
    type: () => CombatLog,
  })
  log: CombatLog;

  @ManyToOne(() => CharacterEntity)
  @JoinColumn([
    {
      name: 'winner_id',
      referencedColumnName: 'id',
    },
  ])
  winner: CharacterEntity;

  @ManyToOne(() => CharacterEntity)
  @JoinColumn([
    {
      name: 'loser_id',
      referencedColumnName: 'id',
    },
  ])
  loser: CharacterEntity;

  @Column({
    default: 0,
  })
  rewardGold: number;
}
