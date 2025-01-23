const axios = require("axios");
const express = require("express");
const router = express.Router();
const userDao = require("../daos/userDao");

const REST_API_KEY = "533d7762a1ee320813d03cb068e53ada";

router.post("/refresh-token", refreshKakaoToken);

async function refreshKakaoToken(req, res) {
  const userId = req.body.userId;
  try {
    const refreshToken = await userDao.getRefreshToken(userId);
    console.log(refreshToken);
    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: REST_API_KEY, // 카카오 REST API 키
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = response.data.access_token;
    return res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    console.error("리프레시 토큰으로 액세스 토큰 갱신 실패:", error.message);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
}

module.exports = router;
