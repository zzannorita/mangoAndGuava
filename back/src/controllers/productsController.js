const axios = require("axios");
const productsDao = require("../daos/productsDao");
const userDao = require("../daos/userDao");

const handleProducts = async (req, res) => {
  const item = req.query.item;
  let limit = req.query.limit; // 기본값 15
  let page = req.query.page; // 기본값 1
  let offset = (page - 1) * limit; // 페이지네이션을 위한 오프셋 계산
  const order = req.query.order;
  const category = req.query.category;
  let results = {};
  //전체 상품보기
  if (!item && !page && !order && !category) {
    limit = parseInt(req.query.limit, 10) || 15; // 기본값 15
    page = parseInt(req.query.page, 10) || 1; // 기본값 1
    offset = (page - 1) * limit;
    try {
      const searchData = await productsDao.getProductsAll(limit, offset);
      return res.json({
        code: "SUCCESS_SEARCH_ALL_PRODUCTS",
        data: searchData,
      });
    } catch (error) {
      console.error("Error during search products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //전체 상품보기 정렬
  if (!item && !page && order && !category) {
    limit = parseInt(req.query.limit, 10) || 15; // 기본값 15
    page = parseInt(req.query.page, 10) || 1; // 기본값 1
    offset = (page - 1) * limit;
    try {
      const searchData = await productsDao.getProductsAllOrder(
        limit,
        offset,
        order
      );
      return res.json({
        code: "SUCCESS_SEARCH_ALL_PRODUCTS",
        data: searchData,
      });
    } catch (error) {
      console.error("Error during search products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //item(검색만 된 경우)
  if (item && !page && !order && !category) {
    limit = parseInt(req.query.limit, 10) || 15; // 기본값 15
    page = parseInt(req.query.page, 10) || 1; // 기본값 1
    offset = (page - 1) * limit;
    //데이터베이스 쿼리로 변경 할 것.
    try {
      const searchData = await productsDao.getProductsByItemPageLimit(
        item,
        limit,
        offset
      );
      return res.json({
        code: "SUCCESS_SEARCH_PRODUCTS",
        data: searchData,
      });
    } catch (error) {
      console.error("Error during search products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //item 검색후 페이지네이션 이용
  if (item && page && !order && !category) {
    limit = parseInt(req.query.limit, 10) || 15; // 기본값 15
    page = parseInt(req.query.page, 10) || 1; // 기본값 1
    offset = (page - 1) * limit;
    try {
      const searchData = await productsDao.getProductsByItemPageLimit(
        item,
        limit,
        offset
      );
      return res.json({
        code: "SUCCESS_SEARCH",
        data: searchData,
      });
    } catch (error) {
      console.error("Error during search products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //item 검색후 정렬
  if (item && page && order && !category) {
    limit = parseInt(req.query.limit, 10) || 15; // 기본값 15
    page = parseInt(req.query.page, 10) || 1; // 기본값 1
    offset = (page - 1) * limit;

    try {
      const searchData = await productsDao.getProductsByItemPageLimitOrder(
        item,
        limit,
        offset,
        order
      );
      return res.json({
        code: "SUCCESS_SEARCH",
        data: searchData,
      });
    } catch (error) {
      console.error("Error during search products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

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
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

const getBookmarkList = async (req, res) => {
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
    const productBookmarkList = await productsDao.getProductBookmarkByUserID(
      userId
    );
    return res.json({
      code: "SUCCESS_SELECT_PRODUCTBOOKMARKLiST",
      data: productBookmarkList,
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

// const updateProduct = async (req, res) => {
//   const accessToken = req.headers.authorization?.split(" ")[1];
//   const updateData = req.body;
//   const productId = req.params.productId;
//   console.log(productId, updateData);

//   if (!accessToken) {
//     return res.status(401).json({ message: "No access token provided" });
//   }

//   try {
//     const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const userId = userResponse.data.id;

//     if (!Object.keys(updateData).length) {
//       return res.status(400).json({ message: "No fields to update" });
//     }

//     const updateData = await productsDao.updateProductFields(
//       updateData,
//       productId,
//       userId
//     );

//     return res.json({
//       code: "SUCCESS_UPDATE_PRODUCT",
//       data: null,
//     });
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       return res.status(401).json({ message: "Token expired" });
//     }
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch user data", error: error.message });
//   }
// };

const updateProductByState = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const tradeState = req.body.tradeState;
  const productId = req.params.productId;

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
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

module.exports = {
  handleProducts,
  getProduct,
  getDetailProduct,
  handleProductBookmark,
  getBookmarkList,
  // updateProduct,
  updateProductByState,
};
