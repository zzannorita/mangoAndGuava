const { Server } = require("ws");
const db = require("../config/dbConfig"); // 데이터베이스 연결 가져오기

// WebSocket 관련 설정
function setupWebSocket(server) {
  const wss = new Server({ server });

  // WebSocket 연결 이벤트
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    // 현재 연결된 클라이언트들 확인 테스트용
    wss.clients.forEach((client) => {
      console.log({
        userId: client.userId,
        readyState: client.readyState, // 연결 상태 (OPEN, CLOSED 등)
      });
    });

    // 각 클라이언트마다 고유한 userId 저장
    ws.on("message", async (data) => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.type === "auth") {
          ws.userId = parsedData.userId; // WebSocket 인스턴스에 userId 저장
          return;
        }

        if (parsedData.type === "chat") {
          console.log("채팅의 경우");
          handleChatMessage(parsedData);
        } else if (parsedData.type === "like") {
          console.log("찜하기 눌렀을경우");
        }
      } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({ error: "Message handling error" }));
      }
    });

    const handleChatMessage = async (parsedData) => {
      const {
        roomId,
        user_from: userFrom,
        user_to: userTo,
        message: content,
      } = parsedData;

      // MySQL 데이터베이스에 메시지 저장
      await db.execute(
        `INSERT INTO chat (room_id, user_from, user_to, message) VALUES (?, ?, ?, ?)`,
        [String(roomId), String(userFrom), String(userTo), String(content)]
      );

      // 특정 클라이언트(userTo)에게만 메시지 전송
      wss.clients.forEach((client) => {
        if (
          client.readyState === ws.OPEN &&
          (client.userId === userTo || client.userId === userFrom)
        ) {
          client.send(
            JSON.stringify({
              roomId,
              userFrom,
              userTo,
              content,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });
    };

    // 연결 종료 이벤트
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  console.log("WebSocket server setup complete");
}

function generateRoomId(userFrom, userTo, productId) {
  // userFrom과 userTo를 정렬하여 일관된 순서로 조합
  const sortedUsers = [userFrom, userTo].sort();
  // room_id 생성
  const roomId = `${sortedUsers[0]}_${sortedUsers[1]}_${productId}`;
  return roomId;
}

module.exports = setupWebSocket;
