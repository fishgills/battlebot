export class CreateInstallDto {
  team_id: string;
  installObj: {
    bot: {
      token: string;
    };
  };
  channelId: string;
}
