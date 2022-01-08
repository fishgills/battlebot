import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterModel } from 'src/characters/character.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class RewardModel {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  to: string;

  @Column()
  @Field()
  from: string;

  @Column({ default: 1 })
  @Field({ defaultValue: 1 })
  value: number;

  @Field()
  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  created_at: Date;
  @Field()
  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updated_at: Date;
}
