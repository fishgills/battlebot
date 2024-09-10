import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Character {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  owner: string;

  @Field()
  @Column()
  teamId: string;

  @Field()
  @Column()
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

  // @Field((type) => User)
  // @ManyToOne(() => User, (user) => user.characters)
  // user: User;

  @Field()
  @Column({ default: 0 })
  rolls: number;

  @Field()
  @Column({ default: 0 })
  extraPoints: number;

  combatHitPoints: number;

  @Field({
    nullable: false,
  })
  @Column({
    default: false,
  })
  active: boolean;

  initCombat() {
    this.combatHitPoints = this.hitPoints;
  }
}
