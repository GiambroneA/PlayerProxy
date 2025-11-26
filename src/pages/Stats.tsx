// pages/Stats.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlayerHeader from '../components/PlayerHeader';
import StatsTable, { StatRow } from '../components/statsTable'; //if error, change capitalization to 'StatsTable'

// Mock data for different sports
const sportStats: Record<string, StatRow[]> = {
  Basketball: [
    { category: 'Points Per Game', value: 18.5 },
    { category: 'Rebounds', value: 7.2 },
    { category: 'Assists', value: 4.8 },
    { category: 'Steals', value: 1.5 },
    { category: 'Blocks', value: 0.8 },
    { category: 'Field Goal %', value: '47.2%' },
  ],
  Soccer: [
    { category: 'Goals', value: 12 },
    { category: 'Assists', value: 8 },
    { category: 'Pass Accuracy', value: '85%' },
    { category: 'Tackles', value: 25 },
    { category: 'Clean Sheets', value: 5 },
  ],
  Baseball: [
    { category: 'Batting Average', value: '.285' },
    { category: 'Home Runs', value: 15 },
    { category: 'RBI', value: 42 },
    { category: 'Stolen Bases', value: 8 },
    { category: 'On Base %', value: '.350' },
  ]
};

const Stats: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>('Basketball');
  const availableSports = Object.keys(sportStats);

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
          
          {/* Stats Table */}
          <StatsTable
            title={`${selectedSport} Statistics`}
            data={sportStats[selectedSport]}
            size="medium"
          />
          
          {/* You can add more sections below later */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">More statistics and history sections will go here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;