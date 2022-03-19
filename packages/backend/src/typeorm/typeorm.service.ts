import { SecretsManager } from '@aws-sdk/client-secrets-manager';
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
    const { host, port, username, password, database } =
      await this.getDatabaseCredential();

    const conf: TypeOrmModuleOptions = {
      type: 'postgres',
      name: 'app',
      host,
      port,
      username,
      database,
      password,
      dropSchema: false,
      synchronize: false,
      migrationsRun: false,
      logging: true,
      cache: false,
      migrations: [`${__dirname}/migrations/*.{ts,js}`],
      cli: {
        migrationsDir: `${__dirname}/migrations`,
      },
      entities: [
        CombatModel,
        CharacterEntity,
        SlackInstallModel,
        RewardEntity,
        SessionModel,
        ConvoEntity,
        UserEntity,
      ],
      verboseRetryLog: true,
    };
    console.log(conf);
    return conf;
  }

  async getDatabaseCredential(): Promise<any> {
    const client = new SecretsManager({
      region: 'us-east-1',
    });

    const result = await client.getSecretValue({
      SecretId: process.env.AWS_SECRET_ARN,
    });
    return JSON.parse(result.SecretString);
  }
}
