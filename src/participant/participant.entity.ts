import { Relation } from '@nestjs-query/query-graphql';
import { registerEnumType } from '@nestjs/graphql';
import { BattleDto } from 'src/battle/battle.dto';
import { BattleEntity } from 'src/battle/battle.entity';
import { CharacterEntity } from 'src/character/character.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ParticipantRole {
  ATTACKER = 'attacker',
  DEFENDER = 'defender',
}

registerEnumType(ParticipantRole, {
  name: 'RoleEnum',
});
@Entity('Participant')
@Relation('battle', () => BattleDto)
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(
    (): ObjectType<CharacterEntity> => CharacterEntity,
    (character) => character.participating,
    {
      onDelete: 'NO ACTION',
      nullable: false,
    },
  )
  @JoinColumn()
  character!: CharacterEntity;

  @Column({ nullable: false })
  characterId!: string;

  @ManyToOne(
    (): ObjectType<BattleEntity> => BattleEntity,
    (battle) => battle.participants,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn()
  battle: BattleEntity;

  @Column({ nullable: false })
  battleId!: string;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.ATTACKER,
  })
  role!: ParticipantRole;
}
