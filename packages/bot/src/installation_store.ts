import {
  Installation,
  InstallationQuery,
  InstallationStore,
} from '@slack/bolt';
import { sdk } from './utils/gql';

export class Store implements InstallationStore {
  async storeInstallation(installation: Installation): Promise<void> {
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      await sdk.createInstall({
        input: {
          team_id: installation.enterprise.id,
          installObj: installation,
        },
      });
      return;
    }
    if (installation.team !== undefined) {
      await sdk.createInstall({
        input: {
          team_id: installation.team.id,
          installObj: installation,
        },
      });
      return;
    }
    throw new Error('Failed saving installation data to installationStore');
  }
  async fetchInstallation(
    query: InstallationQuery<boolean>,
  ): Promise<Installation<'v1' | 'v2', boolean>> {
    if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
      try {
        const result = await sdk.getInstall({
          team_id: query.enterpriseId,
        });

        return result.install.installObj;
      } catch (e) {
        throw new Error(e);
      }
    }
    if (query.teamId !== undefined) {
      try {
        const result = await sdk.getInstall({
          team_id: query.teamId,
        });
        return result.install.installObj;
      } catch (e) {
        throw new Error(e);
      }
    }
  }
  async deleteInstallation(query: InstallationQuery<boolean>): Promise<void> {
    if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
      await sdk.removeInstall({
        team_id: query.enterpriseId,
      });
      return;
    }
    if (query.teamId !== undefined) {
      await sdk.removeInstall({
        team_id: query.teamId,
      });
      return;
    }
    throw new Error('Failed to delete installation');
  }
}
