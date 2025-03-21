const { Router } = require("express");
const controller = require("../controllers/posts");
const router = Router();

router.get("/", controller.getPosts);
router.get("/user/:userId", controller.getPostsByUserId);
router.get("/:postId", controller.getPostById);
router.post("/", controller.createPost);
router.post("/like/:id", controller.toggleLike);
router.delete("/:id", controller.deletePost);
router.put("/:id", controller.updatePost);

module.exports = router;
