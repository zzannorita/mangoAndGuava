import React, { useState } from "react";
import styles from "../styles/ratingStars.module.css";

function RatingStars({ rating, setRating }) {
  const [hoverRating, setHoverRating] = useState(0);

  // 별 클릭 시
  const handleStarClick = (index) => {
    setRating(index + 1); // 클릭한 별의 인덱스를 기준으로 별점 설정 (1~5)
  };

  // 별에 hover시
  const handleMouseEnter = (index) => {
    setHoverRating(index + 1); // hover한 별과 그 이전 별들을 채우기
  };

  // hover가 끝났을 때
  const handleMouseLeave = () => {
    setHoverRating(0); // hover 상태 초기화
  };

  return (
    <div className={styles.ratingStars}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={
            index < (hoverRating || rating)
              ? styles.filledStar
              : styles.emptyStar
          }
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
