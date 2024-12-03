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
      const parsedData = JSON.parse(data);
      console.log("테스트", parsedData);
      if (parsedData.type === "auth") {
        ws.userId = parsedData.userId; // WebSocket 인스턴스에 userId 저장
        return;
      }

      try {
        const {
          roomId,
          user_from: userFrom,
          user_to: userTo,
          message: content,
        } = parsedData;
        console.log("테스트2", parsedData);
        console.log(roomId, userFrom, userTo, content);

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
      } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({ error: "Message handling error" }));
      }
    });

    // 연결 종료 이벤트
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  console.log("WebSocket server setup complete");
}

module.exports = setupWebSocket;
