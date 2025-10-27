import React from "react";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <Navbar />

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center mt-24 text-center">
        <img
          src={logo}
          alt="PlayerProxy Logo"
          className="w-56 h-56 mb-6 drop-shadow-2xl"
        />
        <h1 className="text-5xl font-bold mb-4 tracking-wide">
          Your Roster
        </h1>
        <p className="text-lg text-gray-300">
          ROSTER COMING SOOOON
        </p>
      </div>
    </div>
  );
};

export default Home;
