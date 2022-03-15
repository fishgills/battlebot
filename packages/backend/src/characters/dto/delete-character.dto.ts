import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCharacterInput {
  @Field()
  owner: string;

  @Field()
  teamId: string;
}
