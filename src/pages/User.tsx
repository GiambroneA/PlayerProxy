// pages/User.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../types/Player";

interface League {
  id: string;
  sport: string;
  name: string;
}

const User: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Player state
  const [player, setPlayer] = useState<Player | null>(null);
  // Editable fields state
  const [editHeight, setEditHeight] = useState({ feet: 0, inches: 0 });
  const [editWeight, setEditWeight] = useState(0);
  const [editDob, setEditDob] = useState("");

  // Hardcoded leagues data
  const [leagues] = useState<League[]>([
    { id: "1", sport: "Basketball", name: "City Summer League" },
    { id: "2", sport: "Basketball", name: "Corporate Challenge" },
    { id: "3", sport: "Soccer", name: "Sunday Premier League" },
    { id: "4", sport: "Baseball", name: "Spring Training League" }
  ]);

  // Format height from array [feet, inches] to string "X'Y\""
  const formatHeight = (heightArray: number[] | undefined): string => {
    if (!heightArray || heightArray.length < 2) return "N/A";
    return `${heightArray[0]}'${heightArray[1]}"`;
  };

  // Format date from "YYYY-MM-DD" to "Month DD, YYYY"
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setLoading(true);
        const allPlayers = await PlayerService.getAllPlayers();
        const alexJohnson = allPlayers.find(p => 
          p.Name?.toLowerCase().includes("alex johnson")
        );
        
        if (alexJohnson) {
          setPlayer(alexJohnson);
          // Initialize editable fields
          if (alexJohnson.Height && alexJohnson.Height.length >= 2) {
            setEditHeight({
              feet: alexJohnson.Height[0],
              inches: alexJohnson.Height[1]
            });
          }
          if (alexJohnson.Weight) {
            setEditWeight(alexJohnson.Weight);
          }
          if (alexJohnson.DoB) {
            setEditDob(alexJohnson.DoB);
          }
        } else {
          setError("Alex Johnson not found in database");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load player data");
        console.error("Error loading player:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, []);

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!player) return;
    
    try {
      setSaving(true);
      setSaveMessage(null);
      
      const updates: Partial<Player> = {
        Height: [editHeight.feet, editHeight.inches],
        Weight: editWeight,
        DoB: editDob
      };
      
      const updatedPlayer = await PlayerService.updatePlayer(player.id, updates);
      setPlayer(updatedPlayer);
      setIsEditing(false);
      setSaveMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Group leagues by sport for the dropdowns
  const leaguesBySport = leagues.reduce((acc, league) => {
    if (!acc[league.sport]) {
      acc[league.sport] = [];
    }
    acc[league.sport].push(league);
    return acc;
  }, {} as Record<string, League[]>);

  const handlePlayerInfoClick = () => {
    navigate("/Stats");
  };

  const handleLeagueClick = (leagueId: string) => {
    navigate("/League");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading player data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !player) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center py-12">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            
            {/* Edit/Save buttons */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {player?.Name || "Alex Johnson"}
              </h2>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset to original values
                        if (player) {
                          if (player.Height && player.Height.length >= 2) {
                            setEditHeight({
                              feet: player.Height[0],
                              inches: player.Height[1]
                            });
                          }
                          if (player.Weight) setEditWeight(player.Weight);
                          if (player.DoB) setEditDob(player.DoB);
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Success Message */}
            {saveMessage && (
              <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg">
                <p className="text-green-300">{saveMessage}</p>
              </div>
            )}
            
            {/* Player Details */}
            <div className="space-y-4 mb-8">
              {/* Date of Birth */}
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="text-blue-300 text-sm font-medium">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="mt-1 w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white mt-1">
                    {formatDate(player?.DoB)}
                  </p>
                )}
              </div>
              
              {/* Height */}
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="text-blue-300 text-sm font-medium">Height</label>
                {isEditing ? (
                  <div className="flex space-x-2 mt-1">
                    <div className="flex-1">
                      <label className="text-gray-400 text-xs">Feet</label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={editHeight.feet}
                        onChange={(e) => setEditHeight(prev => ({
                          ...prev,
                          feet: parseInt(e.target.value) || 0
                        }))}
                        className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-gray-400 text-xs">Inches</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={editHeight.inches}
                        onChange={(e) => setEditHeight(prev => ({
                          ...prev,
                          inches: parseInt(e.target.value) || 0
                        }))}
                        className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-white mt-1">
                    {formatHeight(player?.Height)}
                  </p>
                )}
              </div>
              
              {/* Weight */}
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="text-blue-300 text-sm font-medium">Weight</label>
                {isEditing ? (
                  <div className="flex items-center mt-1">
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={editWeight}
                      onChange={(e) => setEditWeight(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500"
                    />
                    <span className="ml-2 text-gray-400">lbs</span>
                  </div>
                ) : (
                  <p className="text-white mt-1">
                    {player?.Weight ? `${player.Weight} lbs` : "N/A"}
                  </p>
                )}
              </div>
            </div>
            
            {/* Player Info Button */}
            <button
              onClick={handlePlayerInfoClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Player Info & Statistics
            </button>

            {/* record stats button */}
          <button
            onClick={() => navigate("/record-stats")}
            className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
              📊 Record Game Stats
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