import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';
import JSON from 'graphql-type-json';

export const JSONScalar = createFromGraphQLScalar({
  scalar: JSON,
});
