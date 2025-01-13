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

function Header() {
  ////////////////////////알림///////////////////////////////
  const [clickedAlarm, setClickedAlarm] = useState(false);
  const [userId, setUserId] = useState(null); // 사용자 데이터 상태 추가
  const [newMessage, setNewMessage] = useState(false); // 새로운 메시지 알림 상태
  const socket = useRef(null); // useRef를 사용하여 socket 객체 저장
  const [alarmData, setAlarmData] = useState([]);

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
      //촐추가//
      setUserId(String(Cookies.get("userId")));
      /////////
      const loginStatus = !!accessToken;
      setIsLogin(loginStatus);
    };
    checkLoginStatus();
  }, []);

  //컴포넌트 마운트될때 로그인상태 확인
  // WebSocket 연결
  useEffect(() => {
    let reconnectAttempts = 0;
    let isWebSocketConnected = false; // WebSocket 연결 여부를 추적

    const connectWebSocket = () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        return; // 이미 연결되어 있으면 함수 종료
      }

      socket.current = new WebSocket("ws://localhost:3001");

      // WebSocket 열리면 userId 전달 (인증)
      socket.current.onopen = () => {
        reconnectAttempts = 0; // 재연결 시도 횟수 초기화
        isWebSocketConnected = true;
        console.log("웹소켓 열림(헤더).");
        console.log("전달할 userId(헤더),", userId);
        socket.current.send(JSON.stringify({ type: "auth", userId }));
      };

      // WebSocket으로 메시지 수신
      socket.current.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        // type이 'notification'인 경우에만 처리

        if (newMessage.type === "notification") {
          console.log("📢 알림 메시지:", newMessage);
          console.log("확인용", alarmData);
          // 알림 처리 로직 추가
          setAlarmData((prev) => {
            // 새로운 알림의 roomId 추출
            const newRoomId = newMessage.extraData.roomId;
            // 동일한 roomId가 있는 기존 알림을 제거하고 새 알림 추가
            const updatedData = [
              ...prev.filter((alarm) => alarm.extraData.roomId !== newRoomId),
              newMessage,
            ];

            console.log("업데이트된 알람 데이터", updatedData);
            return updatedData;
          });
        }
      };

      // WebSocket 연결이 닫혔을 때 재연결 시도
      socket.current.onclose = () => {
        isWebSocketConnected = false;
        reconnectWebSocket();
      };

      // WebSocket 오류 발생 시 재연결 시도
      socket.current.onerror = (error) => {
        console.error("웹소켓 에러 발생 재연결 시도.");
        socket.current.close();
      };
    };

    const reconnectWebSocket = () => {
      if (!isWebSocketConnected && reconnectAttempts < 10) {
        reconnectAttempts++;
        setTimeout(() => {
          connectWebSocket();
        }, reconnectAttempts * 1000); // 시도 횟수에 따라 지연 시간 증가
      } else if (reconnectAttempts >= 10) {
        console.error("WebSocket 재연결 실패. 최대 시도 횟수 초과.");
      }
    };

    connectWebSocket(); // 처음 WebSocket 연결

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [userId]);

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
        console.log(response.data.alarmData);
        setAlarmData(response.data.alarmData);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
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
              <img alt="logo" src={logo} />
            </div>
            <div>망고와 구아바</div>
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
