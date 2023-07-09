import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MyBaseEntity } from '../../base/entity';
import { Column, Entity } from 'typeorm';

@Entity('reward_model')
export class RewardEntity extends MyBaseEntity {
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
