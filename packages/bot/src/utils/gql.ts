import fetch from 'cross-fetch';
import { DocumentNode } from 'graphql';
import { getSdk, Requester } from '../generated/graphql';
import {
  ApolloClient,
  InMemoryCache,
  QueryOptions,
  MutationOptions,
  HttpLink,
  ApolloLink,
} from '@apollo/client/core';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { decode, JwtPayload } from 'jsonwebtoken';
import { Logger } from '../logger';
import { getAccessToken, setAccessToken } from './accesstoken';

export type ApolloRequesterOptions<V, R> =
  | Omit<QueryOptions<V>, 'variables' | 'query'>
  | Omit<MutationOptions<R, V>, 'variables' | 'mutation'>;

const validDocDefOps = ['mutation', 'query', 'subscription'];

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
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) {
      return false;
    }
    try {
      const { exp } = decode(token) as JwtPayload;
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  },
  fetchAccessToken: async () => {
    Logger.verbose('Retrieve JWT Token');
    const endpoint = new URL(process.env['GRAPHQL_ENDPOINT']);

    const fetchFrom = `${endpoint.protocol}//${endpoint.host}/auth/login`;
    const response = await fetch(fetchFrom, {
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
    setAccessToken(newToken);
  },
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: getAccessToken() ? `Bearer ${getAccessToken()}` : '',
    },
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_ENDPOINT as string,
  fetch,
});
export const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT as string,
  cache: new InMemoryCache(),
  link: refreshToken.concat(authLink).concat(httpLink),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});
export const sdk = getSdkApollo(client);
export type Sdk = ReturnType<typeof getSdkApollo>;
