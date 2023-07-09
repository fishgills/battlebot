import {
  Installation,
  InstallationQuery,
  InstallationStore,
} from '@slack/bolt';
import api from './utils/api';
import { Logger } from './logger';

export class Store implements InstallationStore {
  async storeInstallation(installation: Installation): Promise<void> {
    Logger.debug(`Installing Bot`);
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      await api.install.installControllerCreate({
        team_id: installation.enterprise.id,
        installObj: installation,
      });
      return;
    }
    if (installation.team !== undefined) {
      await api.install.installControllerCreate({
        team_id: installation.team.id,
        installObj: installation,
      });
      return;
    }
    throw new Error('Failed saving installation data to installationStore');
  }
  async fetchInstallation(
    query: InstallationQuery<boolean>,
  ): Promise<Installation<'v1' | 'v2', boolean>> {
    Logger.debug(`Fetching Install`);
    if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
      try {
        const { data: result } = await api.install.installControllerFindOne(
          query.enterpriseId,
        );

        return result.installObj as Installation;
      } catch (e) {
        throw new Error(e);
      }
    }
    if (query.teamId !== undefined) {
      try {
        const { data: result } = await api.install.installControllerFindOne(
          query.teamId,
        );

        return result.installObj as Installation;
      } catch (e) {
        throw new Error(e);
      }
    }
  }
  async deleteInstallation(query: InstallationQuery<boolean>): Promise<void> {
    Logger.debug(`Deleting Install`);
    if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
      await api.install.installControllerRemoveBy(query.enterpriseId);
      return;
    }
    if (query.teamId !== undefined) {
      await api.install.installControllerRemoveBy(query.teamId);
      return;
    }
    throw new Error('Failed to delete installation');
  }
}
