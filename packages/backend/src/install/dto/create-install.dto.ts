import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '@slack/oauth';

export class CreateInstallDto {
  team_id: string;
  @ApiProperty()
  installObj: Installation;
  channelId?: string;
}
