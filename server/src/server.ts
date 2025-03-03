import dotenv from 'dotenv';
import express from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLContext } from './utils/context.js';
import { typeDefs, resolvers } from './schemas/index.js';
import jwt, {JwtPayload } from 'jsonwebtoken';
import User from './models/User.js';
import mongoose from 'mongoose';


dotenv.config()

const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

const startApolloServer = async () => {

  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1] || '';
      let user = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
          const userDoc = await User.findById(decoded._id);

          if (userDoc && userDoc._id instanceof mongoose.Types.ObjectId) {
            user = {
              _id: userDoc._id.toString(), 
              username: userDoc.username, 
              email: userDoc.email, 
            };
          }
        } catch (err) {
          console.error('Invalid token:', err);
        }
      }

      return { req, res, user };
    }}));
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

// app.use(
//   '/graphql',
//   expressMiddleware(server, {
//     context: async ({ req, res }): Promise<GraphQLContext> => {
//       const authHeader = req.headers.authorization || '';
//       const token = authHeader.split(' ')[1] || '';
//       let user = null;

//       if (token) {
//         try {
//           const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//           const userDoc = await User.findById(decoded._id);

//           if (userDoc && userDoc._id instanceof mongoose.Types.ObjectId) {
//             user = {
//               _id: userDoc._id.toString(), 
//               username: userDoc.username, 
//               email: userDoc.email, 
//             };
//           }
//         } catch (err) {
//           console.error('Invalid token:', err);
//         }
//       }

//       return { req, res, user };
//     }
//   })
// );

// server.start().then(() => {
//   app.listen(3001, () => console.log('Server running on http://localhost:3001/graphql'));
// });

