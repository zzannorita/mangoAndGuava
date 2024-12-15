const mysql = require("mysql2"); // MySQL2 모듈 불러오기
const db = require("../config/dbConfig");

const getShopInfo = async (userId) => {
  const escapeedUserId = mysql.escape(String(userId));
  const query = `SELECT * FROM shop WHERE userId = ${escapeedUserId}`;
  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getShopCommentData = async (userId) => {
  const escapedUserId = mysql.escape(String(userId));
  const query = `SELECT 
    shopcomment.*, 
    product.productName
FROM 
    shopcomment
JOIN 
    product 
ON 
    shopcomment.purchasedProductId = product.productId
WHERE 
    shopcomment.shopOwnerUserId = ${escapedUserId}`;

  try {
    const [comments] = await db.execute(query);
    const commentsWithUserData = await Promise.all(
      comments.map(async (comment) => {
        const userQuery = `SELECT * FROM user WHERE userId = ?`;
        const [userRows] = await db.execute(userQuery, [comment.commentUserId]);

        if (userRows.length > 0) {
          comment.userInfo = userRows[0];
        }

        return comment;
      })
    );
    return commentsWithUserData;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getShopAvg = async (userId) => {
  const query = `SELECT AVG(avg) AS average_avg
  FROM shopcomment
  WHERE shopOwnerUserId = ?`;

  try {
    const [rows] = await db.execute(query, [parseInt(userId, 10)]);

    const averageAvg = rows[0].average_avg;
    return averageAvg;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addProduct = async (productData) => {
  const {
    userId,
    productImage,
    productName,
    productCategory,
    productPrice,
    productInfo,
    productState,
    tradingMethod,
    isTrade,
    isShippingFee,
    tradingAddress,
  } = productData;
  const tradeState = "판매중";

  const productCreatedDate = new Date();

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction(); // 아래 쿼리는 하나의 트랜잭션
    const insertProductQuery = `
      INSERT INTO product (
        userId,
        productName,
        productCategory,
        productPrice,
        productInfo,
        productState,
        tradingMethod,
        tradingAddress,
        isTrade,
        productCreatedDate,
        isShippingFee,
        tradeState
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [productResult] = await connection.execute(insertProductQuery, [
      userId,
      productName,
      productCategory,
      productPrice,
      productInfo,
      productState,
      tradingMethod,
      tradingAddress,
      isTrade,
      productCreatedDate,
      isShippingFee,
      tradeState,
    ]);

    const productId = productResult.insertId;

    const insertImageQuery = `
      INSERT INTO productImage (
        productId,
        productImage
      ) VALUES (?, ?)
    `;

    for (const image of productImage) {
      //이미지가 여러장이므로 for문을 통해.
      await connection.execute(insertImageQuery, [productId, image]);
    }

    await connection.commit(); // 잘 수행 됐으면 커밋

    return { productId };
  } catch (error) {
    await connection.rollback(); // 에러나오면 롤백 어떤 과정도 실행 안함
    console.log(error);
    throw error;
  } finally {
    connection.release();
  }
};

const updateProductByProductId = async (
  productId,
  updateData,
  userId,
  productImage
) => {
  delete updateData.imageOrder;
  delete updateData.images;
  const setUpdateData = Object.keys(updateData)
    .map((key) => `${key} = ?`) // `key = ?` 형식으로 변환
    .join(", "); // 쉼표로 결합
  console.log(setUpdateData);
  const values = [
    ...Object.values(updateData),
    parseInt(productId),
    String(userId),
  ];
  console.log(values);

  const escapedProductId = mysql.escape(parseInt(productId));

  const query = `
    UPDATE product 
    SET ${setUpdateData}, productUpdatedDate = NOW() 
    WHERE productId = ? AND userId = ?`;

  const query2 = `
  DELETE FROM productimage
  WHERE productId = ${escapedProductId};
`;

  const insertImageQuery = `
      INSERT INTO productimage (
        productId,
        productImage
      ) VALUES (${escapedProductId}, ?)
    `;

  console.log(query);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction(); // 아래 쿼리는 하나의 트랜잭션

    const [productResult] = await connection.execute(query, values);

    const [imageDeleteResult] = await connection.execute(query2);

    for (const image of productImage) {
      //이미지가 여러장이므로 for문을 통해.
      await connection.execute(insertImageQuery, [image]);
    }

    await connection.commit(); // 잘 수행 됐으면 커밋

    return { productId };
  } catch (error) {
    await connection.rollback(); // 에러나오면 롤백 어떤 과정도 실행 안함
    console.log(error);
    throw error;
  } finally {
    connection.release();
  }
};

const addShopUser = async (userId) => {
  console.log(userId);
  const query = `INSERT INTO shop (userId) VALUES (${parseInt(userId, 10)})`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const updateShopInfo = async (userId, info) => {
  const escapedUserId = mysql.escape(String(userId));
  const escapedInfo = mysql.escape(info);
  const query = `UPDATE shop SET shopInfo = ${escapedInfo} WHERE userId = ${escapedUserId}`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addBookmark = async (userId, bookmarkUserId) => {
  const escapedUserId = mysql.escape(userId);
  const escapedBookmarkUserId = mysql.escape(bookmarkUserId);
  const query = `INSERT INTO shopbookmark (userId, bookmarkUserId) VALUES (${escapedUserId}, ${escapedBookmarkUserId})`;

  try {
    const [rows] = await db.execute(query);
    console.log(rows);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addShopComment = async (commentData) => {
  const escapedShopOwnerUserId = mysql.escape(commentData.shopOwnerUserId);
  const escapedComment = mysql.escape(commentData.comment);
  const escapedAvg = mysql.escape(parseFloat(commentData.avg));
  const escapedCommentUserId = mysql.escape(commentData.commentUserId);
  const escapedPurchasedProductId = mysql.escape(
    parseInt(commentData.purchasedProductId)
  );
  const insertCommentQuery = `
  INSERT INTO shopcomment (shopOwnerUserId, comment, avg, commentUserId, purchasedProductId) 
  VALUES (${escapedShopOwnerUserId}, ${escapedComment}, ${escapedAvg}, ${escapedCommentUserId}, ${escapedPurchasedProductId});
  `;

  const updateShopAvgQuery = `
  UPDATE shop AS s
  JOIN (
    SELECT shopOwnerUserId, AVG(avg) AS avgScore
    FROM shopComment
    WHERE shopOwnerUserId = ${escapedShopOwnerUserId}
    GROUP BY shopOwnerUserId
  ) AS sc
  ON s.userId = sc.shopOwnerUserId
  SET s.shopAvg = sc.avgScore;
  `;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction(); // 트랜잭션 시작
    await connection.execute(insertCommentQuery);
    await connection.execute(updateShopAvgQuery);
    await connection.commit();
    console.log("댓글 추가 및 평점 업데이트 성공");
  } catch (error) {
    await connection.rollback(); // 오류 발생 시 롤백
    console.error("댓글 추가 및 평점 업데이트 실패:", error.message);
    throw new Error("Database query error: " + error.message);
  } finally {
    connection.release(); // 연결 해제
  }
};

const getBookmarkUser = async (userId) => {
  const escapedUserId = mysql.escape(userId);
  const query = `
      SELECT bookmarkUserId
      FROM shopbookmark
      WHERE userId = ${escapedUserId};
    `;

  try {
    const [rows] = await db.execute(query);
    // bookmarkUserId 배열 반환
    return rows.map((row) => row.bookmarkUserId);
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getUsersByIds = async (bookmarkUserIds) => {
  // bookmarkUserIds가 비어 있으면 빈 배열 반환
  if (bookmarkUserIds.length === 0) {
    return [];
  }

  const query = `
    SELECT *
    FROM user
    WHERE userId IN (${bookmarkUserIds.map(() => "?").join(",")});
  `;

  try {
    const [rows] = await db.execute(query, bookmarkUserIds);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

module.exports = {
  getShopInfo,
  addProduct,
  addShopUser,
  updateShopInfo,
  addBookmark,
  addShopComment,
  getShopCommentData,
  getShopAvg,
  getBookmarkUser,
  getUsersByIds,
  getBookmarkUser,
  getUsersByIds,
  updateProductByProductId,
};
