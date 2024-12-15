import React, { useState } from "react";
import productStyle from "../styles/productsCard.module.css";
import emptyHeartImg from "../image/emptyHeart.png";
import fillHeartImg from "../image/fillHeart.png";
import getRelativeTime from "../utils/getRelativeTime";
import axiosInstance from "../axios";

const ProductsCard = ({ product, userId }) => {
  ////////////////////////찜/////////////////////////////////
  const [clickedHeart, setClickedHeart] = useState(!product.isBookmarked);
  const [showAlarm, setShowAlarm] = useState(false);

  const isOwner = product.userId === userId; //찜 방지

  const handleClick = async (e) => {
    if (isOwner || tradeState !== "판매중") return; // 자신의 제품이거나 "판매중"이 아닌 경우 클릭 방지

    e.preventDefault(); //링크 이동 방지

    try {
      const response = await axiosInstance.post("product/bookmark", {
        productId: product.productId,
      });
      if (response.status === 200) {
        const wasHeartEmpty = clickedHeart; // 하트가 있었는지 확인
        setClickedHeart(!clickedHeart); // 하트 상태 토글

        if (wasHeartEmpty) {
          setShowAlarm(true);
          setTimeout(() => setShowAlarm(false), 1500);
        }
      } else {
        console.error("찜 상태 변경 실패", response.data);
      }
    } catch (error) {
      console.error("찜 상태 변경 요청 중 오류 발생", error);
    }
  };

  //////////////////////////상태/////////////////////////////////
  const [tradeState, setTradeState] = useState(product.tradeState || "판매중");
  const overlayText =
    tradeState === "예약중"
      ? "예약중"
      : tradeState === "판매완료"
      ? "판매완료"
      : tradeState === "판매중"
      ? ""
      : "";
  // 구매 불가 상품
  const disableClickStyle =
    tradeState !== "판매중" ? productStyle.disabled2 : "";

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
        className={`${productStyle.productImage} ${disableClickStyle}`}
      ></img>
      {overlayText && <div className={productStyle.overlay}>{overlayText}</div>}
      <img
        src={clickedHeart ? emptyHeartImg : fillHeartImg}
        alt="emptyHeartImg"
        className={`${productStyle.emptyHeartImg} ${
          isOwner ? productStyle.disabled : ""
        }`}
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
