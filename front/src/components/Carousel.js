import React, { useState, useEffect } from "react";
import carouselStyle from "../styles/carousel.module.css";
import HomeStyle from "../styles/home.module.css";

export default function CombinedCarousel({ type, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 슬라이드 변경 함수
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length); // 이미지 순환
  };
  // 홈 슬라이드만 자동
  useEffect(() => {
    if (type === "home") {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [type]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className={
        type === "home"
          ? HomeStyle.sliderContainer
          : carouselStyle.carouselContainer
      }
    >
      <img
        src={images[currentIndex]} // 현재 슬라이드 이미지 표시
        alt={`carousel-slide-${currentIndex}`}
        className={
          type === "home" ? HomeStyle.sliderImage : carouselStyle.carouselImage
        }
      />

      {/* 이미지 갯수만큼 점 생성 */}
      <div className={carouselStyle.dotsContainer}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${carouselStyle.dot} ${
              currentIndex === index ? carouselStyle.activeDot : ""
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
