const { Server } = require("ws");
const userDao = require("../daos/userDao");
const productsDao = require("../daos/productsDao");
const chatDao = require("../daos/chatDao");
const alarmDao = require("../daos/alarmDao");
const db = require("../config/dbConfig"); // 데이터베이스 연결 가져오기

// WebSocket 관련 설정
function setupWebSocket(server) {
  const connectedChatClients = new Set();

  const wss = new Server({ server });

  // WebSocket 연결 이벤트
  wss.on("connection", (ws) => {
    // 각 클라이언트마다 고유한 userId 저장
    ws.on("message", async (data) => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "auth") {
          if (parsedData.userId && parsedData.userId !== "") {
            // userId가 유효할 경우에만 Set에 추가
            if (
              !Array.from(connectedChatClients).some(
                (client) => client.userId === parsedData.userId
              )
            ) {
              // Set에 해당 userId가 없으면 추가
              ws.userId = parsedData.userId;
              connectedChatClients.add(ws);
              console.log(
                "현재 연결된 userId 목록(중복 없음.):",
                Array.from(connectedChatClients).map((client) => client.userId)
              );
            } else {
              console.log("이미 연결된 userId:", parsedData.userId);
              console.log(
                "현재 연결된 userId 목록(중복 있음):",
                Array.from(connectedChatClients).map((client) => client.userId)
              );
            }
          } else {
            console.log("유효하지 않은 userId");
            console.log(
              "현재 연결된 userId 목록(빈문자열):",
              Array.from(connectedChatClients).map((client) => client.userId)
            );
          }
          return;
        }

        // 기타 메시지 처리
        if (parsedData.type === "chat") {
          handleChatMessage(parsedData);
        }

        if (parsedData.type === "like") {
          console.log(" 좋아요 알림 도착 ");
          handleLikeNotification(parsedData);
        }

        if (parsedData.type === "follow") {
          console.log(" 팔로우 알림 도착");
          handleFollowNotification(parsedData);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({ error: "Message handling error" }));
      }
    });

    const handleFollowNotification = async (parsedData) => {
      const { nickname: userFromNickname } = await userDao.getUserById(
        parsedData.userId
      );
      const roomId = `${parsedData.userId}-${parsedData.followUserId}-follow`;
      const content = `${userFromNickname}님이 팔로우 했습니다.`;

      const alarmNoti = {
        userTo: parsedData.followUserId,
        userFrom: parsedData.userId,
        productName: "null",
        content,
        chatContent: content,
        userFromNickname,
        roomId: roomId,
        type: "follow",
      };

      // 채팅 알림 데이터베이스에 저장
      await alarmDao.insertAlarm(alarmNoti);

      wss.clients.forEach((client) => {
        // 알림 전송
        const extraData = {
          productName: "null",
          userFromNickname,
          chatContent: content,
          sendUserID: parsedData.userId,
          roomId,
        };
        const isRead = 0;
        if (String(client.userId) === String(parsedData.followUserId)) {
          client.send(
            JSON.stringify({
              type: "notification",
              content: content,
              extraData,
              isRead,
              userId: parsedData.productUserId,
              createdAt: new Date().toISOString(),
            })
          );
        }
      });
    };

    const handleLikeNotification = async (parsedData) => {
      const { nickname: userFromNickname } = await userDao.getUserById(
        parsedData.userId
      );
      const roomId = `${parsedData.userId}-${parsedData.productUserId}-${parsedData.productId}-like`;
      const content = `${userFromNickname}님이 상품을 찜했습니다.`;

      const alarmNoti = {
        userTo: parsedData.productUserId,
        userFrom: parsedData.userId,
        productName: parsedData.productName,
        content,
        chatContent: content,
        userFromNickname,
        roomId: roomId,
        type: "like",
      };

      // 채팅 알림 데이터베이스에 저장
      await alarmDao.insertAlarm(alarmNoti);

      wss.clients.forEach((client) => {
        // 알림 전송
        const extraData = {
          productName: parsedData.productName,
          userFromNickname,
          chatContent: content,
          sendUserID: parsedData.userId,
          roomId,
        };
        const isRead = 0;
        if (String(client.userId) === String(parsedData.productUserId)) {
          client.send(
            JSON.stringify({
              type: "notification",
              content: content,
              extraData,
              isRead,
              userId: parsedData.productUserId,
              createdAt: new Date().toISOString(),
            })
          );
        }
      });
    };

    const handleChatMessage = async (parsedData) => {
      const {
        room_id: roomId,
        user_from: userFrom,
        user_to: userTo,
        message: content,
      } = parsedData;

      // MySQL 데이터베이스에 메시지 저장
      await chatDao.insertChat(parsedData);

      // 채팅 알림 생성
      const [, , productId] = roomId.split("-");
      const products = await productsDao.getProductByProductId(productId);
      const { productName, images } = products[0];
      const { nickname: userFromNickname } = await userDao.getUserById(
        userFrom
      );
      const notificationMessage = `${userFromNickname}님이 메시지를 보냈습니다.`;
      const alarmNoti = {
        userTo, //알람 받을사람
        userFrom, //알람 보낸이
        productName,
        content: notificationMessage,
        chatContent: content,
        userFromNickname,
        roomId,
        type: "chat",
      };

      // 채팅 알림 데이터베이스에 저장
      await alarmDao.insertAlarm(alarmNoti);

      // 특정 클라이언트(userTo)에게만 메시지 전송
      wss.clients.forEach((client) => {
        if (
          client.readyState === ws.OPEN &&
          (String(client.userId) === String(userTo) ||
            String(client.userId) === String(userFrom))
        ) {
          client.send(
            JSON.stringify({
              type: "chatting",
              roomId,
              userFrom,
              userTo,
              content,
              timestamp: new Date().toISOString(),
            })
          );
        }
        // 알림 전송
        const extraData = {
          productName,
          userFromNickname,
          chatContent: content,
          sendUserID: userFrom,
          roomId,
        };
        const isRead = 0;
        if (String(client.userId) === String(userTo)) {
          client.send(
            JSON.stringify({
              type: "notification",
              content: notificationMessage,
              extraData,
              isRead,
              userId: userTo,
              createdAt: new Date().toISOString(),
            })
          );
        }
      });
    };

    // 연결 종료 이벤트
    ws.on("close", () => {
      connectedChatClients.delete(ws);
      console.log("연결 종료:", ws.userId);
      console.log(
        "남은 연결된 userId 목록:",
        Array.from(connectedChatClients).map((client) => client.userId)
      );
    });
  });

  console.log("웹소켓 서버 설정 완료");
}

module.exports = setupWebSocket;
