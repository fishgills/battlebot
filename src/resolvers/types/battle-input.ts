import { Battle } from 'src/entities/battle';
import { Field, InputType } from 'type-graphql';
@InputType()
export class BattleInput implements Partial<Battle> {}
