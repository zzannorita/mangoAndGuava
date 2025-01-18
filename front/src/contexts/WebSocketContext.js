import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [newAlarm, setNewAlarm] = useState(null); // 최신 메시지
  const [newChat, setNewChat] = useState(null);
  const socketRef = useRef(null); // WebSocket 참조
  const userId = Cookies.get("userId"); // 쿠키에서 userId 가져오기

  // WebSocket 연결 및 메시지 수신
  useEffect(() => {
    // userId가 없으면 실행하지 않음
    if (!userId) {
      console.log("로그인이 되지 않아 웹소켓(헤더 contextapi) 연결되지 않음");
      return;
    }
    socketRef.current = new WebSocket("ws://localhost:3001");

    // WebSocket 연결 시
    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      // WebSocket 인증 정보 전송
      socketRef.current.send(JSON.stringify({ type: "auth", userId: userId }));
    };

    // 메시지 수신 처리
    socketRef.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (newMessage.type === "notification") {
        setNewAlarm(newMessage);
      }
      if (newMessage.type === "chatting") {
        setNewChat(newMessage);
      }
    };

    // WebSocket 연결 해제 처리
    return () => {
      if (socketRef.current) {
        socketRef.current.close(); // WebSocket 객체가 존재할 때만 닫음
      }
    };
  }, [userId]); // userId를 의존성에 추가

  // WebSocket 메시지 전송 함수
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket이 연결되지 않았거나 닫힌 상태입니다.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, newChat, newAlarm, socket: socketRef.current }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
