import { Field, InputType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType('CreateSlackInstallInput')
export class CreateSlackInstallInput {
  @Field()
  team_id: string;

  @Field(() => GraphQLJSON)
  installObj: any;
}
