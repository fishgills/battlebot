import { Field, InputType } from '@nestjs/graphql';
import { JSONScalar } from './json.scalar';

@InputType('CreateSlackInstallInput')
export class CreateSlackInstallInput {
  @Field()
  team_id: string;

  @Field(() => JSONScalar)
  installObj: string;

  @Field(() => String, {
    nullable: true,
  })
  channelId: string;
}
