import React, { useState } from "react";
import modalStyle from "../styles/modal.module.css";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import closedImg from "../image/x.png";

function Modal({ isOpen, onClose, shopOwnerUserId, purchasedProductId }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const reviewData = {
        shopOwnerUserId,
        purchasedProductId,
        comment: reviewText,
        avg: rating,
      };
      if (!reviewData.comment || !reviewData.avg) {
        alert("리뷰와 평점을 모두 입력해주세요");
        return;
      }
      const response = await axiosInstance.post("/shop/comment", reviewData);
      alert("리뷰가 작성되었습니다.");
      console.log("리뷰 저장 성공:", response.data);

      // 초기화 및 네비게이션
      setReviewText(""); // 후기 입력 필드 초기화
      setRating(0); // 별점 초기화
      onClose(); // 모달 닫기
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      alert("리뷰 작성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={modalStyle.modalOverlay}>
      <div className={modalStyle.modalContent}>
        <div className={modalStyle.modalClosedBox}>
          <img
            className={modalStyle.modalClosed}
            src={closedImg}
            onClick={onClose}
            alt={closedImg}
          />
        </div>
        <div className={modalStyle.modalName}>상품은 만족하셨나요?</div>
        <div className={modalStyle.ratingBox}>
          <RatingStars rating={rating} setRating={setRating} />
        </div>
        <textarea
          className={modalStyle.textArea}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="후기를 작성해주세요."
        ></textarea>
        <div className={modalStyle.buttonGroup}>
          <button className={modalStyle.registButton} onClick={handleSubmit}>
            작성
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
