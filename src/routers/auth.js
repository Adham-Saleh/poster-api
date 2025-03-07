const { Router } = require("express");
const controller = require("../controllers/auth");
const router = Router();

router.post("/login", controller.login);
router.get("/me", controller.getUser);

module.exports = router;
