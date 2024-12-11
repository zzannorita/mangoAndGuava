import React from "react";
import ReviewStyle from "../styles/review.module.css";
import shopStyle from "../styles/shop.module.css";
import RatingAvg from "../components/RatingAvg";
import exImg from "../image/userImg.png";
export default function Review() {
  return (
    <div className={ReviewStyle.myProductsBox}>
      <div className={shopStyle.myProductsMainBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <div>
              후기 <span className="impact">15 </span>
            </div>
            <RatingAvg />
          </div>
          <div className={shopStyle.mainTopRightBox}>
            <div className={shopStyle.filterTextBox}>별점높은순</div>
            <span>|</span>
            <div className={shopStyle.filterTextBox}>별점낮은순</div>
          </div>
        </div>
        <div className={ReviewStyle.reviewBox}>
          <div className={ReviewStyle.reviewList}>
            <img
              className={ReviewStyle.reviewImg}
              src={exImg}
              alt="exImg"
            ></img>
            <div className={ReviewStyle.reviewTextBox}>
              <div className={ReviewStyle.reviewTopBox}>
                <div className={ReviewStyle.reviewWriter}>
                  <div>슈가야음주운전은안돼</div>
                  <RatingAvg />
                </div>
                <div className={ReviewStyle.reviewTitle}>
                  슈가 런 미공개 포카
                </div>
              </div>
              <div className={ReviewStyle.reviewContent}>
                방탄소년단 00님 음주운전 이슈로 급처했는데 빠르게 구매해주셨어요
              </div>
            </div>
            <div className={ReviewStyle.reviewRegistTime}>3일전</div>
          </div>
          <div className={ReviewStyle.reviewList}>
            <img
              className={ReviewStyle.reviewImg}
              src={exImg}
              alt="exImg"
            ></img>
            <div className={ReviewStyle.reviewTextBox}>
              <div className={ReviewStyle.reviewTopBox}>
                <div className={ReviewStyle.reviewWriter}>
                  <div>초디야사랑햄구</div>
                  <RatingAvg />
                </div>
                <div className={ReviewStyle.reviewTitle}>
                  은평구 신초디 인형
                </div>
              </div>
              <div className={ReviewStyle.reviewContent}>
                거래자가 인형에 대한 애착이 매우 보였어요. 쿨거래 감사합니다!
              </div>
            </div>
            <div className={ReviewStyle.reviewRegistTime}>5분전</div>
          </div>
        </div>
      </div>
    </div>
  );
}
