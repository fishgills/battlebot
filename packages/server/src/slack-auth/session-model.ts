import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SessionModel extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({
    type: 'json',
    nullable: false,
  })
  data: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
