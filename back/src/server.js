// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
//const tokenMiddleware = require("./tokenMiddleware"); // 액세스토큰 검증 미들웨어

const userRoutes = require("./routes/user");
const productsRoutes = require("./routes/products");
const shopRoutes = require("./routes/shop");

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
// 파일 업로드 경로 설정
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));
// 정적 파일 제공을 위한 설정
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/profileImage",
  express.static(path.join(__dirname, "../profileImage"))
);
//app.use(tokenMiddleware); //모든 백엔드 호출에 대해 토큰검증

// Enable CORS for all origins
app.use(cors());

// Use routes
app.use("/", userRoutes);
app.use("/", productsRoutes);
app.use("/", shopRoutes);

// 특정 도메인에서 오는 요청만 허용하려면 다음과 같이 설정
// app.use(cors({
//     origin: 'http://example.com' // 허용할 도메인
// }));

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
