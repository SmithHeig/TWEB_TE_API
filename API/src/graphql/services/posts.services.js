const mongoose = require('mongoose');
const PostsModel = require('../models/posts.modelgql');

function getAllPostsOfUser(userId, { limit = 30, page = 0 } = {}) {
  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return PostsModel.find({ userId })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

function addPostOfUser(post) {
  post.publicationDate = Date.now();

  // on enregistre le nouveau post dans la base de données
  return new PostsModel(post).save();
}

async function deletePostOfUser(postId, userId) {
  const post = await PostsModel.findById(postId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Received userId is invalid!');
  }
  if (post.userId.toString() !== userId) {
    throw new Error('  You can\'t modify information of another user than yourself!');
  }

  return PostsModel.findByIdAndRemove(postId);
}

module.exports = {
  getAllPostsOfUser,
  addPostOfUser,
  deletePostOfUser
};
