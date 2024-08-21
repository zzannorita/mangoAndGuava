import React, { useState } from "react";
import registStyle from "../styles/regist.module.css";
import cameraImg from "../image/camera.png";
import removeImg from "../image/x.png";
import checkEmptyImg from "../image/checkEmpty.png";
import checkFillImg from "../image/checkFill.png";
import RegistCategory from "./RegistCategory";
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

  /////////////////////배송비별도///////////////////////
  const [isCheckedImg, setCheckedImg] = useState(false);

  const imageCheckHandler = () => {
    setCheckedImg(!isCheckedImg);
  };

  /////////////////////상품상태//////////////////////////
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusClickHandler = (id) => {
    setSelectedStatus(id);
  };

  /////////////////////교환가능유무//////////////////////////
  const [selectedExchange, setSelectedExchange] = useState(null);

  const ExchangeClickHandler = (id) => {
    setSelectedExchange(id);
  };

  /////////////////////거래방법//////////////////////////
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const deliveryClickHandler = (id) => {
    setSelectedDelivery(id);
  };
  return (
    <div className="container">
      <div className={registStyle.container}>
        <div className={registStyle.registTitle}>상품등록</div>
        <div className={registStyle.imageContainer}>
          <div className={registStyle.imgCountAlarm}>
            이미지를 등록해주세요 (최대 5개)
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
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>상품명</div>
          <input
            className={registStyle.registInputBox}
            placeholder="상품명을 입력해주세요. (최대 30자)"
          />
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>카테고리</div>
          <RegistCategory />
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>가격</div>
          <input
            className={registStyle.registInputBox}
            placeholder="가격을 입력해주세요.(원)"
          />
          <div className={registStyle.deliveryFeeBox}>
            <div>배송비포함 </div>
            {isCheckedImg ? (
              <img
                className={registStyle.checkImg}
                src={checkFillImg}
                alt="checkFillImg"
                onClick={imageCheckHandler}
              />
            ) : (
              <img
                className={registStyle.checkImg}
                src={checkEmptyImg}
                alt="checkEmptyImg"
                onClick={imageCheckHandler}
              />
            )}
          </div>
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>내용</div>
          <textarea
            className={registStyle.registContentInputBox}
            placeholder="상품에 대한 내용을 상세하게 입력해주세요."
          />
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>상품 상태</div>
          <div className={registStyle.productStatusBox}>
            <div
              className={`${registStyle.productStatusText} ${
                selectedStatus === "new" ? registStyle.active : ""
              }`}
              onClick={() => statusClickHandler("new")}
            >
              새상품
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                selectedStatus === "old" ? registStyle.active : ""
              }`}
              onClick={() => statusClickHandler("old")}
            >
              중고
            </div>
          </div>
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>교환 가능 유무</div>
          <div className={registStyle.productStatusBox}>
            <div
              className={`${registStyle.productStatusText} ${
                selectedExchange === "yes" ? registStyle.active : ""
              }`}
              onClick={() => ExchangeClickHandler("yes")}
            >
              가능
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                selectedExchange === "no" ? registStyle.active : ""
              }`}
              onClick={() => ExchangeClickHandler("no")}
            >
              불가능
            </div>
          </div>
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>거래 방법</div>
          <div className={registStyle.productStatusBox}>
            <div
              className={`${registStyle.productStatusText} ${
                selectedDelivery === "delivery" ? registStyle.active : ""
              }`}
              onClick={() => deliveryClickHandler("delivery")}
            >
              택배거래
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                selectedDelivery === "direct" ? registStyle.active : ""
              }`}
              onClick={() => deliveryClickHandler("direct")}
            >
              직거래
            </div>
          </div>
        </div>
        {selectedDelivery === "direct" ? (
          <div className={registStyle.commonContainer}>
            <div className={registStyle.registName}>위치</div>
            <input
              className={registStyle.registInputBox}
              placeholder="거래하실 위치를 상세하게 입력해주세요."
            />
          </div>
        ) : (
          ""
        )}

        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>키워드</div>
          <input
            className={registStyle.registInputBox}
            placeholder="키워드를 입력해주세요. (최대 5개)"
          />
        </div>
        <div className={registStyle.registButtonBox}>
          <button className={registStyle.registButton}>등록</button>
        </div>
      </div>
    </div>
  );
}
