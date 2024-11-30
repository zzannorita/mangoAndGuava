import React from "react";
import DetailStyle from "../styles/detail.module.css";
import camera from "../image/camera.png";
import emptyHeartImg from "../image/emptyHeart.png";
import eyeImg from "../image/eye.png";
export default function Detail() {
  return (
    <div className="container">
      <div className={DetailStyle.productInfoBox}>
        <div className={DetailStyle.productCategoryBox}>전체 의류</div>

        <div className={DetailStyle.productInfoBottomBox}>
          <div className={DetailStyle.productInfoLeftBox}>
            <img className={DetailStyle.productImg} alt="camera" src={camera} />
          </div>
          <div className={DetailStyle.productInfoMiddleBox}>
            <div className={DetailStyle.productNameBox}>망고팝니다</div>
            <div className={DetailStyle.productPriceBox}>13000원</div>
            <div className={DetailStyle.productDetailBox}>
              <div className={DetailStyle.tradeState}>
                <div>상태</div>
                <div>중고</div>
              </div>
              <div className={DetailStyle.tradingMethod}>
                <div>거래방법</div>
                <div>직거래</div>
              </div>
              <div className={DetailStyle.tradingAddress}>
                <div>직거래 위치</div>
                <div>서울 은평구</div>
              </div>
              <div className={DetailStyle.isShippingFee}>
                <div>배송비</div>
                <div>-</div>
              </div>
            </div>
          </div>
          <div className={DetailStyle.productInfoRightBox}>
            <div className={DetailStyle.productInfoTopBox}>
              <div className={DetailStyle.productDetainInfoBox}>
                <div className={DetailStyle.productDetainInfoBoxes}>
                  <img
                    src={emptyHeartImg}
                    alt="emptyHeartImg"
                    className="smallImgSize"
                  ></img>
                  <div>95</div>
                </div>
                <div className={DetailStyle.productDetainInfoBoxes}>
                  <img src={eyeImg} alt="eyeImg" className="smallImgSize"></img>
                  <div>100</div>
                </div>
                <div className={DetailStyle.productDetainInfoBoxes}>채팅 5</div>
                <div className={DetailStyle.productDetainInfoBoxes}>32분전</div>
              </div>
            </div>
            <div className={DetailStyle.chattingBtnBox}>채팅하기</div>
          </div>
        </div>
      </div>
      <div className={DetailStyle.productContentBox}>
        <div className={DetailStyle.productContentBoxName}>상품 정보</div>
        <div className={DetailStyle.productContent}>내용들이 들어올것임</div>
      </div>
    </div>
  );
}
