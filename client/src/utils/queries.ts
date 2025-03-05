import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me($meId: ID, $username: String) {
  me(id: $meId, username: $username) {
    _id
    username
    savedBooks {
      bookId
      title
      authors
      description
      image
      link
      __typename
    }
    __typename
  },
}`;