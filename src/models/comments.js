const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./users");
const Post = require("./posts");

const Comments = sequelize.define(
  "Comments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
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
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
  }
);

User.belongsToMany(Post, { through: Comments, foreignKey: "userId" });
Post.belongsToMany(User, { through: Comments, foreignKey: "postId" });

module.exports = Comments;
