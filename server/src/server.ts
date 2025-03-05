import { dirname } from 'path'; 
import { fileURLToPath } from 'url'; 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);
import dotenv from 'dotenv';
import express from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// import { GraphQLContext } from './utils/context.js';
import { typeDefs, resolvers } from './schemas/index.js';
// import jwt, {JwtPayload } from 'jsonwebtoken';
// import mongoose from 'mongoose';
import path from 'path';



// import cors from 'cors';

dotenv.config();
 const PORT = process.env.PORT || 3001;
const app = express();

// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Auhtorization']
// }));

  const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

const startApolloServer = async () => {

  await server.start();
  // const { primaryConnection, secondaryConnection } = await db();

 

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any));
  // , {
  //   context: async ({ req, res }): Promise<GraphQLContext> => {
  //     const authHeader = req.headers.authorization || '';
  //     const token = authHeader.split(' ')[1] || '';
  //     let user = null;

  //     if (token) {
  //       try {
  //         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
  //         const userModel = secondaryConnection.model('User', new mongoose.Schema({ username: String, email: String }));
          
  //         const userDoc = await userModel.findById(decoded._id);

  //         if (userDoc) {
  //           user = {
  //             _id: userDoc._id.toString(), 
  //             username: userDoc.username || '', 
  //             email: userDoc.email || '', 
  //           };
  //         }
  //       } catch (err) {
  //         console.error('Invalid token:', err);
  //       }
  //     }

  //     return { req, res, user, primaryConnection, secondaryConnection};
  //   }}));
  if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
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

