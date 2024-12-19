// src/daos/userDao.js
//userDao.js에서 데이터베이스와의 상호작용을 담당합니다.
// 예를 들어, 유저 정보를 데이터베이스에 저장하거나 검색하는 기능을 구현합니다.
const e = require("express");
const db = require("../config/dbConfig");
const mysql = require("mysql2");

const getUserById = async (userId) => {
  const escapedUserId = mysql.escape(userId);
  const query = `SELECT userId, nickname, email, address, createdAt, profileImage, account FROM user WHERE userId = ${escapedUserId}`;
  try {
    const [rows] = await db.execute(query);
    if (rows.length > 0) {
      const user = rows[0];
      // 프로필 이미지 URL 생성
      if (user.profileImage !== null) {
        const imageUrl = `http://localhost:3001/profileImage/${user.profileImage}`;
        // user 객체에 imageUrl 추가
        user.profileImage = imageUrl;
      }
      return user;
    } else {
      return null; // 유저가 존재하지 않는 경우
    }
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }

  // return rows[0];
};

const getRefreshToken = async (userId) => {
  const escapedUserId = mysql.escape(userId);
  const query = `SELECT refreshToken FROM user WHERE userId = ${escapedUserId}`;

  try {
    const [rows] = await db.execute(query);
    const refreshToken = rows[0].refreshToken;
    return refreshToken;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addUser = async (user) => {
  const query = `INSERT INTO user (userId, nickname, email, createdAt, refreshToken) VALUES 
  (${user.userId}, '${user.nickname}', '${user.email}', '${user.createdAt}', '${user.refreshToken}')`;

  try {
    await db.execute(query);
  } catch (error) {
    console.error("addUser Query Error", error);
  }
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

const updateProfileImage = async (userData) => {
  const userId = String(userData.userId);
  const profileImage = userData.profileImage;
  const query = `UPDATE user
SET profileImage = ?
WHERE userId = ?`;
  try {
    const [rows] = await db.execute(query, [profileImage[0], userId]);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addRefreshToken = async (userId, refreshToken) => {
  const escapedUserId = mysql.escape(String(userId));
  const escapedRefreshToken = mysql.escape(refreshToken);
  const checkRefreshTokenQuery = `
  SELECT refreshToken 
  FROM user 
  WHERE userId = ${escapedUserId}
  `;

  const updateRefreshTokenQuery = `
  UPDATE user SET refreshToken = ${escapedRefreshToken} 
  WHERE userId = ${escapedUserId}
  `;

  try {
    const [checkRefreshToken] = await db.execute(checkRefreshTokenQuery);
    console.log(checkRefreshToken);
    if (checkRefreshToken[0].refreshToken === null) {
      //리프레시 토큰에 값이 없는 경우
      await db.execute(updateRefreshTokenQuery);
    } else {
      if (checkRefreshToken[0].refreshToken === refreshToken) {
        //리프레시 토큰 기존에 존재했지만 새 리프레시 토큰과 같은경우
      } else {
        //리프레시 토큰 기존에 존재했지만 새 리프레시 토큰과 다른경우
        await db.execute(updateRefreshTokenQuery);
      }
    }
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

module.exports = {
  getUserById,
  addUser,
  updateUserInfo,
  updateProfileImage,
  addRefreshToken,
  getRefreshToken,
};
