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

const updateProductByBuyerUserId = async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const buyerUserId = req.body.otherUserId;
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
      return res.status(401).json({ message: "Token expired" });
    }
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

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

  //카테고리만 검색된 경우
  if (!item && !page && !order && category) {
    limit = parseInt(req.query.limit, 10) || 15; // 기본값 15
    page = parseInt(req.query.page, 10) || 1; // 기본값 1
    offset = (page - 1) * limit;

    try {
      const searchData = await productsDao.getProductsCategory(
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

module.exports = {
  handleProducts,
  getProduct,
  getDetailProduct,
  handleProductBookmark,
  getBookmarkList,
  // updateProduct,
  updateProductByState,
  updateProductByBuyerUserId,
  getProductsByFilter, //이게 수술후 함수
  updateProductByView,
};
