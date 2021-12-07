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
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  str!: number;

  @Column()
  dex!: number;

  @Column()
  con!: number;

  @Column()
  name!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @OneToMany(() => ParticipantEntity, (participant) => participant.character)
  participating!: ParticipantEntity[];

  @Column()
  active!: boolean;

  @Column()
  owner!: string;
}
