import { GraphQLContext } from '../utils/context'  ;
import User from '../models/User.js';
import { signToken } from '../services/auth.js'

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
    me: async (_: any, { id, username }: { id?: string; username?: string}, context: GraphQLContext) => {
      if (!context.user && !id && !username) {
        throw new Error('Unauthorized');
      }
      const foundUser = await User.findOne({
        $or: [{ _id: id || context.user?._id }, { username }],
      });

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
      const user = await User.findOne({
        $or: [{ username: input.username }, { email: input.email }],
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
    saveBook: async (_: any, { book }: { book: BookInput }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Authentication required.');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    // This mutation should delete a book from the user's book list
    removeBook: async (_: any, { bookId }: { bookId: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Authentication required.');
      }

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
