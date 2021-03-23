export interface Messages {
  message: Message;
  level: string;
}
export interface Message {
  type: string;
  user: string;
  client_msg_id?: string | null;
  suppress_notification?: boolean | null;
  text: string;
  team: string;
  blocks?: BlocksEntity[] | null;
  source_team?: string | null;
  user_team?: string | null;
  channel: string;
  event_ts: string;
  ts: string;
  subtype?: string | null;
  inviter?: string | null;
  bot_profile?: BotProfile;
}
export interface BlocksEntity {
  type: string;
  block_id?: string;
  elements: ElementsEntity[];
}
export interface ElementsEntity {
  type: string;
  user_id?: string | null;
  text?: string | null;
}

export interface BotProfile {
  id: string;
  deleted: boolean;
  name: string;
  app_id: string;
  icons: { [key: string]: string };
  team_id: string;
}
