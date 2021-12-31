import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CombatModel } from '../combat/combat.model';

@ObjectType()
@Entity()
export class CharacterModel {
  @Field()
  @PrimaryGeneratedColumn()
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

  @Field((type) => [CombatModel], { nullable: true })
  @ManyToMany((type) => CombatModel, (combat) => combat.participants, {
    cascade: true,
  })
  @JoinTable({
    name: 'character_combat',
    joinColumn: {
      name: 'character_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'combat_id',
      referencedColumnName: 'id',
    },
  })
  combats: CombatModel[];
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
