const express = require("express");
const router = express.Router();
const axios = require("axios");
const productsController = require("../controllers/productsController");

//상품 처리
router.get("/products", productsController.handleProducts);
router.get("/product", productsController.getProduct);
router.get("/detail", productsController.getDetailProduct);
router.post("/product/bookmark", productsController.handleProductBookmark);

module.exports = router;
