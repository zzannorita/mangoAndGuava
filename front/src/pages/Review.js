import React, { useEffect, useState } from "react";
import ReviewStyle from "../styles/review.module.css";
import shopStyle from "../styles/shop.module.css";
import RatingAvg from "../components/RatingAvg";
import exImg from "../image/userImg.png";
import axiosInstance from "../axios";
import getRelativeTime from "../utils/getRelativeTime";
export default function Review() {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState("");
  useEffect(() => {
    axiosInstance
      .get("/myShop")
      .then((response) => {
        const data = response.data;
        console.log(data);
        const commentCount = data.commentCount;
        setCommentCount(commentCount.ratingAvg);
        const commentData = data.commentData || [];
        const arrangeComments = commentData.map((comment) => {
          const user = comment.userInfo; // 각 댓글의 userInfo 접근
          return {
            productId: comment.purchasedProductId,
            productName: comment.productName,
            userNickname: user?.nickname || user?.userId,
            commentContent: comment.comment,
            commentDate: getRelativeTime(comment.commentDate),
            commentAvg: comment.avg,
          };
        });

        setComments(arrangeComments);
        console.log("arrangeComments:", arrangeComments);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패", error);
      });
  }, []);

  return (
    <div className={ReviewStyle.myProductsBox}>
      <div className={shopStyle.myProductsMainBox}>
        <div className={shopStyle.mainTopBox}>
          <div className={shopStyle.mainTopLeftBox}>
            <div>
              후기 <span className="impact">{comments.length} </span>
            </div>
            <RatingAvg rating={commentCount} />
          </div>
          <div className={shopStyle.mainTopRightBox}>
            <div className={shopStyle.filterTextBox}>별점높은순</div>
            <span>|</span>
            <div className={shopStyle.filterTextBox}>별점낮은순</div>
          </div>
        </div>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
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
