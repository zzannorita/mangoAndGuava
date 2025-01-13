const axios = require("axios");
const alarmDao = require("../daos/alarmDao");

const getAlarmData = async (req, res) => {
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
    const alarmData = await alarmDao.getAlarm(userId);

    return res.status(200).json({
      code: "SUCCESS_GET_ALARM",
      alarmData,
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

module.exports = {
  getAlarmData,
};
