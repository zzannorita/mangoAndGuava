const WebSocket = require("ws");

// 웹소켓 서버 생성
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("새 클라이언트가 연결되었습니다.");

  // 클라이언트로부터 메시지 수신
  ws.on("message", (message) => {
    console.log(`받은 메시지: ${message}`);

    // 모든 클라이언트에게 메시지 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // 연결 종료 시
  ws.on("close", () => {
    console.log("클라이언트 연결이 종료되었습니다.");
  });

  // 클라이언트에 초기 메시지 전송
  ws.send("서버와의 연결이 성공했습니다!");
});

console.log("웹소켓 서버가 8080 포트에서 실행 중입니다.");
