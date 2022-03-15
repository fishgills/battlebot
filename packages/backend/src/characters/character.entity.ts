import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CombatModel } from '../combat/combat.model';

@Entity('character_model')
@Unique(['owner'])
export class CharacterEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;
  @Column()
  @CreateDateColumn()
  created_at: Date;
  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  owner: string;

  @OneToMany(() => CombatModel, (combat) => combat.attacker, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  attacking: CombatModel[];

  @OneToMany(() => CombatModel, (combat) => combat.defender, {
    lazy: true,
    onDelete: 'CASCADE',
  })
  defending: CombatModel[];

  @Column({
    default: 0,
  })
  strength: number;

  @Column({
    default: 0,
  })
  defense: number;

  @Column({
    default: 0,
  })
  vitality: number;

  @Column({
    default: 1,
  })
  level: number;

  @Column({
    default: 0,
  })
  xp: number;

  @Column({
    default: 0,
  })
  hp: number;

  @Column({
    default: 0,
  })
  rolls: number;

  @Column({
    default: 0,
  })
  gold: number;

  @Column({
    nullable: false,
  })
  teamId: string;

  @Column({
    default: 0,
  })
  extraPoints: number;

  @Column({
    default: false,
  })
  active: boolean;
}
