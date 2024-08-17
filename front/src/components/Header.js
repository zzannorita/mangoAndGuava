import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Alarm from "./Alarm";
import HeaderStyle from "../styles/header.module.css";
import logo from "../image/logo.png";
import alarmOff from "../image/alarmOff.png";
import chat from "../image/chat.png";
import person from "../image/person.png";
import sell from "../image/sell.png";
import SearchBox from "../components/SearchBox";
import axios from "axios";

function Header() {
  ////////////////////////알림///////////////////////////////
  const [clickedAlarm, setClickedAlarm] = useState(false);

  const handleClick = () => {
    setClickedAlarm((alarmClick) => !alarmClick);
    console.log("ClickedAlarm 상태 변경:", clickedAlarm);
  };

  ////////////////////////로그인/////////////////////////////
  const REST_API_KEY = "533d7762a1ee320813d03cb068e53ada";
  const REDIRECT_URI = "http://localhost:3001/auth/kakao/callback";
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const [isLogin, setIsLogin] = useState(false);

  //컴포넌트 마운트될때 로그인상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = getCookie("accessToken");
      setIsLogin(!!accessToken); // 토큰이 있으면 로그인 상태로 설정
    };
    checkLoginStatus();
  }, []);

  const loginHandler = () => {
    window.location.href = link;
  };

  ////////////////////////로그아웃///////////////////////////
  const handleLogout = async () => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      console.error("토큰이 없음");
      return;
    }
    axios
      .post("http://localhost:3001/logout", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("로그아웃성공");
        }
      })
      .catch((error) => {
        console.log("로그아웃 실패", error);
      });
  };

  // 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  return (
    <header className="container">
      <div className={HeaderStyle.headerBox}>
        <div className={HeaderStyle.headerTop}>
          <div className={HeaderStyle.headerTopRightBox}>
            <div className={HeaderStyle.loginBox}>
              {isLogin ? (
                <div onClick={handleLogout} className={HeaderStyle.logoutBtn}>
                  로그아웃
                </div>
              ) : (
                <a href={link} className={HeaderStyle.link}>
                  로그인/회원가입
                </a>
              )}
            </div>

            <div className="commonStyle">
              <img
                className={HeaderStyle.alarmImg}
                alt="alarmOff"
                src={alarmOff}
                onClick={handleClick}
              />
              <Alarm alarmClick={clickedAlarm} />
            </div>
          </div>
        </div>
        <div className={HeaderStyle.headerBottom}>
          <div className={HeaderStyle.logoBox}>
            <div className={HeaderStyle.logo}>
              <img alt="logo" src={logo} />
            </div>
            <div>망고와 구아바</div>
          </div>
          <SearchBox />
          <div className={HeaderStyle.rightBox}>
            <div className={HeaderStyle.box}>
              <img className="commonImgSize" alt="sell" src={sell} />
              <div className={HeaderStyle.overlay}>판매</div>
            </div>
            <div className={HeaderStyle.box}>
              <img className="commonImgSize" alt="chat" src={chat} />
              <div className={HeaderStyle.overlay}>채팅</div>
            </div>
            <div className={HeaderStyle.box}>
              <img className="commonImgSize" alt="perosn" src={person} />
              <Link
                to="/myshop"
                className={`${HeaderStyle.overlay} ${HeaderStyle.link}`}
              >
                마이
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
