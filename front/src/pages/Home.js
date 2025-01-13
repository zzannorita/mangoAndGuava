import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import HomeStyle from "../styles/home.module.css";
import axiosInstance from "../axios";
import Carousel from "../components/Carousel";
import slide1 from "../image/slide1.png";
import slide2 from "../image/slide2.png";
import slide3 from "../image/slide3.png";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [totalPage, setTotalPage] = useState();

  // 이미지 배열
  const sliderImages = [slide1, slide2, slide3];

  useEffect(() => {
    axiosInstance
      .get("/products")
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
      <Carousel type="home" images={sliderImages} />
      <div className={HomeStyle.recommendBox}>
        <div className={HomeStyle.userRecommendBox}>
          <div className={HomeStyle.userRecommendName}>최신 상품 목록</div>
          <div className={HomeStyle.productList}>
            <ProductList type="home" products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
