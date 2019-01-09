const connectionTokenServices = require('../services/connectionToken.services');

const tokenResolvers = {
  Mutation: {
    login: (parent, args, context) => connectionTokenServices.login(args.email, args.password),

    signUp: (parent, args, context) => connectionTokenServices.signUpAsUser(args.newUser)
  },

  Token: {
    token: (parent, args, context) => parent
  },

};
module.exports = tokenResolvers;
