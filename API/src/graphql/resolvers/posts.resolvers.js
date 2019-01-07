const { GraphQLDateTime } = require('graphql-iso-date');
const { isAuthenticatedAndIsYourself } = require('./authorization.resolvers');
const postsServices = require('../services/posts.services');
const usersServices = require('../services/users.services');

const postsResolvers = {
  Query: {
    postsOfUser: (parent, args, context) => postsServices.getAllPostsOfUser(args.userId)
  },

  Mutation: {
    addPostOfUser: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.post.userId, context.kind);
      return postsServices.addPostOfUser(args.post);
    },

    deletePostOfUser: async(parent, args, context) => {
      await isAuthenticatedAndIsYourself(context.id, args.userId, context.kind);
      return postsServices.deletePostOfUser(args.postId, args.userId);
    }
  },

  Post: {
    user: (parent, args, context) => usersServices.getUserById(parent.userId)
  },

  Date: GraphQLDateTime
};

module.exports = postsResolvers;
