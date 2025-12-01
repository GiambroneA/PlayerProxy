import { League, Team } from "../types/League";

export class LeagueService {
  private static async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let body: any = {};
      try {
        body = await res.json();
      } catch {
        // ignore
      }
      const message =
        body.detail || body.error || body.message || `HTTP ${res.status}`;
      throw new Error(message);
    }
    return res.json() as Promise<T>;
  }

  static async createLeague(name?: string | null): Promise<League> {
    const res = await fetch("/api/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name ?? null }),
    });
    return this.handleResponse<League>(res);
  }

  static async joinLeague(code: string): Promise<League> {
    const res = await fetch("/api/leagues/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return this.handleResponse<League>(res);
  }

  static async createTeam(
    leagueCode: string,
    name: string
  ): Promise<{ league: League; team: Team }> {
    const res = await fetch(`/api/leagues/${encodeURIComponent(leagueCode)}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return this.handleResponse<{ league: League; team: Team }>(res);
  }

  static async joinTeam(
    leagueCode: string,
    teamCode: string
  ): Promise<{ league: League; team: Team }> {
    const res = await fetch(
      `/api/leagues/${encodeURIComponent(leagueCode)}/teams/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamCode }),
      }
    );
    return this.handleResponse<{ league: League; team: Team }>(res);
  }
}
