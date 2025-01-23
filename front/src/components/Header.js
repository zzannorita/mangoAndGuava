import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Alarm from "./Alarm";
import HeaderStyle from "../styles/header.module.css";
import logo from "../image/logo.png";
import alarmOff from "../image/alarmOff.png";
import chat from "../image/chat.png";
import person from "../image/person.png";
import sell from "../image/sell.png";
import SearchBox from "../components/SearchBox";
import axios from "axios";
import Cookies from "js-cookie";
import axiosInstance from "../axios";
import { useWebSocket } from "../contexts/WebSocketContext";

function Header() {
  ////////////////////////알림///////////////////////////////
  const [clickedAlarm, setClickedAlarm] = useState(false);
  const [userId, setUserId] = useState(null); // 사용자 데이터 상태 추가
  const socket = useRef(null); // useRef를 사용하여 socket 객체 저장
  const [alarmData, setAlarmData] = useState([]);
  const { newAlarm } = useWebSocket(); // 최신 메시지 및 누적 알림 가져오기

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
      const accessToken = Cookies.get("accessToken");
      setUserId(String(Cookies.get("userId")));
      const loginStatus = !!accessToken;
      setIsLogin(loginStatus);
    };
    checkLoginStatus();
  }, []);

  //
  useEffect(() => {
    if (newAlarm) {
      // 원하는 타입별로 처리
      if (newAlarm.type === "notification") {
        // alert(`새로운 알림: ${newMessage.payload.message}`);
        // 알림 처리 로직 추가
        setAlarmData((prev) => {
          // 새로운 알림의 roomId 추출
          const newRoomId = newAlarm.extraData.roomId;
          // 동일한 roomId가 있는 기존 알림을 제거하고 새 알림 추가
          const updatedData = [
            newAlarm,
            ...prev.filter((alarm) => alarm.extraData.roomId !== newRoomId),
          ];
          return updatedData;
        });
      } else {
        console.log("다른 타입의 메시지:", newAlarm);
      }
    }
  }, [newAlarm]); // newMessage가 변경될 때 실행

  ////////////////////////로그아웃///////////////////////////
  const handleLogout = async () => {
    const accessToken = Cookies.get("accessToken");
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
          Cookies.remove("accessToken");
          setIsLogin(false);
          navigate("/");
          console.log("로그아웃성공");
        }
      })
      .catch((error) => {
        console.log("로그아웃 실패", error);
      });
  };

  /////////////////////////로고 리다이렉트///////////////////
  const navigate = useNavigate();

  const logoClickHandler = () => {
    navigate("/");
  };

  ///////////////////미로그인시 페이지 접근 방지//////////////
  const protectedHandler = (event, redirect) => {
    console.log(isLogin);
    event.preventDefault();
    if (isLogin) {
      navigate(redirect);
    } else {
      alert("로그인 후 이용 가능합니다.");
      navigate("/");
    }
  };

  ////////////////알람 내역 가져오기 ////////////////////
  useEffect(() => {
    axiosInstance
      .get("/alarm")
      .then((response) => {
        setAlarmData(response.data.alarmData);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패(알람)", error);
      });
  }, []);

  return (
    <header className="container">
      <div className={HeaderStyle.headerBox}>
        <div className={HeaderStyle.headerTop}>
          <div className={HeaderStyle.headerTopRightBox}>
            <div className={HeaderStyle.loginBox}>
              {isLogin ? (
                <button
                  onClick={handleLogout}
                  className={HeaderStyle.logoutBtn}
                >
                  로그아웃
                </button>
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
              <Alarm alarmClick={clickedAlarm} alarmData={alarmData} />
            </div>
          </div>
        </div>
        <div className={HeaderStyle.headerBottom}>
          <div className={HeaderStyle.logoBox} onClick={logoClickHandler}>
            <div className={HeaderStyle.logo}>
              <img className={HeaderStyle.logoImg} alt="logo" src={logo} />
            </div>
            <div className={HeaderStyle.logoText}>망고와 구아바</div>
          </div>
          <SearchBox />
          <div className={HeaderStyle.rightBox}>
            <div
              className={HeaderStyle.box}
              onClick={(e) => protectedHandler(e, "/sell")}
            >
              <img className="commonImgSize" alt="sell" src={sell} />
              <div className={HeaderStyle.overlay}>판매</div>
            </div>
            <div
              className={HeaderStyle.box}
              onClick={(e) => protectedHandler(e, "/chat")}
            >
              <img className="commonImgSize" alt="chat" src={chat} />
              <div className={HeaderStyle.overlay}>채팅</div>
            </div>
            <div
              className={HeaderStyle.box}
              onClick={(e) => protectedHandler(e, "/myShop")}
            >
              <img className="commonImgSize" alt="perosn" src={person} />
              <Link
                to="/myShop"
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
