import React from "react";
import styles from "../styles/ratingStars.module.css"; // 별점 스타일 모듈 임포트

function RatingStars({ rating, setRating }) {
  // 별 클릭 시 호출되는 함수
  const handleStarClick = (index) => {
    setRating(index + 1); // 클릭한 별의 인덱스를 기준으로 별점 설정 (1~5)
  };

  return (
    <div className={styles.ratingStars}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < rating ? styles.filledStar : styles.emptyStar}
          onClick={() => handleStarClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
