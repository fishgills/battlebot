import { FilterableField, Relation } from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { BattleDto } from 'src/battle/battle.dto';
import { CharacterDto } from 'src/character/character.dto';
import { ParticipantRole } from './participant.entity';

@ObjectType('Participant')
@Relation('battle', () => BattleDto)
@Relation('character', () => CharacterDto)
export class ParticipantDto {
  @FilterableField(() => ID)
  id!: string;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;

  @Field(() => Number)
  battleId!: number;

  @Field(() => String)
  characterId!: string;

  @FilterableField(() => ParticipantRole)
  role!: ParticipantRole;
}
