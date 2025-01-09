import React, { useEffect, useState } from "react";
import shopStyle from "../styles/shop.module.css";
import ShopInfo from "./ShopInfo";
import ProductList from "../components/ProductList";
import Review from "./Review";
import Settings from "./Settings";
import Favorites from "./Favorites";
import axiosInstance from "../axios";
import { sortProducts } from "../utils/sortUtils";
export default function Shop() {
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
  const [products, setProducts] = useState([]);
  const [bookmarkedProducts, setBookmarkedProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);

  //즐겨찾기
  const [bookmarkUser, setBookmarkUser] = useState([]);
  //myshop api호출
  useEffect(() => {
    axiosInstance
      .get("/myShop")
      .then((response) => {
        const data = response.data;
        setProducts(data.shopProducts);
        setBookmarkedProducts(data.bookmarkProduct);
        setPurchasedProducts(data.purchasedProduct);
        setBookmarkUser(data.bookmarkUser);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);

  // 정렬
  const [sortType, setSortType] = useState("newest");
  const sortedProducts = sortProducts(products, sortType);
  const sortedPurchasedProducts = sortProducts(purchasedProducts, sortType);
  const sortedBookmarkedProducts = sortProducts(bookmarkedProducts, sortType);

  //필터에 따른 컨테이너
  const renderContainer = () => {
    if (selectedFilter) {
      switch (selectedFilter) {
        case "전체":
          return <ProductList products={sortedProducts} />;
        case "판매중":
          return (
            <ProductList
              products={sortedProducts.filter(
                (product) => product.tradeState === "판매중"
              )}
            />
          );
        case "예약중":
          return (
            <ProductList
              products={sortedProducts.filter(
                (product) => product.tradeState === "예약중"
              )}
            />
          );
        case "판매완료":
          return (
            <ProductList
              products={sortedProducts.filter(
                (product) => product.tradeState === "판매완료"
              )}
            />
          );
        case "거래후기":
          return <Review />;
        default:
          return <ProductList products={sortedProducts} />;
      }
    } else if (selectedInfo) {
      switch (selectedInfo) {
        case "구매내역":
          return <ProductList products={sortedPurchasedProducts} />;
        case "찜한상품":
          return <ProductList products={sortedBookmarkedProducts} />;
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
            <ShopInfo />
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
                      상품 &nbsp;
                      <span className="impact">
                        {(() => {
                          if (selectedFilter) {
                            switch (selectedFilter) {
                              case "전체":
                                return sortedProducts.length;
                              case "판매중":
                                return sortedProducts.filter(
                                  (product) => product.tradeState === "판매중"
                                ).length;
                              case "예약중":
                                return sortedProducts.filter(
                                  (product) => product.tradeState === "예약중"
                                ).length;
                              case "판매완료":
                                return sortedProducts.filter(
                                  (product) => product.tradeState === "판매완료"
                                ).length;
                              default:
                                return sortedProducts.length;
                            }
                          } else if (selectedInfo) {
                            switch (selectedInfo) {
                              case "구매내역":
                                return sortedPurchasedProducts.length;
                              case "찜한상품":
                                return sortedBookmarkedProducts.length;
                              case "즐겨찾기":
                                return bookmarkUser.length;
                              default:
                                return 0;
                            }
                          }
                          return 0;
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className={shopStyle.mainTopRightBox}>
                    <div
                      className={shopStyle.filterTextBox}
                      onClick={() => setSortType("newest")}
                    >
                      최신
                    </div>
                    <span>|</span>
                    <div
                      className={shopStyle.filterTextBox}
                      onClick={() => setSortType("lowPrice")}
                    >
                      저가
                    </div>
                    <span>|</span>
                    <div
                      className={shopStyle.filterTextBox}
                      onClick={() => setSortType("highPrice")}
                    >
                      고가
                    </div>
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
