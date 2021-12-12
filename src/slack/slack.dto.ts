import { FilterableField } from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('SlackInstalls')
export class SlackDto {
  //   @FilterableField(() => ID)
  //   id!: string;

  @FilterableField(() => String)
  slackId!: string;

  @Field()
  slackInfo!: string;
}
