// src/graphql/user/user.schema.ts
import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    email: String!
    age: Int!
    status: String!
    role: String!
  }

  input CreateUserInput {
    fullName: String!
    email: String!
    password: String!
    age: Int!
  }

  input UpdateUserInput {
    fullName: String
    email: String
    password: String
    age: Int
    status: String
    role: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): User
  }
`;

export default userTypeDefs;
