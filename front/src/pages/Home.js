import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import HomeStyle from "../styles/home.module.css";
import axiosInstance from "../axios";
import slide1 from "../image/slide1.png";
import slide2 from "../image/slide2.png";
import slide3 from "../image/slide3.png";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  /////////////////////페이지네이션/////////////////////
  const [totalPage, setTotalPage] = useState();

  // 슬라이드 변경 함수
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3); // 3개의 이미지 순환
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3); // 3개의 이미지 순환
  };

  // 자동 슬라이드 설정 (3초마다 넘어가도록)
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // 3초마다 nextSlide 호출
    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 클리어
  }, []);

  // 이미지 배열
  const sliderImages = [slide1, slide2, slide3];

  useEffect(() => {
    axiosInstance
      .get("http://localhost:3001/products")
      .then((response) => {
        setProducts(response.data.products || []); // 상품 배열 저장
        setTotalPage(response.data.totalPages);
        console.log("API Response:", response.data.products); // 데이터 확인
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);
  return (
    <div className="container">
      {/* 슬라이드 배너 */}
      <div className={HomeStyle.sliderContainer}>
        <img
          src={sliderImages[currentSlide]} // 현재 슬라이드 이미지 표시
          alt={`slide-${currentSlide}`}
          className={HomeStyle.sliderImage}
        />
        <button onClick={prevSlide} className={HomeStyle.prevButton}>
          &lt;
        </button>
        <button onClick={nextSlide} className={HomeStyle.nextButton}>
          &gt;
        </button>
      </div>
      <div className={HomeStyle.recommendBox}>
        <div className={HomeStyle.userRecommendBox}>
          <div className={HomeStyle.userRecommendName}>최신 상품 목록</div>
          <div className={HomeStyle.productList}>
            <ProductList products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
