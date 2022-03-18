import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { SecretsManager } from 'aws-sdk';
import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';
import { database } from './database.config';

export default class TypeOrmConfig {
  static async getConfig(): Promise<TypeOrmModuleOptions> {
    const secretsManager = new SecretsManager({
      region: 'us-east-1',
    });
    let result: GetSecretValueResponse;
    Logger.debug('getting secrets');
    if (process.env.NODE_ENV === 'production') {
      result = await secretsManager
        .getSecretValue({
          SecretId:
            'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX',
        })
        .promise();

      database.password = 'U2nh82eztHnH1VhSg0i75VIkpYBtzcxu';
      database.username = 'bot';
      database.database = 'botdb';
      database.host = 'botdb.cyt9boru3gsa.us-east-1.rds.amazonaws.com';
    } else {
      result = await secretsManager
        .getSecretValue({
          SecretId:
            'arn:aws:secretsmanager:us-east-1:946679114937:secret:local-db-DWw80v',
        })
        .promise();
    }
    const secret = JSON.parse(result.SecretString);

    Logger.debug('got secrets');

    const conf = {
      ...database,
      // ...(process.env.NODE_ENV === 'production' ? secret : {}),
      verboseRetryLog: true,
      keepConnectionAlive: true,
    };

    Logger.debug('Factory Connection info');
    Logger.debug(conf);
    return conf as TypeOrmModuleOptions;
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getConfig(),
};
