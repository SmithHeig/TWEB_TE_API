const UsersModel = require('../../src/graphql/models/users.modelgql');
const PostsModel = require('../../src/graphql/models/posts.modelgql');

const clearDB = async() => {
  await UsersModel.deleteMany();
  await PostsModel.deleteMany();
};

module.exports = clearDB;
