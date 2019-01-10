/**
 * Movies resolvers
 * @type {{getAllMovies, getMovieInReceivedIdList}|*}
 */
const moviesServices = require('../services/movies.services');

const moviesResolvers = {
  Query: {
    // Get all movies
    movies: (parent, args) => moviesServices.getAllMovies(args.first, args.offset),
  },
};

module.exports = moviesResolvers;
