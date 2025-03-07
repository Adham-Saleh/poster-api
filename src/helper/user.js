const handleResponse = require("./response");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const resetUser = function (res) {
  res.clearCookie("token");
  handleResponse(res, 404, "User not found");
};

const getUser = async function (token) {
  const decoded = jwt.verify(token, "hello");
  const user = await User.findByPk(decoded.id);
  return user;
};

module.exports = getUser;
