import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { id } from 'date-fns/locale';
import { ConvoService } from './convo.service';
import { ConvoType } from './convo.type';
import { CreateConvoInput } from './create-convo.dto';

@Resolver(() => ConvoType)
export class ConvoResolver {
  constructor(@Inject(ConvoService) readonly service: ConvoService) {}
  @Query(() => ConvoType)
  convo(@Args('convoId', { type: () => String }) id: string) {
    return this.service.findOne(id);
  }

  @Mutation(() => ConvoType)
  createConvo(
    @Args('input')
    input: CreateConvoInput,
  ) {
    return this.service.createConvo(input);
  }

  @Mutation(() => Int)
  deleteConvo(@Args('convoId') id: string) {
    return this.service.delete(id);
  }
}
