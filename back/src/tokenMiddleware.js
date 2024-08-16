// const axios = require("axios");
// //백엔드 요청에 대해 항상 먼저 실행하는 함수
// // 왜 ? -> 매 인증 요청마다 액세스 토큰의 만료시
// //리프레시 토큰으로 액세스토큰 발급해줘야함.
// const tokenMiddleware = async (req, res, next) => {
//   const authorizationHeader = req.headers.authorization; //헤더 있나 체크용
//   const accessToken = req.headers.authorization?.split(" ")[1];

//   // Authorization 헤더가 없는 경우 다음 미들웨어로 넘어감
//   // 다음 미들웨어 없는경우 진행하던 api로
//   if (!authorizationHeader) {
//     return next();
//   }

//   if (!accessToken) {
//     return res.status(401).json({ message: "No access token provided" });
//   }

//   try {
//     // 토큰 검증
//     await axios.get("https://kapi.kakao.com/v2/user/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     next();
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       // 액세스 토큰 만료 시
//       try {
//         const newAccessToken = await refreshKakaoAccessToken(
//           req.user.refreshToken
//         );
//         req.headers.authorization = `Bearer ${newAccessToken}`;
//         next();
//       } catch (refreshError) {
//         return res
//           .status(401)
//           .json({ message: "Failed to refresh access token" });
//       }
//     } else {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }
// };

// // 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급 함수
// const refreshKakaoAccessToken = async (refreshToken) => {
//   const REST_API_KEY = process.env.KAKAO_REST_API_KEY;

//   try {
//     const response = await axios.post(
//       "https://kauth.kakao.com/oauth/token",
//       null,
//       {
//         params: {
//           grant_type: "refresh_token",
//           client_id: REST_API_KEY,
//           refresh_token: refreshToken,
//         },
//       }
//     );

//     return response.data.access_token;
//   } catch (error) {
//     throw new Error("Failed to refresh Kakao access token");
//   }
// };

// module.exports = tokenMiddleware;
