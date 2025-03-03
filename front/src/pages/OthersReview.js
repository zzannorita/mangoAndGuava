import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewStyle from "../styles/review.module.css";
import shopStyle from "../styles/shop.module.css";
import RatingAvg from "../components/RatingAvg";
import exImg from "../image/userImg.png";
import getRelativeTime from "../utils/getRelativeTime";
import { sortComments2 } from "../utils/sortUtils";
import axiosInstance from "../axios";
import Cookies from "js-cookie";
export default function OthersReview({ shopComment }) {
  const [sortedComments, setSortedComments] = useState([...shopComment]);
  const [sortType, setSortType] = useState("newest");

  // 정렬 함수 호출
  useEffect(() => {
    const updatedComments = sortComments2([...shopComment], sortType);
    setSortedComments(updatedComments);
  }, [shopComment, sortType]);

  // 로그인된 사용자 정보 불러오기
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
          console.error("로그인되지 않은 사용자입니다.");
          setNowUserId(null);
        });
    } else {
      setNowUserId("test");
    }
  }, []);

  //상점으로 이동
  const navigate = useNavigate();
  const handleEnterShop = (commentUserId) => {
    if (nowUserId && String(nowUserId.userId) === String(commentUserId)) {
      navigate("/myShop");
    } else {
      navigate(`/yourShop?userId=${commentUserId}`);
    }
  };
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
            <div
              className={shopStyle.filterTextBox}
              onClick={() => setSortType("highest")}
            >
              별점높은순
            </div>
            <span>|</span>
            <div
              className={shopStyle.filterTextBox}
              onClick={() => setSortType("lowest")}
            >
              별점낮은순
            </div>
          </div>
        </div>
        {sortedComments && sortedComments.length > 0 ? (
          sortedComments.map((comment, index) => (
            <div key={index} className={ReviewStyle.reviewBox}>
              <div className={ReviewStyle.reviewList}>
                <img
                  className={ReviewStyle.reviewImg}
                  src={
                    comment.userInfo.profileImage
                      ? `http://localhost:3001/profileImage/${comment.userInfo.profileImage}`
                      : exImg
                  }
                  alt="exImg"
                  onClick={() => handleEnterShop(comment.commentUserId)}
                ></img>
                <div className={ReviewStyle.reviewTextBox}>
                  <div className={ReviewStyle.reviewTopBox}>
                    <div className={ReviewStyle.reviewWriter}>
                      <div>
                        {comment.userInfo.nickname || comment.userInfo.userId}
                      </div>
                      <RatingAvg rating={comment.avg} />
                    </div>
                    <div className={ReviewStyle.reviewTitle}>
                      {comment.productName}
                    </div>
                  </div>
                  <div className={ReviewStyle.reviewContent}>
                    {comment.comment}
                  </div>
                </div>
                <div className={ReviewStyle.reviewRegistTime}>
                  {getRelativeTime(comment.commentDate)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={ReviewStyle.noReviewBox}>등록된 후기가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
