import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: "Update a character's properties",
})
export class UpdateCharacterInput {
  @Field({
    nullable: true,
  })
  strength: number;

  @Field({
    nullable: true,
  })
  vitality: number;

  @Field({
    nullable: true,
  })
  defense: number;

  @Field({
    nullable: true,
  })
  extraPoints: number;

  @Field({
    nullable: true,
  })
  active!: boolean;
}
