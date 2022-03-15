import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConvoEntity } from './convo.entity';
import { CreateConvoInput } from './create-convo.dto';

@Injectable()
export class ConvoService {
  constructor(
    @InjectRepository(ConvoEntity)
    readonly repo: Repository<ConvoEntity>,
  ) {}

  public findOne(id: string) {
    return this.repo.findOneOrFail({
      where: {
        convoId: id,
      },
    });
  }

  public createConvo(input: CreateConvoInput) {
    return this.repo
      .upsert(input, ['convoId'])
      .then(() => this.findOne(input.convoId));
  }

  public delete(convoId: string) {
    return this.repo
      .delete({
        convoId: convoId,
      })
      .then((result) => {
        return result.affected;
      });
  }
}
