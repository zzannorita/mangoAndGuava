const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

//상품 등록
router.post(
  "/add-product",
  shopController.uploadImages,
  shopController.uploadProduct
);
router.get("/myshop", shopController.getMyShopData);
router.patch("/update-info", shopController.updateShopInfo);
router.get("/shop", shopController.getShopData);
router.patch("/user-update", shopController.updateUserInfo);
router.post("/bookmark", shopController.addBookmark);
router.post("/shop/comment", shopController.addShopComment);

module.exports = router;
