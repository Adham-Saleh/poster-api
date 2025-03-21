const Post = require("../models/posts");
const User = require("../models/users");
const Likes = require("../models/likes");
const handleResponse = require("../helper/response");
const getUser = require("../helper/user");

const checkIfUserLikedAPost = async function (userId, postId) {
  const liked = await Likes.findOne({ where: { userId, postId } });
  if (liked) return true;
  return false;
};

const getPosts = async function (req, res) {
  const token = req.cookies.token;
  try {
    const posts = await Post.findAll({
      include: { model: User, as: "user" },
      attributes: { exclude: "userId" },
    });
    const user = await getUser(token);
    const flaggedPosts = await Promise.all(
      posts.map(async (post) => {
        const currentPost = post.toJSON();
        const liked = await checkIfUserLikedAPost(user.id, currentPost.id);
        return { ...currentPost, liked };
      })
    );
    handleResponse(res, 200, "Operation done successfully", flaggedPosts);
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
  const token = req.cookies.token;
  try {
    const post = await Post.findByPk(postId, {
      include: { model: User, as: "user" },
      attributes: { exclude: "userId" },
    });
    if (!post) return handleResponse(res, 404, "Post not found");
    const user = await getUser(token);
    const liked = await checkIfUserLikedAPost(user.id, post.id);

    handleResponse(res, 200, "Operation done successfully", {
      ...post.toJSON(),
      liked,
    });
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
    if (!post) return handleResponse(res, 404, "Post does not exist");
    if (currentUser.id !== post.userId)
      handleResponse(res, 400, "Permission denied");
    const updatedPost = await post.update({ content, media, isPublic });
    handleResponse(res, 200, "Operation done successfully", updatedPost);
  } catch (err) {
    handleResponse(res, 404, err.message);
  }
};

const toggleLike = async function (req, res) {
  const token = req.cookies.token;
  const { id } = req.params;
  try {
    const currentUser = await getUser(token);
    const post = await Post.findByPk(id);
    const liked = await checkIfUserLikedAPost(currentUser.id, post.id);
    if (!liked) {
      await Likes.create({ userId: currentUser.id, postId: id });
      await Post.increment({ likes: 1 }, { where: { id } });
    } else {
      await Likes.destroy({ where: { userId: currentUser.id, postId: id } });
      await Post.decrement({ likes: 1 }, { where: { id } });
    }
    return handleResponse(res, 200, "Operation done successfully");
  } catch (err) {
    handleResponse(res, 404, err.message);
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  getPostsByUserId,
  getPostById,
  updatePost,
  toggleLike,
};
