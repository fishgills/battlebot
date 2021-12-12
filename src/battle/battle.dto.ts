import {
  FilterableField,
  IDField,
  UnPagedRelation,
} from '@nestjs-query/query-graphql';

import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ParticipantDto } from 'src/participant/participant.dto';

@ObjectType('Battle')
@UnPagedRelation('participants', () => ParticipantDto, {
  disableRemove: true,
})
export class BattleDto {
  @IDField(() => ID)
  id: number;

  @FilterableField()
  completed!: boolean;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;

  @Field()
  test!: string;
}
