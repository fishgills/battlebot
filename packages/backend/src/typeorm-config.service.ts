import * as AWS from 'aws-sdk';

export const ssmProvider = {
  provide: 'AWS_SSM',
  useFactory: async () => {
    const ssm = new AWS.SSM({});
    const result = await ssm
      .getParametersByPath({
        Path: '/rds-info-1',
      })
      .promise();

    return result.Parameters;
  },
};
