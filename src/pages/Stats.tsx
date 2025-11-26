// pages/Stats.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlayerHeader from '../components/PlayerHeader';
import StatsTable, { StatRow } from '../components/StatsTable';
import { StatsService } from '../services/StatsService';
import { GameStats } from '../types/Player';

const Stats: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>('Basketball');
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Available sports from the player document
  const availableSports = ['Basketball', 'Soccer', 'Baseball'];

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Using the player ID from your documents
        const stats = await StatsService.getPlayerStats('Players/alex-johnson');
        setGameStats(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  // Convert game stats to table format for selected sport
  const getStatsForSport = (): StatRow[] => {
    return StatsService.aggregateStatsForSport(gameStats, selectedSport);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Player Header with Sport Selector */}
          <PlayerHeader
            playerName="Alex Johnson"
            sport={selectedSport}
            availableSports={availableSports}
            onSportChange={setSelectedSport}
          />
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading statistics...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}
          
          {/* Stats Table */}
          {!loading && !error && (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;