const UsersModel = require('../../src/graphql/models/users.modelgql');

const clearDB = async() => {
  await UsersModel.deleteMany();
};

module.exports = clearDB;
