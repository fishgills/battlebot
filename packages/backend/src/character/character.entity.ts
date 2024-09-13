import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { modifier } from '../gamerules';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['userId'])
export class Character {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  teamId: string;

  @Field()
  @Column({
    length: 25,
  })
  name: string;

  @Field()
  @Column()
  strength: number;

  @Field()
  @Column()
  constitution: number;

  @Field()
  @Column()
  dexterity: number;

  @Field({
    nullable: false,
  })
  @Column({ default: 1 })
  level: number;

  @Field({
    nullable: false,
  })
  @Column({ default: 0 })
  gold: number;

  @Field({
    nullable: false,
  })
  @Column({ default: 0 })
  experiencePoints: number;

  @Field()
  @Column()
  hitPoints: number;
  @Field({
    nullable: false,
  })
  @Column({ default: 0 })
  wins: number;
  @Field({
    nullable: false,
  })
  @Column({ default: 0 })
  losses: number;

  @Field()
  @Column({ default: 0 })
  rolls: number;

  @Field()
  @Column({ default: 0 })
  extraPoints: number;

  combatHitPoints: number;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'datetime',
    nullable: true,
  })
  active: Date;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  initCombat() {
    this.combatHitPoints = this.hitPoints;
  }

  public rollCharacter() {
    this.strength = new DiceRoll('4d6kh3').total;
    this.constitution = new DiceRoll('4d6kh3').total;
    this.dexterity = new DiceRoll('4d6kh3').total;
    this.hitPoints = 10 + modifier(this.constitution);
    this.rolls = this.rolls ? ++this.rolls : 1;
  }
}
