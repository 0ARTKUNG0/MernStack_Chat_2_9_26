const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { protectedRoute } = require("../middleware/auth.middleware");

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/signout", userController.signOut);
router.put("/update-profile", protectedRoute, userController.updateProfile);
router.get("/check-auth", protectedRoute, userController.checkAuth);
router.get("/users", protectedRoute, userController.getUsers);

module.exports = router;
