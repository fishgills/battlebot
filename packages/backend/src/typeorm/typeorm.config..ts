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

    const conf: TypeOrmModuleOptions = {
      ...database,
      ...(process.env.NODE_ENV === 'production' ? secret : {}),
      verboseRetryLog: true,
      loggerLevel: 'debug',
      logging: true,
      debug: true,
      keepConnectionAlive: true,
    };

    Logger.debug('Factory Connection info');
    Logger.debug(conf);
    return conf;
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getConfig(),
};
