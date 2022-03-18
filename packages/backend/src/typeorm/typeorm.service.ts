import {
  GetSecretValueCommand,
  SecretsManager,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CharacterEntity } from 'characters/character.entity';
import { CombatModel } from 'combat/combat.model';
import { ConvoEntity } from 'convostore/convo.entity';
import { SlackInstallModel } from 'installs/install.model';
import { RewardEntity } from 'rewards/reward.entity';
import { SessionModel } from 'slack-auth/session-model';
import { UserEntity } from 'users/users.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const databaseCredential = await this.getDatabaseCredential();
    const { host, port, username, password, database } = databaseCredential;
    const conf = {
      type: 'mysql' as const,
      host,
      port,
      username,
      database,
      password,
      dropSchema: false,
      synchronize: false,
      migrationsRun: false,
      logging: process.env.NODE_ENV !== 'production',
      cache: false,
      migrations: [`${__dirname}/migrations/*.{ts,js}`],
      cli: {
        migrationsDir: `${__dirname}/migrations`,
      },
      keepConnectionAlive: true,
      entities: [
        CombatModel,
        CharacterEntity,
        SlackInstallModel,
        RewardEntity,
        SessionModel,
        ConvoEntity,
        UserEntity,
      ],
    };
    console.log(JSON.stringify(conf));
    return conf;
  }

  getDatabaseCredential(): Promise<any> {
    const client = new SecretsManager({
      region: 'us-east-1',
    });
    return client
      .send(
        new GetSecretValueCommand({
          SecretId: process.env.AWS_SECRET_ARN,
        }),
      )
      .then((result) => {
        return JSON.parse(result.SecretString);
      });
  }
}
