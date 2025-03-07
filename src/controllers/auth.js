const User = require("../models/users");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const handleResponse = require("../helper/response");


const login = async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return handleResponse(res, 404, "User not found");
    }

    if (!(user.toJSON().password === password))
      return handleResponse(res, 404, "Wrong email or password");

    const token = jwt.sign(user.toJSON(), "hello", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    return handleResponse(res, 200, "Operation done successfully", {
      ...user.toJSON(),
      password: undefined,
      token,
    });
  } catch (err) {
    return handleResponse(res, 404, err.message);
  }
};

const getUser = async function (req, res) {
  const token = req.cookies.token;
  if (!token) handleResponse(res, 401, "Unauthorized");
  try {
    const decoded = jwt.verify(token, "hello");
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return handleResponse(res, 404, "User not found");
    }
    return handleResponse(res, 200, "Operation done successfully", {
      ...user.toJSON(),
      password: undefined,
    });
  } catch (err) {
    return handleResponse(res, 404, err.message);
  }
};

module.exports = {
  login,
  getUser,
};
