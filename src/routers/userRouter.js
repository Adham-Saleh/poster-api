const { Router } = require("express");
const controller = require("../controllers/users");
const router = Router();

router.get("/", controller.getAllUsers);
router.post("/", controller.createUser);
router.get("/:id", controller.getUserById);
router.delete("/:id", controller.deleteUser);

module.exports = router;
