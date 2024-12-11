import React, { useState } from "react";
import modalStyle from "../styles/modal.module.css";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars"; // 별점 컴포넌트 임포트

function Modal({ isOpen, onClose, shopOwnerUserId }) {
  const [reviewText, setReviewText] = useState(""); // 후기 내용
  const [rating, setRating] = useState(0); // 별점 (avg)
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const reviewData = {
        shopOwnerUserId, // 상점 주 userId
        comment: reviewText, // 후기 내용
        avg: rating, // 별점 (avg)
      };
      console.log("리뷰", reviewData);
      const response = await axiosInstance.post("/shop/comment", reviewData);
      console.log("리뷰 저장 성공:", response.data);

      // 초기화 및 네비게이션
      setReviewText(""); // 후기 입력 필드 초기화
      setRating(0); // 별점 초기화
      onClose(); // 모달 닫기
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("리뷰 저장 실패:", error);
      alert("리뷰 작성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
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
