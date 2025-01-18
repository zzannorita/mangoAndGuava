import React, { useEffect, useState } from "react";
import AlarmStyle from "../styles/alarm.module.css";
import imageImg from "../image/image.png";
import axiosInstance from "../axios";

export default function Alarm({ alarmClick, alarmData }) {
  const [imageData, setImageData] = useState({});

  const getProductImage = async (roomId) => {
    const [, , productId] = roomId.split("-");

    try {
      const response = await axiosInstance.get(`/image?id=${productId}`);

      // 첫 번째 이미지만 사용
      const firstImage = response.data.data[0];

      // 만약 첫 번째 이미지가 존재한다면
      if (firstImage) {
        setImageData((prevState) => ({
          ...prevState,
          [productId]: firstImage.productImage, // 첫 번째 이미지만 상태에 저장
        }));
      }
    } catch (error) {
      console.error("이미지 로드 실패", error);
    }
  };

  useEffect(() => {
    alarmData.forEach((alarm) => {
      getProductImage(alarm.extraData.roomId);
    });
  }, [alarmData]);

  //채팅 시간 포매팅
  function formatRelativeTime(targetTime) {
    const now = new Date(); // 현재 시간
    const targetDate = new Date(targetTime); // 매개변수로 받은 시간
    const diff = now - targetDate; // 시간 차이를 밀리초로 계산 (현재 - 대상 시간)

    // 시간 단위로 변환
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 조건에 따라 적절한 메시지 반환
    if (minutes < 1) {
      return "방금 전"; // 1분 미만
    } else if (minutes < 60) {
      return `${minutes}분 전`; // 1시간 미만
    } else if (hours < 24) {
      return `${hours}시간 전`; // 24시간 미만
    } else {
      return `${days}일 전`; // 하루 이상
    }
  }

  const wordLimit = (word) => {
    if (word.length > 15) {
      const updateWord = word.substr(0, 13) + "...";
      return updateWord;
    } else {
      return word;
    }
  };

  return (
    <div
      className={`${AlarmStyle.alarmContainer} ${
        alarmClick ? AlarmStyle.open : ""
      }`}
    >
      <div className={AlarmStyle.alarmText}>알림</div>
      <hr className={AlarmStyle.separator} />
      <div className={AlarmStyle.alarmListBox}>
        {alarmData.map((alarm, index) => {
          const productId = alarm.extraData.roomId.split("-")[2]; // roomId로 productId 추출
          const imageUrl = imageData[productId]; // 상태에서 이미지 URL을 가져옴
          console.log("확인용", alarm);
          return (
            <>
              {alarm.type === "chat" && (
                <div className={AlarmStyle.alarmList} key={index}>
                  <div className={AlarmStyle.alarmListLeftBox}>
                    <img
                      src={imageUrl ? imageUrl : imageImg} // 이미지가 있으면 URL을 사용, 없으면 기본 이미지 사용
                      alt={imageUrl || "default image"}
                      className={AlarmStyle.alarmListImg}
                    />
                    <div>
                      <div className={AlarmStyle.alarmListTitle}>
                        {wordLimit(alarm.extraData.productName)}
                      </div>
                      <div className={AlarmStyle.alarmListContent}>
                        {alarm.extraData.userFromNickname}
                        {" : "}
                        {alarm.extraData.chatContent}
                      </div>
                    </div>
                  </div>
                  <div className={AlarmStyle.alarmListRightBox}>
                    <div className={AlarmStyle.alarmRegistTime}>
                      {formatRelativeTime(alarm.createdAt)}
                    </div>
                  </div>
                </div>
              )}
              {alarm.type === "like" && (
                <div className={AlarmStyle.alarmList} key={index}>
                  <div className={AlarmStyle.alarmListLeftBox}>
                    <img
                      src={imageUrl ? imageUrl : imageImg} // 이미지가 있으면 URL을 사용, 없으면 기본 이미지 사용
                      alt={imageUrl || "default image"}
                      className={AlarmStyle.alarmListImg}
                    />
                    <div>
                      <div className={AlarmStyle.alarmListTitle}>찜 알림</div>
                      <div className={AlarmStyle.alarmListContent}>
                        {wordLimit(alarm.extraData.chatContent)}
                      </div>
                    </div>
                  </div>
                  <div className={AlarmStyle.alarmListRightBox}>
                    <div className={AlarmStyle.alarmRegistTime}>
                      {formatRelativeTime(alarm.createdAt)}
                    </div>
                  </div>
                </div>
              )}
              {alarm.type === "follow" && (
                <div className={AlarmStyle.alarmList} key={index}>
                  <div className={AlarmStyle.alarmListLeftBox}>
                    <img
                      src={imageUrl ? imageUrl : imageImg} // 이미지가 있으면 URL을 사용, 없으면 기본 이미지 사용
                      alt={imageUrl || "default image"}
                      className={AlarmStyle.alarmListImg}
                    />
                    <div>
                      <div className={AlarmStyle.alarmListTitle}>
                        팔로우 알림
                      </div>
                      <div className={AlarmStyle.alarmListContent}>
                        {alarm.extraData.chatContent}
                      </div>
                    </div>
                  </div>
                  <div className={AlarmStyle.alarmListRightBox}>
                    <div className={AlarmStyle.alarmRegistTime}>
                      {formatRelativeTime(alarm.createdAt)}
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
