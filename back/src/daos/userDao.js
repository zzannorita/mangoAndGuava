// src/daos/userDao.js
//userDao.js에서 데이터베이스와의 상호작용을 담당합니다.
// 예를 들어, 유저 정보를 데이터베이스에 저장하거나 검색하는 기능을 구현합니다.
const e = require("express");
const db = require("../config/dbConfig");
const mysql = require("mysql2");

const getUserById = async (userId) => {
  console.log("1");
  const query = "SELECT * FROM user WHERE userId = ?";
  console.log("받은값", userId);
  try {
    const [rows] = await db.execute(query, [parseInt(userId, 10)]);
    console.log("2");
    if (rows.length > 0) {
      console.log("3");
      const user = rows[0];
      console.log("4");
      // 프로필 이미지 URL 생성
      if (user.profileImage !== null) {
        const imageUrl = `http://localhost:3001/profileImage/${user.profileImage}`;
        console.log("5");
        // user 객체에 imageUrl 추가
        user.imageUrl = imageUrl;
        console.log("6");
      }
      console.log("7");
      return user;
    } else {
      console.log("8");
      return null; // 유저가 존재하지 않는 경우
    }
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }

  // return rows[0];
};

const addUser = async (user) => {
  const query = `INSERT INTO user (userId, nickname, email, createdAt) VALUES (${parseInt(
    user.userId,
    10
  )}, '${user.nickname}', '${user.email}', '${user.createdAt}')`;

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
  const userId = userData.userId;
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

module.exports = {
  getUserById,
  addUser,
  updateUserInfo,
  updateProfileImage,
};
