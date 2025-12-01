// pages/Roster.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TeamCard from "../components/TeamCard";
import LeagueOverview from "../components/LeagueOverview";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../types/Player";
import logo from "../assets/logo.png";

interface Team {
  id: string;
  name: string;
  players: Player[];
}

const Roster: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const players = await PlayerService.getAllPlayers();
        
        // Group players by team
        const teamsMap = new Map<string, Team>();
        
        players.forEach(player => {
          if (player.Teams && player.Teams.length > 0) {
            player.Teams.forEach(teamInfo => {
              const teamId = teamInfo.Team;
              const teamName = teamInfo.Team.split('/').pop() || teamInfo.Team;
              
              if (!teamsMap.has(teamId)) {
                teamsMap.set(teamId, {
                  id: teamId,
                  name: teamName,
                  players: []
                });
              }
              
              const team = teamsMap.get(teamId)!;
              if (!team.players.find(p => p.id === player.id)) {
                team.players.push(player);
              }
            });
          }
        });
        
        // Convert map to array and sort
        const teamsArray = Array.from(teamsMap.values())
          .sort((a, b) => a.name.localeCompare(b.name));
        
        // Sort players by number within each team
        teamsArray.forEach(team => {
          team.players.sort((a, b) => {
            const numA = parseInt(a.Number || "999");
            const numB = parseInt(b.Number || "999");
            return numA - numB;
          });
        });
        
        setTeams(teamsArray);
      } catch (err: any) {
        setError(err.message || "Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    
    loadPlayers();
    const intervalId = setInterval(loadPlayers, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handlePlayerClick = (playerName: string) => {
    if (playerName) {
      navigate(`/stats/${encodeURIComponent(playerName)}`);
    } else {
      navigate('/stats');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mt-16 px-4">
        <img src={logo} alt="PlayerProxy Logo" className="w-48 h-48 mb-6 drop-shadow-2xl" />
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide text-center">Team Rosters</h1>
        <p className="text-gray-400 mb-8 text-center">View all teams and their players</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading rosters...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Teams Display */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {teams.map(team => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onPlayerClick={handlePlayerClick} 
                />
              ))}
            </div>

            {/* Empty State */}
            {teams.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🏀</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">No Teams Found</h3>
                <p className="text-gray-400 mb-6">
                  Teams will appear here when players are assigned to them.
                </p>
                <button
                  onClick={() => navigate('/user')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Go to Profile
                </button>
              </div>
            )}

            {/* League Overview */}
            {teams.length > 0 && <LeagueOverview teams={teams} />}
          </>
        )}
      </div>
    </div>
  );
};

export default Roster;