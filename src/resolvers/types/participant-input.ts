import { Field, ID, InputType } from 'type-graphql';
import { Participant } from '../../entities/participant';
@InputType()
export class ParticipantInput implements Partial<Participant> {
  @Field(() => ID)
  battleId: number;

  @Field(() => ID)
  characterId: number;
}
