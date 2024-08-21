const db = require("../config/dbConfig");

const getShopInfo = async (userId) => {
  const query = `SELECT * FROM shop WHERE userId = ${parseInt(userId, 10)}`;
  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getShopCommentData = async (userId) => {
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
    shopcomment.shopOwnerUserId = ?`;

  try {
    const [comments] = await db.execute(query, [parseInt(userId, 10)]);
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
  } = productData;
  const tradeState = "판매중";

  const productCreatedDate = new Date();
  const tradingAddress = "123-123-123-123";

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
  const query = `UPDATE shop SET shopInfo = '${info}' WHERE userId = ${userId}`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addBookmark = async (userId, bookmarkUserId) => {
  // const intUserId = parseInt(userId, 10);
  // const intBookmarkUserId = parseInt(bookmarkUserId, 10);
  // 혹시 나중에 인트형으로 변환해서 넣어야하면 .. 아래 쿼리 변수 변경하기
  const query = `INSERT INTO shopbookmark (userId, bookmarkUserId) VALUES (${userId}, ${bookmarkUserId})`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const addShopComment = async (commentData) => {
  const query = `INSERT INTO shopcomment (shopOwnerUserId, commentUserId, comment, avg) VALUES (${parseInt(
    commentData.shopOwnerUserId,
    10
  )}, ${parseInt(commentData.commentUserId, 10)}, '${
    commentData.comment
  }', ${parseFloat(commentData.avg)})`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getBookmarkUser = async (userId) => {
  const query = `
      SELECT bookmarkUserId
      FROM shopbookmark
      WHERE userId = ${parseInt(userId, 10)};
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
};
