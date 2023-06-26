import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../base/entity';
import { Column, Entity } from 'typeorm';

@Entity('reward_model')
export class RewardEntity extends BaseEntity {
  @Column()
  @ApiProperty({
    readOnly: true,
  })
  destination: string;

  @Column()
  @ApiProperty()
  source: string;

  @Column()
  @ApiProperty()
  teamId: string;

  @Column({ default: 1 })
  @ApiPropertyOptional()
  value: number;
}
