import React from "react";
import RealTimeStyle from "../styles/realTime.module.css";

export default function RealTime() {
  return (
    <div className="commonStyle">
      <div className={RealTimeStyle.searchContainer}>
        <div className="searchBox">
          <div className={RealTimeStyle.rankNum}>1</div>
          <div className={RealTimeStyle.rankText}>실시간 검색어</div>
        </div>
      </div>
    </div>
  );
}
