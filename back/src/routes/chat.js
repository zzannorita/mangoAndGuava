const express = require("express");
const router = express.Router();
const axios = require("axios");
const chatController = require("../controllers/chatController");

//채팅 처리
router.post("/chat-product", chatController.handleChatAndProduct);
router.get("/chat-my", chatController.getMyChatList);
router.get("/chat-each", chatController.getChatEach);

module.exports = router;
