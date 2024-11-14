import React, { useState } from "react";
import PropTypes from "prop-types";
import productStyle from "../styles/productsCard.module.css";
// import productImg from "../image/exImg.png";
import emptyHeartImg from "../image/emptyHeart.png";
import fillHeartImg from "../image/fillHeart.png";
import getRelativeTime from "../utils/getRelativeTime";
import extractLocation from "../utils/extractLocation";

const ProductsCard = ({ product, userData }) => {
  ////////////////////////찜/////////////////////////////////
  const [clickedHeart, setClickedHeart] = useState(true);

  const handleClick = () => {
    setClickedHeart(!clickedHeart);
  };

  /////////////////////////주소//////////////////////////////////
  const location = extractLocation(userData?.address || "");

  /////////////////////////시간//////////////////////////////////
  const relativeTime = getRelativeTime(product.productCreatedDate);

  return (
    <div className={productStyle.productCard}>
      <img
        src={product.images[0] || ""}
        alt={product.productName}
        className={productStyle.productImage}
      ></img>
      <img
        src={clickedHeart ? emptyHeartImg : fillHeartImg}
        alt="emptyHeartImg"
        className={productStyle.emptyHeartImg}
        onClick={handleClick}
      ></img>
      {!clickedHeart && (
        <div className={productStyle.heartAlarm}>상품을 찜하였습니다.</div>
      )}
      <div className={productStyle.productTopBox}>
        <div className={productStyle.productName}>{product.productName}</div>
        <div className={productStyle.productPrice}>
          {product.productPrice.toLocaleString()}원
        </div>
        <div className={productStyle.productBottomBox}>
          <div className={productStyle.productLocation}>{location}</div>
          <div className={productStyle.registTime}>{relativeTime}</div>
        </div>
      </div>
    </div>
  );
};

ProductsCard.propTypes = {
  product: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductsCard;
