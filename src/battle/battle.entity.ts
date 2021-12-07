import { ParticipantEntity } from 'src/participant/participant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  completed: boolean;

  @OneToMany(() => ParticipantEntity, (participant) => participant.battle)
  participants!: ParticipantEntity[];
}
