// src/graphql/resolvers.ts
import { mergeResolvers } from '@graphql-tools/merge';
import userResolvers from './user/user.resolvers';

const resolvers = mergeResolvers([
  userResolvers,
  // Add other resolvers here
]);

export default resolvers;
