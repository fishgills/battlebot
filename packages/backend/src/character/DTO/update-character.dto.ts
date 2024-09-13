import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCharacterDto {
  @Field({
    nullable: true,
  })
  strength?: number;
  @Field({
    nullable: true,
  })
  vitality?: number;
  @Field({
    nullable: true,
  })
  defense?: number;
  @Field({
    nullable: true,
  })
  extraPoints?: number;
  @Field({
    nullable: true,
  })
  active?: Date;
}
