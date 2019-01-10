const moviesServices = require('../services/movies.services');

const moviesResolvers = {
  Query: {
    movies: (parent, args, context) => moviesServices.getAllMovies()
  },
};

module.exports = moviesResolvers;
