import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT as string);
const sdk = getSdk(client);

export { sdk, client };
