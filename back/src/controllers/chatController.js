const axios = require("axios");
const chatDao = require("../daos/chatDao");

//상품 페이지에서 상대방에게 채팅 요청 하는경우
const handleChatAndProduct = async (req, res) => {
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

    const userData = userResponse.data;
    const buyerUserId = userData.id;
    const productId = req.body.productId;
    const sellerId = req.body.userId;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

const getMyChatList = async (req, res) => {
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

    const userData = userResponse.data;
    const userId = userData.id;

    const chatList = await chatDao.getMyChatList(userId);

    return res.json({
      code: "SUCCESS_SEARCH_CHATLIST",
      data: chatList,
    });
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

const getChatEach = async (req, res) => {
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

    const userData = userResponse.data;
    const userId = userData.id;

    const room_id = req.query.roomId;

    const chatEach = await chatDao.getChatEachRoomId(room_id);

    return res.json({
      code: "SUCCESS_SEARCH_CHATLIST",
      data: chatEach,
    });
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

module.exports = {
  handleChatAndProduct,
  getMyChatList,
  getChatEach,
};
