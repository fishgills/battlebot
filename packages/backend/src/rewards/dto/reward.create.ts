import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRewardInput {
  @Field()
  source: string;

  @Field()
  destination: string;

  @Field({
    nullable: true,
  })
  value: number;

  @Field()
  teamId: string;
}
