import React, { useEffect, useState } from "react";
import Category from "./Category";
import RealTime from "./RealTime";
import MainLayoutStyle from "../styles/mainLayout.module.css";
import exImg from "../image/exImg.png";
import eyeImg from "../image/eye.png";
import axiosInstance from "../axios";
import { useLocation } from "react-router-dom";

export default function MainLayout() {
  //경로 변경시마다 렌더링
  const location = useLocation();
  const [productId, setProductId] = useState([]);
  const [productImage, setProductImage] = useState([]);
  useEffect(() => {
    axiosInstance
      .get("/recent-view")
      .then((response) => {
        const data = response.data.data;
        const productIdArray = data.map((item) => item.productId);
        const productId = [...new Set(productIdArray)];
        setProductId(productId);
      })
      .catch((error) => {
        console.error("최근본상품 에러:", error);
      });
  }, [location.pathname]);

  useEffect(() => {
    if (productId.length === 0) return;
    const fetchProductImages = async () => {
      try {
        const imageArray = productId.map((id) => {
          return axiosInstance.get(`/detail?itemId=${id}`).then((response) => {
            const images = response.data.product[0].images || [];
            const image = images[0] || exImg;
            return image;
          });
        });

        const images = await Promise.all(imageArray);
        setProductImage(images);
      } catch (error) {
        console.error("이미지 로드 에러:", error);
      }
    };

    fetchProductImages();
  }, [productId]);
  return (
    <div className="container">
      <div className={MainLayoutStyle.container}>
        <Category />
        <RealTime />
        <div className={MainLayoutStyle.recentBoxContainer}>
          <div className={MainLayoutStyle.recentBoxTop}>
            <div>Today</div>

            <img
              className={MainLayoutStyle.eyeImg}
              src={eyeImg}
              alt="eyeImg"
            ></img>
          </div>
          <div className={MainLayoutStyle.recentImgBox}>
            {productImage.length > 0 ? (
              productImage.map((image, index) => (
                <img
                  key={index}
                  className={MainLayoutStyle.imageImg}
                  src={image}
                  alt="imageImg"
                ></img>
              ))
            ) : (
              <div className={MainLayoutStyle.noRecentView}>
                최근 본 상품이
                <div>없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
