import { Injectable } from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { database } from './database.config';

@Injectable()
export class SecretsService /* 👁🔫🩸 */ {
  private secretsManager: SecretsManager;

  constructor() {
    this.secretsManager = new SecretsManager({
      region: 'us-east-1',
    });
  }

  async createTypeOrmOptions(): Promise<MysqlConnectionOptions> {
    let secret: any;
    if (process.env.NODE_ENV === 'production') {
      console.log('before getting secret');
      const { SecretString }: GetSecretValueResponse = await this.secretsManager
        .getSecretValue({
          SecretId:
            'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX',
        })
        .promise();
      secret = JSON.parse(SecretString);
      console.log('after getting a secret', SecretString);
    }
    return {
      ...database,
      ...(process.env.NODE_ENV === 'production' ? secret : {}),
    };
  }
}
