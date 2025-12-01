import React, { useState } from "react";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";
import { League, Team } from "../types/League";
import { LeagueService } from "../services/LeagueService";

type ViewMode = "initial" | "createLeague" | "joinLeague" | "inLeague";

const LeaguePage: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>("initial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [leagueName, setLeagueName] = useState("");
  const [leagueCodeInput, setLeagueCodeInput] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamCodeInput, setTeamCodeInput] = useState("");

  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  const normalizeCode = (value: string) => value.trim().toUpperCase();

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // --- League actions ---

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    try {
      setLoading(true);
      const league = await LeagueService.createLeague(
        leagueName.trim() || null
      );
      setCurrentLeague(league);
      setCurrentTeam(null);
      setLeagueCodeInput(league.code);
      setMode("inLeague");
      setSuccess(
        `League created! Share this code so others can join: ${league.code}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to create league");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const code = normalizeCode(leagueCodeInput);
    if (code.length !== 5) {
      setError("League code must be 5 characters.");
      return;
    }

    try {
      setLoading(true);
      const league = await LeagueService.joinLeague(code);
      setCurrentLeague(league);
      setCurrentTeam(null);
      setLeagueCodeInput(league.code);
      setMode("inLeague");
      setSuccess(`Joined league: ${league.name || league.code}`);
    } catch (err: any) {
      setError(err.message || "Failed to join league");
    } finally {
      setLoading(false);
    }
  };

  // --- Team actions ---

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!currentLeague) {
      setError("You must be in a league first.");
      return;
    }

    if (!teamName.trim()) {
      setError("Team name is required.");
      return;
    }

    try {
      setLoading(true);
      const { team } = await LeagueService.createTeam(
        currentLeague.code,
        teamName.trim()
      );
      setCurrentTeam(team);
      setTeamCodeInput(team.code);
      setSuccess(
        `Team created in league ${currentLeague.code}. Share this team code: ${team.code}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!currentLeague) {
      setError("You must be in a league first.");
      return;
    }

    const teamCode = normalizeCode(teamCodeInput);
    if (teamCode.length !== 5) {
      setError("Team code must be 5 characters.");
      return;
    }

    try {
      setLoading(true);
      const { team } = await LeagueService.joinTeam(
        currentLeague.code,
        teamCode
      );
      setCurrentTeam(team);
      setSuccess(
        `Joined team "${team.name}" in league ${currentLeague.code}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to join team");
    } finally {
      setLoading(false);
    }
  };

  // --- Render helpers ---

  const renderInitial = () => (
    <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-2xl p-8 border border-blue-500 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Leagues</h2>
      <p className="text-gray-300 text-center mb-8">
        Start by creating a new league or joining one with a 5-character
        code.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            resetMessages();
            setMode("createLeague");
          }}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Create a League
        </button>
        <button
          onClick={() => {
            resetMessages();
            setMode("joinLeague");
          }}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Join a League
        </button>
      </div>
    </div>
  );

  const renderCreateLeague = () => (
    <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-2xl p-8 border border-blue-500 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create a League</h2>
      <p className="text-gray-300 text-center mb-6">
        Optionally give your league a name. A 5-character league code will
        be generated for others to use to join.
      </p>
      <form onSubmit={handleCreateLeague} className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-300">
            League Name (optional)
          </label>
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600"
            placeholder="e.g. Sunday Night Men's League"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 disabled:from-blue-900 disabled:to-blue-900 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? "Creating..." : "Create League"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("initial");
              resetMessages();
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );

  const renderJoinLeague = () => (
    <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-2xl p-8 border border-blue-500 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Join a League</h2>
      <p className="text-gray-300 text-center mb-6">
        Enter the 5-character league code that was given to you.
      </p>
      <form onSubmit={handleJoinLeague} className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-300">League Code</label>
          <input
            type="text"
            value={leagueCodeInput}
            onChange={(e) => setLeagueCodeInput(normalizeCode(e.target.value))}
            maxLength={5}
            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 tracking-[0.4em] text-center text-xl"
            placeholder="ABCDE"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 disabled:from-blue-900 disabled:to-blue-900 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? "Joining..." : "Join League"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("initial");
              resetMessages();
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );

  const renderInLeague = () => (
    <div className="w-full max-w-3xl bg-gray-900 rounded-xl shadow-2xl p-8 border border-blue-500 mt-10">
      <h2 className="text-2xl font-bold mb-2 text-center">League Lobby</h2>

      {currentLeague && (
        <div className="text-center mb-6">
          <p className="text-gray-300">
            You are in league:
            <span className="font-semibold text-white">
              {" "}
              {currentLeague.name || currentLeague.code}
            </span>
          </p>
          <p className="mt-2 text-gray-300">
            League Code:{" "}
            <span className="font-mono text-xl tracking-[0.4em] bg-gray-800 px-3 py-1 rounded">
              {currentLeague.code}
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create team */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-600">
          <h3 className="text-xl font-semibold mb-3">Create a Team</h3>
          <p className="text-gray-300 mb-3">
            Make a new team inside this league. You will get a 5-character
            team code that others can use to join.
          </p>
          <form onSubmit={handleCreateTeam} className="space-y-3">
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-2 bg-gray-900 text-white rounded border border-gray-600"
                placeholder="e.g. Washington Wolves"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 disabled:from-blue-900 disabled:to-blue-900 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {loading ? "Creating Team..." : "Create Team"}
            </button>
          </form>

          {currentTeam && (
            <div className="mt-4 text-sm text-gray-200">
              <p>
                Current team:{" "}
                <span className="font-semibold">{currentTeam.name}</span>
              </p>
              <p className="mt-1">
                Team Code:{" "}
                <span className="font-mono tracking-[0.4em] bg-gray-900 px-2 py-1 rounded">
                  {currentTeam.code}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Join team */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-600">
          <h3 className="text-xl font-semibold mb-3">Join Existing Team</h3>
          <p className="text-gray-300 mb-3">
            If someone already made a team in this league, enter their 5-character
            team code here.
          </p>
          <form onSubmit={handleJoinTeam} className="space-y-3">
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Team Code
              </label>
              <input
                type="text"
                value={teamCodeInput}
                onChange={(e) => setTeamCodeInput(normalizeCode(e.target.value))}
                maxLength={5}
                className="w-full p-2 bg-gray-900 text-white rounded border border-gray-600 tracking-[0.4em] text-center text-xl"
                placeholder="ABCDE"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-all duration-200"
            >
              {loading ? "Joining Team..." : "Join Team"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => {
            // Reset back to the main League page choice
            setMode("initial");
            setCurrentLeague(null);
            setCurrentTeam(null);
            setLeagueName("");
            setTeamName("");
            setLeagueCodeInput("");
            setTeamCodeInput("");
            resetMessages();
          }}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Leave League
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center">
      <Navbar />

      <div className="flex flex-col items-center justify-start mt-24 text-center px-4 w-full">
        <img
          src={logo}
          alt="PlayerProxy Logo"
          className="w-40 h-40 mb-4 drop-shadow-2xl"
        />
        <h1 className="text-4xl font-bold mb-2 tracking-wide">League</h1>
        <p className="text-gray-300 mb-4">
          Create or join leagues using simple 5-character codes. Then create or
          join teams inside those leagues.
        </p>

        {/* Status messages */}
        {error && (
          <div className="mt-3 w-full max-w-xl bg-red-900/70 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-3 w-full max-w-xl bg-green-900/70 border border-green-500 text-green-100 px-4 py-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Main content by mode */}
        {mode === "initial" && renderInitial()}
        {mode === "createLeague" && renderCreateLeague()}
        {mode === "joinLeague" && renderJoinLeague()}
        {mode === "inLeague" && renderInLeague()}
      </div>
    </div>
  );
};

export default LeaguePage;
