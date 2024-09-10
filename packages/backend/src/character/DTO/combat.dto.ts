import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CombatInput {
  @Field()
  attackerId: string;
  @Field()
  defenderId: string;
}
