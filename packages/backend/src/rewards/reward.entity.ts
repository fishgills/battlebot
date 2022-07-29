import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reward_model')
export class RewardEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destination: string;

  @Column()
  source: string;

  @Column()
  teamId: string;

  @Column({ default: 1 })
  value: number;

  @Column({ type: 'timestamp' })
  @CreateDateColumn()
  created_at: Date;
  @Column({ type: 'timestamp' })
  @UpdateDateColumn()
  updated_at: Date;
}
