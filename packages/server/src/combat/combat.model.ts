import { Field, ObjectType } from '@nestjs/graphql';
import { type } from 'ormconfig-migrations';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CharacterModel } from '../characters/character.model';
import { CombatLog } from '../gamerules';

@ObjectType()
@Entity()
export class CombatModel {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field((type) => CharacterModel, { nullable: true })
  @ManyToOne((type) => CharacterModel, (character) => character.attacking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attacker_id' })
  attacker: CharacterModel;

  @Column({ type: 'uuid', name: 'attacker_id' })
  @Field()
  attackerId: string;

  @Field((type) => CharacterModel, { nullable: true })
  @ManyToOne((type) => CharacterModel, (character) => character.defending, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'defender_id' })
  defender: CharacterModel;
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
  @ManyToOne(() => CharacterModel)
  @JoinColumn([
    {
      name: 'winner_id',
      referencedColumnName: 'id',
    },
  ])
  winner: CharacterModel;

  @Field()
  @ManyToOne(() => CharacterModel)
  @JoinColumn([
    {
      name: 'loser_id',
      referencedColumnName: 'id',
    },
  ])
  loser: CharacterModel;

  @Field()
  @Column({
    default: 0,
  })
  rewardGold: number;
}
