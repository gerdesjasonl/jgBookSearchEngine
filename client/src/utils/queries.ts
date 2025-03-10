import { gql } from '@apollo/client';

export const GET_ME = gql`
query Me {
  me {
    _id
    bookCount
    email
    username
    savedBooks {
      title
      bookId
      authors
      description
      image
      # link
    }
  }
}`;