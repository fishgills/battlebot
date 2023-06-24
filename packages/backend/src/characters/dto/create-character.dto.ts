import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({
    type: String,
    example: 'Mister Dude',
  })
  readonly name: string;
  @ApiProperty({
    type: String,
    description: 'Slack User Id',
  })
  readonly owner: string;
  @ApiProperty({
    type: String,
    description: 'Slack Team Id',
  })
  readonly teamId: string;
}
