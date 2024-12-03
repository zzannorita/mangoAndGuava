import React, { useState, useEffect, useRef } from "react";
import chatStyle from "../styles/chat.module.css";
import chatTestImg from "../image/userImg.png";
import mangoImg from "../image/logo.png";
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
  const [currentOtherUserId, setCurrentOtherUserId] = useState("");

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

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        roomId: selectedRoomId,
        user_from: userId,
        user_to: otherUserId,
        message: message.trim(),
      };

      // WebSocket으로 메시지 전송
      socket.current.send(JSON.stringify(newMessage));

      // 로컬에서 즉시 메시지 렌더링
      setChatEach((prevMessages) => [...prevMessages, newMessage]);
      setMessage(""); // 입력 필드 초기화
    }
  };

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
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
                          {formatRelativeTime(chat.recent_time)}
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
                        ? `${otherUserId} 님과의 대화`
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
                            ? chatStyle.myMessageWrapper
                            : chatStyle.otherMessageWrapper
                        }
                      >
                        <div
                          className={
                            String(message.user_from) === String(userId)
                              ? chatStyle.myMessage
                              : chatStyle.otherMessage
                          }
                        >
                          {message.message}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={chatStyle.emptyChatBox}></div>
                  )}
                </div>
              </div>

              {/* 메시지 입력 */}
              <div className={chatStyle.chatFieldContainer}>
                <div className={chatStyle.chatFieldBox}>
                  <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    onKeyDown={sendMessage}
                    placeholder="메시지를 입력하세요..."
                    className={chatStyle.chatInput} // 스타일 클래스 추가
                  />
                  <button
                    onClick={() => handleSendMessage()} // 버튼 클릭 시 메시지 전송
                    className={chatStyle.sendButton} // 스타일 클래스 추가
                  >
                    <img
                      src={mangoImg} // 전송 버튼의 이미지 경로
                      alt="Send"
                      className={chatStyle.sendIcon}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
