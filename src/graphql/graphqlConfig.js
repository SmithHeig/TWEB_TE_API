const merge = require('lodash/merge');
const path = require('path');
const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const User = require('./resolvers/users.resolvers');
const TokenValidationEmail = require('./resolvers/tokens.resolvers');
const Movies = require('./resolvers/movies.resolvers');


const resolvers = merge(
  User,
  TokenValidationEmail,
  Movies
);

const typesArray = fileLoader(path.join(__dirname, './schemas'));
const schema = mergeTypes(typesArray, { all: true });

module.exports = {
  resolvers,
  schema
};
