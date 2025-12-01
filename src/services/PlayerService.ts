import { Player , GameStats} from '../types/Player';

export class PlayerService {
  static async getAllPlayers(): Promise<Player[]> {
    try {
      const res = await fetch("/api/allplayers");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch players:', error);
      throw error;
    }
  }

  static async getPlayerById(id: string): Promise<Player> {
    try {
      const res = await fetch(`/api/players?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch player:', error);
      throw error;
    }
  }

  static async getPlayerStats(playerId: string): Promise<GameStats[]> {
    try {
      const res = await fetch(`/api/playerstats/${encodeURIComponent(playerId)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
      throw error;
    }
  }

  // Get all players with their sports
  static async getPlayersWithSports(): Promise<Player[]> {
    const players = await this.getAllPlayers();
    return players.filter(player => player.Teams && player.Teams.length > 0);
  }
}