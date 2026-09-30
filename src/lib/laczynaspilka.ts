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

export async function getTeamMatches(team: TeamKey): Promise<Match[]> {
  const token = process.env.PZPN_API_TOKEN;
  const config = teamConfig[team];

  // Na razie korzystamy z obecnych JSON-ów.
  // Po otrzymaniu prawdziwego tokenu podłączymy tutaj API PZPN.
  if (!token || token === "test" || !config.playId) {
    return getFallbackMatches(team);
  }

  return getFallbackMatches(team);
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
