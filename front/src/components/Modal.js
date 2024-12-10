import React, { useState } from "react";
import modalStyle from "../styles/modal.module.css";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars"; // 별점 컴포넌트 임포트

function Modal({ isOpen, onClose, onSubmit, shopOwnerUserId }) {
  const [reviewText, setReviewText] = useState(""); // 후기 내용
  const [rating, setRating] = useState(0); // 별점 (avg)
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = () => {
    const reviewData = {
      shopOwnerUserId, // 상점 주 userId
      comment: reviewText, // 후기 내용
      avg: rating, // 별점 (avg)
    };
    navigate("/review");
    onSubmit(reviewData); // 부모 컴포넌트로 데이터 전달
    setReviewText(""); // 후기 입력 필드 초기화
    setRating(0); // 별점 초기화
    onClose(); // 모달 닫기
  };

  return (
    <div className={modalStyle.modalOverlay}>
      <div className={modalStyle.modalContent}>
        <h2>후기 작성</h2>

        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="후기를 작성해주세요."
        ></textarea>

        <div>
          <RatingStars rating={rating} setRating={setRating} />{" "}
          {/* 별점 선택 */}
        </div>

        <div className={modalStyle.buttonGroup}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>작성하기</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
