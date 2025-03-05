
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import jwt from 'jsonwebtoken';

interface UserInput {
  username?: string;
  email?: string;
  password: string;
}

interface BookInput {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

const resolvers = {
  User: {
    bookCount: (parent: { savedBooks: any[] }) => {
      return parent.savedBooks.length;
    }
  },

  // This query will get user profile
  Query: {
    me: async (_: any, __: any, context: any) => {
      const token = context.req.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new Error('Unauthorized');
      }
      const jwtSecret = process.env.JWT_SECRET_KEY;
      if (!jwtSecret) {
        throw new Error('JWT secret is not defined');
      }

      let decodedUser;
      try {
        decodedUser = jwt.verify(token, jwtSecret) as {userId: string};
      } catch (error) {
        throw new Error('Unauthorized');
      }
      const userId = decodedUser?.userId;

      if (!userId) {
        throw new Error('Unauthorized');
      }
      const foundUser = await User.findOne({ _id: userId});

      if (!foundUser) {
      throw new Error('Cannot find user');
      }

      return foundUser;
    },
  },

  Mutation: {

    // This mutation creates a new user
    addUser: async (_: any, { input }: {input: UserInput}) => {
      const user = await User.create(input);

      if (!user) {
        throw new Error('Error while creating user');
      }
      const token = signToken(user.username as string, user.email as string, user._id as string);
      return { token, user };
    },

    // this mutation logs the user in
    login: async (_: any, { input }: { input: UserInput }) => {
      console.log(input);
      const user = await User.findOne({
         email: input.email
      });

      if (!user) {
        throw new Error("Can't find this user.");
      }

      const correctPw = await user.isCorrectPassword(input.password);
      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user.username as string, user.email as string, user._id as string);
      return { token, user };
    },

    // This should save a book to the user's book list
    saveBook: async (_: any, { bookId }: { bookId: BookInput }) => {

      const updatedUser = await User.findOneAndUpdate(
        { _id: bookId },
        { $addToSet: { savedBooks: bookId } },
        { new: true, runValidators: true }
      );

      return updatedUser?.savedBooks;
    },

    // This mutation should delete a book from the user's book list
    removeBook: async (_: any, { bookId }: { bookId: string }) => {
    
      const updatedUser = await User.findOneAndUpdate(
        { _id: bookId },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user or error deleting book");
      }

      return updatedUser;
    },
  },
};


export default resolvers;
