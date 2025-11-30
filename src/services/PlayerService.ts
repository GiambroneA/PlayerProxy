import { Player } from '../types/Player';

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

  /**
  static async getPlayerById(id: string): Promise<Player> {
    // Similar pattern for single player
  }

  */

  static async getPlayerStats(playerId: string): Promise<any> {
    // For your stats page later
  }
}