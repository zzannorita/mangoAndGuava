require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/user");
const productsRoutes = require("./routes/products");
const shopRoutes = require("./routes/shop");
const chatRoutes = require("./routes/chat");
const refreshRoutes = require("./token/refresh");
const setupWebSocket = require("./websockets/chat"); // WebSocket 모듈 가져오기

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/profileImage",
  express.static(path.join(__dirname, "../profileImage"))
);

// Routes
app.use("/", userRoutes);
app.use("/", productsRoutes);
app.use("/", shopRoutes);
app.use("/", chatRoutes);
app.use("/", refreshRoutes);

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// WebSocket 설정
setupWebSocket(server);
