import { ApiProperty } from '@nestjs/swagger';

export enum AllowedDirections {
  FROM = 'source',
  TO = 'destination',
}

export class RewardsScoreBoardInput {
  @ApiProperty({
    type: AllowedDirections,
  })
  direction: AllowedDirections;
  @ApiProperty()
  teamId: string;
  @ApiProperty()
  today: boolean;
}
