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
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [followSeller, setFollowSeller] = useState(false);

  //필터 클릭 핸들러
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  //팔로우 핸들러
  const handleFollowClick = async () => {
    try {
      const response = await axiosInstance.post("bookmark", { sellerId });
      if (response.status === 200) {
        setFollowSeller(!followSeller);
      } else {
        console.error("팔로우 실패", response.data);
      }
    } catch (error) {
      console.error("팔로우 중 오류 발생", error);
    }
  };

  useEffect(() => {
    // 상점 정보 가져오기
    axiosInstance
      .get(`/shop?id=${sellerId}`)
      .then((response) => {
        const data = response.data;
        const shopData = data.shopData[0];
        //setSellerNickName(shopData.userId); //아직nickname이 없어서 임시로 userId

        ///촐///
        axiosInstance
          .get(`/user-data/other?userId=${shopData.userId}`)
          .then((response) => {
            //console.log(response.data.user.nickname2);
            // setSellerNickName(response.data.user.nickname2);
            ///율///
            const nickname = response.data.user.nickname2;
            setSellerNickName(nickname || shopData.userId);
          });
        ////////

        setDescription(shopData.shopInfo);
        setProducts(data.shopProducts);
        const shopComment = data.shopCommentData;
        setReviews(shopComment);

        // 별점 평균 계산
        const totalRating = shopComment.reduce(
          (sum, comment) => sum + comment.avg,
          0
        );
        const avgRating =
          shopComment.length > 0 ? totalRating / shopComment.length : 0;
        setAverageRating(avgRating);
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
              <div className={shopStyle.myShopBoxInner}>
                <div className={shopStyle.myShopTitleBox}>
                  <div className={shopStyle.myShopTitleText}>
                    <span className="impact3">{sellerNickName}</span>
                    님의 상점
                  </div>
                  <RatingAvg rating={averageRating} />
                </div>
                <div className={shopStyle.follow} onClick={handleFollowClick}>
                  {!followSeller ? "+ 팔로우" : "팔로잉"}
                </div>
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
