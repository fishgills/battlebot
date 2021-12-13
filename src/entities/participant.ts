import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Character } from './character';
import { Battle } from './battle';

@ObjectType()
@Entity()
export class Participant {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne((type) => Character)
  character: Character;

  @RelationId((p: Participant) => p.character)
  @Column()
  @Field((type) => ID)
  characterId!: number;

  @ManyToOne((type) => Battle)
  battle: Battle;

  @RelationId((p: Participant) => p.battle)
  @Column()
  @Field((type) => ID)
  battleId!: number;
}
