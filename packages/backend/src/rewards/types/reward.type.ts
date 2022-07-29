import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RewardType {
  @Field()
  id: string;

  @Field()
  destination: string;

  @Field()
  source: string;

  @Field({ defaultValue: 1 })
  value: number;

  @Field()
  created_at: Date;
  @Field()
  updated_at: Date;

  @Field()
  teamId: string;
}
