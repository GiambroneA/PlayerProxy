// pages/Stats.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlayerHeader from '../components/PlayerHeader';
import StatsTable, { StatRow } from '../components/StatsTable';
import { PlayerService } from '../services/PlayerService';
import { StatsService } from '../services/StatsService';
import { Player, GameStats } from '../types/Player';

const Stats: React.FC = () => {
  const navigate = useNavigate();
  const { playerName } = useParams<{ playerName: string }>();
  
  const [selectedSport, setSelectedSport] = useState<string>('Basketball');
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Function to load data - wrapped in useCallback to prevent recreation
  const loadData = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) {
        setLoading(true);
      }
      
      // Load all players
      const allPlayers = await PlayerService.getAllPlayers();
      
      // Update players list if changed
      const playersChanged = JSON.stringify(allPlayers) !== JSON.stringify(players);
      if (playersChanged) {
        setPlayers(allPlayers);
      }

      // Find player by name (case-insensitive, partial match)
      const targetPlayer = allPlayers.find(p => 
        p.Name.toLowerCase().includes((playerName || 'alex johnson').toLowerCase())
      ) || allPlayers[0];
      
      if (targetPlayer) {
        // Check if player changed
        const playerChanged = !player || targetPlayer.id !== player.id;
        if (playerChanged) {
          setPlayer(targetPlayer);
        }

        // Load stats for this player
        const stats = await PlayerService.getPlayerStats(targetPlayer.id);
        
        // Only update if stats actually changed
        const statsChanged = JSON.stringify(stats) !== JSON.stringify(gameStats);
        if (statsChanged) {
          setGameStats(stats);
          if (isPolling) {
            console.log('Stats updated from polling');
            setLastUpdate(new Date()); // Update timestamp
          }
        }
        
        // Set default sport to first available sport if player changed
        if (playerChanged && targetPlayer.Teams && targetPlayer.Teams.length > 0) {
          setSelectedSport(targetPlayer.Teams[0].Sport);
        }
      }
      
      if (!isPolling) {
        setError(null);
      }
    } catch (err: any) {
      if (!isPolling) {
        setError(err.message || 'Failed to load data');
      }
      console.error('Error loading data:', err);
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  }, [playerName, player, players, gameStats]);

  // Initial load and polling setup
  useEffect(() => {
    // Initial load
    loadData(false);
    
    // Set up polling every 10 seconds
    const pollInterval = setInterval(() => {
      loadData(true);
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, [loadData]);

  // Get available sports for current player
  const availableSports = player?.Teams?.map(team => team.Sport) || [];

  // Convert game stats to table format for selected sport
  const getStatsForSport = (): StatRow[] => {
    return StatsService.aggregateStatsForSport(gameStats, selectedSport);
  };

  // Handle player change
  const handlePlayerChange = (newPlayerName: string) => {
    navigate(`/stats/${newPlayerName}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Last update indicator */}
          <div className="mb-6 p-3 bg-gray-800 rounded-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-gray-400 text-sm">Auto-updating</span>
              </div>
              <div className="text-gray-400 text-sm">
                Last updated: {lastUpdate.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          {/* Player Header with Sport Selector */}
          {player && (
            <PlayerHeader
              playerName={player.Name}
              sport={selectedSport}
              availableSports={availableSports}
              onSportChange={setSelectedSport}
            />
          )}
          
          {/* Player Selector Dropdown */}
          {players.length > 1 && (
            <div className="mb-6">
              <label className="block text-blue-300 mb-2">Select Player:</label>
              <select 
                onChange={(e) => handlePlayerChange(e.target.value)}
                value={player?.Name || ''}
                className="bg-gray-700 text-white p-2 rounded-lg w-full hover:bg-gray-600 transition-colors"
              >
                {players.map(p => (
                  <option key={p.id} value={p.Name}>
                    {p.Name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-gray-400">Loading statistics...</p>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-400">Error: {error}</p>
              <p className="text-gray-500 text-sm mt-2">
                Data will auto-retry in a few seconds, or refresh the page.
              </p>
            </div>
          )}
          
          {/* Stats Table */}
          {!loading && !error && player && (
            <StatsTable
              title={`${selectedSport} Statistics`}
              data={getStatsForSport()}
              size="medium"
            />
          )}
          
          {/* Empty State */}
          {!loading && !error && getStatsForSport().length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No statistics found for {selectedSport}</p>
              <p className="text-gray-500 text-sm mt-2">Data will appear here when available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;