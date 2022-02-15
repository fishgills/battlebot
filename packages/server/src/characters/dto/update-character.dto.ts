import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCharacterInput {
  @Field()
  strength: number;

  @Field()
  vitality: number;

  @Field()
  defense: number;

  @Field()
  extraPoints: number;
}
