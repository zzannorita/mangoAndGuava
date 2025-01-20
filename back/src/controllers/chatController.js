const axios = require("axios");
const chatDao = require("../daos/chatDao");
const userDao = require("../daos/userDao");

//상품 페이지에서 상대방에게 채팅 요청 하는경우
const handleChatAndProduct = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "No access token provided", errorType: "NO_TOKEN" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    const buyerUserId = userData.id;
    const productId = req.body.productId;
    const sellerId = req.body.userId;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage =
        error.response.data.error === "invalid_token"
          ? { message: "Invalid access token", errorType: "INVALID_TOKEN" }
          : { message: "Token expired", errorType: "TOKEN_EXPIRED" };
      return res.status(401).json(errorMessage);
    }

    // 다른 에러 처리
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
};

const getMyChatList = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "No access token provided", errorType: "NO_TOKEN" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    const userId = userData.id;

    const chatList = await chatDao.getMyChatList(userId);
    const updatedChatList = []; // 업데이트된 chatList를 저장할 배열

    for (const chat of chatList) {
      const roomId = chat.room_id;
      const [userId1, userId2, productId] = roomId.split("-");

      let otherUserId;

      if (String(userId) !== String(userId1)) {
        otherUserId = userId1;
      } else {
        otherUserId = userId2;
      }
      const otherUser = await userDao.getUserById(otherUserId);
      const otherUserNickname = otherUser.nickname;
      const otherUserImg = otherUser.profileImage;

      const updatedChat = { ...chat, otherUserNickname, otherUserImg }; // 기존 chat 객체에 새로운 속성 추가

      updatedChatList.push(updatedChat);
    }

    return res.json({
      code: "SUCCESS_SEARCH_CHATLIST",
      data: updatedChatList,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage =
        error.response.data.error === "invalid_token"
          ? { message: "Invalid access token", errorType: "INVALID_TOKEN" }
          : { message: "Token expired", errorType: "TOKEN_EXPIRED" };
      return res.status(401).json(errorMessage);
    }

    // 다른 에러 처리
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
};

const getChatEach = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "No access token provided", errorType: "NO_TOKEN" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    const userId = userData.id;

    const room_id = req.query.roomId;

    const chatEach = await chatDao.getChatEachRoomId(room_id);

    return res.json({
      code: "SUCCESS_SEARCH_CHATLIST",
      data: chatEach,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage =
        error.response.data.error === "invalid_token"
          ? { message: "Invalid access token", errorType: "INVALID_TOKEN" }
          : { message: "Token expired", errorType: "TOKEN_EXPIRED" };
      return res.status(401).json(errorMessage);
    }

    // 다른 에러 처리
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
};

const getChatNumber = async (req, res) => {
  const productId = req.query.productId;

  try {
    const result = await chatDao.getNumberOfChat(productId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error! get chatNum" });
  }
};

module.exports = {
  handleChatAndProduct,
  getMyChatList,
  getChatEach,
  getChatNumber,
};
