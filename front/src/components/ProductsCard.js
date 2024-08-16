import React, { useState } from "react";
import PropTypes from "prop-types";
import productStyle from "../styles/productsCard.module.css";
import productImg from "../image/exImg.png";
import emptyHeartImg from "../image/emptyHeart.png";
import fillHeartImg from "../image/fillHeart.png";

const ProductCard = ({ product }) => {
  const [clickedHeart, setClickedHeart] = useState(true);

  const handleClick = () => {
    setClickedHeart(!clickedHeart);
  };
  return (
    <div className={productStyle.productCard}>
      {/* <img src={product.image} alt={product.name} className="productImage" />
      <h2 className="productName">{product.name}</h2>
      <p className="productPrice">${product.price.toFixed(2)}</p>
      <button className="productButton">View Details</button> */}
      <img
        src={productImg}
        alt="productImg"
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
        <div className={productStyle.productName}>컨버스 하이 그린</div>
        <div className={productStyle.productPrice}>50,000원</div>
        <div className={productStyle.productBottomBox}>
          <div className={productStyle.productLocation}>은평구 갈현동</div>
          <div className={productStyle.registTime}>5분전</div>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
