import gql from 'graphql-tag';

const typeDefs = gql`

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    title: String!
    authors: [String]
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    getSingleUser(id: ID, username: String): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): Auth
    login(input: LoginInput!): Auth
    saveBook(book: BookInput!): User
    deleteBook(bookId: ID!): User
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username: String
    email: String
    password: String!
  }

  input BookInput {
    bookId: ID!
    title: String!
    authors: [String]
  }
`;

export default typeDefs;
