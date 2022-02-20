import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConvoType {
  @Field()
  id: string;

  @Field()
  convoId: string;

  @Field()
  value: string;

  @Field()
  expiresAt: number;
}
