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
router.delete("/bookmark", shopController.deleteBookmark);
router.post("/shop/comment", shopController.addShopComment);
router.patch(
  "/update-product/:productId",
  shopController.uploadImages,
  shopController.updateProduct
);
router.get("/comment/:productId", shopController.getCommentData);
router.post("/recent-view", shopController.addOrUpdateRecentView);
router.get("/recent-view", shopController.getRecentView);

module.exports = router;
