import { Character } from '../../entities/character';
import { Field, InputType } from 'type-graphql';
@InputType()
export class CharacterInput implements Partial<Character> {
  @Field()
  owner: string;

  @Field()
  name: string;
}
