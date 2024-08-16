import React from "react";
import RatingStars from "../styles/ratingStars.module.css";
export default function RatingStarts() {
  return (
    <div className={RatingStars.myShopStarBox}>
      <div className={RatingStars.myShopStars}>
        <div className={RatingStars.rating}>
          <span className={RatingStars.star} data-value="5">
            &#9733;
          </span>
          <span className={RatingStars.star} data-value="4">
            &#9733;
          </span>
          <span className={RatingStars.star} data-value="3">
            &#9733;
          </span>
          <span className={RatingStars.star} data-value="2">
            &#9733;
          </span>
          <span className={RatingStars.star} data-value="1">
            &#9733;
          </span>
        </div>
      </div>
    </div>
  );
}
