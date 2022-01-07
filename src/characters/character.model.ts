import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
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
    nullable: true,
  })
  @Column({
    default: 0,
  })
  str: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  dex: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  con: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  level: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  xp: number;
  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  hp: number;

  @Field({
    nullable: true,
  })
  @Column({
    default: 0,
  })
  rolls: number;
}

// @Entity('character_combat_link')
// export class CharacterCombatLink {
//   @CreateDateColumn()
//   createdAt: Date;

//   @PrimaryColumn('uuid')
//   character_id: string;

//   @PrimaryColumn('uuid')
//   combat_id: string;
// }
