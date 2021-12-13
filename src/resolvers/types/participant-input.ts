import { Participant } from 'src/entities/participant';
import { Field, ID, InputType } from 'type-graphql';
@InputType()
export class ParticipantInput implements Partial<Participant> {
  @Field(() => ID)
  battleId: number;

  @Field(() => ID)
  characterId: number;
}
