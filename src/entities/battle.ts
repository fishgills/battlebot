import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Participant } from './participant';

@Entity()
@ObjectType()
export class Battle {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @Field()
  @Column({
    default: false,
  })
  completed: boolean;

  @OneToMany((type) => Participant, (participant) => participant.battle)
  @Field((type) => [Participant])
  participating!: Participant[];
}
