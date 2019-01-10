const MoviesModel = require('../models/movies.modelgql');

function getAllMovies() {
  return MoviesModel.find()
    .sort({ _id: 1 });
}

module.exports = {
  getAllMovies,
};
