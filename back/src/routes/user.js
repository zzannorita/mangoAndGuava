// src/routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//카카오 로그인시
router.get("/auth/kakao/callback", userController.kakaoLogin);
router.get("/user-data", userController.getUserData);
router.post("/logout", userController.kakaoLogout);
router.patch(
  "/profile-image",
  userController.uploadImages,
  userController.uploadProfileImage
);
module.exports = router;
