import { Field, ObjectType } from '@nestjs/graphql';
import { CombatLog } from 'src/dnd';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CharacterModel } from '../characters/character.model';

@ObjectType()
@Entity()
export class CombatModel {
  @PrimaryGeneratedColumn('uuid')
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
}
