import { ConnectionOptionsReader } from 'typeorm/connection/ConnectionOptionsReader';
import { database } from './typeorm/database.config';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
  let arn =
    'arn:aws:secretsmanager:us-east-1:946679114937:secret:local-db-DWw80v';

  if (process.env.NODE_ENV === 'production') {
    arn =
      'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX';
  }

  const client = await new SecretsManager({
    region: 'us-east-1',
  });

  const result = await client.getSecretValue({
    SecretId: arn,
  });

  const sm = JSON.parse(result.SecretString);

  if (sm) {
    const config: PostgresConnectionOptions = {
      ...database,
      ...sm,
    };
    return config;
  }
}

const config = buildConnectionOptions();

export default config;
