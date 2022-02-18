import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RewardScore {
  @Field()
  teamId: string;

  @Field()
  userId: string;

  @Field()
  count: number;
}
