import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainLayout from "./components/MainLayout";
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

function App() {
  return (
    <Router>
      <div className="header">
        <Header />
      </div>
      <hr className="separator" />
      <div className="mainLayout">
        <MainLayout />
      </div>
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regist" element={<Regist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="/products?item={search-data}" element={<Search />} /> */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myshop" element={<Shop />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/newMember" element={<NewMember />} />
          <Route path="/authCallBack" element={<AuthCallback />} />
          {/* <Route path="/detail?itemId={productId}" element={<Detail />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
