const User = require("../models/users");
const handleResponse = require("../helper/response");

const getAllUsers = async function (req, res, next) {
  try {
    const users = await User.findAll();
    return handleResponse(
      res,
      200,
      "Operation done successfully",
      users.map((user) => ({ ...user.toJSON(), password: undefined }))
    );
  } catch (err) {
    return handleResponse(res, 400, err.message);
  }
};

const getUserById = async function (req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return handleResponse(res, 404, "User not found");
    return handleResponse(res, 200, "Operation done successfully", user);
  } catch (err) {
    return handleResponse(res, 400, err.message);
  }
};

const deleteUser = async function (req, res) {
  const { id } = req.params;
  try {
    const user = await User.destroy({ where: { id } });
    return handleResponse(res, 500, "Operation done successfully", undefined);
  } catch (err) {
    return handleResponse(res, 404, err.message);
  }
};

const createUser = async (req, res, next) => {
  const { firstName, lastName, fullName, email, password } = req.body;
  try {
    const user = await User.create({
      firstName,
      lastName,
      fullName,
      email,
      password,
    });
    return handleResponse(res, 200, "Operation done successfully", {
      ...user.toJSON(),
      password: undefined,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  createUser,
};
