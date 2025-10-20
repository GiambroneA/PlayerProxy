import React from "react";
import logo from "../assets/logo.png";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="PlayerProxy Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold tracking-wide">PlayerProxy</h1>
        </div>

        {/* Right side - Navigation links */}
        <ul className="flex space-x-8 text-lg font-medium">
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            Home
          </li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            Roster
          </li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            Stats
          </li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            League
          </li>
          <li className="hover:text-blue-300 cursor-pointer transition-colors">
            User
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
