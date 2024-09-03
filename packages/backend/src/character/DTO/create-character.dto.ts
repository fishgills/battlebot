import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({
    type: String,
    example: 'Mister Dude',
  })
  name: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  userId: number;
  //   @ApiProperty({
  //     type: String,
  //     description: 'Slack User Id',
  //   })
  //   owner: string;
  //   @ApiProperty({
  //     type: String,
  //     description: 'Slack Team Id',
  //   })
  //   teamId: string;
}
