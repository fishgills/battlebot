import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum AllowedDirections {
  FROM = 'from',
  TO = 'to',
}

registerEnumType(AllowedDirections, {
  name: 'AllowedDirections',
  description: 'Supported scoreboard directions',
  valuesMap: {
    FROM: {
      description: 'rewards from users',
    },
    TO: {
      description: 'rewards to users',
    },
  },
});
@InputType()
export class RewardsScoreBoardInput {
  @Field(() => AllowedDirections)
  direction: AllowedDirections;

  @Field()
  teamId: string;

  @Field({
    defaultValue: true,
  })
  today: boolean;
}
