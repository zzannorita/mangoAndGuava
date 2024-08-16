import React from "react";
import AlarmStyle from "../styles/alarm.module.css";
import imageImg from "../image/image.png";
export default function Alarm({ alarmClick }) {
  return (
    <div
      className={`${AlarmStyle.alarmContainer} ${
        alarmClick ? AlarmStyle.open : ""
      }`}
    >
      <div className={AlarmStyle.alarmText}>알림</div>
      <hr className={AlarmStyle.separator} />
      <div className={AlarmStyle.alarmListBox}>
        <div className={AlarmStyle.alarmList}>
          <div className={AlarmStyle.alarmListLeftBox}>
            <img
              src={imageImg}
              alt={imageImg}
              className={AlarmStyle.alarmListImg}
            ></img>
            <div>
              <div className={AlarmStyle.alarmListTitle}>
                나이키 H03-w 레깅스
              </div>
              {/* 사용자가 등록한 키워드, 등등 제목 */}
              <div className={AlarmStyle.alarmListContent}>
                나이키 레깅스 새상품
              </div>
              {/* 제품의 제목 등등 */}
            </div>
          </div>
          <div className={AlarmStyle.alarmListRightBox}>
            <div className={AlarmStyle.alarmRegistTime}>5분전</div>
          </div>
        </div>
        <div className={AlarmStyle.alarmList}>
          <div className={AlarmStyle.alarmListLeftBox}>
            <img
              src={imageImg}
              alt={imageImg}
              className={AlarmStyle.alarmListImg}
            ></img>
            <div>
              <div className={AlarmStyle.alarmListTitle}>
                아이폰 15 프로 맥스
              </div>
              {/* 사용자가 등록한 키워드, 등등 제목 */}
              <div className={AlarmStyle.alarmListContent}>
                아이폰 15 프로 맥스 중고
              </div>
              {/* 제품의 제목 등등 */}
            </div>
          </div>
          <div className={AlarmStyle.alarmListRightBox}>
            <div>5분전</div>
          </div>
        </div>
      </div>
    </div>
  );
}
