// types/Player.ts
export interface Player {
  id: string;
  Name: string;
  Number: string;
  DoB: string;
  Height: number[];
  Weight: number;
  Teams: {
    Sport: string;
    Team: string;
  }[];
}

export interface GameStats {
  id: string;
  playerId: string;
  sport: string;
  gameDate: string;
  opponent: string;
  stats: Record<string, number>;
}

export interface StatRow {
  category: string;
  value: string | number;
}