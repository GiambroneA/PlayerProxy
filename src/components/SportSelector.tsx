import React from 'react';

interface SportSelectorProps {
  sports: string[];
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

const SportSelector: React.FC<SportSelectorProps> = ({ 
  sports, 
  selectedSport, 
  onSportChange 
}) => {
  return (
    <div className="flex space-x-2">
      {sports.map((sport) => (
        <button
          key={sport}
          onClick={() => onSportChange(sport)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            selectedSport === sport
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {sport}
        </button>
      ))}
    </div>
  );
};

export default SportSelector;