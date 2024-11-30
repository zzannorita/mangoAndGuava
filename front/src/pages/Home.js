import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import HomeStyle from "../styles/home.module.css";
import cowBoy from "../image/maggo.jpg";
import axiosInstance from "../axios";
export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("http://localhost:3001/products")
      .then((response) => {
        setProducts(response.data.data || []);
        console.log("API Response:", response.data); // 데이터 확인
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);
  return (
    <div className="container">
      <img src={cowBoy} alt="cowBoy" className={HomeStyle.cowBoy}></img>
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
