/**
 * Resolvers for the Users
 */
const { isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const usersServices = require('../services/users.services');
const moviesServices = require('../services/movies.services');

const usersResolvers = {
  Query: {
    // get all users
    users: (parent, args, context) => usersServices.getUsers(),

    // get a user by id
    user: (parent, args, context) => usersServices.getUserById(args.userId),

    // get ourself
    me: (parent, args, context) => usersServices.getUserByToken(args.token),

    // check if the email is available
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

    addMovieToWatchlist: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.user.id);
      usersServices.addMovieToWatchlist(args.userId, args.movieId);
    }
  },
  User: {
    watchlist: (parent, args, context) => moviesServices.getMovieInReceivedIdList(parent.watchlist)
  }
};
module.exports = usersResolvers;
