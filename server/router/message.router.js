const express = require("express");
const router = express.Router();
const {getUsersForSidebar, sendMessage, getMessages} = require("../controller/message.controller");
const { protectedRoute } = require("../middleware/auth.middleware");

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/messages/:id", protectedRoute, getMessages);
router.post("/sendmessages/:id", protectedRoute, sendMessage);


module.exports = router;