import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterEntity } from '../characters/character.entity';
import { CharacterType } from '../characters/character.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CombatLog } from '../gamerules';

@ObjectType()
@Entity()
export class CombatModel {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field(() => CharacterType, { nullable: true })
  @ManyToOne(() => CharacterEntity, (character) => character.attacking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attacker_id' })
  attacker: CharacterType;

  @Column({ type: 'uuid', name: 'attacker_id' })
  @Field()
  attackerId: string;

  @Field(() => CharacterType, { nullable: true })
  @ManyToOne(() => CharacterEntity, (character) => character.defending, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'defender_id' })
  defender: CharacterType;

  @Field()
  @Column({ type: 'uuid', name: 'defender_id' })
  defenderId: string;

  @Field()
  @Column({
    type: 'json',
    nullable: true,
  })
  log: CombatLog;
  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;
  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Field()
  @ManyToOne(() => CharacterEntity)
  @JoinColumn([
    {
      name: 'winner_id',
      referencedColumnName: 'id',
    },
  ])
  winner: CharacterType;

  @Field()
  @ManyToOne(() => CharacterEntity)
  @JoinColumn([
    {
      name: 'loser_id',
      referencedColumnName: 'id',
    },
  ])
  loser: CharacterType;

  @Field()
  @Column({
    default: 0,
  })
  rewardGold: number;
}
