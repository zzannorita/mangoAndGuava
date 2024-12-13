import React from "react";
import RatingAvg from "../styles/ratingAvg.module.css";

export default function RatingStars({ rating }) {
  return (
    <div className={RatingAvg.myShopStarBox}>
      <div className={RatingAvg.myShopStars}>
        <div className={RatingAvg.rating}>
          {[5, 4, 3, 2, 1].map((value) => (
            <span
              key={value}
              className={`${RatingAvg.star} ${
                value <= rating ? RatingAvg.activeStar : ""
              }`}
              data-value={value}
            >
              &#9733;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
