import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRewardInput {
  @Field()
  from: string;

  @Field()
  to: string;

  @Field({
    nullable: true,
  })
  value: number;

  @Field()
  teamId: string;
}
