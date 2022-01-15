export interface SlackAuth {
  id_token: string;
  userinfo: Userinfo;
  access_token: string;
}
export interface Userinfo {
  ok: boolean;
  sub: string;
  name: string;
  email: string;
  locale: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  date_email_verified: number;
  'https://slack.com/team_id': string;
  'https://slack.com/user_id': string;
  'https://slack.com/team_name': string;
  'https://slack.com/team_domain': string;
  'https://slack.com/team_image_34': string;
  'https://slack.com/team_image_44': string;
  'https://slack.com/team_image_68': string;
  'https://slack.com/team_image_88': string;
  'https://slack.com/user_image_24': string;
  'https://slack.com/user_image_32': string;
  'https://slack.com/user_image_48': string;
  'https://slack.com/user_image_72': string;
  'https://slack.com/team_image_102': string;
  'https://slack.com/team_image_132': string;
  'https://slack.com/team_image_230': string;
  'https://slack.com/user_image_192': string;
  'https://slack.com/user_image_512': string;
  'https://slack.com/team_image_default': boolean;
}
