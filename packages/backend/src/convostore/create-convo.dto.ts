import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateConvoInput')
export class CreateConvoInput {
  @Field()
  convoId: string;

  @Field()
  value: string;

  @Field()
  expiresAt: number;
}
