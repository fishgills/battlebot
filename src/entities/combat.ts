import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Battle } from './battle';
import { Character } from './character';

@ObjectType()
@Entity()
export class Combat {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @ManyToOne(() => Battle)
  @Field()
  battle!: Battle;

  @RelationId((c: Combat) => c.battle)
  @Column()
  @Field((type) => ID)
  battleId!: number;

  @Field()
  @Column()
  hit!: boolean;

  @Field()
  @Column()
  attackRoll!: number;

  @Field()
  @Column()
  attackModifier!: number;

  @Field()
  @Column()
  damage!: number;

  @ManyToOne(() => Character)
  @Field()
  attacker!: Character;

  @RelationId((c: Combat) => c.attacker)
  @Column()
  @Field((type) => ID)
  attackerId!: number;

  @ManyToOne(() => Character, (character) => character.id, {
    onDelete: 'CASCADE',
  })
  @Field()
  defender!: Character;

  @RelationId((c: Combat) => c.defender)
  @Column()
  @Field((type) => ID)
  defenderId!: number;

  @CreateDateColumn()
  @Field()
  created!: Date;

  @UpdateDateColumn()
  @Field()
  updated!: Date;
}
