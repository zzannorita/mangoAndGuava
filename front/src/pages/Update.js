import React, { useEffect, useState } from "react";
import registStyle from "../styles/regist.module.css";
import cameraImg from "../image/camera.png";
import removeImg from "../image/x.png";
import checkEmptyImg from "../image/checkEmpty.png";
import checkFillImg from "../image/checkFill.png";
import RegistCategory from "./RegistCategory";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import LocationList from "../components/LocationList";
import { useLocation } from "react-router-dom";
import { getCategoryNames } from "../utils/categoryUtils";
export default function Update() {
  ////////////////////수정상품id받아오기/////////////
  const location = useLocation();
  const { productId } = location.state || {}; // state가 없을 때를 대비

  useEffect(() => {
    axiosInstance
      .get(`/detail?itemId=${productId}`)
      .then((response) => {
        const product = response.data.product[0];
        setProductImg(product.images);
        setImages(product.images); // 초기 상태에 기존 이미지 포함
        setProductName(product.productName);
        setProductPrice(product.productPrice);
        setShippingFee(product.isShippingFee === 1); // 1이면 true로 설정
        setProductInfo(product.productInfo);
        setProductState(product.productState);
        setIsTrade(product.isTrade === 1);
        setTradingMethod(product.tradingMethod === 1);
        setTradingAddress(product.tradingAddress);
        setTradeState(product.tradeState);
        // 카테고리 이름 변환
        const categoryCode = product.productCategory;
        const { firstCategory, secondCategory, thirdCategory } =
          getCategoryNames(categoryCode);

        const categoryName = `${firstCategory} > ${secondCategory} > ${thirdCategory}`;

        setProductCategory(categoryCode); // 원본 카테고리 코드 저장
        setProductCategoryName(categoryName); // 변환된 카테고리 이름 저장
        console.log(response.data);
      })
      .catch((error) => {
        console.log("상품 데이터 불러오기 실패", error);
      });
  }, [productId]);

  ////////////////////이미지 업로드//////////////////
  const [productImg, setProductImg] = useState([]); // 서버에서 가져온 기존 이미지
  const [images, setImages] = useState([]); // 현재 등록할 이미지 (기존+new)
  const [imageFiles, setImageFiles] = useState([]); // 새로 업로드된 파일

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

  // 이미지 삭제 핸들러
  const removeImageHandler = (indexToRemove) => {
    const imageToRemove = images[indexToRemove];

    // 기존 이미지인지 확인
    if (productImg.includes(imageToRemove)) {
      setProductImg((prevProductImg) =>
        prevProductImg.filter((img) => img !== imageToRemove)
      );
    } else {
      setImageFiles((prevFiles) =>
        prevFiles.filter(
          (_, index) => index !== indexToRemove - productImg.length
        )
      );
    }

    // UI 상태 업데이트
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  /////////////////////상품명///////////////////////////
  const [productName, setProductName] = useState("");

  /////////////////////카테고리/////////////////////////
  const [productCategory, setProductCategory] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");

  const handleCategorySelect = (categoryCode, categoryName) => {
    setProductCategory(categoryCode);
    setProductCategoryName(categoryName);
  };

  /////////////////////가격////////////////////////////
  const [productPrice, setProductPrice] = useState("");

  /////////////////////배송비별도///////////////////////
  const [isShippingFee, setShippingFee] = useState(false);

  const imageCheckHandler = () => {
    setShippingFee((prevState) => !prevState); // 불리언 값 토글
  };
  ////////////////////////내용///////////////////////////
  const [productInfo, setProductInfo] = useState("");

  /////////////////////상품상태//////////////////////////
  const [productState, setProductState] = useState(false);

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
  const [selectedTradingAddress, setSelectedTradingAddress] = useState("");

  ////////////////////////상태변경///////////////////////
  const [tradeState, setTradeState] = useState("");

  const ExchangeStateHandler = (id) => {
    setTradeState(id);
  };
  ////////////////////////데이터 전송/////////////////////
  const navigate = useNavigate();
  const handleSubmit = () => {
    // 이미지가 등록되지 않으면
    if (images.length === 0) {
      alert("이미지를 등록해주세요.");
      return;
    }

    // 상품명이 입력되지 않으면
    if (productName.trim() === "") {
      alert("상품명을 등록해주세요.");
      return;
    }

    // 카테고리가 선택되지 않으면
    if (productCategory.trim() === "") {
      alert("카테고리를 선택해주세요.");
      return;
    }

    // 가격이 입력되지 않으면
    if (productPrice.trim() === "") {
      alert("가격을 입력해주세요.");
      return;
    }

    // 상품 상태가 선택되지 않으면
    if (productState === null) {
      alert("상품 상태를 선택해주세요.");
      return;
    }

    // 교환 가능 여부가 선택되지 않으면
    if (isTrade === null) {
      alert("교환 가능 여부를 선택해주세요.");
      return;
    }

    // 거래 방법이 선택되지 않으면
    if (tradingMethod === null) {
      alert("거래 방법을 선택해주세요.");
      return;
    }

    // 거래 방법이 직거래일 경우 위치를 입력하지 않으면
    if (tradingMethod === true && tradingAddress.trim() === "") {
      alert("거래 위치를 입력해주세요.");
      return;
    }

    const formData = new FormData();

    //이미지 전송
    imageFiles.forEach((file) => {
      formData.append("productImage", file);
    });
    //나머지 데이터들
    formData.append("productName", productName);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", parseInt(productPrice, 10));
    formData.append("isShippingFee", isShippingFee);
    formData.append("productInfo", productInfo);
    formData.append("productState", productState);
    formData.append("isTrade", isTrade);
    formData.append("tradingMethod", tradingMethod);
    formData.append("tradeState", tradeState);
    formData.append(
      "tradingAddress",
      tradingMethod === false ? null : tradingAddress
    );

    axiosInstance
      .patch("/update-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("상품이 수정되었습니다.");
        navigate(`/detail?itemId=${productId}`);
        setProductName("");
        setProductCategory("");
        setProductPrice("");
        setShippingFee(false);
        setProductInfo("");
        setProductState(null);
        setIsTrade(null);
        setTradingMethod("");
        setTradingAddress("");
        setTradeState("");
        setImages([]);
        setImageFiles([]);
      })
      .catch((error) => {
        console.error("상품 수정 실패", error);
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
        <div className={registStyle.selectedCategory}>
          {productCategoryName}
        </div>
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
            <img
              className={registStyle.checkImg}
              src={isShippingFee ? checkFillImg : checkEmptyImg}
              alt={isShippingFee ? "checkFillImg" : "checkEmptyImg"}
              onClick={imageCheckHandler}
            />
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
                isTrade === true ? registStyle.active : ""
              }`}
              onClick={() => ExchangeClickHandler(true)}
            >
              가능
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                isTrade === false ? registStyle.active : ""
              }`}
              onClick={() => ExchangeClickHandler(false)}
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
                tradingMethod === false ? registStyle.active : ""
              }`}
              onClick={() => deliveryClickHandler(false)}
            >
              택배거래
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                tradingMethod === true ? registStyle.active : ""
              }`}
              onClick={() => deliveryClickHandler(true)}
            >
              직거래
            </div>
          </div>
        </div>
        {tradingMethod === true ? (
          <div className={registStyle.commonContainer}>
            <div className={registStyle.registName}>위치</div>
            <div className={registStyle.registNameBox}>
              <input
                disabled
                value={selectedTradingAddress || tradingAddress}
                onChange={(e) => setTradingAddress(e.target.value)}
                className={registStyle.registInputBox}
                placeholder="거래하실 위치를 선택해주세요."
              />
              <LocationList
                className={registStyle.locationList}
                onLocationSelect={(address) =>
                  setSelectedTradingAddress(address)
                }
              />
            </div>
          </div>
        ) : (
          ""
        )}

        <div className={registStyle.commonContainer}>
          <div className={registStyle.registName}>상태 변경</div>
          <div className={registStyle.productStatusBox}>
            <div
              className={`${registStyle.productStatusText} ${
                tradeState === "판매중" ? registStyle.active : ""
              }`}
              onClick={() => ExchangeStateHandler("판매중")}
            >
              판매중
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                tradeState === "예약중" ? registStyle.active : ""
              }`}
              onClick={() => ExchangeStateHandler("예약중")}
            >
              예약중
            </div>
            <div>|</div>
            <div
              className={`${registStyle.productStatusText} ${
                tradeState === "판매완료" ? registStyle.active : ""
              }`}
              onClick={() => ExchangeStateHandler("판매완료")}
            >
              판매완료
            </div>
          </div>
        </div>
        <div className={registStyle.registButtonBox}>
          <button className={registStyle.registButton} onClick={handleSubmit}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
