// import { GraphQLClient } from 'graphql-request';
// import { getSdk } from '../generated/graphql';

// const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT as string, {});
// const sdk = getSdk(client);

// export { sdk, client };
import fetch from 'cross-fetch';
import { DocumentNode, GraphQLError } from 'graphql';
import { getSdk, Requester } from '../generated/graphql';
import {
  ApolloClient,
  from,
  InMemoryCache,
  QueryOptions,
  MutationOptions,
  HttpLink,
  ApolloLink,
} from '@apollo/client/core';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { decode } from 'jsonwebtoken';

export type ApolloRequesterOptions<V, R> =
  | Omit<QueryOptions<V>, 'variables' | 'query'>
  | Omit<MutationOptions<R, V>, 'variables' | 'mutation'>;

const validDocDefOps = ['mutation', 'query', 'subscription'];

let token = '';
let expiresIn = 0;

export function getSdkApollo<C>(client: ApolloClient<C>) {
  const requester: Requester = async <R, V>(
    doc: DocumentNode,
    variables: V,
    options?: ApolloRequesterOptions<V, R>,
  ): Promise<R> => {
    // Valid document should contain *single* query or mutation unless it's has a fragment
    if (
      doc.definitions.filter(
        (d) =>
          d.kind === 'OperationDefinition' &&
          validDocDefOps.includes(d.operation),
      ).length !== 1
    ) {
      throw new Error(
        'DocumentNode passed to Apollo Client must contain single query or mutation',
      );
    }

    const definition = doc.definitions[0];

    // Valid document should contain *OperationDefinition*
    if (definition.kind !== 'OperationDefinition') {
      throw new Error(
        'DocumentNode passed to Apollo Client must contain single query or mutation',
      );
    }

    switch (definition.operation) {
      case 'mutation': {
        const response = await client.mutate<R, V>({
          mutation: doc,
          variables,
        });

        if (response.errors) {
          throw new Error(JSON.stringify(response.errors));
        }

        if (response.data === undefined || response.data === null) {
          throw new Error('No data presented in the GraphQL response');
        }

        return response.data;
      }
      case 'query': {
        const response = await client.query<R, V>({
          query: doc,
          variables,
          ...options,
        });

        if (response.errors) {
          throw new Error(JSON.stringify(response.errors));
        }

        if (response.data === undefined || response.data === null) {
          throw new Error('No data presented in the GraphQL response');
        }

        return response.data;
      }
      case 'subscription': {
        throw new Error(
          'Subscription requests through SDK interface are not supported',
        );
      }
    }
  };

  return getSdk(requester);
}

const refreshToken = new TokenRefreshLink({
  accessTokenField: 'token',
  isTokenValidOrUndefined: (options) => {
    if (!token) {
      return false;
    }
    if (expiresIn * 1000 > Date.now()) {
      return true;
    }
    return false;
  },
  fetchAccessToken: async () => {
    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.GRAPQHL_USER,
        password: process.env.GRAPQHL_PASS,
      }),
    });

    return response;
  },
  handleFetch: (newToken) => {
    const decodedToken = decode(newToken, {
      json: true,
    });
    token = newToken;
    expiresIn = decodedToken.exp;
  },
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_ENDPOINT as string,
  fetch,
});
const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT as string,
  cache: new InMemoryCache(),
  link: refreshToken.concat(authLink).concat(httpLink),
});
export const sdk = getSdkApollo(client);
export type Sdk = ReturnType<typeof getSdkApollo>;
