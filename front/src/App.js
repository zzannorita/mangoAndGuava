import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainLayout from "./components/MainLayout";
import Carousel from "./components/Carousel";
import Home from "./pages/Home";
import Regist from "./pages/Regist";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import NewMember from "./pages/NewMember";
import AuthCallback from "./pages/AuthCallBack";
import ShopForBuyer from "./pages/ShopForBuyer";
import Update from "./pages/Update";
import Review from "./pages/Review";
import OthersReview from "./pages/OthersReview";
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <WebSocketProvider>
      <Router>
        <div className="header">
          <Header />
        </div>
        <hr className="separator" />
        <div className="mainLayout">
          <MainLayout isModalOpen={isModalOpen} />
        </div>
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sell" element={<Regist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Search />} />
            <Route
              path="/chat"
              element={
                <Chat
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/myShop" element={<Shop />} />
            <Route path="/yourShop" element={<ShopForBuyer />} />
            <Route
              path="/detail"
              element={
                <Detail
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              }
            />
            <Route path="/update" element={<Update />} />
            <Route path="/newMember" element={<NewMember />} />
            <Route path="/authCallBack" element={<AuthCallback />} />
            <Route path="/review" element={<Review />} />
            <Route path="/othersReview" element={<OthersReview />} />
            <Route path="/carousel" element={<Carousel />} />
          </Routes>
        </div>
      </Router>
    </WebSocketProvider>
  );
}

export default App;
