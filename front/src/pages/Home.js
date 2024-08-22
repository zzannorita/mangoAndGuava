import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductsCard";
import HomeStyle from "../styles/home.module.css";
import cowBoy from "../image/banner.png";
export default function Home() {
  // const [recommendedProducts, setRecommendedProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("/api/recommended-products");
  //       const data = await response.json();
  //       setRecommendedProducts(data);
  //     } catch (error) {
  //       console.error("Error fetching recommended products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  return (
    <div className="container">
      <img src={cowBoy} alt="cowBoy" className={HomeStyle.cowBoy}></img>
      <div className={HomeStyle.recommendBox}>
        <div className={HomeStyle.userRecommendBox}>
          <div className={HomeStyle.userRecommendName}>사용자 추천 상품</div>
          <div className={HomeStyle.productList}>
            {/* {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}
