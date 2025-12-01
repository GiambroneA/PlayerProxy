// services/StatsService.ts -fetches data from db and makes calculations
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

  // Calculate averages from all games for a sport
  static aggregateStatsForSport(gameStats: GameStats[], sport: string): StatRow[] {
    const sportStats = gameStats.filter(stat => stat.sport === sport);
    
    if (sportStats.length === 0) return [];
    
    // If only one game, show that game's stats
    if (sportStats.length === 1) {
      const game = sportStats[0];
      return Object.entries(game.stats).map(([category, value]) => ({
        category: this.formatCategoryName(category),
        value
      }));
    }
    
    // Calculate averages across all games
    const aggregated: Record<string, { total: number; count: number }> = {};
    
    // Initialize aggregation for all stat categories
    sportStats.forEach(game => {
      Object.entries(game.stats).forEach(([category, value]) => {
        if (!aggregated[category]) {
          aggregated[category] = { total: 0, count: 0 };
        }
        aggregated[category].total += Number(value);
        aggregated[category].count += 1;
      });
    });
    
    // Convert to averages and format
    return Object.entries(aggregated).map(([category, data]) => {
      const average = data.total / data.count;
      
      // Format based on stat type
      let formattedValue: string | number;
      
      switch(category.toLowerCase()) {
        case 'fieldgoalpercentage':
        case 'freethrowpercentage':
        case 'threepointpercentage':
        case 'passaccuracy':
          formattedValue = `${(average * 100).toFixed(1)}%`;
          break;
        case 'battingaverage':
        case 'onbasepercentage':
        case 'sluggingpercentage':
          formattedValue = average.toFixed(3);
          break;
        default:
          // For counts (points, rebounds, etc.)
          formattedValue = average.toFixed(1);
      }
      
      return {
        category: this.formatCategoryName(category),
        value: formattedValue
      };
    });
  }

  // Alternative: Show both averages and totals
  static getDetailedStats(gameStats: GameStats[], sport: string): {
    averages: StatRow[];
    totals: StatRow[];
    gamesPlayed: number;
  } {
    const sportStats = gameStats.filter(stat => stat.sport === sport);
    const gamesPlayed = sportStats.length;
    
    if (gamesPlayed === 0) {
      return { averages: [], totals: [], gamesPlayed: 0 };
    }
    
    const aggregated: Record<string, { total: number; count: number }> = {};
    
    // Calculate totals
    sportStats.forEach(game => {
      Object.entries(game.stats).forEach(([category, value]) => {
        if (!aggregated[category]) {
          aggregated[category] = { total: 0, count: 0 };
        }
        aggregated[category].total += Number(value);
        aggregated[category].count += 1;
      });
    });
    
    // Create averages array
    const averages = Object.entries(aggregated).map(([category, data]) => {
      const average = data.total / data.count;
      
      let formattedValue: string | number;
      
      switch(category.toLowerCase()) {
        case 'fieldgoalpercentage':
        case 'freethrowpercentage':
        case 'threepointpercentage':
        case 'passaccuracy':
          formattedValue = `${(average * 100).toFixed(1)}%`;
          break;
        case 'battingaverage':
        case 'onbasepercentage':
        case 'sluggingpercentage':
          formattedValue = average.toFixed(3);
          break;
        default:
          formattedValue = average.toFixed(1);
      }
      
      return {
        category: this.formatCategoryName(category),
        value: formattedValue
      };
    });
    
    // Create totals array
    const totals = Object.entries(aggregated).map(([category, data]) => ({
      category: this.formatCategoryName(category),
      value: data.total
    }));
    
    return { averages, totals, gamesPlayed };
  }

  // Helper to get latest game stats (if you still want that option)
  static getLatestGameStats(gameStats: GameStats[], sport: string): StatRow[] {
    const sportStats = gameStats.filter(stat => stat.sport === sport);
    
    if (sportStats.length === 0) return [];
    
    // Sort by date (newest first)
    const sortedStats = [...sportStats].sort((a, b) => 
      new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
    );
    
    const latestGame = sortedStats[0];
    
    return Object.entries(latestGame.stats).map(([category, value]) => ({
      category: this.formatCategoryName(category),
      value
    }));
  }

  private static formatCategoryName(category: string): string {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Fg', 'FG')
      .replace('Fg', 'FG')
      .replace('3pt', '3PT')
      .replace('Rbi', 'RBI');
  }
}