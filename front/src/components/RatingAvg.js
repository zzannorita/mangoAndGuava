import React from "react";
import RatingAvg from "../styles/ratingAvg.module.css";
export default function RatingStarts() {
  return (
    <div className={RatingAvg.myShopStarBox}>
      <div className={RatingAvg.myShopStars}>
        <div className={RatingAvg.rating}>
          <span className={RatingAvg.star} data-value="5">
            &#9733;
          </span>
          <span className={RatingAvg.star} data-value="4">
            &#9733;
          </span>
          <span className={RatingAvg.star} data-value="3">
            &#9733;
          </span>
          <span className={RatingAvg.star} data-value="2">
            &#9733;
          </span>
          <span className={RatingAvg.star} data-value="1">
            &#9733;
          </span>
        </div>
      </div>
    </div>
  );
}
