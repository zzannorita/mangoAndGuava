import { Link, useNavigate } from "react-router-dom";
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
import Cookies from "js-cookie";

function Header() {
  ////////////////////////알림///////////////////////////////
  const [clickedAlarm, setClickedAlarm] = useState(false);
  const [userId, setUserId] = useState(null); // 사용자 데이터 상태 추가
  const [newMessage, setNewMessage] = useState(false); // 새로운 메시지 알림 상태
  const socket = useRef(null); // useRef를 사용하여 socket 객체 저장

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
    if (isLogin && userId) {
      const connectWebSocket = () => {
        socket.current = new WebSocket("ws://localhost:3001"); // 웹소켓 서버 주소

        socket.current.onopen = () => {
          console.log("웹소켓 연결됨");
          // 사용자 ID로 웹소켓 연결 설정
          socket.current.send(JSON.stringify({ type: "auth", userId: userId }));
        };

        socket.current.onmessage = (event) => {
          const parsedData = JSON.parse(event.data); // 변수명 변경
          console.log("수신된 메시지:", parsedData);

          // 메시지 타입에 따라 처리
          if (parsedData.type === "chat") {
            // chat 타입인 경우, 채팅 메시지를 처리
            if (parsedData.userTo === userId) {
              setNewMessage(true); // 새로운 채팅 메시지가 오면 알림 표시
              console.log("새로운 채팅 메시지 수신:", parsedData);
            }
          } else if (parsedData.type === "like") {
            // like 타입인 경우, 다른 처리
            console.log("좋아요 메시지 수신:", parsedData);
            // 예시: 좋아요 알림을 처리하거나 UI 업데이트
          }
        };

        socket.current.onclose = () => {
          console.log("웹소켓 연결 종료");
          // 연결이 끊어지면 재연결 시도
          setTimeout(connectWebSocket, 5000); // 5초 후에 재연결 시도
        };
      };

      connectWebSocket();

      return () => {
        if (socket.current) {
          socket.current.close(); // 컴포넌트 언마운트 시 소켓 종료
        }
      };
    }
  }, [isLogin, userId]);

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
    event.preventDefault();
    if (isLogin) {
      navigate(redirect);
    } else {
      alert("로그인 후 이용 가능합니다.");
      navigate("/");
    }
  };

  ////////////////////////웹소켓 연결////////////////////////
  useEffect(() => {
    if (isLogin && userId) {
      let ws;
      const connectWebSocket = () => {
        ws = new WebSocket("ws://localhost:3001"); // 웹소켓 서버 주소

        ws.onopen = () => {
          console.log("웹소켓 연결됨");
          // 사용자 ID로 웹소켓 연결 설정
          ws.send(JSON.stringify({ type: "auth", userId: userId }));
        };

        ws.onmessage = (event) => {
          const messageData = JSON.parse(event.data);
          // 메시지 수신 시 알림 처리 (백엔드에서 전달된 데이터 구조에 맞게 처리)
          if (
            messageData.userTo === userId // userTo가 현재 사용자와 동일한 경우 알림 표시
          ) {
            setNewMessage(true); // 새로운 메시지가 오면 알림 표시
            console.log("새로운 메시지 수신:", messageData);
          }
        };

        ws.onclose = () => {
          console.log("웹소켓 연결 종료");
          // 연결이 끊어지면 재연결 시도
          setTimeout(connectWebSocket, 5000); // 5초 후에 재연결 시도
        };

        setSocket(ws);
      };

      connectWebSocket();

      return () => {
        if (ws) {
          ws.close(); // 컴포넌트 언마운트 시 소켓 종료
        }
      };
    }
  }, [isLogin, userId]);

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
              <Alarm alarmClick={clickedAlarm} />
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
