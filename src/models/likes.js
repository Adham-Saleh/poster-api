const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./users");
const Post = require("./posts");

const Likes = sequelize.define(
  "Likes",
  {
    postId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "likes",
  }
);

User.belongsToMany(Post, { through: Likes, foreignKey: "userId" });
Post.belongsToMany(User, { through: Likes, foreignKey: "postId" });

module.exports = Likes;
