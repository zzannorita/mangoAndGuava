import React, { useState } from "react";
import registStyle from "../styles/regist.module.css";
import cameraImg from "../image/camera.png";
import removeImg from "../image/x.png";
export default function Regist() {
  ////////////////////이미지 업로드//////////////////
  const [images, setImages] = useState([]);

  const imageUploadHandler = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files
      .slice(0, 5 - images.length)
      .map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImageHandler = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };
  return (
    <div className="container">
      <div className={registStyle.container}>
        <div>상품등록</div>
        <div className={registStyle.imageContainer}>
          <div className={registStyle.imgCountAlarm}>
            이미지를 등록해주세요. 최대 5개
          </div>
          <div className={registStyle.imageSection}>
            <label htmlFor="imageUpload">
              <div className={registStyle.imageBox}>
                <img
                  src={cameraImg}
                  alt="cameraImg"
                  className={registStyle.cameraImg}
                />
                <div className={registStyle.cameraText}>이미지 등록</div>

                <input
                  className={registStyle.imgInputBox}
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={imageUploadHandler}
                />
              </div>
            </label>
            {images.map((image, index) => (
              <div key={index} className={registStyle.imageBox}>
                <img
                  src={image}
                  alt={`uploaded ${index + 1}`}
                  className={registStyle.registImg}
                />
                <img
                  className={registStyle.removeButton}
                  onClick={() => removeImageHandler(index)}
                  src={removeImg}
                  alt="removeImg"
                ></img>
              </div>
            ))}
          </div>
        </div>
        <div className={registStyle.productNameContainer}>상품명</div>
        <div className={registStyle.categoryContainer}>카테고리</div>
        <div className={registStyle.priceContainer}>가격</div>
        <div className={registStyle.contentContainer}>내용</div>
        <div className={registStyle.productStatusContainer}>상품상태</div>
        <div className={registStyle.dealFormContainer}>거래방법</div>
        <div className={registStyle.locationContainer}>위치</div>
        <div className={registStyle.keywordContainer}>키워드</div>
      </div>
    </div>
  );
}
