import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();


export const authenticateToken = ({ req }: any) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.headers.authorization;
  console.log(token);

  // If the token is sent in the authorization header, extract the token from the header
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // If no token is provided, return the request object as is
  if (!token) {
    return req;
  }

  // Try to verify the token
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    // If the token is valid, attach the user data to the request object
    req.user = data;
  } catch (err) {
    // If the token is invalid, log an error message
    console.log('Invalid token');
  }

  // Return the request object
  return req;
};

export const signToken = (_id: string, username: string, email: string) => {
  // Create a payload with the user information
  const payload = { _id, username, email };
  const secretKey: any = process.env.JWT_SECRET_KEY; // Get the secret key from environment variables

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};


// This is the auth I tried to set up
// import { GraphQLError } from 'graphql';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// // import type { Request } from 'express';

// dotenv.config();

// // interface JwtPayload {
// //   _id: unknown;
// //   username: string;
// //   email: string,
// // }

// // // Helper function to extract the token from Authorization header
// // const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
// //   if (!authHeader) return null;

// //   // Ensure the header follows "Bearer <token>" format
// //   const tokenParts = authHeader.split(' ');
// //   if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
// //     return null;
// //   }

// //   return tokenParts[1];
// // };

// export const authenticateToken = ({ req }: any) => {
//   // Allows token to be sent via req.body, req.query, or headers
//   let token = req.body.token || req.query.token || req.headers.authorization;

//   // If the token is sent in the authorization header, extract the token from the header
//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   // If no token is provided, return the request object as is
//   if (!token) {
//     return req;
//   }

//   // Try to verify the token
//   try {
//     const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
//     // If the token is valid, attach the user data to the request object
//     req.user = data;
//   } catch (err) {
//     // If the token is invalid, log an error message
//     console.log('Invalid token');
//   }

//   // Return the request object
//   return req;
// };
// // export const authenticateToken = (req: Request) => {
// //   const authHeader = req.headers.authorization;
// //   const token = extractTokenFromHeader(authHeader);

// //   if (!token) {
// //     throw new GraphQLError('Unauthorized', {
// //       extensions: {code: 'UNAUTHORIZED'},
// //     });
// //   }

// //     const secretKey = process.env.JWT_SECRET_KEY || '';

// //     try {
// //       const decoded = jwt.verify(token, secretKey) as unknown as JwtPayload;
// //       return decoded;
// //     } catch (err) {
// //       throw new GraphQLError('Forbidden', {
// //         extensions: { code: 'FORBIDDEN' },
// //       });
// //     }
// //   };

// export const signToken = (username: string, email: string, _id: string) => {
//   const payload = { username, email, _id };
//   const secretKey = process.env.JWT_SECRET_KEY;
//   if (!secretKey) {
//     throw new Error('JWT_SECRET_KEY is not defined');
//   }

//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };

// export class AuthenticationError extends GraphQLError {
//   constructor(message: string) {
//     super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
//     Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
//   }
// };