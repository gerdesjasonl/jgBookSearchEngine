import dotenv from 'dotenv';

dotenv.config()

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLContext } from './utils/context';
import { typeDefs, resolvers } from './schemas/index';
import jwt, {JwtPayload } from 'jsonwebtoken';
import User from './models/User';
import mongoose from 'mongoose';


const app = express();

const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const token = req.headers.authorization || '';
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
    }
  })
);

server.start().then(() => {
  app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
});

