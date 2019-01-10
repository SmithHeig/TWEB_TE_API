const { isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const usersServices = require('../services/users.services');
const moviesServices = require('../services/movies.services');
const usersResolvers = {
  Query: {
    users: (parent, args, context) => usersServices.getUsers(),

    user: (parent, args, context) => usersServices.getUserById(args.userId),

    me: (parent, args, context) => usersServices.getUserByToken(args.token),

    checkIfEmailIsAvailable: (parent, args, context) => usersServices.isEmailAvailable(args.email)
  },

  Mutation: {
    updateUser: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.user.id);
      return usersServices.updateUser(args.user);
    },

    deleteUser: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.userId);
      return usersServices.deleteUser(args.userId);
    },

    addMovieToWatchlist: (parent, args, context) => usersServices.addMovieToWatchlist(args.userId, args.movieId)
  },
  User: {
    watchlist: (parent, args, context) => moviesServices.getMovieInReceivedIdList(parent.watchlist)
  }
};
module.exports = usersResolvers;
