import { Field, InputType } from 'type-graphql';
import { Battle } from '../../entities/battle';
@InputType()
export class BattleInput implements Partial<Battle> {}
