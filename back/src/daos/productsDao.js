const mysql = require("mysql2"); // MySQL2 모듈 불러오기
//userDao.js에서 데이터베이스와의 상호작용을 담당합니다.
//예를 들어, 유저 정보를 데이터베이스에 저장하거나 검색하는 기능을 구현합니다.
const db = require("../config/dbConfig");
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

const getProductsAllOrder = async (limit, offset, order) => {
  let orderMethod = "";
  if (order === "price-asc") {
    // 낮은 가격순
    orderMethod = "productPrice ASC";
  } else if (order === "price-desc") {
    // 높은 가격순
    orderMethod = "productPrice DESC";
  } else if (order === "date") {
    // 최신순
    orderMethod = "productCreatedDate DESC";
  }

  const query = `
    SELECT 
      p.*,
      GROUP_CONCAT(pi.productImage) AS images 
    FROM 
      product p 
    LEFT JOIN 
      productimage pi 
    ON 
      p.productId = pi.productId 
    GROUP BY 
      p.productId 
    ORDER BY 
      ${orderMethod}
    LIMIT ${limit} OFFSET ${offset};
  `;

  try {
    const [rows] = await db.execute(query);

    // 상품별로 이미지를 묶기 위한 객체
    const products = rows.map((row) => {
      const productData = { ...row };
      productData.images = row.images
        ? row.images
            .split(",")
            .map((image) => `http://localhost:3001/uploads/${image}`)
        : [];
      return productData;
    });

    return products;
  } catch (error) {
    throw new Error("Database query error: " + error.message);
  }
};

const getProductsByItemPageLimit = async (item, limit, offset) => {
  const itemSafe = mysql.escape(`%${item}%`); // LIKE 패턴을 위한 값
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
    p.productName LIKE ${itemSafe}
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

const getProductsByItemPageLimitOrder = async (item, limit, offset, order) => {
  const itemSafe = mysql.escape(`%${item}%`); // LIKE 패턴을 위한 값
  let orderMethod = "";
  if (order === "price-asc") {
    //높은 가격순
    orderMethod = "productPrice DESC";
  } else if (order === "price-desc") {
    //낮은 가격순
    orderMethod = "productPrice";
  } else if (order === "date") {
    orderMethod = "productCreatedDate";
  }
  const query = `
  SELECT
    p.*,
    GROUP_CONCAT(pi.productImage) AS images
  FROM
    product p
  LEFT JOIN
    productimage pi
  ON
    p.productId = pi.productId
  WHERE
    p.productName LIKE ${itemSafe}
  GROUP BY
    p.productId
  ORDER BY
    ${orderMethod}
  LIMIT ${limit} OFFSET ${offset};
`;
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
  try {
    const bookmarkQuery = `
    SELECT productId 
    FROM productbookmark 
    WHERE userId = ?
  `;
    // Step 1: productbookmark 테이블에서 userId가 일치하는 productId들을 가져옴
    const [bookmarkRows] = await db.execute(bookmarkQuery, [
      parseInt(userId, 10),
    ]);

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

  try {
    const [existingBookmark] = await db.execute(checkQuery);

    if (existingBookmark.length > 0) {
      const deleteQuery = `DELETE FROM productbookmark WHERE userId = ${escapedUserId} AND productId = ${escapedProductId}`;
      await db.execute(deleteQuery);
      return;
    } else {
      //존재하지 않으면 새로 찜을 추가
      const insertQuery = `INSERT INTO productbookmark (userId, productId) VALUES (${escapedUserId}, ${escapedProductId})`;
      const [rows] = await db.execute(insertQuery);
      return rows;
    }
  } catch (error) {
    console.error("Error in productBookmark operation:", error.message);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 던지기
  }
};

module.exports = {
  getProductsAll,
  getProductsByItemPageLimit,
  getProductsByItemPageLimitOrder,
  getProductsAllOrder,
  getProductsByUserId,
  getProductsByPurchasedUserId,
  getBookmarkProductByUserId,
  getProductByProductId,
  handleProductBookmark,
};
