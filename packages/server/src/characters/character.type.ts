import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CombatModel } from '../combat/combat.model';

@ObjectType()
export class CharacterType {
  @Field()
  id: string;

  @Field()
  name: string;
  @Field()
  created_at: Date;
  @Field()
  updated_at: Date;

  @Field()
  owner: string;

  @Field(() => [CombatModel], {
    nullable: true,
  })
  attacking: CombatModel[];

  @Field(() => [CombatModel], {
    nullable: true,
  })
  defending: CombatModel[];

  @Field({
    defaultValue: 0,
  })
  strength: number;

  @Field({
    defaultValue: 0,
  })
  defense: number;

  @Field({
    defaultValue: 0,
  })
  vitality: number;

  @Field({
    defaultValue: 1,
  })
  level: number;

  @Field({
    defaultValue: 0,
  })
  xp: number;
  @Field({
    defaultValue: 0,
  })
  hp: number;

  @Field({
    defaultValue: 0,
  })
  rolls: number;

  @Field(() => Float)
  gold: number;

  @Field()
  teamId: string;

  @Field()
  extraPoints: number;
}
