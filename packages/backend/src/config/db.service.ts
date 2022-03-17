import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SecretsManager } from 'aws-sdk';
import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';
import { database } from './database.config';

export const dbFactory = async (): Promise<TypeOrmModuleOptions> => {
  const secretsManager = new SecretsManager({
    region: 'us-east-1',
  });
  let secret: any;
  if (process.env.NODE_ENV === 'production') {
    Logger.debug('getting production secrets');
    const { SecretString }: GetSecretValueResponse = await secretsManager
      .getSecretValue({
        SecretId:
          'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX',
      })
      .promise();
    secret = JSON.parse(SecretString);
    Logger.debug('got secrets');
  }

  const conf: TypeOrmModuleOptions = {
    ...database,
    ...(process.env.NODE_ENV === 'production' ? secret : {}),
    verboseRetryLog: true,
    loggerLevel: 'debug',
    logging: true,
    debug: true,
  };

  Logger.debug('Factory Connection info');
  Logger.debug(conf);
  return conf;
};
