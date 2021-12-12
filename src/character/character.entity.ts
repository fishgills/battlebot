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

  @Column({
    default: 0,
  })
  str!: number;

  @Column({
    default: 0,
  })
  dex!: number;

  @Column({
    default: 0,
  })
  con!: number;

  @Column({
    default: 0,
  })
  level!: number;

  @Column({
    default: 0,
  })
  xp!: number;

  @Column({
    default: 0,
  })
  hp!: number;

  @Column()
  name!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @OneToMany(() => ParticipantEntity, (participant) => participant.character)
  participating!: ParticipantEntity[];

  @Column({
    default: true,
  })
  active!: boolean;

  @Column()
  owner!: string;
}
