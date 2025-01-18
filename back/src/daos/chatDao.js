const mysql = require("mysql2");
const db = require("../config/dbConfig");

//현재 나의 채팅 목록 리스트를 검색하는 함수
const getMyChatList = async (userId) => {
  const escapedUserId = mysql.escape(userId);
  const query = `
    SELECT 
        c1.room_id,
        CASE 
            WHEN c1.user_from = ${escapedUserId} THEN c1.user_to
            ELSE c1.user_from
        END AS other_user,
        c1.message AS recent_message,
        c1.created_at AS recent_time
    FROM chat c1
    INNER JOIN (
        SELECT room_id, MAX(created_at) AS recent_time
        FROM chat
        WHERE user_from = ${escapedUserId} OR user_to = ${escapedUserId}
        GROUP BY room_id
    ) c2 ON c1.room_id = c2.room_id AND c1.created_at = c2.recent_time
    ORDER BY c1.created_at DESC;
    `;
  try {
    const [rows] = await db.execute(query);
    // 결과 반환
    return rows;
  } catch (error) {
    console.error("Error fetching chat list:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const getChatEachRoomId = async (room_id) => {
  const escapedRoom_id = mysql.escape(room_id);
  const query = `SELECT * 
  FROM chat 
  WHERE room_id = ${escapedRoom_id} 
  ORDER BY created_at ASC`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching chat each:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const insertChat = async (chatData) => {
  const {
    room_id: roomId,
    user_from: userFrom,
    user_to: userTo,
    message: content,
  } = chatData;
  const escapedRoomId = mysql.escape(roomId);
  const escapedUserFrom = mysql.escape(String(userFrom));
  const escapedUserTo = mysql.escape(String(userTo));
  const escapedContent = mysql.escape(content);
  const insertQuery = `INSERT INTO chat (room_id, user_from, user_to, message) VALUES (${escapedRoomId}, ${escapedUserFrom}, ${escapedUserTo}, ${escapedContent})`;

  try {
    const [rows] = await db.execute(insertQuery);
    return rows;
  } catch (error) {
    console.error("Error fetching chat each:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const getNumberOfChat = async (productId) => {
  const escapedProductId = mysql.escape(productId);

  const query = `SELECT COUNT(DISTINCT room_id) AS count
FROM chat
WHERE SUBSTRING_INDEX(room_id, '-', -1) = ${escapedProductId};`;

  try {
    const [rows] = await db.execute(insertQuery);
    return rows;
  } catch (error) {
    console.error("Error fetching chat each:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

module.exports = {
  getMyChatList,
  getChatEachRoomId,
  insertChat,
  getNumberOfChat,
};
