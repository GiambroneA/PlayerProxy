// components/LeagueOverview.tsx
import React from "react";
import { Player } from "../types/Player";

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface LeagueOverviewProps {
  teams: Team[];
}

const LeagueOverview: React.FC<LeagueOverviewProps> = ({ teams }) => {
  const totalPlayers = teams.reduce((total, team) => total + team.players.length, 0);
  
  const uniqueSports = new Set(
    teams.flatMap(team => 
      team.players.flatMap(p => 
        p.Teams?.map(t => t.Sport) || []
      )
    )
  ).size;

  const multiSportPlayers = teams.flatMap(team => team.players)
    .filter((player, index, self) => 
      self.findIndex(p => p.id === player.id) === index && 
      (player.Teams?.length || 0) > 1
    ).length;

  return (
    <div className="mt-12 p-6 bg-gray-800 rounded-xl border border-blue-700">
      <h3 className="text-xl font-bold mb-4 text-white">League Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Teams</p>
          <p className="text-2xl font-bold text-white">{teams.length}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Players</p>
          <p className="text-2xl font-bold text-white">{totalPlayers}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Sports</p>
          <p className="text-2xl font-bold text-white">{uniqueSports}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Multi-sport Players</p>
          <p className="text-2xl font-bold text-white">{multiSportPlayers}</p>
        </div>
      </div>
    </div>
  );
};

export default LeagueOverview;