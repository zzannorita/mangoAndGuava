import React, { useState, useEffect } from "react";

const ChatTest = () => {
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("room1"); // 채팅방 ID
  const [userFrom, setUserFrom] = useState("User1"); // 보내는 사람
  const [userTo, setUserTo] = useState("User2"); // 받는 사람
  const [message, setMessage] = useState(""); // 메시지
  const [chatLog, setChatLog] = useState([]); // 채팅 내역

  useEffect(() => {
    // 웹소켓 연결 설정
    const createWebSocketConnection = () => {
      const socket = new WebSocket("ws://localhost:3001"); // 백엔드 웹소켓 주소

      // 연결 시 처리
      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      // 메시지 수신 시 처리
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChatLog((prevMessages) => [
          ...prevMessages,
          {
            userFrom: data.userFrom,
            userTo: data.userTo,
            content: data.content,
            timestamp: data.timestamp,
          },
        ]);
      };

      // 연결 종료 시 처리
      socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        // 연결이 끊어졌을 때 3초 후 재연결 시도
        setTimeout(createWebSocketConnection, 3000);
      };

      // 에러 처리
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      setSocket(socket);
    };

    createWebSocketConnection();

    // 컴포넌트가 언마운트 될 때 웹소켓 연결 종료
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message) {
      const messageData = {
        roomId,
        userFrom,
        userTo,
        content: message,
      };

      socket.send(JSON.stringify(messageData)); // 서버로 메시지 전송
      setMessage(""); // 입력창 초기화
    } else {
      console.error("WebSocket is not open or message is empty.");
    }
  };

  return (
    <div>
      <h2>Real-time Chat</h2>
      <div>
        <input
          type="text"
          value={userFrom}
          onChange={(e) => setUserFrom(e.target.value)}
          placeholder="Your Name"
        />
        <input
          type="text"
          value={userTo}
          onChange={(e) => setUserTo(e.target.value)}
          placeholder="Receiver's Name"
        />
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
      </div>
      <button onClick={sendMessage}>Send Message</button>

      <div>
        <h3>Chat Log</h3>
        <ul>
          {chatLog.map((msg, index) => (
            <li key={index}>
              <strong>
                {msg.userFrom} to {msg.userTo}:{" "}
              </strong>
              {msg.content} <small>({msg.timestamp})</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatTest;
