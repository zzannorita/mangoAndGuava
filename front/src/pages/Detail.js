import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import DetailStyle from "../styles/detail.module.css";
import emptyHeartImg from "../image/emptyHeart.png";
import eyeImg from "../image/eye.png";
import rightImg from "../image/right.png";
import getRelativeTime from "../utils/getRelativeTime";
import fillHeartImg from "../image/fillHeart.png";
import productStyle from "../styles/productsCard.module.css";

const categoryMapping = {
  100: "의류",
  110: "남성의류",
  111: "상의",
  112: "하의",
  120: "여성의류",
  121: "상의",
  122: "하의",
  200: "전자제품",
  210: "모바일",
  220: "컴퓨터",
  // 추가적으로 필요한 카테고리 코드와 이름을 넣어야 함
};

const subCategoryMapping = {
  110: {
    111: "상의",
    112: "하의",
    // 필요한 다른 하위 카테고리
  },
  120: {
    121: "상의",
    122: "하의",
    // 필요한 다른 하위 카테고리
  },
  // 추가적으로 필요한 하위 카테고리
};

export default function Detail() {
  // 현재 URL에서 쿼리 파라미터 추출
  const currentUrl = new URL(window.location.href);
  const productId = currentUrl.searchParams.get("itemId");

  ///////////////////product//////////////////////////////
  const [productCategory, setProductCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImg, setProductImg] = useState("");
  const [productState, setProductState] = useState("");
  const [productTradingMethod, setProductTradingMethod] = useState("");
  const [productTradingAddress, setProductTradingAddress] = useState("");
  const [productShippngFee, setProductShippngFee] = useState("");
  const [productWishlistCount, setProductWishlistCount] = useState("");
  const [productViews, setProductViews] = useState("");
  const [productCreatedDate, setProductCreatedDate] = useState("");
  const [productInfo, setProductInfo] = useState("");
  //////////////////user//////////////////////////////////
  const [userNickName, setUserNickName] = useState("");

  /////////////////카테고리//////////////////////////////
  // 카테고리 코드 분리
  const firstCategoryCode = productCategory.slice(0, 3); // 첫 3자리: 100
  const secondCategoryCode = productCategory.slice(3, 6); // 다음 3자리: 110
  const thirdCategoryCode = productCategory.slice(6, 9); // 마지막 3자리: 111

  // 카테고리 이름 찾기
  const firstCategory = categoryMapping[firstCategoryCode] || "기타";
  const secondCategory = categoryMapping[secondCategoryCode] || "기타";
  const thirdCategory = subCategoryMapping[secondCategoryCode]
    ? subCategoryMapping[secondCategoryCode][thirdCategoryCode] || "기타"
    : "기타";
  /////////////////상점들어가기//////////////////////////
  const navigate = useNavigate();
  const handleEnterShop = () => {
    navigate("/myshop"); //아직 안만들어서 예시
  };

  /////////////////채팅//////////////////////////////////
  const handleEnterChat = () => {
    navigate("/chat");
  };

  ////////////////////////찜/////////////////////////////////
  const [clickedHeart, setClickedHeart] = useState(true);
  const [showAlarm, setShowAlarm] = useState(false);

  const handleClick = async (e) => {
    // e.stopPropagation();
    e.preventDefault(); //링크 이동 방지
    try {
      const response = await axiosInstance.post("product/bookmark", {
        productId: productId,
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

  useEffect(() => {
    axiosInstance
      .get(`/detail?itemId=${productId}`)
      .then((response) => {
        const product = response.data.product[0];
        setProductCategory(product.productCategory);
        setProductName(product.productName);
        setProductPrice(product.productPrice);
        setProductImg(product.images);
        setProductTradingAddress(
          product.tradingAddress === "null" ? "-" : product.tradingAddress
        );
        setProductInfo(product.productInfo);
        setProductCreatedDate(getRelativeTime(product.productCreatedDate));
        setProductWishlistCount(
          product.wishlistCount === null ? "0" : product.wishlistCount
        );
        setProductViews(product.views === null ? "0" : product.views);
        setProductState(product.productState === "old" ? "중고" : "새상품");
        setProductTradingMethod(
          product.tradingMethod === 1 ? "직거래" : "택배거래"
        );
        setProductShippngFee(product.isShippingFee === 0 ? "별도" : "-");

        const user = response.data.user;
        setUserNickName(user?.nickname === null ? user.userId : user?.nickname);

        console.log("API Response:", response.data); // 데이터 확인
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, [productId]);

  return (
    <div className="container">
      <div className={DetailStyle.productInfoBox}>
        <div className={DetailStyle.productInfoBottomBox}>
          <div className={DetailStyle.productInfoLeftBox}>
            <img
              className={DetailStyle.productImg}
              alt="camera"
              src={productImg}
            />
            <img
              src={clickedHeart ? emptyHeartImg : fillHeartImg}
              alt="emptyHeartImg"
              className={DetailStyle.emptyHeartImg}
              onClick={handleClick}
            ></img>
            <div
              className={`${DetailStyle.heartAlarm} ${
                showAlarm ? DetailStyle.active : ""
              }`}
            >
              상품을 찜하였습니다.
            </div>
          </div>
          <div className={DetailStyle.productInfoMiddleBox}>
            <div className={DetailStyle.productCategoryBox}>
              {firstCategory} &nbsp;&gt;&nbsp; {secondCategory} &nbsp;&gt;&nbsp;{" "}
              {thirdCategory}
            </div>
            <div className={DetailStyle.productNameBox}>{productName}</div>
            <div className={DetailStyle.productPriceBox}>
              <div className={DetailStyle.productPrice}>{productPrice} </div>
              <div className={DetailStyle.text}>원</div>
            </div>
            <div className={DetailStyle.productDetailBox}>
              <div className={DetailStyle.tradeState}>
                <div>상태</div>
                <div className={DetailStyle.productText}>{productState}</div>
              </div>
              <div className={DetailStyle.tradingMethod}>
                <div>거래방법</div>
                <div className={DetailStyle.productText}>
                  {productTradingMethod}
                </div>
              </div>
              <div className={DetailStyle.tradingAddress}>
                <div>직거래 위치</div>
                <div className={DetailStyle.productText}>
                  {productTradingAddress}
                </div>
              </div>
              <div className={DetailStyle.isShippingFee}>
                <div>배송비</div>
                <div className={DetailStyle.productText}>
                  {productShippngFee}
                </div>
              </div>
            </div>
          </div>
          <div className={DetailStyle.productInfoRightBox}>
            <div className={DetailStyle.productShopEnterBox}>
              <span className="impact3">{userNickName}</span>님 상점&nbsp;
              <img
                src={rightImg}
                alt="rightImg"
                className="smallImgSize"
                onClick={handleEnterShop}
              ></img>
            </div>
            <div className={DetailStyle.productInfoTopBox}>
              <div className={DetailStyle.productDetainInfoBox}>
                <div className={DetailStyle.productDetainInfoBoxes}>
                  <img
                    src={emptyHeartImg}
                    alt="emptyHeartImg"
                    className="smallImgSize"
                  ></img>
                  <div>{productWishlistCount}</div>
                </div>
                <div className={DetailStyle.productDetainInfoBoxes}>
                  <img src={eyeImg} alt="eyeImg" className="smallImgSize"></img>
                  <div>{productViews}</div>
                </div>
                <div className={DetailStyle.productDetainInfoBoxes}>채팅 5</div>
                <div className={DetailStyle.productDetainInfoBoxes}>
                  {productCreatedDate}
                </div>
              </div>
            </div>
            <div
              className={DetailStyle.chattingBtnBox}
              onClick={handleEnterChat}
            >
              채팅하기
            </div>
          </div>
        </div>
      </div>
      <div className={DetailStyle.productContentBox}>
        <div className={DetailStyle.productContentBoxName}>상품 정보</div>
        <div className={DetailStyle.productContent}>{productInfo}</div>
      </div>
    </div>
  );
}
