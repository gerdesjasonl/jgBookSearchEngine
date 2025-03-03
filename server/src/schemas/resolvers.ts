import { User } from '../models/User';

// TODO: Add a comment describing the functionality of this expression
// A query awaits for the search and return of entry in users db.
const resolvers = {
  Query: {
    users: async () => {
      // TODO: Add a comment describing the functionality of this statement
      return await User.find({});
    },
  },
};

export default resolvers;
