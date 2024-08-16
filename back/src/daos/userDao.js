// src/daos/userDao.js
//userDao.js에서 데이터베이스와의 상호작용을 담당합니다.
// 예를 들어, 유저 정보를 데이터베이스에 저장하거나 검색하는 기능을 구현합니다.
const db = require("../config/dbConfig");
const mysql = require("mysql2");

const getUserById = async (userId) => {
  const query = "SELECT * FROM user WHERE userId = ?";
  const [rows] = await db.execute(query, [userId]);
  return rows[0];
};

const addUser = async (user) => {
  const query =
    "INSERT INTO user (userId, nickname, email, createdAt) VALUES (?, ?, ?, ?)";
  await db.execute(query, [
    user.userId,
    user.nickname,
    user.email,
    user.createdAt,
  ]);
};

const updateUserInfo = async (userId, nickname, address, account) => {
  let queryData = [];

  if (nickname !== null && nickname !== undefined) {
    queryData.push(`nickname = ${mysql.escape(nickname)}`);
  }

  if (address !== null && address !== undefined) {
    queryData.push(`address = ${mysql.escape(address)}`);
  }

  if (account !== null && account !== undefined) {
    queryData.push(`account = ${mysql.escape(account)}`);
  }

  // queryData 배열이 비어 있지 않을 경우에만 쿼리를 실행
  if (queryData.length > 0) {
    const query = `UPDATE user SET ${queryData.join(
      ", "
    )} WHERE userId = ${mysql.escape(userId)}`;

    try {
      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      throw new Error("Database query error: " + error.message);
    }
  } else {
    throw new Error("No fields to update.");
  }
};

module.exports = {
  getUserById,
  addUser,
  updateUserInfo,
};
