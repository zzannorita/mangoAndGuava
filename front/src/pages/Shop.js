import React, { useEffect, useState } from "react";
import shopStyle from "../styles/shop.module.css";
import userImg from "../image/userImg.png";
import editImg from "../image/edit.png";
import checkImg from "../image/checkbox.png";
import ProductsCard from "../components/ProductsCard";
import Review from "./Review";
import Settings from "./Settings";
import Favorites from "./Favorites";
import RatingStars from "../components/RatingStars";
import Cookies from "js-cookie";
import axios from "axios";

export default function Shop() {
  /////////////////////소개글 수정//////////////////////
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  const handleEditClick = () => {
    if (isEditing) {
      // 수정 후 저장하면 description에 tempDescription 저장
      setDescription(tempDescription);
    } else {
      // 수정 모드로 들어갈 때 현재 description을 tempDescription에 저장
      setTempDescription(description);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    setTempDescription(event.target.value);
  };

  /////////////////필터///////////////////
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [selectedInfo, setSelectedInfo] = useState(null);

  //필터 클릭 핸들러
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setSelectedInfo(null);
  };

  const handleInfoClick = (info) => {
    setSelectedInfo(info);
    setSelectedFilter(null); // "내 정보"를 선택했을 때는 "내 상품" 필터 초기화
  };

  //필터에 따른 컨테이너
  const renderContainer = () => {
    if (selectedFilter) {
      switch (selectedFilter) {
        case "판매중":
          return <div>판매중인상품</div>;
        case "예약중":
          return <div>예약중인상품</div>;
        case "판매완료":
          return <div>판매완료상품</div>;
        case "거래후기":
          return <Review />;
        default:
          return (
            <>
              <ProductsCard />
              <ProductsCard />
              <ProductsCard />
              {/* 여기에 전체 상품 목록을 추가 */}
            </>
          );
      }
    } else if (selectedInfo) {
      switch (selectedInfo) {
        case "구매내역":
          return <div>구매내역 콘텐츠</div>;
        case "찜한상품":
          return <div>찜한상품 콘텐츠</div>;
        case "즐겨찾기":
          return <Favorites />;
        case "설정":
          return <Settings />;
        default:
          return null;
      }
    }
    return null;
  };

  //myshop api호출
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.error("토큰이 없음");
      return;
    }
    axios
      .get("http://localhost:3001/myshop", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const shopData = response.data;
        console.log(shopData);
        // const { userId, shopRating, shopInfo } = shopData;
        // console.log("userId:", userId);
        // console.log("shopRating:", shopRating);
        // console.log("shopInfo:", shopInfo);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);
  return (
    <div className="container">
      <div className={shopStyle.container}>
        <div className={shopStyle.leftBox}>
          <div className={shopStyle.myProductsListBox}>
            <div className={shopStyle.myProductsTitle}>내 상품</div>
            <div className={shopStyle.myProductsList}>
              {["판매중", "예약중", "판매완료", "거래후기"].map((filter) => (
                <div
                  key={filter}
                  className={shopStyle.myProductsListTitle}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}
                </div>
              ))}
            </div>
          </div>
          <div className={shopStyle.myInfoListBox}>
            <div className={shopStyle.myProductsTitle}>내 정보</div>
            <div className={shopStyle.myProductsList}>
              {["구매내역", "찜한상품", "즐겨찾기", "설정"].map((info) => (
                <div
                  key={info}
                  className={shopStyle.myProductsListTitle} // 동일한 스타일 적용
                  onClick={() => handleInfoClick(info)}
                >
                  {info}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={shopStyle.rightBox}>
          <div className={shopStyle.myShopBox}>
            <div className={shopStyle.myShopTitleBox}>
              <div className={shopStyle.myShopTitleText}>000님의 상점</div>
              <RatingStars />
            </div>
            <div className={shopStyle.myShopInfoBox}>
              <img
                className={shopStyle.myShopImg}
                src={userImg}
                alt="userImg"
              ></img>
              <div className={shopStyle.myShopInfoText}>
                <textarea
                  className={`${shopStyle.textArea} ${
                    isEditing ? shopStyle.textAreaEditing : ""
                  }`}
                  value={isEditing ? tempDescription : description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="상점을 소개하는 글을 작성하여 신뢰도를 높여 보세요."
                ></textarea>
              </div>
              {isEditing ? (
                <img
                  className={shopStyle.editImg}
                  src={checkImg}
                  alt="checkImg"
                  onClick={handleEditClick}
                ></img>
              ) : (
                <img
                  className={shopStyle.editImg}
                  src={editImg}
                  alt="editImg"
                  onClick={handleEditClick}
                ></img>
              )}
            </div>
          </div>
          <div className={shopStyle.myProductsBox}>
            <div className={shopStyle.myProductsText}>
              {selectedFilter ? "내 상품" : selectedInfo ? "내 정보" : ""}
            </div>
            <div className={shopStyle.productListBox}>
              {selectedFilter &&
                ["전체", "판매중", "예약중", "판매완료", "거래후기"].map(
                  (filter) => (
                    <div
                      key={filter}
                      className={`${shopStyle.productsListTitle} ${
                        selectedFilter === filter ? shopStyle.selected : ""
                      }`}
                      onClick={() => handleFilterClick(filter)}
                    >
                      {filter}
                    </div>
                  )
                )}
              {selectedInfo &&
                ["구매내역", "찜한상품", "즐겨찾기", "설정"].map((info) => (
                  <div
                    key={info}
                    className={`${shopStyle.productsListTitle} ${
                      selectedInfo === info ? shopStyle.selected : ""
                    }`}
                    onClick={() => handleInfoClick(info)}
                  >
                    {info}
                  </div>
                ))}
            </div>
            <div className={shopStyle.myProductsMainBox}>
              {!(
                selectedFilter === "거래후기" ||
                selectedInfo === "즐겨찾기" ||
                selectedInfo === "설정"
              ) ? (
                <div className={shopStyle.mainTopBox}>
                  <div className={shopStyle.mainTopLeftBox}>
                    <div>
                      상품 <span className="impact">15</span>
                    </div>
                  </div>
                  <div className={shopStyle.mainTopRightBox}>
                    <div className={shopStyle.filterTextBox}>최신</div>
                    <span>|</span>
                    <div className={shopStyle.filterTextBox}>저가</div>
                    <span>|</span>
                    <div className={shopStyle.filterTextBox}>고가</div>
                  </div>
                </div>
              ) : null}
              <div className={shopStyle.mainProductsBox}>
                {renderContainer()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
