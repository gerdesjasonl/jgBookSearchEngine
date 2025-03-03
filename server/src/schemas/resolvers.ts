import { GraphQLError } from 'graphql';

const resolvers = {
  Query: {
    getUserProfile: (_: any, __: any, context: { user?: any }) => {
      if (!context.user) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }
      return context.user;
    },
  },
};


export default resolvers;
