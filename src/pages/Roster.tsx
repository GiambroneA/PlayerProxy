// pages/Roster.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { PlayerService } from "../services/PlayerService";
import { Player } from "../types/Player";

const Roster: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await PlayerService.getAllPlayers();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  // Rest of your component remains the same...
};