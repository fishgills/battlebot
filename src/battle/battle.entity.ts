import { ParticipantEntity } from 'src/participant/participant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  ObjectType,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BattleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    default: false,
  })
  completed: boolean;

  @OneToMany(() => ParticipantEntity, (participant) => participant.battle)
  participants!: ParticipantEntity[];
}
