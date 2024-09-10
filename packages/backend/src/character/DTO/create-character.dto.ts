import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCharacterDto {
  @Field()
  name: string;
  @Field()
  userId: string;
  @Field()
  teamId: string;

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
