import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Participant } from './participant';

@ObjectType()
@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @Field()
  @Column({
    default: 0,
  })
  str!: number;
  @Field()
  @Column({
    default: 0,
  })
  dex!: number;
  @Field()
  @Column({
    default: 0,
  })
  con!: number;
  @Field()
  @Column({
    default: 0,
  })
  level!: number;
  @Field()
  @Column({
    default: 0,
  })
  xp!: number;
  @Field()
  @Column({
    default: 0,
  })
  hp!: number;
  @Field()
  @Column()
  name!: string;
  @Field()
  @CreateDateColumn()
  created!: Date;
  @Field()
  @UpdateDateColumn()
  updated!: Date;

  @Field()
  @Column({
    default: true,
  })
  active!: boolean;
  @Field()
  @Column()
  owner!: string;

  @OneToMany((type) => Participant, (participant) => participant.character)
  @Field((type) => [Participant])
  participating!: Participant[];
}
