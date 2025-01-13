import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import ProductList from "../components/ProductList";
import SearchStyle from "../styles/search.module.css";
import shopStyle from "../styles/shop.module.css";
import RegistCategory from "./RegistCategory";
import LocationList from "../components/LocationList";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  const [products, setProducts] = useState([]); // 초기값을 빈 배열로 설정

  /////////////////////페이지네이션/////////////////////
  const [totalPage, setTotalPage] = useState();

  /////////////////// 주소 필터링 함수///////////////////////
  const [isLocationVisible, setIsLocationVisible] = useState(false);
  const [selectedTradingAddress, setSelectedTradingAddress] = useState("");
  const toggleLocation = () => {
    setIsLocationVisible((prevState) => !prevState);
  };
  const handleLocationFilter = (address) => {
    const currentQueryParams = new URLSearchParams(location.search);
    currentQueryParams.set("address", address);
    navigate(`/products?${currentQueryParams.toString()}`);
  };

  /////////////////////// 가격 필터링 함수/////////////////////
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const handlePriceFilter = () => {
    const currentQueryParams = new URLSearchParams(location.search);
    if (priceMin !== undefined) {
      currentQueryParams.set("priceMin", priceMin);
    }
    if (priceMax !== undefined) {
      currentQueryParams.set("priceMax", priceMax);
    }
    navigate(`/products?${currentQueryParams.toString()}`);
  };

  /////////////////////// 카테고리 필터링 함수//////////////////
  const [productCategory, setProductCategory] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const toggleCategory = () => {
    setIsCategoryVisible((prevState) => !prevState); // 카테고리 표시 여부 토글
  };
  const handleCategoryFilter = (categoryCode, categoryName) => {
    const currentQueryParams = new URLSearchParams(location.search);
    currentQueryParams.set("category", categoryCode);
    navigate(`/products?${currentQueryParams.toString()}`);
    setProductCategory(categoryCode);
    setProductCategoryName(categoryName);
  };

  /////////////최신, 고가, 저가 필터링 //////////////////////////
  const [sortOrder, setSortOrder] = useState("");
  const handleSortChange = (sortType) => {
    const currentQueryParams = new URLSearchParams(location.search);
    currentQueryParams.set("sort", sortType); // sort 파라미터 추가
    setSortOrder(sortType);
    navigate(`/products?${currentQueryParams.toString()}`); // 새 쿼리로 네비게이션
  };

  // API 요청 함수 (쿼리 파라미터에 의해)
  const fetchProducts = async (queryParams) => {
    try {
      const response = await axiosInstance.get(`/products?${queryParams}`);
      setProducts(response.data.products || []);
      setTotalPage(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // URL 쿼리 파라미터 변경 시 상품 목록 업데이트
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryString = queryParams.toString();

    // 검색어(q)가 있으면 API 호출
    if (queryString) {
      fetchProducts(queryString);
    }
  }, [location.search]); // URL 쿼리 파라미터가 변경될 때마다 호출

  return (
    <div className="container">
      <div className={SearchStyle.resultTextBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <span className="impact impact2">{query}</span>&nbsp; 검색 결과
            &nbsp;
            <span className="impact">{products.length}</span>건
          </div>
          <div className={shopStyle.mainTopRightBox}>
            <div
              className={shopStyle.filterTextBox}
              onClick={() => handleSortChange("newest")}
            >
              최신순
            </div>
            <span>|</span>
            <div
              className={shopStyle.filterTextBox}
              onClick={() => handleSortChange("priceAsc")}
            >
              고가순
            </div>
            <span>|</span>

            <div
              className={shopStyle.filterTextBox}
              onClick={() => handleSortChange("priceDesc")}
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
                    handleCategoryFilter(categoryCode, categoryName);
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
                    handleLocationFilter(address);
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
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <span className={SearchStyle.priceBoxBetween}>~</span>
              <input
                className={SearchStyle.priceBox}
                placeholder="최대"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
              <span className={SearchStyle.priceBoxBetween}>원</span>
              <div
                className={SearchStyle.priceFilteredButton}
                onClick={handlePriceFilter}
              >
                적용
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={SearchStyle.resultProductsBox}>
        {products && products.length > 0 ? (
          <ProductList products={products} />
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
