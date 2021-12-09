import { FilterableField, IDField } from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Field, ID } from '@nestjs/graphql';

@ObjectType('Character')
export class CharacterDto {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  name!: string;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;

  @Field()
  str!: number;

  @Field()
  dex!: number;

  @Field()
  con!: number;

  @Field()
  level!: number;

  @Field()
  xp!: number;

  @FilterableField()
  active!: boolean;

  @FilterableField({
    nullable: false,
  })
  owner!: string;
}
