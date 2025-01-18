const mysql = require("mysql2");
const db = require("../config/dbConfig");

const insertAlarm = async (alarmNoti) => {
  const {
    userTo: userId,
    userFrom: sendUserId,
    productName,
    content,
    chatContent,
    userFromNickname,
    roomId,
    type,
  } = alarmNoti;
  const extraData = {
    sendUserId,
    productName,
    chatContent,
    userFromNickname,
    roomId,
  };

  const escapedUserId = mysql.escape(userId);
  const escapedContent = mysql.escape(content);
  const escapedExtraData = mysql.escape(JSON.stringify(extraData));
  const escapedType = mysql.escape(type);

  const insertQuery = `INSERT INTO notifications (userId, type, content, extraData) VALUES (${escapedUserId},${escapedType},${escapedContent},${escapedExtraData})`;

  try {
    const [rows] = await db.execute(insertQuery);
    // 결과 반환
    return rows;
  } catch (error) {
    console.error("Error fetching chat list:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const getAlarm = async (userId) => {
  const escapedUserId = mysql.escape(userId);

  const selectQuery = `SELECT a.*
FROM notifications a
INNER JOIN (
    SELECT 
        extraData->>'$.roomId' AS roomId,
        MAX(createdAt) AS latestCreatedAt
    FROM notifications
    WHERE userId = ${escapedUserId}
    GROUP BY extraData->>'$.roomId'
) b ON a.extraData->>'$.roomId' = b.roomId 
AND a.createdAt = b.latestCreatedAt
AND a.userId = ${escapedUserId}
ORDER BY a.createdAt DESC;`;

  try {
    const [rows] = await db.execute(selectQuery);
    // 결과 반환
    return rows;
  } catch (error) {
    console.error("Error fetching chat list:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

module.exports = { insertAlarm, getAlarm };
