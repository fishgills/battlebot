import { Assembler, ClassTransformerAssembler } from '@nestjs-query/core';
import { BattleDto } from './battle.dto';
import { BattleEntity } from './battle.entity';

@Assembler(BattleDto, BattleEntity)
export class BattleAssembler extends ClassTransformerAssembler<
  BattleDto,
  BattleEntity
> {
  convertToDTO(entity: BattleEntity): BattleDto {
    const dto = super.convertToDTO(entity);
    dto.test = 'hi';
    return dto;
  }
}
