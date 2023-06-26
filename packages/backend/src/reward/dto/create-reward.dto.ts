import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({
    type: String,
  })
  source: string;
  @ApiProperty({
    type: String,
  })
  destination: string;
  @ApiPropertyOptional({
    type: Number,
  })
  value: number;
  @ApiProperty({
    type: String,
  })
  teamId: string;
}
