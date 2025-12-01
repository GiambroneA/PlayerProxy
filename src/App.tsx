import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Home from "./pages/Home";
import League from "./pages/League";
import Roster from "./pages/Roster";
import Stats from "./pages/Stats";
import User from "./pages/User";
import RecordStats from "./pages/RecordStats";

const App: React.FC = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/League" element={<League />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/user" element={<User />} />
        <Route path="/stats/:playerName?" element={<Stats />} />
        <Route path="/record-stats" element={<RecordStats />} />
      </Routes>
   
  );
};

export default App;
