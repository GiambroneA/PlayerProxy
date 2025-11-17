import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

type Player = {
  ['@id']?: string;
  Name?: string;
  Team?: string;
  Number?: number;
  Shoots?: string;
};

const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const res = await fetch("/api/allplayers"); // proxied to localhost:4000
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        }
        const data: Player[] = await res.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-16">
        <img
          src={logo}
          alt="PlayerProxy Logo"
          className="w-56 h-56 mb-6 drop-shadow-2xl"
        />

        <h1 className="text-5xl font-bold mb-4 tracking-wide">
          Your Roster
        </h1>

        {/* Loading / Error / Player List */}
        {loading && <p className="text-gray-400">Loading players...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && (
          <ul className="mt-6 space-y-2 text-lg text-gray-200">
            {players.length > 0 ? (
              players.map((p) => (
                <li key={p['@id']}>
                  {p.Name || "(Unnamed Player)"}
                </li>
              ))
            ) : (
              <li>No players found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Roster;

