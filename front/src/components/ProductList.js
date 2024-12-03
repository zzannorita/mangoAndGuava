import React, { useEffect, useState } from "react";
import ProductsCard from "./ProductsCard";
import productListStyle from "../styles/productList.module.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../axios";

const ProductList = ({ products }) => {
  const [updatedProducts, setUpdatedProducts] = useState([]); // 상태로 관리

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        console.log("로그인 상태입니다.");
        try {
          const response = await axiosInstance.post(
            "http://localhost:3001/product/bookmark/user"
          );
          const productBookmarkList = response.data.data;
          console.log("Bookmark 리스트 =>", productBookmarkList);

          // products와 productBookmarkList를 비교해 isBookmarked 추가
          const mergedProducts = products.map((product) => {
            const isBookmarked = productBookmarkList.some(
              (bookmark) => bookmark.productId === product.productId
            );
            return { ...product, isBookmarked }; // isBookmarked 추가
          });
          console.log("합체된것=>", mergedProducts);
          setUpdatedProducts(mergedProducts); // 업데이트된 배열 설정
        } catch (error) {
          console.error("Bookmark 데이터를 불러오는 중 에러 발생:", error);
        }
      } else {
        setUpdatedProducts(products); // 로그인 상태가 아니면 원래 products 사용
      }
    };

    checkLoginStatus();
  }, [products]); // products 변경 시 useEffect 재실행
  return (
    <div className={productListStyle.product}>
      {updatedProducts.map((product) => (
        <Link
          key={product.productId}
          to={`/detail?itemId=${product.productId}`}
          className={productListStyle.link}
        >
          <ProductsCard product={product} />
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
