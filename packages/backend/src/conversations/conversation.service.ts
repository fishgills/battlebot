import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, ConversationInput } from './conversation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
  constructor(
    @InjectRepository(Conversation)
    protected charactersRepository: Repository<Conversation>,
  ) {}

  async createConversation(input: ConversationInput) {
    const conversation = this.charactersRepository.create(input);

    return this.charactersRepository.save(conversation);
  }

  async deleteConversation(id: string) {
    return await this.charactersRepository.delete(id);
  }

  async getConversationById(id: string) {
    return await this.charactersRepository.findOneBy({
      id,
    });
  }
}
