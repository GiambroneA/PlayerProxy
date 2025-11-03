import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Home from "./pages/Home";
import League from "./pages/League";
import Roster from "./pages/Roster";
import Stats from "./pages/Stats";
import User from "./pages/User";

const App: React.FC = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/League" element={<League />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/user" element={<User />} />
      </Routes>
   
  );
};

export default App;
