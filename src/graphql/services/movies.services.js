const mongoose = require('mongoose');
const MoviesModel = require('../models/movies.modelgql');

function getAllMovies(first, offset) {
  if (typeof first === 'number' && typeof offset === 'number') {
    return MoviesModel.find()
      .sort({ _id: 1 })
      .limit(first)
      .skip(offset);
  } else if (typeof first === 'number') {
    return MoviesModel.find()
      .sort({ _id: 1 })
      .limit(first);
  } else if (typeof offset === 'number') {
    return MoviesModel.find()
      .sort({ _id: 1 })
      .skip(offset);
  } else {
    return MoviesModel.find()
      .sort({ _id: 1 });
  }
}

function getMovieInReceivedIdList(list){
  return MoviesModel.find({ _id: { $in: list } }).sort({ _id: 1 });
}

module.exports = {
  getAllMovies,
  getMovieInReceivedIdList
};
