import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CharacterModel } from '../characters/character.model';

@ObjectType()
@Entity()
export class CombatModel {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Field((type) => [CharacterModel], { nullable: true })
  @ManyToMany((type) => CharacterModel, (character) => character.combats)
  participants: CharacterModel[];
}
