import React, { useState } from "react";
import productStyle from "../styles/productsCard.module.css";
import emptyHeartImg from "../image/emptyHeart.png";
import fillHeartImg from "../image/fillHeart.png";
import getRelativeTime from "../utils/getRelativeTime";
import axiosInstance from "../axios";

const ProductsCard = ({ product }) => {
  ////////////////////////찜/////////////////////////////////
  const [clickedHeart, setClickedHeart] = useState(!product.isBookmarked);
  const [showAlarm, setShowAlarm] = useState(false);

  const handleClick = async (e) => {
    // e.stopPropagation();
    e.preventDefault(); //링크 이동 방지
    try {
      const response = await axiosInstance.post("product/bookmark", {
        productId: product.productId,
      });
      if (response.status === 200) {
        setClickedHeart(!clickedHeart);
        setShowAlarm(true); // 알람 표시
        setTimeout(() => setShowAlarm(false), 1500);
      } else {
        console.error("찜하기 실패", response.data);
      }
    } catch (error) {
      console.error("찜하기 요청 중 오류 발생", error);
    }
  };

  /////////////////////////주소//////////////////////////////////
  const location =
    product.tradingAddress === "null" ? "" : product.tradingAddress;

  /////////////////////////시간//////////////////////////////////
  const relativeTime = getRelativeTime(product.productCreatedDate);

  return (
    <div className={productStyle.productCard}>
      <img
        src={product.images[0] || ""}
        alt={product.productName}
        className={productStyle.productImage}
      ></img>
      <img
        src={clickedHeart ? emptyHeartImg : fillHeartImg}
        alt="emptyHeartImg"
        className={productStyle.emptyHeartImg}
        onClick={handleClick}
      ></img>
      <div
        className={`${productStyle.heartAlarm} ${
          showAlarm ? productStyle.active : ""
        }`}
      >
        상품을 찜하였습니다.
      </div>
      <div className={productStyle.productTopBox}>
        <div className={productStyle.productName}>{product.productName}</div>
        <div className={productStyle.productPrice}>
          {product.productPrice.toLocaleString()}원
        </div>
        <div className={productStyle.productBottomBox}>
          <div className={productStyle.productLocation}>{location}</div>
          <div className={productStyle.registTime}>{relativeTime}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
