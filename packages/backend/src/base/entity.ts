import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity as TypeOrmBaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
