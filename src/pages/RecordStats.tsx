// pages/RecordStats.tsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../types/Player";

// Sport-specific stat templates
const sportTemplates: Record<string, string[]> = {
  Basketball: ["points", "rebounds", "assists", "steals", "blocks", "fieldGoalPercentage", "threePointPercentage"],
  Soccer: ["goals", "assists", "passAccuracy", "tackles", "shotsOnTarget", "fouls"],
  Baseball: ["hits", "homeRuns", "rbis", "stolenBases", "battingAverage", "strikeouts"],
  Hockey: ["goals", "assists", "shots", "penaltyMinutes", "plusMinus", "faceoffWinPercentage"]
};

const RecordStats: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedSport, setSelectedSport] = useState<string>("Basketball");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [gameDate, setGameDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [opponent, setOpponent] = useState<string>("");
  const [stats, setStats] = useState<Record<string, number>>({});

  // Load players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const allPlayers = await PlayerService.getAllPlayers();
        setPlayers(allPlayers);
        
        // Default to Alex Johnson if exists
        const alexJohnson = allPlayers.find(p => p.Name.toLowerCase().includes("alex johnson"));
        if (alexJohnson) {
          setSelectedPlayer(alexJohnson.id);
        }
      } catch (error) {
        console.error("Failed to load players:", error);
        setMessage({ text: "Failed to load players", type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  // Update stats fields when sport changes
  useEffect(() => {
    const template = sportTemplates[selectedSport] || [];
    const initialStats: Record<string, number> = {};
    template.forEach(stat => {
      initialStats[stat] = 0;
    });
    setStats(initialStats);
  }, [selectedSport]);

  const handleStatChange = (statName: string, value: string) => {
    setStats(prev => ({
      ...prev,
      [statName]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayer) {
      setMessage({ text: "Please select a player", type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const gameData = {
        playerId: selectedPlayer,
        sport: selectedSport,
        gameDate: gameDate,
        opponent: opponent,
        stats: stats
      };

      // Call your backend to save the game stats
      const response = await fetch('/api/create-gamestats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      setMessage({ 
        text: `Game stats recorded successfully! ID: ${result.id}`, 
        type: 'success' 
      });
      
      // Reset form
      setOpponent("");
      setStats({});
      
    } catch (error) {
      console.error("Failed to save game stats:", error);
      setMessage({ 
        text: "Failed to save game stats. Please try again.", 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Add this endpoint to your backend index.ts:
  // app.post("/api/create-gamestats", async (req, res) => {
  //   const session = openSession();
  //   try {
  //     const gameStats = req.body;
  //     const id = `gamestats/${Date.now()}`;
  //     await session.store(gameStats, id);
  //     await session.saveChanges();
  //     res.json({ success: true, id });
  //   } catch (e: any) {
  //     res.status(500).json({ error: e.message });
  //   } finally {
  //     session.dispose();
  //   }
  // });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </button>
          
          {/* Main form */}
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-green-500">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-400">
                <span className="text-2xl">📊</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Record Game Statistics</h1>
              <p className="text-gray-300">
                Enter statistics for a game you participated in
              </p>
            </div>

            {/* Message display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900 border border-green-700 text-green-300' 
                  : 'bg-red-900 border border-red-700 text-red-300'
              }`}>
                {message.text}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading players...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Player Selection */}
                <div className="mb-6">
                  <label className="block text-green-300 font-medium mb-2">
                    Select Player
                  </label>
                  <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required
                  >
                    <option value="">-- Select a player --</option>
                    {players.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.Name} (#{player.Number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sport Selection */}
                <div className="mb-6">
                  <label className="block text-green-300 font-medium mb-2">
                    Sport
                  </label>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  >
                    {Object.keys(sportTemplates).map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                {/* Game Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-green-300 font-medium mb-2">
                      Game Date
                    </label>
                    <input
                      type="date"
                      value={gameDate}
                      onChange={(e) => setGameDate(e.target.value)}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-green-300 font-medium mb-2">
                      Opponent Team
                    </label>
                    <input
                      type="text"
                      value={opponent}
                      onChange={(e) => setOpponent(e.target.value)}
                      placeholder="e.g., Sharks, Flyers, etc."
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Statistics Input */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-green-300 mb-4">
                    {selectedSport} Statistics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(stats).map(statKey => (
                      <div key={statKey} className="bg-gray-700 p-4 rounded-lg">
                        <label className="block text-gray-300 font-medium mb-2 capitalize">
                          {statKey.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={stats[statKey]}
                          onChange={(e) => handleStatChange(statKey, e.target.value)}
                          className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </span>
                    ) : (
                      "Save Game Statistics"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/stats")}
                    className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    View Stats
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordStats;