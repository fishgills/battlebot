import * as dotenv from 'dotenv';
dotenv.config();
import { ConnectionOptionsReader } from 'typeorm/connection/ConnectionOptionsReader';
import { database } from './typeorm/database.config';
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
  const config: PostgresConnectionOptions = {
    ...database,
  };
  return config;
}

const config = buildConnectionOptions();

export default config;
