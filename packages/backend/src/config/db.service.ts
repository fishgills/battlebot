import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SecretsManager } from 'aws-sdk';
import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';
import { database } from './database.config';

@Injectable()
export class SecretsService /* 👁🔫🩸 */ {
  private readonly logger = new Logger(SecretsService.name);

  private secretsManager: SecretsManager;

  constructor() {
    this.secretsManager = new SecretsManager({
      region: 'us-east-1',
    });
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    let secret: any;
    if (process.env.NODE_ENV === 'production') {
      this.logger.debug('getting production secrets');
      const { SecretString }: GetSecretValueResponse = await this.secretsManager
        .getSecretValue({
          SecretId:
            'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX',
        })
        .promise();
      secret = JSON.parse(SecretString);
      this.logger.debug('got secrets');
    }

    const conf: TypeOrmModuleOptions = {
      ...database,
      ...(process.env.NODE_ENV === 'production' ? secret : {}),
      verboseRetryLog: true,
      loggerLevel: 'debug',
      logging: true,
      debug: true,
    };

    this.logger.debug('Connection info');
    this.logger.debug(conf);
    return conf;
  }
}
