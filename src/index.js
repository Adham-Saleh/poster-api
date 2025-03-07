const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./models/index");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/posts");
const cookieParser = require("cookie-parser");

dotenv.config();
port = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(port, async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log("listening on port " + port);
});
