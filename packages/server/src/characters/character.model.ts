import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CombatModel } from '../combat/combat.model';

@ObjectType()
@Entity()
@Unique(['owner'])
export class CharacterModel {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({
    length: 100,
    nullable: false,
  })
  name: string;
  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;
  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Field()
  @Column()
  owner: string;

  @OneToMany((type) => CombatModel, (combat) => combat.attacker, { lazy: true })
  @Field(() => [CombatModel], {
    nullable: true,
  })
  attacking: CombatModel[];

  @OneToMany((type) => CombatModel, (combat) => combat.defender, { lazy: true })
  @Field(() => [CombatModel], {
    nullable: true,
  })
  defending: CombatModel[];

  @Field({
    defaultValue: 0,
  })
  @Column({
    default: 0,
  })
  strength: number;

  @Field({
    defaultValue: 0,
  })
  @Column({
    default: 0,
  })
  defense: number;

  @Field({
    defaultValue: 0,
  })
  @Column({
    default: 0,
  })
  vitality: number;

  @Field({
    defaultValue: 1,
  })
  @Column({
    default: 1,
  })
  level: number;

  @Field({
    defaultValue: 0,
  })
  @Column({
    default: 0,
  })
  xp: number;
  @Field({
    defaultValue: 0,
  })
  @Column({
    default: 0,
  })
  hp: number;

  @Field({
    defaultValue: 0,
  })
  @Column({
    default: 0,
  })
  rolls: number;

  @Field(() => Float)
  @Column({
    default: 0,
  })
  gold: number;

  @Column({
    nullable: false,
  })
  @Field()
  teamId: string;
}
