// pages/User.tsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// Define types for our data
interface PlayerInfo {
  id: string;
  name: string;
  dateOfBirth: string;
  height: string;
  weight: string;
}

interface League {
  id: string;
  sport: string;
  name: string;
}

const User: React.FC = () => {
  const navigate = useNavigate();

  // Hardcoded player data for proof of concept
  const [playerInfo] = useState<PlayerInfo>({
    id: "1",
    name: "Alex Johnson",
    dateOfBirth: "1995-03-15",
    height: "6'2\"",
    weight: "185 lbs"
  });

  // Hardcoded leagues data
  const [leagues] = useState<League[]>([
    { id: "1", sport: "Basketball", name: "City Summer League" },
    { id: "2", sport: "Basketball", name: "Corporate Challenge" },
    { id: "3", sport: "Soccer", name: "Sunday Premier League" },
    { id: "4", sport: "Baseball", name: "Spring Training League" }
  ]);

  // Group leagues by sport for the dropdowns
  const leaguesBySport = leagues.reduce((acc, league) => {
    if (!acc[league.sport]) {
      acc[league.sport] = [];
    }
    acc[league.sport].push(league);
    return acc;
  }, {} as Record<string, League[]>);

  const handlePlayerInfoClick = () => {
    // This will redirect to stats page later
    //alert("Redirecting to player statistics page...");
    navigate("/Stats");
  };

  const handleLeagueClick = (leagueId: string) => {
    // This will redirect to league page later
    //alert(`Redirecting to league page for ID: ${leagueId}`);
    //TODO : add league ids for specific leagues
    navigate("/League");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Main content container */}
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Left Panel - Player Profile */}
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-blue-500">
            {/* Profile Picture Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-400">
                <span className="text-white text-lg font-semibold">Photo</span>
              </div>
            </div>
            
            {/* Player Name */}
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              {playerInfo.name}
            </h2>
            
            {/* Player Details */}
            <div className="space-y-4 mb-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="text-blue-300 text-sm font-medium">Date of Birth</label>
                <p className="text-white mt-1">{playerInfo.dateOfBirth}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="text-blue-300 text-sm font-medium">Height</label>
                <p className="text-white mt-1">{playerInfo.height}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="text-blue-300 text-sm font-medium">Weight</label>
                <p className="text-white mt-1">{playerInfo.weight}</p>
              </div>
            </div>
            
            {/* Player Info Button */}
            <button
              onClick={handlePlayerInfoClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Player Info & Statistics
            </button>
          </div>
          
          {/* Right Panel - My Leagues */}
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-blue-500">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              My Leagues
            </h2>
            
            <div className="space-y-4">
              {Object.entries(leaguesBySport).map(([sport, sportLeagues]) => (
                <div key={sport} className="bg-gray-700 rounded-lg overflow-hidden">
                  {/* Sport Dropdown Header */}
                  <details className="group" open>
                    <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-600 hover:bg-gray-500 transition-colors">
                      <span className="text-lg font-semibold text-white">{sport}</span>
                      <svg className="w-5 h-5 text-blue-300 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    
                    {/* League List */}
                    <div className="px-4 pb-4 space-y-2">
                      {sportLeagues.map((league) => (
                        <button
                          key={league.id}
                          onClick={() => handleLeagueClick(league.id)}
                          className="w-full text-left p-3 bg-gray-600 hover:bg-blue-600 rounded-lg transition-colors text-white"
                        >
                          {league.name}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;