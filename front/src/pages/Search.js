import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../axios";
import ProductList from "../components/ProductList";
import SearchStyle from "../styles/search.module.css";
import shopStyle from "../styles/shop.module.css";
import RegistCategory from "./RegistCategory";
import LocationList from "../components/LocationList";

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [products, setProducts] = useState([]); // 초기값을 빈 배열로 설정

  /////////////////////카테고리/////////////////////////
  const [productCategory, setProductCategory] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");
  const handleCategorySelect = (categoryCode, categoryName) => {
    setProductCategory(categoryCode);
    setProductCategoryName(categoryName);
  };

  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const toggleCategory = () => {
    setIsCategoryVisible((prevState) => !prevState); // 카테고리 표시 여부 토글
  };

  ////////////////////////지역/////////////////////////////

  const [isLocationVisible, setIsLocationVisible] = useState(false);
  const [selectedTradingAddress, setSelectedTradingAddress] = useState("");
  const toggleLocation = () => {
    setIsLocationVisible((prevState) => !prevState);
  };

  ////////////////////////가격//////////////////////////////
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceFiltered, setPriceFiltered] = useState(false);

  const handlePriceFiltered = () => {
    setPriceFiltered(true);
  };

  ////////////////////////필터링////////////////////////////
  const [sortOrder, setSortOrder] = useState("low");

  // 필터링된 상품 리스트
  const filteredProducts = products.filter((product) => {
    let isCategoryMatch = true;
    let isLocationMatch = true;
    let isPriceMatch = true;
    const productPrice = Number(product.productPrice);

    if (productCategory) {
      isCategoryMatch = product.productCategory === productCategory;
    }

    if (selectedTradingAddress) {
      isLocationMatch = product.tradingAddress === selectedTradingAddress;
    }
    // 가격 필터가 적용되었을 때만 가격 비교
    if (priceFiltered) {
      if (minPrice && productPrice < Number(minPrice)) {
        isPriceMatch = false; // 최소 가격보다 낮으면 제외
      }
      if (maxPrice && productPrice > Number(maxPrice)) {
        isPriceMatch = false; // 최대 가격보다 높으면 제외
      }
    }

    return isCategoryMatch && isLocationMatch && isPriceMatch; // 모든 조건이 일치하는 상품만 반환
  });
  // 정렬된 상품 리스트
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low") {
      return a.productPrice - b.productPrice; // 저가순
    } else {
      return b.productPrice - a.productPrice; // 고가순
    }
  });
  useEffect(() => {
    if (!query) return; // 검색어가 없는 경우 API 호출 방지
    axiosInstance
      .get(`/products?item=${encodeURIComponent(query)}`)
      .then((response) => {
        console.log(response.data);
        setProducts(response.data.data || []); // 상품 배열 저장
      })
      .catch();
  }, [query]);
  return (
    <div className="container">
      <div className={SearchStyle.resultTextBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            '&nbsp;<span className="impact impact2">{query}</span>&nbsp;'의 검색
            결과 &nbsp;
            <span className="impact">{products.length}</span>건
          </div>
          <div className={shopStyle.mainTopRightBox}>
            <div className={shopStyle.filterTextBox}>최신순</div>
            <span>|</span>
            <div
              className={shopStyle.filterTextBox}
              onClick={() => setSortOrder("high")}
            >
              고가순
            </div>
            <span>|</span>

            <div
              className={shopStyle.filterTextBox}
              onClick={() => setSortOrder("low")}
            >
              저가순
            </div>
          </div>
        </div>
        <div className={SearchStyle.resultTextBottomBox}>
          <div className={SearchStyle.category}>
            <div className={SearchStyle.categoryNameBox}>
              카테고리
              <button
                className={SearchStyle.categoryAddButton}
                onClick={toggleCategory}
              >
                {isCategoryVisible ? "-" : "+"}
              </button>
            </div>
            <div className={SearchStyle.categorySelectedBox}>
              {!isCategoryVisible && (productCategoryName || "전체")}
              {isCategoryVisible && (
                <RegistCategory
                  onCategorySelect={(categoryCode, categoryName) => {
                    handleCategorySelect(categoryCode, categoryName);
                    setIsCategoryVisible(false);
                  }}
                />
              )}
            </div>
          </div>
          <div className={SearchStyle.category}>
            <div className={SearchStyle.categoryNameBox}>
              지역
              <button
                className={SearchStyle.categoryAddButton}
                onClick={toggleLocation}
              >
                {isLocationVisible ? "-" : "+"}
              </button>
            </div>
            <div className={SearchStyle.categorySelectedBox}>
              {!isLocationVisible && (selectedTradingAddress || "전체")}
              {isLocationVisible && (
                <LocationList
                  onLocationSelect={(address) => {
                    setSelectedTradingAddress(address);
                    setIsLocationVisible(false);
                  }}
                />
              )}
            </div>
          </div>
          <div className={SearchStyle.category}>
            <div className={SearchStyle.categoryNameBox}>가격</div>
            <div className={SearchStyle.priceSelectedBox}>
              <input
                className={SearchStyle.priceBox}
                placeholder="최소"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className={SearchStyle.priceBoxBetween}>~</span>
              <input
                className={SearchStyle.priceBox}
                placeholder="최대"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <span className={SearchStyle.priceBoxBetween}>원</span>
              <div
                className={SearchStyle.priceFilteredButton}
                onClick={handlePriceFiltered}
              >
                적용
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={SearchStyle.resultProductsBox}>
        {sortedProducts && sortedProducts.length > 0 ? (
          <ProductList products={sortedProducts} />
        ) : (
          <p className={SearchStyle.noProductsText}>
            상품 검색 결과가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
