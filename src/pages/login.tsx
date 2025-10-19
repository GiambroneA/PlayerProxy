import React from "react";
import logo from "../assets/logo.png";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#021224] text-white">
      <img
        src={logo}
        alt="PlayerProxy Logo"
        className="w-48 h-48 mb-6 drop-shadow-2xl"
      />
      <h1 className="text-3xl font-bold mb-6 tracking-wide">PlayerProxy Login</h1>

      <form className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-80">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 transition-colors py-2 rounded-lg font-semibold"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
