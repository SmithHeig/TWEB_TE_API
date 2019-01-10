const moviesServices = require('../services/movies.services');

const moviesResolvers = {
  Query: {
    movies: (parent, args) => moviesServices.getAllMovies(args.first, args.offset),
  },
};

module.exports = moviesResolvers;
