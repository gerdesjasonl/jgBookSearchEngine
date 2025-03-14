import { ObjectId } from 'mongoose';
import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';
// import jwt from 'jsonwebtoken';

interface UserInput {
  id: ObjectId,
  username?: string;
  email: string;
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
    me: async (_parent: any,_args: any, context: any) => {
      console.log('Context:', context); // Debugging
      // If the user is authenticated, find and return the user's information along with their thoughts
      if (!context.user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
  
      return User.findOne({ _id: context.user._id });
    },
  
    // me: async (_: any, __: any, context: any) => {
    //   const token = context.req.headers['authorization']?.split(' ')[1];

    //   if (!token) {
    //     throw new Error('Unauthorized');
    //   }
    //   const jwtSecret = process.env.JWT_SECRET_KEY;
    //   if (!jwtSecret) {
    //     throw new Error('JWT secret is not defined');
    //   }

    //   let decodedUser;
    //   try {
    //     decodedUser = jwt.verify(token, jwtSecret) as {userId: string};
    //   } catch (error) {
    //     throw new Error('Unauthorized');
    //   }
    //   const userId = decodedUser?.userId;

    //   if (!userId) {
    //     throw new Error('Unauthorized');
    //   }
    //   const foundUser = await User.findOne({ _id: userId});

    //   if (!foundUser) {
    //   throw new Error('Cannot find user');
    //   }

    //   return foundUser;
    // },
  },

  Mutation: {

    // This mutation creates a new user
    addUser: async (_: any, { input }: {input: UserInput}) => {
      const user = await User.create(input);

      if (!user) {
        throw new Error('Error while creating user');
      }
      const token = signToken(user._id as string, user.username as string, user.email as string);
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

      const token = signToken(user._id as string, user.username as string, user.email as string);
      return { token, user };
    },

    // This should save a book to the user's book list
    saveBook: async (_: any, { book }: { book: BookInput }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    
      return updatedUser;
    },

    // This mutation should delete a book from the user's book list
    removeBook: async (_: any, { bookId }: { bookId: BookInput }, context: any) => {
    
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
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
