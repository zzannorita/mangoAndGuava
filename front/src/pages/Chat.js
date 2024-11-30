import React, { useState, useEffect } from "react";
import chatStyle from "../styles/chat.module.css";
import chatTestImg from "../image/chat.png";
import chatRemove from "../image/x.png";
import axiosInstance from "../axios";

const Chat = () => {
  const [message, setMessage] = useState(""); // 인풋에 입력된 메시지를 상태로 관리
  const [userId, setUserId] = useState("");
  const [chatList, setChatList] = useState([]);
  const [chatEach, setChatEach] = useState([]); // 선택된 채팅방 내역 상태
  const [selectedRoomId, setSelectedRoomId] = useState(null); // 현재 선택된 room_id

  // 메시지를 전송하는 함수 (엔터키를 누를 때 실행)
  const sendMessage = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      console.log("채팅 전송:", message); // 실제로 메시지를 서버에 전송하는 로직
      setMessage(""); // 메시지 전송 후 인풋 초기화
    }
  };

  // 인풋 내용 변경 함수
  const handleChange = (e) => {
    setMessage(e.target.value); // 인풋에 입력된 텍스트를 상태로 관리
  };

  // 채팅방 클릭 시 room_id로 채팅 내역 가져오기
  const fetchChatRoomMessages = async (roomId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3001/chat-each?roomId=${roomId}`
      );
      setChatEach(response.data.data); // 채팅 내역 저장
      console.log(response.data.data);
      setSelectedRoomId(roomId); // 선택된 채팅방 ID 저장
    } catch (error) {
      console.error("채팅 내역 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    axiosInstance
      .get("http://localhost:3001/chat-my")
      .then((response) => {
        const data = response.data.data;
        setChatList(data);
        console.log(data);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
      });
  }, []);

  //자신의 userId를 얻어오기 위함
  useEffect(() => {
    axiosInstance
      .get("http://localhost:3001/user-data")
      .then((response) => {
        const data = response.data.user;
        setUserId(data.userId);
        //console.log(data);
      })
      .catch((error) => {
        console.log("데이터 가져오기 실패", error);
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
            <div className={chatStyle.chatTitleSearch}></div>
          </div>
          <div className={chatStyle.chatBox}>
            {/* 채팅방 리스트 */}
            <div className={chatStyle.chatListBox}>
              {chatList.length > 0 ? (
                chatList.map((chat, index) => (
                  <div
                    key={index}
                    className={chatStyle.chatEachBox}
                    onClick={() => fetchChatRoomMessages(chat.room_id)}
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

            {/* 선택된 채팅방의 채팅 내역 */}
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
                          message.user_from === `${userId}`
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

              {/* 입력창 */}
              <div className={chatStyle.chatFieldBox}>
                <div className={chatStyle.chatInputContainer}>
                  <input
                    type="text"
                    className={chatStyle.chatInput}
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
    </div>
  );
};

export default Chat;
