// src/graphql/schema.ts
import { mergeTypeDefs } from '@graphql-tools/merge';
import userTypeDefs from './user/user.schema';

const typeDefs = mergeTypeDefs([
  userTypeDefs,
  // Add other type definitions here
]);

export default typeDefs;
