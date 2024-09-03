import { ApiProperty } from '@nestjs/swagger';

export class CombatDTO {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  attackerId: number;

  @ApiProperty({
    type: Number,
    example: 2,
  })
  defenderId: number;
}
