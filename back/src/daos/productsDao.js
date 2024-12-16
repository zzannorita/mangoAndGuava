const mysql = require("mysql2"); // MySQL2 모듈 불러오기
const db = require("../config/dbConfig");
//userDao.js에서 데이터베이스와의 상호작용을 담당합니다.
//예를 들어, 유저 정보를 데이터베이스에 저장하거나 검색하는 기능을 구현합니다.

//대 수술 dao
const getProductsByFilter = async (filters) => {
  const {
    search,
    category,
    sort,
    page,
    perPage,
    tradeState,
    priceMin,
    priceMax,
    address,
  } = filters;
  const whereConditions = []; // WHERE 절에 들어갈 조건들을 저장
  const values = []; // 조건문에 들어갈 값들
  let order = ""; // 정렬 조건
  let offset = (page - 1) * perPage;
  let limit = perPage;

  // 1. 검색 필터링 (상품명 또는 상품정보에서 검색)
  //제목, 내용 필터
  if (search) {
    whereConditions.push(`(productName LIKE ? OR productInfo LIKE ?)`);
    values.push(`%${search}%`, `%${search}%`);
  }

  // 2. 카테고리 필터링
  if (category) {
    whereConditions.push("productCategory = ?");
    values.push(category);
  }

  // 3. 거래 상태 필터링
  //판매 완료 보기/안보기 이런거 필요하다해서...
  if (tradeState) {
    whereConditions.push("tradeState = ?");
    values.push(tradeState);
  }

  // 3.5. 가격 범위 필터링
  if (priceMin !== undefined && priceMax !== undefined) {
    whereConditions.push("productPrice BETWEEN ? AND ?");
    values.push(priceMin, priceMax);
  } else {
    if (priceMin !== undefined) {
      whereConditions.push("productPrice >= ?");
      values.push(priceMin);
    }
    if (priceMax !== undefined) {
      whereConditions.push("productPrice <= ?");
      values.push(priceMax);
    }
  }

  // 3.75. 주소 필터링
  if (address) {
    whereConditions.push("tradingAddress LIKE ?");
    values.push(`%${address}%`);
  }

  // 4. 정렬 조건
  switch (sort) {
    case "priceAsc":
      order = "ORDER BY productPrice ASC"; //저렴순 (오름차)
      break;
    case "priceDesc":
      order = "ORDER BY productPrice DESC"; //비싼순 (내림차)
      break;
    case "newest":
      order = "ORDER BY productCreatedDate DESC"; //최신순
      break;
    case "oldest":
      order = "ORDER BY productCreatedDate ASC"; //오래된순
      break;
    default:
      order = "ORDER BY productCreatedDate DESC"; // 기본적으로 최신순 정렬
      break;
  }

  // 5. WHERE 조건이 하나도 없다면 WHERE 절을 생략
  const whereClause = whereConditions.length
    ? "WHERE " + whereConditions.join(" AND ")
    : "";

  // 6. 상품 목록 조회 SQL 쿼리
  const query = `SELECT * FROM product ${whereClause} ${order} LIMIT ? OFFSET ?`;

  values.push(limit, offset); // LIMIT과 OFFSET 값을 추가 (맨 마지막에 추가해야함!)

  // 7. 전체 아이템 수 조회 (count)
  const countQuery = `
  SELECT COUNT(*) as totalCount FROM product
  ${whereClause};
  `;

  //이미지 때문에 아마 조인 안하고 트랜잭션으로 진행 할 것 같음.
  try {
    const [products] = await db.query(query, values); // 상품 목록

    // 11. 이미지 정보 조회
    const productIds = products.map((product) => product.productId);
    //8.이미지 조회 SQL 쿼리
    if (productIds.length > 0) {
      const imageQuery = `
        SELECT * FROM productImage
        WHERE productId IN (${productIds.join(",")});
      `;
      const [images] = await db.query(imageQuery);

      // 12. 각 상품에 이미지 추가
      products.forEach((product) => {
        product.images = images
          .filter((image) => image.productId === product.productId) // 해당 productId에 맞는 이미지 필터링
          .map((image) => {
            return {
              imageId: image.imageId,
              productId: image.productId,
              productImage: `http://localhost:3001/uploads/${image.productImage}`, // URL 경로 추가
            };
          });
      });
    }

    const [[countResult]] = await db.execute(
      countQuery,
      values.slice(0, values.length - 2)
    ); // 총 아이템 수
    const totalItems = countResult.totalCount;
    const totalPages = Math.ceil(totalItems / perPage);
    const returnData = { products, totalPages };
    return returnData;
  } catch (error) {
    console.log(error);
  }
};

const getProductsAll = async (limit, offset) => {
  console.log(limit, offset);
  const query = `
    SELECT
      p.*,
      pi.productImage
    FROM
      product p
    LEFT JOIN
      productimage pi
    ON
      p.productId = pi.productId
    ORDER BY
      p.productId DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  try {
    const [rows] = await db.execute(query);

    // 상품별로 이미지를 묶기 위한 객체
    const productsMap = {};

    rows.forEach((row) => {
      const productId = row.productId;

      if (!productsMap[productId]) {
        // 이미지 정보를 제외한 상품 정보
        const { productImage, ...productData } = row;
        productsMap[productId] = {
          ...productData,
          images: [],
        };
      }

      // 이미지가 있을 경우에만 추가
      if (row.productImage) {
        const imageUrl = `http://localhost:3001/uploads/${row.productImage}`;
        productsMap[productId].images.push(imageUrl);
      }
    });

    // 객체를 배열로 변환
    const products = Object.values(productsMap);

    return products;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getProductsByUserId = async (userId) => {
  const query = `
    SELECT
      p.*,
      pi.productImage
    FROM
      product p
    LEFT JOIN
      productimage pi
    ON
      p.productId = pi.productId
    WHERE
      p.userId = ?
    ORDER BY
      p.productId DESC
  `;
  try {
    const [rows] = await db.execute(query, [parseInt(userId, 10)]);

    // 상품별로 이미지를 묶기 위한 객체
    const productsMap = {};

    rows.forEach((row) => {
      const productId = row.productId;

      if (!productsMap[productId]) {
        // 이미지 정보를 제외한 상품 정보
        const { productImage, ...productData } = row;
        productsMap[productId] = {
          ...productData,
          images: [],
        };
      }

      // 이미지가 있을 경우에만 추가
      if (row.productImage) {
        const imageUrl = `http://localhost:3001/uploads/${row.productImage}`;
        productsMap[productId].images.push(imageUrl);
      }
    });

    // 객체를 배열로 변환
    const products = Object.values(productsMap);

    return products;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getProductsByPurchasedUserId = async (userId) => {
  const query = `
    SELECT
      p.*,
      pi.productImage
    FROM
      product p
    LEFT JOIN
      productimage pi
    ON
      p.productId = pi.productId
    WHERE
      p.buyerUserId = ?
    ORDER BY
      p.productId DESC
  `;
  try {
    const [rows] = await db.execute(query, [parseInt(userId, 10)]);

    // 상품별로 이미지를 묶기 위한 객체
    const productsMap = {};

    rows.forEach((row) => {
      const productId = row.productId;

      if (!productsMap[productId]) {
        // 이미지 정보를 제외한 상품 정보
        const { productImage, ...productData } = row;
        productsMap[productId] = {
          ...productData,
          images: [],
        };
      }

      // 이미지가 있을 경우에만 추가
      if (row.productImage) {
        const imageUrl = `http://localhost:3001/uploads/${row.productImage}`;
        productsMap[productId].images.push(imageUrl);
      }
    });

    // 객체를 배열로 변환
    const products = Object.values(productsMap);

    return products;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getBookmarkProductByUserId = async (userId) => {
  const escapedUserId = mysql.escape(userId);
  try {
    const bookmarkQuery = `
    SELECT productId 
    FROM productbookmark 
    WHERE userId = ?
  `;
    // Step 1: productbookmark 테이블에서 userId가 일치하는 productId들을 가져옴
    const [bookmarkRows] = await db.execute(bookmarkQuery, [escapedUserId]);

    // Step 2: 검색 결과가 없을 경우 빈 배열 반환
    if (bookmarkRows.length === 0) {
      return [];
    }

    // 검색된 productId들을 추출
    const productIds = bookmarkRows.map((row) => row.productId);

    // Step 3: productIds 배열을 사용하여 product 테이블에서 해당 상품들을 가져옴
    const productQuery = `
        SELECT
          p.*,
          pi.productImage
        FROM
          product p
        LEFT JOIN
          productimage pi
        ON
          p.productId = pi.productId
        WHERE
          p.productId IN (${productIds.join(",")})
        ORDER BY
          p.productId DESC;
      `;

    const [productRows] = await db.execute(productQuery);

    // 상품별로 이미지를 묶기 위한 객체
    const productsMap = {};

    productRows.forEach((row) => {
      const productId = row.productId;

      if (!productsMap[productId]) {
        // 이미지 정보를 제외한 상품 정보
        const { productImage, ...productData } = row;
        productsMap[productId] = {
          ...productData,
          images: [],
        };
      }

      // 이미지가 있을 경우에만 추가
      if (row.productImage) {
        const imageUrl = `http://localhost:3001/uploads/${row.productImage}`;
        productsMap[productId].images.push(imageUrl);
      }
    });

    // 객체를 배열로 변환
    const products = Object.values(productsMap);

    return products;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getProductByProductId = async (productId) => {
  const query = `
    SELECT
      p.*,
      pi.productImage
    FROM
      product p
    LEFT JOIN
      productimage pi
    ON
      p.productId = pi.productId
    WHERE
      p.productId = ?
    ORDER BY
      p.productId DESC
  `;

  try {
    const [rows] = await db.execute(query, [parseInt(productId, 10)]);
    // 상품별로 이미지를 묶기 위한 객체
    const productsMap = {};

    rows.forEach((row) => {
      const productId = row.productId;

      if (!productsMap[productId]) {
        // 이미지 정보를 제외한 상품 정보
        const { productImage, ...productData } = row;
        productsMap[productId] = {
          ...productData,
          images: [],
        };
      }

      // 이미지가 있을 경우에만 추가
      if (row.productImage) {
        const imageUrl = `http://localhost:3001/uploads/${row.productImage}`;
        productsMap[productId].images.push(imageUrl);
      }
    });

    // 객체를 배열로 변환
    const products = Object.values(productsMap);

    return products;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const handleProductBookmark = async (userId, productId) => {
  const escapedUserId = mysql.escape(userId);
  const escapedProductId = mysql.escape(productId);

  //먼저 해당 찜이 이미 존재하는지 확인
  const checkQuery = `SELECT * FROM productbookmark WHERE userId = ${escapedUserId} AND productId = ${escapedProductId}`;
  //찜 개수 업데이트 쿼리
  const updateWishlistCountQuery = `
    UPDATE product 
    SET wishlistCount = (SELECT COUNT(*) FROM productbookmark WHERE productId = ${escapedProductId}) 
    WHERE productId = ${escapedProductId}
  `;
  try {
    const [existingBookmark] = await db.execute(checkQuery);

    if (existingBookmark.length > 0) {
      const deleteQuery = `DELETE FROM productbookmark WHERE userId = ${escapedUserId} AND productId = ${escapedProductId}`;
      await db.execute(deleteQuery);
      //찜개수 업데이트
      await db.execute(updateWishlistCountQuery);
      return;
    } else {
      //존재하지 않으면 새로 찜을 추가
      const insertQuery = `INSERT INTO productbookmark (userId, productId) VALUES (${escapedUserId}, ${escapedProductId})`;
      const [rows] = await db.execute(insertQuery);
      //찜개수 업데이트
      await db.execute(updateWishlistCountQuery);
      return rows;
    }
  } catch (error) {
    console.error("Error in insert productBookmark operation:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const getProductBookmarkByUserID = async (userId) => {
  const escapedUserId = mysql.escape(userId);

  const query = `
  SELECT *
  FROM productbookmark
  WHERE userId = ${escapedUserId};
`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.error("Error in get productBookmark operation:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const updateProductFields = async (updateData, productId, userId) => {
  console.log("dao -=> ", updateData, productId, userId);
  const setUpdateData = Object.keys(updateData)
    .map((key) => `${key} = ?`) // `key = ?` 형식으로 변환
    .join(", "); // 쉼표로 결합

  const values = [...Object.values(updateData), productId, userId];

  const query = `
  UPDATE product 
  SET ${setUpdateData}, productUpdatedDate = NOW() 
  WHERE productId = ? AND userId = ?`;

  try {
    const [rows] = await db.execute(query, values);
    return rows;
  } catch (error) {
    console.error("Error in update product data:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const updateProductFieldsByState = async (tradeState, productId, userId) => {
  const escapedProductId = mysql.escape(productId);
  const escapedUserId = mysql.escape(userId);
  const escapedTradeState = mysql.escape(tradeState);

  const query = `
  UPDATE product
  SET tradeState = ${escapedTradeState}
  WHERE productId = ${escapedProductId} AND userId = ${escapedUserId}
`;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.error("Error in update product data:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

const updateProductFieldsByBuyerUserId = async (
  buyerUserId,
  productId,
  userId
) => {
  const escapedProductId = mysql.escape(productId);
  const escapedUserId = mysql.escape(userId);
  const escapedBuyerUserId = mysql.escape(buyerUserId);

  const query = `
  UPDATE product
  SET buyerUserId = ${escapedBuyerUserId}
  WHERE productId = ${escapedProductId} AND userId = ${escapedUserId}
`;
  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.error("Error in update product data:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

module.exports = {
  getProductsAll,
  getProductsByUserId,
  getProductsByPurchasedUserId,
  getBookmarkProductByUserId,
  getProductByProductId,
  handleProductBookmark,
  getProductBookmarkByUserID,
  updateProductFields,
  updateProductFieldsByState,
  updateProductFieldsByBuyerUserId,
  getProductsByFilter, //대수술중 함수
};
