import React, { useEffect, useState } from "react";
import shopStyle from "../styles/shop.module.css";
import axiosInstance from "../axios";
import RatingAvg from "../components/RatingAvg";
import userImg from "../image/userImg.png";
import { useSearchParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import OthersReview from "./OthersReview";

export default function ShopForBuyer() {
  //쿼리파라미터에서 sellerId가져오기
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("userId");

  const [sellerNickName, setSellerNickName] = useState(null);
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]); //아직 안함

  const [selectedFilter, setSelectedFilter] = useState("전체");

  //필터 클릭 핸들러
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    // 상점 정보 가져오기
    axiosInstance
      .get(`/shop?id=${sellerId}`)
      .then((response) => {
        const data = response.data;
        const shopData = data.shopData[0];
        setSellerNickName(shopData.userId); //아직nickname이 없어서 임시로 userId
        setDescription(shopData.shopInfo);
        setProducts(data.shopProducts);
        const shopComment = data.shopCommentData;
        setReviews(shopComment);
      })
      .catch((error) => console.log("데이터 가져오기 실패", error));
  }, [sellerId]);

  useEffect(() => {
    if (!selectedFilter) {
      //선택된 필터가 없을 때 전체
      setSelectedFilter("전체");
    }
  }, [selectedFilter]);

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
          return <OthersReview shopComment={reviews} />;
        default:
          return <ProductList products={products} />;
      }
    }
    return null;
  };

  return (
    <div className="container">
      <div className={shopStyle.shopForBuyerContainer}>
        <div className={shopStyle.container}>
          {/* 오른쪽 상점 정보 */}
          <div className={shopStyle.rightBox}>
            <div className={shopStyle.myShopBox}>
              <div className={shopStyle.myShopTitleBox}>
                <div className={shopStyle.myShopTitleText}>
                  <span className="impact3">{sellerNickName}</span>
                  님의 상점
                </div>
                <RatingAvg />
              </div>
              <div className={shopStyle.myShopInfoBox}>
                {/* 상점 이미지 및 소개글 */}
                <img
                  className={shopStyle.myShopImg}
                  src={userImg}
                  alt="userImg"
                ></img>
                <div className={shopStyle.myShopInfoText}>
                  <textarea
                    className={shopStyle.textArea}
                    value={
                      description === (null || "")
                        ? "등록된 소개가 없습니다."
                        : description
                    }
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 상품 목록 */}
            <div className={shopStyle.myProductsBox}>
              <div className={shopStyle.productListBox}>
                {["전체", "판매중", "예약중", "판매완료", "거래후기"].map(
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
              </div>
              <div className={shopStyle.myProductsMainBox}>
                {!(selectedFilter === "거래후기") ? (
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
    </div>
  );
}
