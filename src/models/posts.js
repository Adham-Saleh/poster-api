const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./users");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "posts",
  }
);

Post.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" }); // Each post belongs to a user

module.exports = Post;
