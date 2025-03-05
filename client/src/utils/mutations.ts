import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation loginUser($input: LoginInput!) {
        login(input: $input) { 
        token
        user{
        _id
        username
        email
        }
        }
        
    }`;

export const ADD_USER = gql`
    mutation Mutation($input: CreateUserInput!) {
        addUser(input: $input) {
            token
            user {
            _id
            email
            username
            }
        }
    }`;

export const SAVE_BOOK = gql`
    mutation saveBook($book: BookInput!) {
        saveBook(book: $book) {
            _id
            username
            email
            bookCount
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
            _id
            username
            email
            bookCount
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