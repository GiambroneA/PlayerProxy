// services/StatsService.ts
import { GameStats, StatRow } from '../types/Player';

export class StatsService {
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

  // Convert game stats to table format
  static aggregateStatsForSport(gameStats: GameStats[], sport: string): StatRow[] {
    const sportStats = gameStats.filter(stat => stat.sport === sport);
    
    if (sportStats.length === 0) return [];
    
    // For now, just show the most recent game's stats
    const latestGame = sportStats[sportStats.length - 1];
    
    return Object.entries(latestGame.stats).map(([category, value]) => ({
      category: this.formatCategoryName(category),
      value
    }));
  }

  private static formatCategoryName(category: string): string {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}