import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCharacterDto } from './create-character.dto';

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
  strength?: number;
  vitality?: number;
  defense?: number;
  extraPoints?: number;
  active?: boolean;
}
