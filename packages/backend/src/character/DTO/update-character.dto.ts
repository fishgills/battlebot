import { Field, InputType } from '@nestjs/graphql';
import { Character } from '../character.entity';

@InputType()
export class UpdateCharacterDto implements Partial<Character> {
  @Field({
    nullable: true,
  })
  strength?: number;
  @Field({
    nullable: true,
  })
  constitution?: number;
  @Field({
    nullable: true,
  })
  dexterity?: number;
  @Field({
    nullable: true,
  })
  extraPoints?: number;
  @Field({
    nullable: true,
  })
  active?: Date;
}
