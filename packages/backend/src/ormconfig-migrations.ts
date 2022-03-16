import { database } from './config/database.config';
import * as AWS from 'aws-sdk';

const getConn = async () => {
  if (process.env.NODE_ENV === 'production') {
    const ssm = new AWS.SecretsManager({
      region: 'us-east-1',
    });

    const result = await ssm
      .getSecretValue({
        SecretId:
          'arn:aws:secretsmanager:us-east-1:946679114937:secret:rds-info-1-MwazwX',
      })
      .promise();

    const { host, username, password } = JSON.parse(result.SecretString);
    const config = {
      ...database,
      host,
      username,
      password,
    };
    console.log(config);
    return config;
  } else {
    console.log(database);
    return database;
  }
};

export = getConn();
