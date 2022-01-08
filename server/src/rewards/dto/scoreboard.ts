import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RewardsScoreBoardInput {
  @Field({
    defaultValue: 'from',
  })
  direction: 'from' | 'to';

  @Field({
    defaultValue: true,
  })
  today: boolean;
}
