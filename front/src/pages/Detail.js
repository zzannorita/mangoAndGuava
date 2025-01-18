import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import DetailStyle from "../styles/detail.module.css";
import emptyHeartImg from "../image/emptyHeart.png";
import eyeImg from "../image/eye.png";
import rightImg from "../image/right.png";
import getRelativeTime from "../utils/getRelativeTime";
import fillHeartImg from "../image/fillHeart.png";
import { getCategoryNames } from "../utils/categoryUtils";
import Carousel from "../components/Carousel";
import Modal from "../components/Modal";
import axios from "axios";
import Cookies from "js-cookie";

export default function Detail({ shopOwnerUserId }) {
  // 현재 URL에서 쿼리 파라미터 추출
  const currentUrl = new URL(window.location.href);
  const productId = currentUrl.searchParams.get("itemId");

  ///////////////////product//////////////////////////////
  const [productCategory, setProductCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImg, setProductImg] = useState([]);
  const [productState, setProductState] = useState("");
  const [productTradingMethod, setProductTradingMethod] = useState("");
  const [productTradingAddress, setProductTradingAddress] = useState("");
  const [productShippingFee, setProductShippingFee] = useState("");
  const [productWishlistCount, setProductWishlistCount] = useState("");
  const [productViews, setProductViews] = useState("");
  const [productCreatedDate, setProductCreatedDate] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [tradeState, setTradeState] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [chatNum, setChatNum] = useState("");
  ///////////////////사용자 상태//////////////////////////////
  const [userNickName, setUserNickName] = useState("");
  const [userId, setUserId] = useState("");
  const [ownerUserId, setOwnerUserId] = useState("");
  // 카테고리 관련 로직 분리
  const { firstCategory, secondCategory, thirdCategory } =
    getCategoryNames(productCategory);

  /////////////////////로그인상태//////////////////////////
  const [isLogin, setIsLogin] = useState(false);

  //컴포넌트 마운트될때 로그인상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = Cookies.get("accessToken");
      const loginStatus = !!accessToken;
      setIsLogin(loginStatus);
    };
    checkLoginStatus();
  }, []);

  /////////////////////상점 및 채팅///////////////////////////
  const navigate = useNavigate();
  const handleEnterShop = () => navigate(`/yourShop?userId=${userId}`);
  const handleEnterMyShop = () => navigate("/myShop");
  const handleEnterChat = () => {
    if (!isLogin) {
      alert("로그인 후 이용해주세요.");
      navigate("/");
      return;
    }
    navigate("/chat", {
      state: { ownerUserId, productId },
    });
  };

  ///////////////////찜 상태 관리//////////////////////////////
  const [clickedHeart, setClickedHeart] = useState(true);
  const [showAlarm, setShowAlarm] = useState(false);
  const handleClick = async (e) => {
    e.preventDefault(); //링크 이동 방지
    if (!isLogin) {
      alert("로그인 후 이용해주세요.");
      navigate("/");
      return;
    }
    if (String(userId) === String(nowUserId.userId)) {
      return;
    }
    try {
      const response = await axiosInstance.post("product/bookmark", {
        productId,
      });
      if (response.status === 200) {
        const wasHeartEmpty = clickedHeart; // 하트가 있었는지 확인
        setClickedHeart(!clickedHeart); // 하트 상태 토글

        if (wasHeartEmpty) {
          setShowAlarm(true);
          setTimeout(() => setShowAlarm(false), 1500);
        }
      } else {
        console.error("찜하기 실패", response.data);
      }
    } catch (error) {
      console.error("찜하기 요청 중 오류 발생", error);
    }
  };

  // 상품 수정하기
  const handleEditProduct = () => {
    navigate("/update", { state: { productId } });
  };

  ///////////////////useEffect들//////////////////////////////
  //상품 데이터와 사용자 정보 불러오기
  useEffect(() => {
    axiosInstance
      .get(`/detail?itemId=${productId}`)
      .then((response) => {
        const product = response.data.product[0];
        console.log(product);
        setOwnerUserId(product.userId);
        setProductCategory(product.productCategory);
        setProductName(product.productName);
        setProductPrice(product.productPrice);
        setProductImg(product.images);
        setTradeState(product.tradeState);
        setBuyerId(product.buyerUserId);
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
        setProductShippingFee(product.isShippingFee === 0 ? "별도" : "-");

        const user = response.data.user;
        setUserId(user.userId);
        setUserNickName(user?.nickname || user.userId);
      })
      .catch((error) => {
        console.log("상품 데이터 불러오기 실패", error);
      });
  }, [productId]);
  //채팅 수
  useEffect(() => {
    axiosInstance.get(`/chat-num?productId=${productId}`).then((response) => {
      setChatNum(response.data[0].count);
    });
  });
  // 현재 로그인된 사용자 정보 불러오기
  const [nowUserId, setNowUserId] = useState(null); // 기본값을 null로 설정
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      axiosInstance
        .get("/user-data")
        .then((response) => {
          const data = response.data;
          setNowUserId(data.user); // 로그인된 사용자 정보 저장
        })
        .catch((error) => {
          console.log("로그인되지 않은 사용자입니다.");
          setNowUserId(null); // 로그인되지 않았을 때 null 처리
        });
    } else {
      setNowUserId("test");
    }
  }, []);

  // //////////////////////////후기작성///////////////////
  const [comment, setComment] = useState(false);
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      axiosInstance.get(`/comment/${productId}`).then((response) => {
        const data = response.data.data;
        if (data.length > 0) {
          setComment(true);
        } else {
          setComment(false);
        }
      });
    } else {
      setComment(false);
    }
  }, [productId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isTransactionComplete =
    String(buyerId) === String(nowUserId?.userId) &&
    tradeState === "판매완료" &&
    !comment; // 후기가 작성되지 않았을 때만 true
  const handleOpenModal = () => {
    if (comment) {
      alert("이미 후기가 작성되었습니다."); // 후기가 있으면 알림
    } else {
      setIsModalOpen(true); // 후기가 없으면 모달 열기
    }
  };
  const handleCloseModal = () => setIsModalOpen(false);

  //찜돼있는 상태 동기화 하는 useEffect 함수
  useEffect(() => {
    const getBookmarkList = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          const response = await axiosInstance.post("product/bookmark/user");
          const bookmarkList = response.data?.data || [];
          console.log("테스트", bookmarkList.length);
          if (bookmarkList.length > 0) {
            //내부에 존재할 경우
            bookmarkList.map((item) => {
              if (productId === item.productId) {
                setClickedHeart(false);
              }
            });
          }
        } catch (error) {
          console.error("찜상태 동기화 오류", error);
        }
      } else {
      }
    };
    getBookmarkList();
  }, [productId]);

  //조회수 증가를 위한
  useEffect(() => {
    const increaseView = async () => {
      try {
        await axios.post("http://localhost:3001/detail/view", { productId });
      } catch (error) {
        console.log("조회수 증가 실패", error);
      }
    };
    increaseView();
  }, [productId]);

  const overlayText =
    tradeState === "예약중"
      ? "예약중"
      : tradeState === "판매완료"
      ? "판매완료"
      : tradeState === "판매중"
      ? ""
      : "";
  // 구매 불가 상품
  const disableClickStyle = tradeState !== "판매중" ? DetailStyle.disabled : "";

  //최근본 상품
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      axiosInstance.post("recent-view", { productId });
    }
  });
  return (
    <div className="container">
      <div className={DetailStyle.productInfoBox}>
        <div className={DetailStyle.productInfoBottomBox}>
          <div
            className={`${DetailStyle.productInfoLeftBox}  ${disableClickStyle}`}
          >
            <Carousel type="detail" images={productImg} />
            <img
              src={clickedHeart ? emptyHeartImg : fillHeartImg}
              alt="heart"
              className={`${DetailStyle.emptyHeartImg} ${
                String(userId) === String(nowUserId?.userId)
                  ? DetailStyle.disabledBtn
                  : ""
              }`}
              onClick={handleClick}
            />
            <div
              className={`${DetailStyle.heartAlarm} ${
                showAlarm ? DetailStyle.active : ""
              }`}
            >
              상품을 찜하였습니다.
            </div>
            {overlayText && (
              <div className={DetailStyle.overlay}>{overlayText}</div>
            )}
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
                  {productShippingFee}
                </div>
              </div>
            </div>
          </div>
          <div className={DetailStyle.productInfoRightBox}>
            <div
              className={DetailStyle.productShopEnterBox}
              onClick={
                String(userId) === String(nowUserId?.userId)
                  ? handleEnterMyShop
                  : handleEnterShop
              }
            >
              <span className="impact3">{userNickName}</span>님 상점&nbsp;
              <img src={rightImg} alt="rightImg" className="smallImgSize"></img>
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
                <div className={DetailStyle.productDetainInfoBoxes}>
                  채팅 {chatNum}
                </div>
                <div className={DetailStyle.productDetainInfoBoxes}>
                  {productCreatedDate}
                </div>
              </div>
            </div>
            <div
              className={`${DetailStyle.chattingBtnBox} ${
                tradeState === "예약중" ||
                (tradeState === "판매완료" && comment)
                  ? DetailStyle.disabledBtn
                  : ""
              }`}
              onClick={(e) => {
                if (
                  tradeState === "예약중" ||
                  (tradeState === "판매완료" && comment)
                ) {
                  e.preventDefault(); // 클릭 이벤트 차단
                  return;
                }

                // 조건에 따라 다른 함수 실행
                if (String(userId) === String(nowUserId?.userId)) {
                  handleEditProduct();
                } else if (isTransactionComplete) {
                  handleOpenModal();
                } else {
                  handleEnterChat();
                }
              }}
            >
              {tradeState === "예약중"
                ? "예약중" // 예약중 상태일 때
                : tradeState === "판매완료" &&
                  !comment &&
                  String(buyerId) === String(nowUserId?.userId)
                ? "후기작성" // 판매완료이고 후기 없을 때
                : tradeState === "판매완료" &&
                  comment &&
                  String(buyerId) === String(nowUserId?.userId)
                ? "후기작성완료" // 후기 작성 완료 상태일 때
                : String(userId) === String(nowUserId?.userId)
                ? "수정하기" // userId가 현재 사용자와 같으면 수정하기
                : tradeState === "판매중"
                ? "채팅하기"
                : ""}
            </div>
            {/* 모달 컴포넌트 */}
            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              shopOwnerUserId={userId} // 상점 주 userId 전달
              purchasedProductId={productId}
            />
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
