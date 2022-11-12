// One file defining all routes required for sending and receiving messages


const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;