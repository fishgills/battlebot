import { Character } from '../../entities/character';
import { Field, InputType } from 'type-graphql';
@InputType()
export class CharacterInput implements Partial<Character> {
  @Field({
    nullable: true,
  })
  owner: string;

  @Field({
    nullable: true,
  })
  name: string;

  @Field({
    nullable: true,
  })
  con?: number;
  @Field({
    nullable: true,
  })
  dex?: number;
  @Field({
    nullable: true,
  })
  str?: number;

  @Field({
    nullable: true,
  })
  active?: boolean;

  hp?: number;
}
