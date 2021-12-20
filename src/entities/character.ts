import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Participant } from './participant';

@ObjectType()
@Entity()
@Unique(['owner'])
export class Character {
  @PrimaryGeneratedColumn()
  @Field((type) => ID, {
    nullable: true,
  })
  id!: number;

  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  str!: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  dex!: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  con!: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  level!: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  xp!: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  hp!: number;
  @Field({
    nullable: true,
  })
  @Column()
  name!: string;

  @Field({
    nullable: true,
  })
  @CreateDateColumn()
  created!: Date;

  @Field({
    nullable: true,
  })
  @UpdateDateColumn()
  updated!: Date;

  @Field({
    nullable: true,
  })
  @Column({
    default: false,
  })
  active!: boolean;

  @Field({
    nullable: true,
  })
  @Column()
  owner!: string;

  @OneToMany((type) => Participant, (participant) => participant.character)
  @Field((type) => [Participant])
  participating!: Participant[];

  @Field({
    defaultValue: 0,
    nullable: true,
  })
  @Column({
    default: 0,
  })
  rolls!: number;
}
