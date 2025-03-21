const Comment = require("../models/comments");
const Post = require("../models/posts");
const handleResponse = require("../helper/response");
const getUser = require("../helper/user");

const getCommentById = async function (req, res) {
  const { id } = req.params;
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) return handleResponse(res, 404, "Comment not found");
    return handleResponse(res, 200, "Operation done successfully", comment);
  } catch (err) {
    return handleResponse(res, 500, "Something went wrong");
  }
};

const getCommentsForSinglePost = async function (req, res) {
  const { postId } = req.params;
  try {
    const post = await Post.findByPk(postId);
    if (!post) return handleResponse(res, 404, "Post not found");
    const comments = await Comment.findAll({ where: { postId } });
    return handleResponse(res, 200, "Operation done successfully", comments);
  } catch (err) {
    handleResponse(res, 500, "Something went wrong");
  }
};

const createComment = async function (req, res) {
  const token = req.cookies.token;
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const user = await getUser(token);
    const createComment = await Comment.create({
      userId: user.id,
      postId,
      content,
    });
    return handleResponse(res, 200, "Operation done successfully");
  } catch (err) {
    return handleResponse(res, 500, "Something went wrong");
  }
};

const deleteComment = async function (req, res) {
  const { id } = req.params;
  try {
    const deleteComment = await Comment.destroy({ where: { id } });
    return handleResponse(res, 200, "Operation done successfully");
  } catch (err) {
    return handleResponse(res, 500, "Something went wrong");
  }
};

module.exports = {
  getCommentById,
  getCommentsForSinglePost,
  createComment,
  deleteComment,
};
