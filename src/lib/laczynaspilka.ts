import type { Match } from "@/lib/types";
import { teamConfig, type TeamKey } from "@/lib/teams";

import zakiMatches from "@/data/zaki.json";
import trampkarzeMatches from "@/data/trampkarze.json";
import seniorzyMatches from "@/data/seniorzy.json";
import zaki2018Matches from "@/data/zaki-2018.json";
import orlik2017Matches from "@/data/orlik-2017.json";
import junior2010Matches from "@/data/junior-2010.json";
import orlik2016Matches from "@/data/orlik-2016.json";
import orlik2017IIMatches from "@/data/orlik-2017-ii.json";
import seniorzyIIMatches from "@/data/seniorzy-ii.json";

const PROXY_URL = process.env.PZPN_PROXY_URL || "https://proxy.adiczq.dev";

const fallbackMatches: Record<TeamKey, Match[]> = {
  zaki2019: zakiMatches,
  zaki2018: zaki2018Matches,
  orlik2017: orlik2017Matches,
  orlik2017II: orlik2017IIMatches,
  orlik2016: orlik2016Matches,
  trampkarze2013: trampkarzeMatches,
  junior2010: junior2010Matches,
  seniorzy: seniorzyMatches,
  seniorzyII: seniorzyIIMatches,
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
  state?: string;
  queue?: number;
  host: ApiTeam;
  guest: ApiTeam;
};

function mapApiMatchToMatch(match: ApiMatch): Match {
  const [date, timePart] = match.dateTime.split("T");

  return {
    id: match.matchId,
    date,
    time: timePart?.slice(0, 5),
    homeTeam: match.host.name,
    awayTeam: match.guest.name,
    venue: match.stadium?.trim() || undefined,
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

async function fetchPzpnMatches(team: TeamKey): Promise<Match[]> {
  const config = teamConfig[team];
  const proxySecret = process.env.PROXY_SECRET;

  if (!config.playId || !proxySecret) {
    return [];
  }

  const response = await fetch(
    `${PROXY_URL}/pzpn/plays/${encodeURIComponent(config.playId)}/matches`,
    {
      headers: {
        "x-proxy-secret": proxySecret,
      },
      next: {
        revalidate: 300,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Proxy ${response.status} ${response.statusText}: ${text}`);
  }

  const data = (await response.json()) as ApiMatch[];

  return prepareApiMatches(data);
}

export async function getTeamMatches(team: TeamKey): Promise<Match[]> {
  const config = teamConfig[team];

  if (!config.playId) {
    return getFallbackMatches(team);
  }

  try {
    const matches = await fetchPzpnMatches(team);

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
  const proxySecret = process.env.PROXY_SECRET;

  if (!proxySecret) {
    throw new Error("Brak PROXY_SECRET");
  }

  const response = await fetch(`${PROXY_URL}/pzpn-test`, {
    headers: {
      "x-proxy-secret": proxySecret,
    },
    cache: "no-store",
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    response: data,
  };
}
