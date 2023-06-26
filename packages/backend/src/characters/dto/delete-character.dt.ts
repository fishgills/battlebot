import { ApiProperty } from '@nestjs/swagger';

export class DeleteCharacterInput {
  @ApiProperty()
  owner: string;
  @ApiProperty()
  teamId: string;
}
