import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Conversation, ConversationInput } from './conversation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Logger, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@UseGuards(JwtAuthGuard)
@Resolver((of) => Conversation)
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);
  constructor(private readonly service: ConversationService) {}

  @Query((returns) => Conversation, {
    nullable: true,
  })
  async getConversation(@Args('id') id: string) {
    this.logger.log(`Getting conversation ${id}`);
    const convo = await this.service.getConversationById(id);
    this.logger.debug(convo);
    return convo || null;
  }

  @Mutation((returns) => Conversation)
  async createConversation(
    @Args('CreateConversation') input: ConversationInput,
  ) {
    this.logger.log(
      `Creating conversation:  ${input.id} ${input.body} ${input.expiresAt}`,
    );
    return this.service.createConversation(input);
  }

  @Mutation((returns) => Conversation)
  async deleteConversation(@Args('id') id: string) {
    this.logger.log(`Deleting conversation ${id}`);
    return this.service.deleteConversation(id);
  }
}
