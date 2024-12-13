import React from "react";
import ReviewStyle from "../styles/review.module.css";
import shopStyle from "../styles/shop.module.css";
import RatingAvg from "../components/RatingAvg";
import exImg from "../image/userImg.png";
import axiosInstance from "../axios";
import getRelativeTime from "../utils/getRelativeTime";
export default function OthersReview({ shopComment }) {
  return (
    <div className={ReviewStyle.myProductsBox}>
      <div className={shopStyle.myProductsMainBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <div>
              후기 <span className="impact">{shopComment.length} </span>
            </div>
            <RatingAvg
              rating={
                shopComment.reduce((sum, c) => sum + c.avg, 0) /
                  shopComment.length || 0
              }
            />
          </div>
          <div className={shopStyle.mainTopRightBox}>
            <div className={shopStyle.filterTextBox}>별점높은순</div>
            <span>|</span>
            <div className={shopStyle.filterTextBox}>별점낮은순</div>
          </div>
        </div>
        {shopComment && shopComment.length > 0 ? (
          shopComment.map((comment, index) => (
            <div key={index} className={ReviewStyle.reviewBox}>
              <div className={ReviewStyle.reviewList}>
                <img
                  className={ReviewStyle.reviewImg}
                  src={exImg}
                  alt="exImg"
                ></img>
                <div className={ReviewStyle.reviewTextBox}>
                  <div className={ReviewStyle.reviewTopBox}>
                    <div className={ReviewStyle.reviewWriter}>
                      <div>{comment.userNickname}</div>
                      <RatingAvg rating={comment.commentAvg} />
                    </div>
                    <div className={ReviewStyle.reviewTitle}>
                      {comment.productName}
                    </div>
                  </div>
                  <div className={ReviewStyle.reviewContent}>
                    {comment.commentContent}
                  </div>
                </div>
                <div className={ReviewStyle.reviewRegistTime}>
                  {comment.commentDate}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>등록된 후기가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
