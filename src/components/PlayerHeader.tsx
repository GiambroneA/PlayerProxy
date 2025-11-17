import React from 'react';
import SportSelector from './SportSelector';

interface PlayerHeaderProps {
  playerName: string;
  sport: string;
  onSportChange?: (sport: string) => void;
  availableSports?: string[];
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ 
  playerName, 
  sport,
  onSportChange,
  availableSports = []
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-500 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Profile Image Circle */}
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-400">
            <span className="text-white font-semibold">Photo</span>
          </div>
          
          {/* Player Name and Sport */}
          <div>
            <h1 className="text-2xl font-bold text-white">{playerName}</h1>
            <h2 className="text-lg text-blue-300">Statistics - {sport}</h2>
          </div>
        </div>
        
        {/* Sport Selector */}
        {availableSports.length > 0 && onSportChange && (
          <SportSelector
            sports={availableSports}
            selectedSport={sport}
            onSportChange={onSportChange}
          />
        )}
      </div>
    </div>
  );
};

export default PlayerHeader;