const axios = require("axios");
const shopDao = require("../daos/shopDao");
const userDao = require("../daos/userDao");
const productsDao = require("../daos/productsDao");
const multer = require("multer");
const path = require("path");

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, uniqueSuffix + path.extname(file.originalname));
    // imageOrder를 JSON으로 파싱 (유효성 검사 추가)
    let order = [];
    try {
      order = req.body.imageOrder ? JSON.parse(req.body.imageOrder) : [];
    } catch (error) {
      console.error("Failed to parse imageOrder:", error);
    }

    const index = req.files ? req.files.length : 0; // 현재 업로드된 파일의 순서
    const fileOrder = order[index] ?? index; // 순서가 없으면 기본 인덱스 사용

    const uniqueSuffix = `${Date.now()}-${fileOrder}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// 업로드된 이미지를 처리하는 미들웨어
const uploadImages = upload.array("productImage", 10); // 최대 10개의 이미지를 업로드

const uploadProduct = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    const userId = userData.id;

    const {
      productName,
      productCategory,
      productPrice,
      productInfo,
      productState,
      tradingMethod,
      isTrade,
      isShippingFee,
      tradingAddress,
    } = req.body;

    // req.files를 통해 업로드된 파일 정보 접근
    const productImage = req.files.map((file) => file.filename); // 파일 이름 배열

    const productData = {
      userId,
      productName,
      productCategory,
      productPrice,
      productInfo,
      productState,
      tradingMethod: tradingMethod === "true" ? 1 : 0, // 변환
      isTrade: isTrade === "true" ? 1 : 0, // 변환
      isShippingFee: isShippingFee === "true" ? 1 : 0, // 변환
      tradingAddress,
      productImage,
    };

    const addProductResult = await shopDao.addProduct(productData);

    return res.status(200).json({
      code: "SUCCESS_PRODUCT_UPLOAD",
      productId: addProductResult.productId,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

const updateProduct = async (req, res) => {}
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;
    const userId = userData.id;
    const productId = req.params.productId;
    const updateData = req.body;

    const productImage = req.files.map((file) => file.filename);
    const update = await shopDao.updateProductByProductId(
      productId,
      updateData,
      userId,
      productImage
    );

    return res.status(200).json({
      code: "SUCCESS_PRODUCT_UPDATE",
      productId: update.productId,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "error", error });
  }
};

const getMyShopData = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }
  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = userResponse.data.id;
    const shopData = await shopDao.getShopInfo(userId);
    const shopProducts = await productsDao.getProductsByUserId(userId);
    const userData = await userDao.getUserById(userId);
    const commentData = await shopDao.getShopCommentData(userId);
    const commentCount = {
      commentCount: commentData.length,
      ratingAvg: await shopDao.getShopAvg(userId),
    };
    const purchasedProduct = await productsDao.getProductsByPurchasedUserId(
      userId
    );
    const bookmarkProduct = await productsDao.getBookmarkProductByUserId(
      userId
    );
    const bookmarkUser = await shopDao.getBookmarkUser(userId);

    return res.status(200).json({
      shopData,
      shopProducts,
      userData,
      commentData,
      commentCount,
      purchasedProduct,
      bookmarkProduct,
      bookmarkUser,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

const updateShopInfo = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const shopInfo = req.body.shopInfo;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id;

    const updateShopInfo = await shopDao.updateShopInfo(userId, shopInfo);

    return res.status(200).json({ code: "SUCCESS_UPDATE_SHOPINFO" });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

const getShopData = async (req, res) => {
  const userId = req.query.id;
  try {
    const shopData = await shopDao.getShopInfo(userId);
    const shopProducts = await productsDao.getProductsByUserId(userId);
    const shopCommentData = await shopDao.getShopCommentData(userId);

    return res.status(200).json({
      shopData,
      shopProducts,
      shopCommentData,
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

const updateUserInfo = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const nickname = req.body.nickname;
  const address = req.body.address;
  const account = req.body.account;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id;

    const updateUserInfo = await userDao.updateUserInfo(
      userId,
      nickname,
      address,
      account
    );

    return res.status(200).json({ code: "SUCCESS_UPDATE_USERINFO" });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

const addBookmark = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const bookmarkUserId = req.body.sellerId;

  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id;

    const addBookmark = await shopDao.addBookmark(userId, bookmarkUserId);

    return res.status(200).json({ code: "SUCCESS_INSERT_BOOKMARK" });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    console.log(error, "에러");
    throw new Error("Failed to fetch user data : ", error);
  }
};

const addShopComment = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const shopOwnerUserId = req.body.shopOwnerUserId;
  const comment = req.body.comment;
  const avg = req.body.avg;
  const purchasedProductId = req.body.purchasedProductId;
  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const commentUserId = userResponse.data.id;
    const commentData = {
      shopOwnerUserId,
      comment,
      avg,
      commentUserId,
      purchasedProductId,
    };

    const commentStart = await shopDao.addShopComment(commentData);

    return res.status(200).json({ code: "SUCCESS_INSERT_SHOP_COMMENT" });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Token expired");
    }
    throw new Error("Failed to fetch user data");
  }
};

module.exports = {
  uploadProduct,
  uploadImages,
  getShopData,
  updateShopInfo,
  getMyShopData,
  updateUserInfo,
  addBookmark,
  addShopComment,
  updateProduct,
};
