import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  strength: number;

  @Column()
  constitution: number;

  @Column()
  dexterity: number;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  gold: number;

  @Column({ default: 0 })
  experiencePoints: number;

  @Column()
  hitPoints: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @ManyToOne(() => User, (user) => user.characters)
  user: User;

  @Column({ default: 0 })
  extraPoints: number;

  combatHitPoints: number;

  initCombat() {
    this.combatHitPoints = this.hitPoints;
  }
}
