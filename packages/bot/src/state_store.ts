import { InstallURLOptions, StateStore } from '@slack/bolt';
export class MyStateStore implements StateStore {
  async generateStateParam(): Promise<string> {
    return process.env['SLACK_STATE_SECRET'];
  }

  async verifyStateParam(): Promise<InstallURLOptions> {
    return {
      scopes: ['users:read', 'channels:history', 'commands', 'chat:write'],
    };
  }
}
