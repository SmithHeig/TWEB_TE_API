const UsersModel = require('../../src/graphql/models/users.modelgql');
const PostsModel = require('../../src/graphql/models/movies.modelgql');

const clearDB = async() => {
  await UsersModel.deleteMany();
  await PostsModel.deleteMany();
};

module.exports = clearDB;
