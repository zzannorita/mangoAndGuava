const axios = require("axios");

const refreshKakaoToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: "YOUR_KAKAO_REST_API_KEY", // 카카오 REST API 키
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token; // 새로 발급된 액세스 토큰 반환
  } catch (error) {
    console.error("리프레시 토큰으로 액세스 토큰 갱신 실패:", error.message);
    throw new Error("Failed to refresh token");
  }
};

module.exports = {
  refreshKakaoToken,
};
