import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shopStyle from "../styles/shop.module.css";
import favoritesStyle from "../styles/favorites.module.css";
import exImg from "../image/userImg.png";
import RatingAvg from "../components/RatingAvg";
import axiosInstance from "../axios";
export default function Favorites({ bookmarkUser }) {
  const [sellerData, setSellerData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        //배열 비동기, 닉네임
        const responses = await Promise.all(
          bookmarkUser.map((id) =>
            axiosInstance.get(`/user-data/other?userId=${id}`)
          )
        );
        //그 외
        const shopDataResponses = await Promise.all(
          bookmarkUser.map((id) => axiosInstance.get(`/shop?id=${id}`))
        );
        // 데이터를 매핑
        const data = responses.map((response, index) => {
          const shopData = shopDataResponses[index].data;
          const nickname = response.data.user.nickname2;
          const profileImage = response.data.user.profileImage;
          // 상점 데이터 구조에서 shopAvg와 userId 추출
          const shopAvg = shopData.shopData?.[0]?.shopAvg ?? 0;
          const userId = shopData.shopData?.[0]?.userId;
          // 반환되는 데이터 구성
          return {
            userId: userId, //상점 userId
            nickname: nickname,
            shopRating: shopAvg, // 상점 별점
            profileImg: profileImage,
          };
        });
        setSellerData(data); // 데이터를 상태에 저장
      } catch (error) {
        console.error("즐겨찾기 유저 데이터 가져오기 실패:", error);
      }
    };

    if (bookmarkUser.length > 0) {
      fetchSellerData();
    }
  }, [bookmarkUser]);

  const handleClickShop = (userId) => {
    navigate(`/yourShop?userId=${userId}`);
  };
  return (
    <div className={favoritesStyle.myProductsBox}>
      <div className={shopStyle.myProductsMainBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <div>
              상점 <span className="impact">{bookmarkUser.length} </span>
            </div>
          </div>
        </div>
        {bookmarkUser.length === 0 ? (
          <div className={favoritesStyle.mainContainer}>
            즐겨찾기된 상점이 없습니다.
          </div>
        ) : (
          <div className={favoritesStyle.mainContainer}>
            {sellerData.map((seller) => (
              <div
                key={`${seller.id}-${seller.nickname}`}
                className={favoritesStyle.favoriteList}
                onClick={() => handleClickShop(seller.userId)} // 클릭 시 해당 상점으로 이동
              >
                <img
                  className={favoritesStyle.shopImg}
                  src={seller.profileImg || exImg}
                  alt="exImg"
                />
                <div className={favoritesStyle.shopInfo}>
                  <div className={favoritesStyle.shopName}>
                    {seller.nickname}
                  </div>
                  <div className={favoritesStyle.shopRating}>
                    <RatingAvg rating={seller.shopRating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
