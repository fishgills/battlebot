import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCombatInput {
  @Field()
  initiator: string;
}
