import { Field, ObjectType } from '@nestjs/graphql';
import { CombatLog } from 'src/dnd';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Field({
    nullable: true,
  })
  @Column({
    type: 'json',
  })
  log: CombatLog;
}
