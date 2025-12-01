// components/TeamCard.tsx
import React from "react";
import { Player } from "../types/Player";

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface TeamCardProps {
  team: Team;
  onPlayerClick: (playerName: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onPlayerClick }) => {
  const formatHeight = (heightArray: number[] | undefined): string => {
    if (!heightArray || heightArray.length < 2) return "N/A";
    return `${heightArray[0]}'${heightArray[1]}"`;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-blue-700 hover:border-blue-500 transition-all duration-300">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6">
        <h2 className="text-2xl font-bold text-white">{team.name}</h2>
        <p className="text-blue-200">
          {team.players.length} {team.players.length === 1 ? 'Player' : 'Players'}
        </p>
      </div>

      {/* Players List */}
      <div className="p-6">
        <div className="space-y-4">
          {team.players.map(player => (
            <div 
              key={player.id} 
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={() => onPlayerClick(player.Name)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white hover:text-blue-300 transition-colors">
                    {player.Name}
                    {player.Number && (
                      <span className="text-blue-300 ml-2">#{player.Number}</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {player.Teams?.filter(t => t.Team === team.id).map((teamInfo, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full"
                      >
                        {teamInfo.Sport}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-300 text-sm">{formatHeight(player.Height)}</p>
                  <p className="text-gray-300 text-sm">{player.Weight ? `${player.Weight} lbs` : ''}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Sport:</span>
                    <span className="ml-2 text-white">
                      {player.Teams?.find(t => t.Team === team.id)?.Sport || 'Multi-sport'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">DOB:</span>
                    <span className="ml-2 text-white">
                      {player.DoB ? new Date(player.DoB).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {team.players.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400">No players assigned to this team yet</p>
          </div>
        )}
      </div>

      {/* Team Footer */}
      <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
        {/*<button
          onClick={() => onPlayerClick('')}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          View Team Stats
        </button>*/}
      </div>
    </div>
  );
};

export default TeamCard;