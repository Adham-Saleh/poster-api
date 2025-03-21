const { Router } = require("express");
const controller = require("../controllers/comments");
const router = Router();

router.get("/:id", controller.getCommentById);
router.get("/post/:postId", controller.getCommentsForSinglePost);
router.post("/:postId", controller.createComment);
router.delete("/:id", controller.deleteComment);

module.exports = router;
