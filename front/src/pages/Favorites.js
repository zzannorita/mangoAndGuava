import React from "react";
import shopStyle from "../styles/shop.module.css";
import favoritesStyle from "../styles/favorites.module.css";
import exImg from "../image/userImg.png";
import RatingStarts from "../components/RatingStars";
export default function Favorites() {
  return (
    <div className={favoritesStyle.myProductsBox}>
      <div className={shopStyle.myProductsMainBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <div>
              상점 <span className="impact">15 </span>
            </div>
          </div>
        </div>
        <div className={favoritesStyle.mainContainer}>
          <div className={favoritesStyle.favoriteList}>
            <img
              className={favoritesStyle.shopImg}
              src={exImg}
              alt="exImg"
            ></img>
            <div className={favoritesStyle.shopInfo}>
              <div className={favoritesStyle.shopName}>여자친구은하짱</div>
              <RatingStarts />
            </div>
          </div>
          <div className={favoritesStyle.favoriteList}>
            <img
              className={favoritesStyle.shopImg}
              src={exImg}
              alt="exImg"
            ></img>
            <div className={favoritesStyle.shopInfo}>
              <div className={favoritesStyle.shopName}>지민아사랑해</div>
              <RatingStarts />
            </div>
          </div>
          <div className={favoritesStyle.favoriteList}>
            <img
              className={favoritesStyle.shopImg}
              src={exImg}
              alt="exImg"
            ></img>
            <div className={favoritesStyle.shopInfo}>
              <div className={favoritesStyle.shopName}>주연여보자기</div>
              <RatingStarts />
            </div>
          </div>
          <div className={favoritesStyle.favoriteList}>
            <img
              className={favoritesStyle.shopImg}
              src={exImg}
              alt="exImg"
            ></img>
            <div className={favoritesStyle.shopInfo}>
              <div className={favoritesStyle.shopName}>리셀러입니단</div>
              <RatingStarts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
