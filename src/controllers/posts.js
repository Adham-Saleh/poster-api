const Post = require("../models/posts");
const User = require("../models/users");
const handleResponse = require("../helper/response");
const getUser = require("../helper/user");

const getPosts = async function (req, res) {
  try {
    const posts = await Post.findAll({
      include: { model: User, as: "user" },
      attributes: { exclude: "userId" },
    });
    handleResponse(res, 200, "Operation done successfully", posts);
  } catch (err) {
    handleResponse(res, 400, err.message);
  }
};

const createPost = async function (req, res) {
  const { content, media, isPublic = true, likes } = req.body;
  const token = req.cookies.token;
  try {
    const user = await getUser(token);
    if (!user) handleResponse(res, 400, "Unauthorized");
    const post = await Post.create({
      content,
      media,
      isPublic,
      likes,
      userId: user.id,
    });
    handleResponse(res, 200, "Operation done successfully", post);
  } catch (err) {
    handleResponse(res, 400, err.message);
  }
};

const deletePost = async function (req, res) {
  const token = req.cookies.token;
  const { id } = req.params;
  try {
    const currentUser = await getUser(token);
    const post = await Post.findByPk(id);

    if (!(post.userId === currentUser.id))
      handleResponse(res, 400, "Permission denied");

    await post.destroy();
    handleResponse(res, 200, "Operation done successfully");
  } catch (err) {
    handleResponse(res, 400, err.message);
  }
};

const getPostsByUserId = async function (req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) handleResponse(res, 404, "User does not exist");
    const posts = await Post.findAll({
      where: { userId },
      attributes: { exclude: "userId" },
    });
    handleResponse(res, 200, "Operation done successfully", posts);
  } catch (err) {
    handleResponse(res, 400, err.message);
  }
};

const getPostById = async function (req, res) {
  const { postId } = req.params;
  try {
    const post = await Post.findByPk(postId, {
      include: { model: User, as: "user" },
      attributes: { exclude: "userId" },
    });
    if (!post) handleResponse(res, 404, "Post not found");
    handleResponse(res, 200, "Operation done successfully", post);
  } catch (err) {
    handleResponse(res, 400, err.message);
  }
};

const updatePost = async function (req, res) {
  const token = req.cookies.token;
  const { id } = req.params;
  const { content, media, isPublic } = req.body;
  try {
    const currentUser = await getUser(token);
    const post = await Post.findByPk(id);
    if (!post) handleResponse(res, 404, "Post does not exist");
    if (currentUser.id !== post.userId)
      handleResponse(res, 400, "Permission denied");
    const updatedPost = await post.update({ content, media, isPublic });
    handleResponse(res, 200, "Operation done successfully", updatedPost);
  } catch (err) {
    handleResponse(res, 404, err.message);
  }
};

const likePost = async function (req, res) {};

const disLikePost = async function (req, res) {};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  getPostsByUserId,
  getPostById,
  updatePost,
};
