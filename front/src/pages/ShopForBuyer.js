import React, { useEffect, useState } from "react";
import shopStyle from "../styles/shop.module.css";
import axiosInstance from "../axios";
import RatingAvg from "../components/RatingAvg";
import userImg from "../image/userImg.png";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import OthersReview from "./OthersReview";
import { sortProducts } from "../utils/sortUtils";
import Cookies from "js-cookie";

export default function ShopForBuyer() {
  //쿼리파라미터에서 sellerId가져오기
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("userId");
  const [profileImg, setProfileImg] = useState("");
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

  //이미 팔로우 되어있을 시
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      axiosInstance
        .get("/myShop")
        .then((response) => {
          const data = response.data.bookmarkUser;
          if (data.includes(sellerId)) {
            setFollowSeller(true);
          }
        })
        .catch((error) => {
          console.error("팔로우 상태 확인 중 오류 발생:", error);
        });
    } else {
    }
  }, [sellerId]);

  //팔로우 핸들러
  const navigate = useNavigate();
  const handleFollowClick = async () => {
    const accessToken = Cookies.get("accessToken"); // 로그인 여부 확인
    if (!accessToken) {
      alert("로그인 후 이용해주세요.");
      navigate("/");
      return;
    }
    try {
      if (followSeller) {
        const response = await axiosInstance.delete(
          `/bookmark?deluserId=${sellerId}`
        );
        if (response.status === 200) {
          setFollowSeller(false);
          alert(`${sellerNickName}님을 팔로우 취소하였습니다.`);
        } else {
          console.error("팔취실패패");
        }
      } else {
        const response = await axiosInstance.post("bookmark", { sellerId });
        if (response.status === 200) {
          setFollowSeller(true);
          alert(`${sellerNickName}님을 팔로우 하였습니다.`);
        } else {
          console.error("팔로우 실패", response.data);
        }
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
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          axiosInstance
            .get(`/user-data/other?userId=${shopData.userId}`)
            .then((response) => {
              const nickname = response.data.user.nickname2;
              setSellerNickName(nickname || shopData.userId);
              const profileImg = response.data.user.profileImage;
              setProfileImg(profileImg);
            });
        } else {
          setSellerNickName(shopData.userId);
          setProfileImg(profileImg);
        }

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

  //선택된 필터가 없을 때 전체
  useEffect(() => {
    if (!selectedFilter) {
      setSelectedFilter("전체");
    }
  }, [selectedFilter]);

  // 정렬
  const [sortType, setSortType] = useState("newest");
  const sortedProducts = sortProducts(products, sortType);

  //필터에 따른 컨테이너
  const renderContainer = () => {
    if (selectedFilter) {
      switch (selectedFilter) {
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
          return <OthersReview shopComment={reviews} />;
        default:
          return <ProductList products={sortedProducts} />;
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
                  src={profileImg || userImg}
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
                        상품 <span className="impact">{products.length}</span>
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
    </div>
  );
}
