// src/controllers/userController.js
const axios = require("axios");
const userDao = require("../daos/userDao");
const shopDao = require("../daos/shopDao");
const multer = require("multer");
const path = require("path");

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profileImage/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// 업로드된 이미지를 처리하는 미들웨어
const uploadImages = upload.array("profileImage", 10); // 최대 10개의 이미지를 업로드

const kakaoLogin = async (req, res) => {
  const { code } = req.query;
  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  try {
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          grant_type: "authorization_code",
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token; //액세스 토큰
    const refreshToken = tokenResponse.data.refresh_token; //리프레시 토큰

    res.cookie("accessToken", accessToken, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS 사용 시 true
      sameSite: "Strict", // CSRF 방지
    });
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = userResponse.data.id;
    const nickname = userResponse.data.kakao_account.profile.nickname;
    const email = userResponse.data.kakao_account.email;
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const user = {
      userId,
      nickname,
      email,
      createdAt,
    };

    // 데이터베이스에서 사용자 정보 조회
    const existingUser = await userDao.getUserById(userId);
    if (!existingUser) {
      //새 사용자
      const addUser = await userDao.addUser(user);
      const addShopUser = await shopDao.addShopUser(userId);
      //이후 메인페이지가 아닌 설정페이지로 유도
      return res.redirect("http://localhost:3000/authCallBack?code=NEW_MEMBER");
    } else {
      return res.redirect(
        "http://localhost:3000/authCallBack?code=EXISTING_MEMBER"
      );
    }
  } catch (error) {
    console.error("Error during Kakao login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserData = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userAdditionalResponse = await userDao.getUserById(
      userResponse.data.id
    );
    const userData = userResponse.data;
    const userAdditionalData = userAdditionalResponse;
    const userId = userData.id;
    const nickname = userData.kakao_account.profile.nickname;
    const nickname2 = userAdditionalData.nickname;
    const email = userData.kakao_account.email;
    const address = userAdditionalData.address;
    const createdAt = userAdditionalData.createdAt;
    const profileImage = userAdditionalData.profileImage;
    const account = userAdditionalData.account;
    const userInfo = {
      userId,
      nickname,
      email,
      address,
      createdAt,
      profileImage,
      account,
      nickname2,
    };
    return res.json({ code: "SUCCESS_USERDATA", user: userInfo });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

const getOtherUserData = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const otherUserId = req.query.userId;
  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userAdditionalResponse = await userDao.getUserById(otherUserId);
    const userData = userResponse.data;
    const userAdditionalData = userAdditionalResponse;
    const userId = userData.id;
    const nickname = userData.kakao_account.profile.nickname;
    const nickname2 = userAdditionalData.nickname;
    const email = userData.kakao_account.email;
    const address = userAdditionalData.address;
    const createdAt = userAdditionalData.createdAt;
    const profileImage = userAdditionalData.profileImage;
    const account = userAdditionalData.account;
    const userInfo = {
      userId,
      nickname,
      email,
      address,
      createdAt,
      profileImage,
      account,
      nickname2,
    };
    return res.json({ code: "SUCCESS_USERDATA", user: userInfo });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

const kakaoLogout = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "No access token found" });
  }

  try {
    await axios.post("https://kapi.kakao.com/v1/user/logout", null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 로그아웃 완료 후 쿠키에서 액세스 토큰 제거
    res.clearCookie("accessToken");

    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error during Kakao logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadProfileImage = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id;
    // req.files를 통해 업로드된 파일 정보 접근
    const profileImage = req.files.map((file) => file.filename); // 파일 이름 배열
    const userData = { userId, profileImage };
    const updateProfileImage = await userDao.updateProfileImage(userData);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

module.exports = {
  kakaoLogin,
  getUserData,
  kakaoLogout,
  uploadProfileImage,
  uploadImages,
  getOtherUserData,
};
