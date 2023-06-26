import { ApiProperty } from '@nestjs/swagger';

export enum AllowedDirections {
  FROM = 'source',
  TO = 'destination',
}

export class RewardsScoreBoardInput {
  @ApiProperty({
    enum: AllowedDirections,
  })
  direction: AllowedDirections;
  teamId: string;
  today?: boolean;
}
