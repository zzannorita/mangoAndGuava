import React, { useState } from "react";
import registStyle from "../styles/regist.module.css";
import cameraImg from "../image/camera.png";
import removeImg from "../image/x.png";
import checkEmptyImg from "../image/checkEmpty.png";
import checkFillImg from "../image/checkFill.png";
import RegistCategory from "./RegistCategory";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
export default function Regist() {
  ////////////////////이미지 업로드//////////////////
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const imageUploadHandler = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files
      .slice(0, 5 - images.length)
      .map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
    setImageFiles((prevFiles) => [
      ...prevFiles,
      ...files.slice(0, 5 - prevFiles.length),
    ]);
  };

  const removeImageHandler = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setImageFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  /////////////////////상품명///////////////////////////
  const [productName, setProductName] = useState("");

  /////////////////////카테고리/////////////////////////
  const [productCategory, setProductCategory] = useState("");

  const handleCategorySelect = (categoryCode) => {
    setProductCategory(categoryCode); // selectedCategory 대신 productCategory에 저장
  };

  /////////////////////가격////////////////////////////
  const [productPrice, setProductPrice] = useState("");

  /////////////////////배송비별도///////////////////////
  const [shippingFee, setShippingFee] = useState(false);

  const imageCheckHandler = () => {
    setShippingFee(!shippingFee);
  };

  ////////////////////////내용///////////////////////////
  const [productInfo, setProductInfo] = useState("");

  /////////////////////상품상태//////////////////////////
  const [productState, setProductState] = useState(null);

  const statusClickHandler = (id) => {
    setProductState(id);
  };

  /////////////////////교환가능유무//////////////////////////
  const [isTrade, setIsTrade] = useState(null);

  const ExchangeClickHandler = (id) => {
    setIsTrade(id);
  };

  /////////////////////거래방법//////////////////////////
  const [tradingMethod, setTradingMethod] = useState("");

  const deliveryClickHandler = (id) => {
    setTradingMethod(id);
  };

  //////////////////////위치/////////////////////////////
  const [tradingAddress, setTradingAddress] = useState("");

  ////////////////////////데이터 전송/////////////////////
  const navigate = useNavigate();
  const handleSubmit = () => {
    const formData = new FormData();

    //이미지 전송
    imageFiles.forEach((file) => {
      formData.append("productImage", file);
    });
    //나머지 데이터들
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", parseInt(productPrice, 10));
    formData.append("shippingFee", shippingFee);
    formData.append("productInfo", productInfo);
    formData.append("productState", productState);
    formData.append("isTrade", isTrade);
    formData.append("tradingMethod", tradingMethod);
    formData.append(
      "tradingAddress",
      tradingMethod === "delivery" ? null : tradingAddress
    );

    axiosInstance
      .post("/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("상품이 등록되었습니다.");
        navigate("/");
        setProductName("");
        setProductCategory("");
        setProductPrice("");
        setShippingFee(false);
        setProductInfo("");
        setProductState(null);
        setIsTrade(null);
        setTradingMethod("");
        setTradingAddress("");
        setImages([]);
        setImageFiles([]);
      })
      .catch((error) => {
        console.error("상품 등록 실패", error);
      });
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
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className={registStyle.registInputBox}
            placeholder="상품명을 입력해주세요. (최대 30자)"
          />
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>카테고리</div>
          <RegistCategory onCategorySelect={handleCategorySelect} />
        </div>
        <div>선택된 카테고리 코드: {productCategory}</div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>가격</div>
          <input
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className={registStyle.registInputBox}
            placeholder="가격을 입력해주세요.(원)"
          />
          <div className={registStyle.deliveryFeeBox}>
            <div>배송비포함 </div>
            {shippingFee ? (
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
            value={productInfo}
            onChange={(e) => setProductInfo(e.target.value)}
            className={registStyle.registContentInputBox}
            placeholder="상품에 대한 내용을 상세하게 입력해주세요."
          />
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>상품 상태</div>
          <div className={registStyle.productStatusBox}>
            <div
              className={`${registStyle.productStatusText} ${
                productState === "new" ? registStyle.active : ""
              }`}
              onClick={() => statusClickHandler("new")}
            >
              새상품
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                productState === "old" ? registStyle.active : ""
              }`}
              onClick={() => statusClickHandler("old")}
            >
              중고
            </div>
          </div>
        </div>
        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>교환</div>
          <div className={registStyle.productStatusBox}>
            <div
              className={`${registStyle.productStatusText} ${
                isTrade === "yes" ? registStyle.active : ""
              }`}
              onClick={() => ExchangeClickHandler("yes")}
            >
              가능
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                isTrade === "no" ? registStyle.active : ""
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
                tradingMethod === "delivery" ? registStyle.active : ""
              }`}
              onClick={() => deliveryClickHandler("delivery")}
            >
              택배거래
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                tradingMethod === "direct" ? registStyle.active : ""
              }`}
              onClick={() => deliveryClickHandler("direct")}
            >
              직거래
            </div>
          </div>
        </div>
        {tradingMethod === "direct" ? (
          <div className={registStyle.commonContainer}>
            <div className={registStyle.registName}>위치</div>
            <input
              value={tradingAddress}
              onChange={(e) => setTradingAddress(e.target.value)}
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
          <button className={registStyle.registButton} onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
