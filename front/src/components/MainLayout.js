import React from "react";
import Category from "./Category";
import RealTime from "./RealTime";
import MainLayoutStyle from "../styles/mainLayout.module.css";
import exImg from "../image/exImg.png";
import eyeImg from "../image/eye.png";

export default function MainLayout() {
  return (
    <div className="container">
      <div className={MainLayoutStyle.container}>
        <Category />
        <RealTime />
        {/* 최근본상품 */}
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
            <img
              className={MainLayoutStyle.imageImg}
              src={exImg}
              alt="imageImg"
            ></img>
            <img
              className={MainLayoutStyle.imageImg}
              src={exImg}
              alt="imageImg"
            ></img>
            <img
              className={MainLayoutStyle.imageImg}
              src={exImg}
              alt="imageImg"
            ></img>
            <img
              className={MainLayoutStyle.imageImg}
              src={exImg}
              alt="imageImg"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
