import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCombatInput {
  @Field(() => String)
  attackerId: string;

  @Field(() => String)
  defenderId: string;
}
