const axios = require("axios");
const productsDao = require("../daos/productsDao");
const userDao = require("../daos/userDao");
const fs = require("fs");
const path = require("path");

// 조회수 관리 파일 경로
const viewsFilePath = path.join(__dirname, "..", "viewsData.json");

const getProduct = async (req, res) => {
  const productId = req.query.productId;

  try {
    const getProductByProductId = await productsDao.getProductByProductId(
      productId
    );
    return res.status(200).json({
      code: "SUCCESS_SEARCH_PRODUCT",
      product: getProductByProductId,
    });
  } catch (error) {
    console.error("Error during search products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProductByView = async (req, res) => {
  const productId = req.body.productId;
  const ip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;

  try {
    // 파일에서 데이터 읽기
    let data = {};

    // 파일이 존재하고 내용이 있으면 데이터를 파싱
    if (fs.existsSync(viewsFilePath)) {
      const fileContent = fs.readFileSync(viewsFilePath, "utf-8");

      // 파일 내용이 비어 있지 않으면 파싱
      if (fileContent.trim()) {
        data = JSON.parse(fileContent);
      }
    }

    // 해당 productId가 존재하지 않으면 새로 추가
    if (!data[productId]) {
      data[productId] = { views: 0, ips: [] };
    }

    // 이미 해당 IP가 조회한 기록이 있는지 확인
    if (!data[productId].ips.includes(ip)) {
      // IP가 없으면 조회수 증가
      data[productId].views += 1;
      data[productId].ips.push(ip);

      // 파일에 수정된 데이터 저장
      fs.writeFileSync(viewsFilePath, JSON.stringify(data, null, 2), "utf-8");
    }
    // DB에 조회수 반영 로직 (가정)
    await productsDao.updateProductByView(productId, data[productId].views);

    // 성공적으로 조회수 업데이트
    res.status(200).json({
      code: "SUCCESS",
      views: data[productId].views,
    });
  } catch (err) {
    console.error("Error updating view count:", err);
    res.status(500).json({ message: "조회수 업데이트 실패" });
  }
};

// 클릭해서 상품을 들어갔을때 상세 정보
const getDetailProduct = async (req, res) => {
  const itemId = req.query.itemId;
  try {
    const getProductByProductId = await productsDao.getProductByProductId(
      itemId
    );
    const userId = getProductByProductId[0].userId;
    const user = await userDao.getUserById(userId);

    return res.status(200).json({
      code: "SUCCESS_SEARCH_PRODUCT",
      product: getProductByProductId,
      user: user,
    });
  } catch (error) {
    console.error("Error during search products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//상품 찜하기 추가/삭제하는..
const handleProductBookmark = async (req, res) => {
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
    const productId = req.body.productId;

    const productBookmark = await productsDao.handleProductBookmark(
      userId,
      productId
    );

    return res.json({
      code: "SUCCESS_INSERT_PRODUCTBOOKMARK",
      data: productBookmark,
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

///대수술
const getProductsByFilter = async (req, res) => {
  const {
    q,
    category,
    sort,
    page = 1,
    perPage = 15,
    tradeState,
    priceMin,
    priceMax,
    address,
  } = req.query;

  const filters = {
    search: q,
    category,
    sort,
    page: parseInt(page, 10),
    perPage: parseInt(perPage, 10),
    tradeState,
    priceMin,
    priceMax,
    address,
  };
  try {
    const resultProducts = await productsDao.getProductsByFilter(filters);
    res.status(200).json(resultProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error! get products" });
  }
};
///대수술

const getBookmarkList = async (req, res) => {
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
    const productBookmarkList = await productsDao.getProductBookmarkByUserID(
      userId
    );
    return res.json({
      code: "SUCCESS_SELECT_PRODUCTBOOKMARKLiST",
      data: productBookmarkList,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage =
        error.response.data.error === "invalid_token"
          ? { message: "Invalid access token", errorType: "INVALID_TOKEN" }
          : { message: "Token expired", errorType: "TOKEN_EXPIRED" };
      return res.status(401).json(errorMessage);
    }

    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

const getProductImage = async (req, res) => {
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

    const productId = req.query.id;

    const imageArray = await productsDao.getProductImageByproductId(productId);

    return res.status(200).json({
      code: "SUCCESS_SELECT_PRODUCTIMAGE",
      data: imageArray,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage =
        error.response.data.error === "invalid_token"
          ? { message: "Invalid access token", errorType: "INVALID_TOKEN" }
          : { message: "Token expired", errorType: "TOKEN_EXPIRED" };
      return res.status(401).json(errorMessage);
    }

    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

const updateProductByState = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const tradeState = req.body.tradeState;
  const productId = req.params.productId;

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
    const userId = userResponse.data.id;

    const updateData = await productsDao.updateProductFieldsByState(
      tradeState,
      productId,
      userId
    );

    return res.json({
      code: "SUCCESS_UPDATE_PRODUCT",
      data: updateData,
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

const updateProductByBuyerUserId = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const buyerUserId = req.body.otherUserId;
  const productId = req.params.productId;

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
    const userId = userResponse.data.id;

    const updateData = await productsDao.updateProductFieldsByBuyerUserId(
      buyerUserId,
      productId,
      userId
    );

    return res.json({
      code: "SUCCESS_UPDATE_PRODUCT",
      data: updateData,
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
  getProduct,
  getDetailProduct,
  handleProductBookmark,
  getBookmarkList,
  updateProductByState,
  updateProductByBuyerUserId,
  getProductsByFilter, //이게 수술후 함수
  updateProductByView,
  getProductImage,
};
