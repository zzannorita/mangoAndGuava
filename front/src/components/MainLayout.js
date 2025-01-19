import React, { useEffect, useState } from "react";
import Category from "./Category";
import RealTime from "./RealTime";
import MainLayoutStyle from "../styles/mainLayout.module.css";
import exImg from "../image/camera.png";
import eyeImg from "../image/eye.png";
import axiosInstance from "../axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

export default function MainLayout() {
  // 현재 로그인된 사용자 정보 불러오기
  const [nowUserId, setNowUserId] = useState(null);
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      axiosInstance
        .get("/user-data")
        .then((response) => {
          const data = response.data;
          setNowUserId(data.user);
        })
        .catch((error) => {
          console.log("로그인되지 않은 사용자입니다.");
          setNowUserId(null);
        });
    } else {
      setNowUserId("test");
    }
  }, []);

  //경로 변경시마다 렌더링
  const location = useLocation();
  const [productId, setProductId] = useState([]);
  const [productImage, setProductImage] = useState([]);
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
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
    } else {
      setProductId([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (productId.length === 0) return;
    const fetchProductImages = async () => {
      try {
        const imageArray = productId.map((id) => {
          return axiosInstance.get(`/detail?itemId=${id}`).then((response) => {
            const images = response.data.product[0].images || [];
            const image = images[0] || exImg;
            return { id, image };
          });
        });

        const images = await Promise.all(imageArray);
        setProductImage(images.reverse());
      } catch (error) {
        console.error("이미지 로드 에러:", error);
      }
    };

    fetchProductImages();
  }, [productId]);

  const navigate = useNavigate();
  const handleImgClick = (id) => {
    navigate(`/detail?itemId=${id}`);
  };

  return (
    <div className="container">
      <div className={MainLayoutStyle.container}>
        <Category />
        {/* <RealTime /> */}
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
            {!nowUserId ? (
              <div className={MainLayoutStyle.noRecentView}>
                로그인 후 <div>이용해주세요.</div>
              </div>
            ) : productImage.length > 0 ? (
              productImage.map((item, index) => (
                <img
                  key={index}
                  className={MainLayoutStyle.imageImg}
                  src={item.image}
                  alt={`imageImg-${index}`}
                  onClick={() => handleImgClick(item.id)}
                />
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
