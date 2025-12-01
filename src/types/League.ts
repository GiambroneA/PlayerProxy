export interface League {
  id: string;
  code: string;
  name?: string | null;
  createdAt: string;
}

export interface Team {
  id: string;
  code: string;
  leagueCode: string;
  name: string;
  createdAt: string;
}
