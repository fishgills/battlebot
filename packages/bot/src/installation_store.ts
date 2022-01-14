import {
  Installation,
  InstallationQuery,
  InstallationStore,
  Logger,
} from '@slack/bolt';
import { sdk } from './utils/gql';

export class Store implements InstallationStore {
  storeInstallation<AuthVersion extends 'v1' | 'v2'>(
    installation: Installation<AuthVersion, boolean>,
    logger?: Logger,
  ): Promise<void> {
    if (
      installation.isEnterpriseInstall &&
      installation.enterprise !== undefined
    ) {
      sdk.createInstall({
        input: {
          team_id: installation.enterprise.id,
          installObj: installation,
        },
      });
      return;
    }
    if (installation.team !== undefined) {
      sdk.createInstall({
        input: {
          team_id: installation.team.id,
          installObj: installation,
        },
      });
      return;
    }
    logger.error('Failed saving installation data to installationStore');
  }
  async fetchInstallation(
    query: InstallationQuery<boolean>,
    logger?: Logger,
  ): Promise<Installation<'v1' | 'v2', boolean>> {
    if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
      try {
        const install = (
          await sdk.getInstall({
            team_id: query.enterpriseId,
          })
        ).install.installObj;
        return install;
      } catch (e) {
        logger.error(e);
      }
    }
    if (query.teamId !== undefined) {
      try {
        const install = (
          await sdk.getInstall({
            team_id: query.teamId,
          })
        ).install.installObj;
        return install;
      } catch (e) {
        logger.error(e);
      }
    }
  }
  deleteInstallation(
    query: InstallationQuery<boolean>,
    logger?: Logger,
  ): Promise<void> {
    if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
      sdk
        .removeInstall({
          team_id: query.enterpriseId,
        })
        .then();
      return;
    }
    if (query.teamId !== undefined) {
      sdk
        .removeInstall({
          team_id: query.teamId,
        })
        .then();
      return;
    }
    logger.error('Failed to delete installation');
  }
}
