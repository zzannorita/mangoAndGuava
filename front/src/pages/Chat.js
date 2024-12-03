import React, { useState, useEffect, useRef } from "react";
import chatStyle from "../styles/chat.module.css";
import chatTestImg from "../image/chat.png";
import chatRemove from "../image/x.png";
import axiosInstance from "../axios";

const Chat = () => {
  const [message, setMessage] = useState(""); // 입력 메시지
  const [userId, setUserId] = useState(""); // 현재 사용자 ID
  const [otherUserId, setOtherUserId] = useState(""); // 채팅 상대 ID
  const [chatList, setChatList] = useState([]); // 채팅방 목록
  const [chatEach, setChatEach] = useState([]); // 선택된 채팅방 내역
  const [selectedRoomId, setSelectedRoomId] = useState(null); // 선택된 room_id
  const socket = useRef(null); // WebSocket 연결, 수신, 해제 등 리렌더랑 방지

  // WebSocket 연결
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3001");

    // WebSocket 열리면 userId 전달 (인증)
    socket.current.onopen = () => {
      socket.current.send(JSON.stringify({ type: "auth", userId }));
    };

    // WebSocket으로 메시지 수신
    socket.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);

      // 현재 선택된 채팅방에 해당하는 메시지면 추가
      if (newMessage.roomId === selectedRoomId) {
        setChatEach((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    return () => {
      socket.current.close();
    };
  }, [userId, selectedRoomId]);

  // 채팅방 클릭 시 채팅 내역 가져오기
  const fetchChatRoomMessages = async (roomId, otherUser) => {
    try {
      console.log("클릭됨");
      setOtherUserId(otherUser);
      const response = await axiosInstance.get(
        `http://localhost:3001/chat-each?roomId=${roomId}`
      );
      setChatEach(response.data.data);
      setSelectedRoomId(roomId);
    } catch (error) {
      console.error("채팅 내역 가져오기 실패:", error);
    }
  };

  // 채팅 메시지 전송
  const sendMessage = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      const newMessage = {
        roomId: selectedRoomId,
        user_from: userId, // userFrom -> user_from
        user_to: otherUserId, // userTo -> user_to
        message: message.trim(), // content -> message
      };

      // WebSocket으로 메시지 전송
      socket.current.send(JSON.stringify(newMessage));

      // 로컬에서 즉시 메시지 렌더링 (낙관적 업데이트)
      setChatEach((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  // 입력 내용 변경
  const handleChange = (e) => setMessage(e.target.value);

  // 초기 데이터 로드: 채팅방 목록 및 userId 가져오기
  useEffect(() => {
    axiosInstance.get("http://localhost:3001/chat-my").then((response) => {
      setChatList(response.data.data);
      console.log(response.data.data);
    });

    axiosInstance.get("http://localhost:3001/user-data").then((response) => {
      setUserId(response.data.user.userId);
      console.log(response.data.user.userId);
    });
  }, []);

  return (
    <div className="container">
      <div className={chatStyle.container}>
        <div className={chatStyle.chatContainer}>
          <div className={chatStyle.chatTitleBox}>
            <div className={chatStyle.chatTitleTextBox}>
              <div className={chatStyle.chatTitleText}>채팅</div>
            </div>
          </div>
          <div className={chatStyle.chatBox}>
            {/* 채팅방 목록 */}
            <div className={chatStyle.chatListBox}>
              {chatList.length > 0 ? (
                chatList.map((chat, index) => (
                  <div
                    key={index}
                    className={chatStyle.chatEachBox}
                    onClick={() =>
                      fetchChatRoomMessages(chat.room_id, chat.other_user)
                    }
                  >
                    <div className={chatStyle.chatEachImgBox}>
                      <img src={chatTestImg} alt="chatTestImg" />
                    </div>
                    <div className={chatStyle.chatEachMainBox}>
                      <div className={chatStyle.chatEachNameBox}>
                        <div className={chatStyle.chatEachName}>
                          {chat.other_user}
                        </div>
                        <div className={chatStyle.chatEachDate}>
                          {chat.recent_time}
                        </div>
                      </div>
                      <div className={chatStyle.chatEachContentBox}>
                        {chat.recent_message}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={chatStyle.noChatMessage}>채팅이 없습니다.</div>
              )}
            </div>

            {/* 채팅 내용 */}
            <div className={chatStyle.chattingBox}>
              <div className={chatStyle.chatContentBox}>
                <div className={chatStyle.chatContentTitleBox}>
                  <div className={chatStyle.chatContentNameBox}>
                    <div>
                      {selectedRoomId
                        ? "채팅방 대화 내용"
                        : "채팅방을 선택해주세요."}
                    </div>
                  </div>
                  <div className={chatStyle.chatContentDeleteImg}>
                    <img src={chatRemove} alt="chatRemove" />
                  </div>
                </div>
                <div className={chatStyle.chatContentDetailBox}>
                  {chatEach.length > 0 ? (
                    chatEach.map((message, index) => (
                      <div
                        key={index}
                        className={
                          String(message.user_from) === String(userId)
                            ? chatStyle.myMessage
                            : chatStyle.otherMessage
                        }
                      >
                        {message.message}
                      </div>
                    ))
                  ) : (
                    <div className={chatStyle.emptyChatBox}></div>
                  )}
                </div>
              </div>

              {/* 메시지 입력 */}
              <div className={chatStyle.chatFieldBox}>
                <input
                  type="text"
                  value={message}
                  onChange={handleChange}
                  onKeyDown={sendMessage}
                  placeholder="메시지를 입력하세요..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
