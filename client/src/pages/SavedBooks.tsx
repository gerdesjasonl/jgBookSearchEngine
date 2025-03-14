// import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
// import { getMe } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { Book } from '../models/Book';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
// import type { User } from '../models/User';

const savedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);

  // Check for loading or error states
  // if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error fetching user data: {error.message}</h2>;

  // Get the user data (including saved books)
  const userData = data?.me ? data.me: {};


  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const token = Auth.loggedIn() ? Auth.getToken() : null;

//         if (!token) {
//           return false;
//         }

//         const response = await getMe(token);

//         if (!response.ok) {
//           throw new Error('something went wrong!');
//         }

//         // const user = await response.json();
//         // setUserData(user);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     getUserData();
//   },
// );

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const [ removeBook ] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.modify({
        fields: {
          me(existingUserData = {}) {
            return {
              ...existingUserData,
              savedBooks: existingUserData.savedBooks?.filter(
                (book: Book) => book.bookId !== removeBook.bookId
              ) || [],
            };
          },
        },
      });
    },
  });

  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(token);
    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
       variables: { bookId },
       });

       if (!data) {
        throw new Error('Something went wrong removing book!')
       }
       removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  //     if (!response.ok) {
  //       throw new Error('something went wrong!');
  //     }

  //     const updatedUser = await response.json();
  //     setUserData(updatedUser);
  //     // upon success, remove book's id from localStorage
  //     removeBookId(bookId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
console.log(userData)
  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData?.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book: { bookId: string ; image: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; authors: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default savedBooks;
