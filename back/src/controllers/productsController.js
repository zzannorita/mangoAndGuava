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
    console.log(getProductByProductId);
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

module.exports = {
  handleProducts,
  getProduct,
  getDetailProduct,
};
