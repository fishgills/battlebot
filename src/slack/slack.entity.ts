import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface SlackInstallation {
  team: Team;
  user: User;
  tokenType: string;
  isEnterpriseInstall: boolean;
  appId: string;
  authVersion: string;
  bot: Bot;
}
export interface Team {
  id: string;
  name: string;
}
export interface User {
  id: string;
}
export interface Bot {
  scopes?: string[] | null;
  token: string;
  userId: string;
  id: string;
}

@Entity('SlackInstalls')
export class SlackEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  slackId!: string;

  @Column('simple-json')
  slackInfo!: SlackInstallation;
}
