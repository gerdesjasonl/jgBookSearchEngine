import gql from 'graphql-tag';

const typeDefs = gql`
  # TODO: Add a comment describing the functionality of this statement
  #  Thid established a type def of User and Query.
  type User {
    _id: ID
    name: String
    building: String
    creditHours: Int
  }

  # TODO: Add a comment describing the functionality of this statement
  type Query {
    classes: [Class]
  }
`;

export default typeDefs;
