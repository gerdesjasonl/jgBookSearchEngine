import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me ($meId: ID, $username: String) {
            me(id: $meId, username: $username) {
            _id
            username
            email
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
            }
        }`;