import React, { useState, useEffect } from "react";
import productStyle from "../styles/productsCard.module.css";
import HomeStyle from "../styles/home.module.css";
import emptyHeartImg from "../image/emptyHeart.png";
import fillHeartImg from "../image/fillHeart.png";
import getRelativeTime from "../utils/getRelativeTime";
import axiosInstance from "../axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";

const ProductsCard = ({ product, userId, type }) => {
  ///////////////////////context api websocket/////////////////
  const { sendMessage } = useWebSocket();

  const sendMessageLikeNotification = () => {
    const sendData = {
      type: "like",
      userId: String(userId), //본인 userId
      productUserId: product.userId, //판매자 userId
      productName: product.productName,
      productId: product.productId,
    };

    sendMessage(sendData);
  };

  ////////////////////로그인상태 확인///////////////////////
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = Cookies.get("accessToken");
      setIsLogin(!!accessToken); // 토큰이 있으면 로그인 상태로 설정
    };
    checkLoginStatus();
  }, []);
  ////////////////////////찜/////////////////////////////////
  const [clickedHeart, setClickedHeart] = useState(!product.isBookmarked);
  const [showAlarm, setShowAlarm] = useState(false);

  const isOwner = String(product.userId) === String(userId); //찜 방지
  const navigate = useNavigate();
  const handleClick = async (e) => {
    if (!isLogin) {
      alert("로그인 후 이용가능합니다.");
      navigate("/");
    }
    if (isOwner || tradeState !== "판매중") return; // 자신의 제품이거나 "판매중"이 아닌 경우 클릭 방지

    e.preventDefault(); //링크 이동 방지

    try {
      const response = await axiosInstance.post("product/bookmark", {
        productId: product.productId,
      });
      if (response.status === 200) {
        const wasHeartEmpty = clickedHeart; // 하트가 있었는지 확인
        if (clickedHeart) {
          sendMessageLikeNotification(); // 웹소켓으로 알림 보내기
        }
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
    <div
      className={type === "home" ? HomeStyle.product : productStyle.productCard}
    >
      <img
        src={
          product.images.length > 0
            ? typeof product.images[0] === "object"
              ? product.images[0].productImage
              : product.images[0]
            : ""
        }
        alt={product.productName}
        className={
          type === "home"
            ? `${HomeStyle.productImage}  ${disableClickStyle}`
            : `${productStyle.productImage} ${disableClickStyle}`
        }
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
