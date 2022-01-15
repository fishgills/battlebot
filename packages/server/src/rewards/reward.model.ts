import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class RewardModel {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  to: string;

  @Column()
  @Field()
  from: string;

  @Column({ default: 1 })
  @Field({ defaultValue: 1 })
  value: number;

  @Field()
  @Column({ type: 'timestamp' })
  @CreateDateColumn()
  created_at: Date;
  @Field()
  @Column({ type: 'timestamp' })
  @UpdateDateColumn()
  updated_at: Date;
}
