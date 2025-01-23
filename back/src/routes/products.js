const express = require("express");
const router = express.Router();
const axios = require("axios");
const productsController = require("../controllers/productsController");

//상품 처리
router.get("/products", productsController.getProductsByFilter);
router.get("/product", productsController.getProduct);
router.get("/detail", productsController.getDetailProduct);
router.post("/detail/view", productsController.updateProductByView);
router.post("/product/bookmark", productsController.handleProductBookmark);
router.post("/product/bookmark/user", productsController.getBookmarkList);
router.patch(
  "/update-product/state/:productId",
  productsController.updateProductByState
);
router.patch(
  "/update-product/buyer-user-id/:productId",
  productsController.updateProductByBuyerUserId
);
router.get("/image", productsController.getProductImage);
module.exports = router;
