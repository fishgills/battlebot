import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateSlackInstallInput } from './create-install.dto';

@InputType()
export class UpdateSlackInstallInput extends PartialType(
  CreateSlackInstallInput,
) {
  @Field(() => String)
  id: string;

  @Field({
    nullable: true,
  })
  stripeId?: string;
}
