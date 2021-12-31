import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCharacterInput {
  @Field()
  name: string;

  @Field()
  owner: string;
}
