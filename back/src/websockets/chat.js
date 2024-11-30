const { Server } = require("ws"); // WebSocket 모듈
const db = require("../config/dbConfig"); // 데이터베이스 연결 가져오기

// WebSocket 관련 설정
function setupWebSocket(server) {
  const wss = new Server({ server });

  // WebSocket 연결 이벤트
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    // 메시지 수신 이벤트
    ws.on("message", async (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { roomId, userFrom, userTo, content } = parsedMessage;

        // MySQL 데이터베이스에 메시지 저장
        await db.execute(
          `INSERT INTO chat (room_id, user_from, user_to, message) VALUES (?, ?, ?, ?)`,
          [roomId, userFrom, userTo, content]
        );

        // WebSocket 브로드캐스트
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
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
