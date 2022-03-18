import { SecretsManager } from 'aws-sdk';
import { ConnectionOptionsReader } from 'typeorm/connection/ConnectionOptionsReader';
import { database } from './typeorm/database.config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

function patchAsyncConnectionSetup() {
  const prototype = ConnectionOptionsReader.prototype as any;

  const original = prototype.normalizeConnectionOptions;

  prototype.normalizeConnectionOptions = function (
    options: Promise<any> | object,
  ) {
    if ('then' in options) {
      return options.then((arg) => original.call(this, arg));
    }

    return original.call(this, options);
  };
}
patchAsyncConnectionSetup();

/**
 * @Type - @config- For typeOrm with Database
 * @name ConnectionOptions
 * @description This ConnectionOptions used to access the database cred for app.
 * @return { export } export the database configurations to use on time migrations,seeds with cli.
 */

async function buildConnectionOptions() {
  if (process.env.NODE_ENV === 'production') {
    const client = await new SecretsManager({
      region: 'us-east-1',
    });

    const result = await client
      .getSecretValue({
        SecretId:
          'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX',
      })
      .promise();

    const sm = JSON.parse(result.SecretString);

    if (sm) {
      const config: MysqlConnectionOptions = {
        ...database,
        ...sm,
      };
      return config;
    }
  } else {
    return database;
  }
}

const config = buildConnectionOptions();

export default config;
