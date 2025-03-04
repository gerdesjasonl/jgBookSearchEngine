import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation loginUser($input: UserInput!) {
        login(input: $input) { 
        token
        user {
            _id
            username
            email
            password
            }
        }
    }`;

export const ADD_USER = gql`
    mutation addUser($input: UserInput!) {
        addUser(input: $input) {
            token
            user {
                _id
                username
                email
            }
        }
    }`;

export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            _id
            username
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

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _idusername
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