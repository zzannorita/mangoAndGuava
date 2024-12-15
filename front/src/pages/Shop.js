import React, { useEffect, useState } from "react";
import shopStyle from "../styles/shop.module.css";
import userImg from "../image/userImg.png";
import editImg from "../image/edit.png";
import checkImg from "../image/checkbox.png";
import ProductList from "../components/ProductList";
import Review from "./Review";
import Settings from "./Settings";
import Favorites from "./Favorites";
import RatingAvg from "../components/RatingAvg";
import axiosInstance from "../axios";

export default function Shop() {
  /////////////////////소개글 수정//////////////////////
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [shopData, setShopData] = useState({
    userId: "",
    shopRating: 0,
    shopInfo: "",
  });

  const handleEditClick = () => {
    if (isEditing) {
      axiosInstance
        .patch("/update-info", { shopInfo: description })
        .then(() => {
          setShopData((prevShopData) => ({
            ...prevShopData,
            shopInfo: description,
          }));
          alert("수정이 완료되었습니다.");
        })
        .catch((error) => console.error("설명 업데이트 실패", error));
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    setDescription(event.target.value);
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

  //상점 데이터 상태
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [bookmarkedProducts, setBookmarkedProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [commentCount, setCommentCount] = useState("");

  //즐겨찾기
  const [bookmarkUser, setBookmarkUser] = useState([]);
  //myshop api호출
  useEffect(() => {
    axiosInstance
      .get("/myShop")
      .then((response) => {
        const data = response.data;
        const shopData = data.shopData[0];
        const commentCount = data.commentCount;
        setCommentCount(commentCount.ratingAvg);
        setShopData(data);
        // shopInfo 값을 description 상태에 반영
        setDescription(shopData.shopInfo || "");
        setUserData(data.userData || { address: "주소 없음" });
        setProducts(data.shopProducts);
        setBookmarkedProducts(data.bookmarkProduct);
        setPurchasedProducts(data.purchasedProduct);
        setBookmarkUser(data.bookmarkUser);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);

  //필터에 따른 컨테이너
  const renderContainer = () => {
    if (selectedFilter) {
      switch (selectedFilter) {
        case "판매중":
          return (
            <ProductList
              products={products.filter(
                (product) => product.tradeState === "판매중"
              )}
            />
          );
        case "예약중":
          return (
            <ProductList
              products={products.filter(
                (product) => product.tradeState === "예약중"
              )}
            />
          );
        case "판매완료":
          return (
            <ProductList
              products={products.filter(
                (product) => product.tradeState === "판매완료"
              )}
            />
          );
        case "거래후기":
          return <Review />;
        default:
          return <ProductList products={products} />;
      }
    } else if (selectedInfo) {
      switch (selectedInfo) {
        case "구매내역":
          return <ProductList products={purchasedProducts} />;
        case "찜한상품":
          return (
            <div>
              <ProductList products={bookmarkedProducts} />
            </div>
          );
        case "즐겨찾기":
          return <Favorites bookmarkUser={bookmarkUser} />;
        case "설정":
          return <Settings />;
        default:
          return null;
      }
    }
    return null;
  };

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
            <div className={shopStyle.myShopBoxInner}>
              <div className={shopStyle.myShopTitleBox}>
                <div className={shopStyle.myShopTitleText}>
                  <span className="impact3">{userData?.nickname}</span>님의 상점
                </div>
                <RatingAvg rating={commentCount} />
              </div>
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
                  value={description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="상점을 소개하는 글을 작성하여 신뢰도를 높여 보세요."
                ></textarea>
              </div>
              <img
                className={shopStyle.editImg}
                src={isEditing ? checkImg : editImg}
                alt={isEditing ? "저장" : "편집"}
                onClick={handleEditClick}
              />
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
