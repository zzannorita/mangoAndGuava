import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import chatStyle from "../styles/chat.module.css";
import chatTestImg from "../image/userImg.png";
import mangoImg from "../image/logo.png";
import axiosInstance from "../axios";
import Modal from "../components/Modal";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useMediaQuery } from "react-responsive";

const Chat = ({ isModalOpen, setIsModalOpen }) => {
  const [message, setMessage] = useState(""); // 입력 메시지
  const [userId, setUserId] = useState(""); // 현재 사용자 ID
  const [otherUserId, setOtherUserId] = useState(""); // 채팅 상대 ID
  const [chatList, setChatList] = useState([]); // 채팅방 목록
  const [chatEach, setChatEach] = useState([]); // 선택된 채팅방 내역
  const [selectedRoomId, setSelectedRoomId] = useState(null); // 선택된 room_id
  const [selectedProductData, setSelectedProductData] = useState([]);
  const [selectedOtherUserData, setSelectedOtherUserData] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const chatContentRef = useRef(null); //채팅 스크롤참조 위함
  const isMobile = useMediaQuery({ maxWidth: 1000 });

  const location = useLocation();

  const { newChat, sendMessage } = useWebSocket(); // 최신 메시지 및 누적 알림 가져오기

  //채팅하기 눌러서 온 변수들
  const { ownerUserId = null, productId = null } = location.state || {}; //디테일 페이지에서 온 정보

  // 채팅 내용이 업데이트될 때마다 스크롤을 맨 아래로 내리기
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatEach]); // 채팅내역이 업데이트될 때마다 실행

  useEffect(() => {
    if (newChat) {
      // 원하는 타입별로 처리
      if (newChat.type === "chatting") {
        // alert(`새로운 알림: ${newMessage.payload.message}`);
        // 알림 처리 로직 추가
        const updatedMessage = {
          room_id: newChat.roomId,
          user_from: newChat.userFrom,
          user_to: newChat.userTo,
          message: newChat.content,
          created_at: newChat.timestamp,
        };

        if (
          updatedMessage.room_id === selectedRoomId &&
          String(userId) !== String(updatedMessage.user_from)
        ) {
          setChatEach((prevMessages) => [...prevMessages, updatedMessage]);
        }
      }
    }
  }, [newChat]); // newMessage가 변경될 때 실행

  useEffect(() => {
    if (!ownerUserId || !productId || !userId) return; // userId가 설정된 이후에만 실행
    const roomId = userId + "-" + ownerUserId + "-" + productId;
    const newMessage = {
      type: "chat",
      room_id: roomId,
      user_from: String(userId),
      user_to: String(otherUserId),
      message: `${ownerUserId}님 상품 ${productId} 관련 채팅드립니다.`,
    };

    const firstSendMessage = async () => {
      const chatData = await axiosInstance.get(`chat-each?roomId=${roomId}`);
      if (!(chatData.data.data.length > 0)) {
        //채팅방이 존재하지 않을경우
        sendMessage(JSON.stringify(newMessage));
        setSelectedRoomId(roomId);
        fetchChatRoomMessages(roomId, ownerUserId);
      } else {
        setSelectedRoomId(roomId);
        fetchChatRoomMessages(roomId, ownerUserId);
      }
    };

    firstSendMessage();
  }, [ownerUserId, productId, userId]); // userId가 설정된 이후 실행

  // 채팅방 클릭 시 채팅 내역 가져오기
  const fetchChatRoomMessages = async (roomId, otherUser) => {
    try {
      const [user1, user2, productId] = roomId.split("-");
      setOtherUserId(otherUser);
      const response = await axiosInstance.get(
        `http://localhost:3001/chat-each?roomId=${roomId}`
      );
      setChatEach(response.data.data);
      setSelectedRoomId(roomId);
      const productData = await axiosInstance.get(
        `http://localhost:3001/product?productId=${productId}`
      );
      setSelectedProductData(productData.data.product[0]);
      if (String(user1) === String(userId)) {
        const myUserData = await axiosInstance.get(
          `http://localhost:3001/user-data`
        );
        setSelectedUserData(myUserData.data.user);
        const otherUserData = await axiosInstance.get(
          `http://localhost:3001/user-data/other?userId=${user2}`
        );
        setSelectedOtherUserData(otherUserData.data.user);
      } else {
        const myUserData = await axiosInstance.get(
          `http://localhost:3001/user-data`
        );
        setSelectedUserData(myUserData.data.user);
        const otherUserData = await axiosInstance.get(
          `http://localhost:3001/user-data/other?userId=${user1}`
        );
        setSelectedOtherUserData(otherUserData.data.user);
      }
    } catch (error) {
      console.error("채팅 내역 가져오기 실패:", error);
    }
  };

  // //////////////////////////후기작성///////////////////
  const [comment, setComment] = useState(false);
  useEffect(() => {
    axiosInstance
      .get(`/comment/${selectedProductData.productId}`)
      .then((response) => {
        const data = response.data.data;
        if (data.length > 0) {
          setComment(true);
        } else {
          setComment(false);
        }
      });
  }, [selectedProductData]);

  const [isLocalModalOpen, setIsLocalModalOpen] = useState(isModalOpen);
  //모달 상태가 바뀔 때마다 호출
  useEffect(() => {
    setIsLocalModalOpen(isModalOpen);
  }, [isModalOpen]);
  const handleOpenModal = () => {
    if (comment) {
      alert("이미 후기가 작성되었습니다."); // 후기가 있으면 알림
    } else {
      setIsLocalModalOpen(true); // 모달 열기
      setIsModalOpen(true); // 부모 상태 업데이트
    }
  };
  const handleCloseModal = () => {
    setIsLocalModalOpen(false);
    setIsModalOpen(false);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        type: "chat",
        room_id: selectedRoomId,
        user_from: String(userId),
        user_to: String(otherUserId),
        message: message.trim(),
      };
      sendMessage(newMessage);

      // 로컬에서 즉시 메시지 렌더링
      setChatEach((prevMessages) => [...prevMessages, newMessage]);
      setMessage(""); // 입력 필드 초기화
    }
  };

  const sendMessageAddress = () => {
    const addressMessage = {
      type: "chat",
      room_id: selectedRoomId,
      user_from: String(userId),
      user_to: String(otherUserId),
      message: "주소 정보 : " + selectedUserData.address,
    };

    if (!selectedUserData.address) {
      addressMessage.message = "주소가 설정되지 않았습니다.";
    }

    // WebSocket으로 메시지 전송
    sendMessage(addressMessage);

    // 로컬에서 즉시 메시지 렌더링
    setChatEach((prevMessages) => [...prevMessages, addressMessage]);
  };

  const sendMessageAccount = () => {
    const AccountMessage = {
      type: "chat",
      room_id: selectedRoomId,
      user_from: String(userId),
      user_to: String(otherUserId),
      message: "계좌 정보 : " + selectedUserData.account,
    };

    if (!selectedUserData.account) {
      AccountMessage.message = "계좌가 설정되지 않았습니다.";
    }

    // WebSocket으로 메시지 전송
    sendMessage(AccountMessage);

    // 로컬에서 즉시 메시지 렌더링
    setChatEach((prevMessages) => [...prevMessages, AccountMessage]);
  };

  const enterSendMessage = (e) => {
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
    });

    axiosInstance.get("http://localhost:3001/user-data").then((response) => {
      setUserId(String(response.data.user.userId));
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

  // 상품 상태 변경 함수
  const handleStateChange = async (newState) => {
    if (String(selectedProductData.tradeState) === "판매완료") {
      alert("판매가 완료된 상품의 상태를 변경할 수 없습니다.");
      return;
    }
    if (String(newState) === "판매완료") {
      if (
        alert("정말 거래가 완료됐나요? 다시 거래 상태를 변경할 수 없게 돼요.")
      ) {
        return;
      } else {
        try {
          await axiosInstance.patch(
            `http://localhost:3001/update-product/state/${selectedProductData.productId}`,
            { tradeState: newState } // 상태 업데이트
          );
          setSelectedProductData((prevData) => ({
            ...prevData,
            tradeState: newState,
          }));
          await axiosInstance.patch(
            `http://localhost:3001/update-product/buyer-user-id/${selectedProductData.productId}`,
            { otherUserId: otherUserId } // 상태 업데이트
          );
        } catch (error) {
          console.error("상품 상태 변경 실패:", error);
        }
      }
    }
    try {
      await axiosInstance.patch(
        `http://localhost:3001/update-product/state/${selectedProductData.productId}`,
        { tradeState: newState } // 상태 업데이트
      );
      // 상태 변경 후, selectedProductData 업데이트
      setSelectedProductData((prevData) => ({
        ...prevData,
        tradeState: newState,
      }));
    } catch (error) {
      console.error("상품 상태 변경 실패:", error);
    }
  };

  return (
    <div className="container">
      <div className={chatStyle.container}>
        {!isMobile && (
          <div className={chatStyle.chatContainer}>
            <div className={chatStyle.chatTitleBox}>
              <div className={chatStyle.chatTitleTextBox}>
                <div className={chatStyle.chatTitleText}>채팅</div>
                <div className={chatStyle.chatNickNameText}>
                  {selectedRoomId && (
                    <>{selectedOtherUserData.nickname2} 님과의 대화</>
                  )}
                </div>
              </div>
            </div>
            <div className={chatStyle.chatBox}>
              {/* 채팅방 목록 */}
              <div className={chatStyle.chatListBox}>
                {chatList.length > 0 ? (
                  chatList.map((chat, index) => (
                    <div
                      key={index}
                      className={`${chatStyle.chatEachBox} ${
                        selectedRoomId === chat.room_id
                          ? chatStyle.selectedChatBox
                          : ""
                      }`}
                      onClick={() =>
                        fetchChatRoomMessages(chat.room_id, chat.other_user)
                      }
                    >
                      <div className={chatStyle.chatEachImgBox}>
                        <img
                          src={
                            !chat.otherUserImg ? chatTestImg : chat.otherUserImg
                          }
                          alt="chatTestImg"
                        />
                      </div>
                      <div className={chatStyle.chatEachMainBox}>
                        <div className={chatStyle.chatEachNameBox}>
                          <div className={chatStyle.chatEachName}>
                            {chat.otherUserNickname}
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
                  <div className={chatStyle.noChatMessage}>
                    채팅이 없습니다.
                  </div>
                )}
              </div>

              {/* 채팅 내용 */}
              <div className={chatStyle.chattingBox}>
                <div
                  className={`${chatStyle.chatContentBox} ${
                    selectedProductData.tradeState === "판매완료"
                      ? chatStyle.disabledBox
                      : ""
                  }`}
                >
                  {selectedRoomId && (
                    <div className={chatStyle.chatContentTitleBox}>
                      <div className={chatStyle.chatContentNameBox}>
                        <div className={chatStyle.chatProductImg}>
                          <img
                            className={chatStyle.chatProductImgTag}
                            src={selectedProductData?.images?.[0] || mangoImg}
                            alt="productImg"
                          />
                        </div>

                        <div className={chatStyle.chatProductInfoBox}>
                          <div className={chatStyle.chatProductName}>
                            상품명 | {selectedProductData.productName}
                          </div>
                          <div className={chatStyle.chatProductPrice}>
                            상품 가격 | {selectedProductData.productPrice} 원
                          </div>
                        </div>
                      </div>

                      <div className={chatStyle.chatContentDeleteImg}>
                        {/* 모든 사용자에게 현재 상태를 보여준다 */}
                        <div className={chatStyle.tradeStateText}>
                          거래 상태 | {selectedProductData.tradeState}
                        </div>

                        {/* 로그인한 사용자와 상품 소유자가 같을 때만 상태 변경 */}
                        {String(userId) ===
                        String(selectedProductData.userId) ? (
                          <div className={chatStyle.tradeStateBox}>
                            <div className={chatStyle.tradeStateSelectBox}>
                              <select
                                value={selectedProductData.tradeState}
                                onChange={(e) =>
                                  handleStateChange(e.target.value)
                                } // select 값 변경 시 처리 함수
                                className={chatStyle.tradeStateSelect} // 스타일 클래스 추가
                              >
                                <option value="none">거래 상태 변경</option>
                                {/* 현재 상태에 따라 표시할 옵션을 조건부로 렌더링 */}
                                {selectedProductData.tradeState !==
                                  "판매중" && (
                                  <option value="판매중">판매중</option>
                                )}
                                {selectedProductData.tradeState !==
                                  "예약중" && (
                                  <option value="예약중">예약중</option>
                                )}
                                {selectedProductData.tradeState !==
                                  "판매완료" && (
                                  <option value="판매완료">판매완료</option>
                                )}
                              </select>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                  <div className={chatStyle.chatContentTradingAressContainer}>
                    {selectedRoomId && (
                      <>
                        {selectedProductData.tradingMethod ? (
                          <div className={chatStyle.chatContentTradingAressBox}>
                            직거래 장소 | {selectedProductData.tradingAddress}
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>

                  <div
                    className={chatStyle.chatContentDetailBox}
                    ref={chatContentRef}
                  >
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
                {selectedRoomId && (
                  <div className={chatStyle.chatFieldContainer}>
                    <div className={chatStyle.actionButtonsContainer}>
                      <button
                        className={chatStyle.actionButton}
                        onClick={sendMessageAccount} // 계좌 전달 버튼 클릭 시
                        disabled={selectedProductData.tradeState === "판매완료"}
                      >
                        계좌 전달
                      </button>
                      <button
                        className={chatStyle.actionButton}
                        onClick={sendMessageAddress} // 주소 전달 버튼 클릭 시
                        disabled={selectedProductData.tradeState === "판매완료"}
                      >
                        주소 전달
                      </button>
                    </div>
                    <div className={chatStyle.chatFieldBox}>
                      <input
                        type="text"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={enterSendMessage}
                        placeholder={
                          selectedProductData.tradeState === "판매완료"
                            ? "판매가 완료되어 채팅이 비활성화 되었습니다."
                            : "메시지를 입력하세요.."
                        }
                        className={chatStyle.chatInput} // 스타일 클래스 추가
                        disabled={selectedProductData.tradeState === "판매완료"}
                      />
                      <button
                        onClick={() => handleSendMessage()} // 버튼 클릭 시 메시지 전송
                        className={chatStyle.sendButton} // 스타일 클래스 추가
                        disabled={selectedProductData.tradeState === "판매완료"}
                      >
                        <img
                          src={mangoImg} // 전송 버튼의 이미지 경로
                          alt="Send"
                          className={chatStyle.sendIcon}
                        />
                      </button>
                    </div>
                  </div>
                )}
                {/* 판매완료 메시지 */}
                {selectedProductData.tradeState === "판매완료" && (
                  <div className={chatStyle.tradeCompleteOverlay}>
                    {String(selectedProductData.buyerUserId) ===
                    String(userId) ? (
                      <div className={chatStyle.buyerMessage}>
                        상품 판매가 완료되었습니다. <br />
                        {comment ? (
                          <button
                            className={chatStyle.reviewButton}
                            disabled={true}
                          >
                            이미 후기를 작성했어요.
                          </button>
                        ) : (
                          <button
                            className={chatStyle.reviewButton}
                            onClick={() => handleOpenModal()}
                          >
                            후기 작성
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className={chatStyle.sellerMessage}>
                        상품 판매가 완료되었습니다.
                      </div>
                    )}
                  </div>
                )}
                <Modal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  shopOwnerUserId={selectedProductData.userId} // 상점 주 userId 전달
                  purchasedProductId={selectedProductData.productId}
                />
              </div>
            </div>
          </div>
        )}
        {isMobile && (
          <div className={chatStyle.chatContainer}>
            <div className={chatStyle.chatTitleBox}>
              <div className={chatStyle.chatTitleTextBox}>
                {!selectedRoomId ? (
                  <div className={chatStyle.chatTitleText}>채팅</div>
                ) : (
                  <div
                    className={chatStyle.chatTitleText}
                    onClick={() => {
                      setSelectedRoomId(null);
                    }}
                  >
                    {"<-"}
                  </div>
                )}
                <div className={chatStyle.chatNickNameText}>
                  {selectedRoomId && (
                    <>{selectedOtherUserData.nickname2} 님과의 대화</>
                  )}
                </div>
              </div>
            </div>
            {!selectedRoomId ? (
              <div className={chatStyle.chatListBox}>
                {chatList.length > 0 ? (
                  chatList.map((chat, index) => (
                    <div
                      key={index}
                      className={`${chatStyle.chatEachBox} ${
                        selectedRoomId === chat.room_id
                          ? chatStyle.selectedChatBox
                          : ""
                      }`}
                      onClick={() =>
                        fetchChatRoomMessages(chat.room_id, chat.other_user)
                      }
                    >
                      <div className={chatStyle.chatEachImgBox}>
                        <img
                          src={
                            !chat.otherUserImg ? chatTestImg : chat.otherUserImg
                          }
                          alt="chatTestImg"
                        />
                      </div>
                      <div className={chatStyle.chatEachMainBox}>
                        <div className={chatStyle.chatEachNameBox}>
                          <div className={chatStyle.chatEachName}>
                            {chat.otherUserNickname}
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
                  <div className={chatStyle.noChatMessage}>
                    채팅이 없습니다.
                  </div>
                )}
              </div>
            ) : (
              <div className={chatStyle.chatBox}>
                {/* 채팅방 목록 */}

                {/* 채팅 내용 */}
                <div className={chatStyle.chattingBox}>
                  <div
                    className={`${chatStyle.chatContentBox} ${
                      selectedProductData.tradeState === "판매완료"
                        ? chatStyle.disabledBox
                        : ""
                    }`}
                  >
                    {selectedRoomId && (
                      <div className={chatStyle.chatContentTitleBox}>
                        <div className={chatStyle.chatContentNameBox}>
                          <div className={chatStyle.chatProductImg}>
                            <img
                              className={chatStyle.chatProductImgTag}
                              src={selectedProductData?.images?.[0] || mangoImg}
                              alt="productImg"
                            />
                          </div>

                          <div className={chatStyle.chatProductInfoBox}>
                            <div className={chatStyle.chatProductName}>
                              상품명 | {selectedProductData.productName}
                            </div>
                            <div className={chatStyle.chatProductPrice}>
                              상품 가격 | {selectedProductData.productPrice} 원
                            </div>
                          </div>
                        </div>

                        <div className={chatStyle.chatContentDeleteImg}>
                          {/* 모든 사용자에게 현재 상태를 보여준다 */}
                          <div className={chatStyle.tradeStateText}>
                            거래 상태 | {selectedProductData.tradeState}
                          </div>

                          {/* 로그인한 사용자와 상품 소유자가 같을 때만 상태 변경 */}
                          {String(userId) ===
                          String(selectedProductData.userId) ? (
                            <div className={chatStyle.tradeStateBox}>
                              <div className={chatStyle.tradeStateSelectBox}>
                                <select
                                  value={selectedProductData.tradeState}
                                  onChange={(e) =>
                                    handleStateChange(e.target.value)
                                  } // select 값 변경 시 처리 함수
                                  className={chatStyle.tradeStateSelect} // 스타일 클래스 추가
                                >
                                  <option value="none">거래 상태 변경</option>
                                  {/* 현재 상태에 따라 표시할 옵션을 조건부로 렌더링 */}
                                  {selectedProductData.tradeState !==
                                    "판매중" && (
                                    <option value="판매중">판매중</option>
                                  )}
                                  {selectedProductData.tradeState !==
                                    "예약중" && (
                                    <option value="예약중">예약중</option>
                                  )}
                                  {selectedProductData.tradeState !==
                                    "판매완료" && (
                                    <option value="판매완료">판매완료</option>
                                  )}
                                </select>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                    <div className={chatStyle.chatContentTradingAressContainer}>
                      {selectedRoomId && (
                        <>
                          {selectedProductData.tradingMethod ? (
                            <div
                              className={chatStyle.chatContentTradingAressBox}
                            >
                              직거래 장소 | {selectedProductData.tradingAddress}
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      className={chatStyle.chatContentDetailBox}
                      ref={chatContentRef}
                    >
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
                  {selectedRoomId && (
                    <div className={chatStyle.chatFieldContainer}>
                      <div className={chatStyle.actionButtonsContainer}>
                        <button
                          className={chatStyle.actionButton}
                          onClick={sendMessageAccount} // 계좌 전달 버튼 클릭 시
                          disabled={
                            selectedProductData.tradeState === "판매완료"
                          }
                        >
                          계좌
                        </button>
                        <button
                          className={chatStyle.actionButton}
                          onClick={sendMessageAddress} // 주소 전달 버튼 클릭 시
                          disabled={
                            selectedProductData.tradeState === "판매완료"
                          }
                        >
                          주소
                        </button>
                      </div>
                      <div className={chatStyle.chatFieldBox}>
                        <input
                          type="text"
                          value={message}
                          onChange={handleChange}
                          onKeyDown={enterSendMessage}
                          placeholder={
                            selectedProductData.tradeState === "판매완료"
                              ? "판매가 완료되어 채팅이 비활성화 되었습니다."
                              : "메시지를 입력하세요.."
                          }
                          className={chatStyle.chatInput} // 스타일 클래스 추가
                          disabled={
                            selectedProductData.tradeState === "판매완료"
                          }
                        />
                        <button
                          onClick={() => handleSendMessage()} // 버튼 클릭 시 메시지 전송
                          className={chatStyle.sendButton} // 스타일 클래스 추가
                          disabled={
                            selectedProductData.tradeState === "판매완료"
                          }
                        >
                          <img
                            src={mangoImg} // 전송 버튼의 이미지 경로
                            alt="Send"
                            className={chatStyle.sendIcon}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  {/* 판매완료 메시지 */}
                  {selectedProductData.tradeState === "판매완료" && (
                    <div className={chatStyle.tradeCompleteOverlay}>
                      {String(selectedProductData.buyerUserId) ===
                      String(userId) ? (
                        <div className={chatStyle.buyerMessage}>
                          상품 판매가 완료되었습니다. <br />
                          {comment ? (
                            <button
                              className={chatStyle.reviewButton}
                              disabled={true}
                            >
                              이미 후기를 작성했어요.
                            </button>
                          ) : (
                            <button
                              className={chatStyle.reviewButton}
                              onClick={() => handleOpenModal()}
                            >
                              후기 작성
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className={chatStyle.sellerMessage}>
                          상품 판매가 완료되었습니다.
                        </div>
                      )}
                    </div>
                  )}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    shopOwnerUserId={selectedProductData.userId} // 상점 주 userId 전달
                    purchasedProductId={selectedProductData.productId}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
