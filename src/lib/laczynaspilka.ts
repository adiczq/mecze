import type { Match } from "@/lib/types";
import { teamConfig, type TeamKey } from "@/lib/teams";

import zakiMatches from "@/data/zaki.json";
import trampkarzeMatches from "@/data/trampkarze.json";
import seniorzyMatches from "@/data/seniorzy.json";

const API_URL = "https://shared-api-ng.laczynaspilka.pl/api/lnp/shared/v1";

const fallbackMatches: Record<TeamKey, Match[]> = {
  zaki: zakiMatches as Match[],
  trampkarze: trampkarzeMatches as Match[],
  seniorzy: seniorzyMatches as Match[],
};

export function getFallbackMatches(team: TeamKey): Match[] {
  return fallbackMatches[team];
}

type ApiTeam = {
  id: string;
  name: string;
};

type ApiMatch = {
  matchId: string;
  dateTime: string;
  stadium?: string;
  queue?: number;
  host: ApiTeam;
  guest: ApiTeam;
};

function mapApiMatchToMatch(match: ApiMatch): Match {
  return {
    id: match.matchId,
    date: match.dateTime.split("T")[0],
    time: match.dateTime.split("T")[1]?.slice(0, 5),
    homeTeam: match.host.name,
    awayTeam: match.guest.name,
    venue: match.stadium || undefined,
    round: match.queue !== undefined ? `Kolejka ${match.queue}` : undefined,
    source: "PZPN",
  };
}

const CLUB_NAME = "GÓRNIK RADLIN";

function isGornikMatch(match: ApiMatch) {
  const homeTeam = match.host.name.toUpperCase();
  const awayTeam = match.guest.name.toUpperCase();

  return homeTeam.includes(CLUB_NAME) || awayTeam.includes(CLUB_NAME);
}

function prepareApiMatches(matches: ApiMatch[]): Match[] {
  const now = new Date();

  return matches
    .filter(isGornikMatch)
    .filter((match) => new Date(match.dateTime) >= now)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
    .map(mapApiMatchToMatch);
}

async function fetchPzpnMatches(
  team: TeamKey,
  token: string
): Promise<Match[]> {
  const config = teamConfig[team];

  if (!config.playId) {
    return [];
  }

  // Po otrzymaniu tokenu tutaj podepniemy:
  // /Plays/{playId}/queues
  // oraz /Plays/{playId}/matches

  void token;

  return [];
}

export async function getTeamMatches(team: TeamKey): Promise<Match[]> {
  const token = process.env.PZPN_API_TOKEN;
  const config = teamConfig[team];

  if (!token || token === "test" || !config.playId) {
    return getFallbackMatches(team);
  }

  try {
    const matches = await fetchPzpnMatches(team, token);

    if (matches.length === 0) {
      return getFallbackMatches(team);
    }

    return matches;
  } catch (error) {
    console.error(`Błąd pobierania meczów dla ${team}:`, error);

    return getFallbackMatches(team);
  }
}

export async function testPzpnConnection() {
  const token = process.env.PZPN_API_TOKEN;

  if (!token) {
    throw new Error("Brak PZPN_API_TOKEN w .env.local");
  }

  const response = await fetch(`${API_URL}/Seasons/dictionaries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    response: text,
  };
}
