import express, {Request, Response} from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {typeDefs, resolvers } from './schemas/index';

const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});

};

startApolloServer();

