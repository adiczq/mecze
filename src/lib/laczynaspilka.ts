import type { Match } from "@/lib/types";
import { teamConfig, type TeamKey } from "@/lib/teams";
import type { ArchiveCompetition, ArchiveSeasonTeam } from "@/lib/seasons";

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

export type TeamMatchesResult = {
  matches: Match[];
  playedMatches: Match[];
  updatedAt: Date | null;
};

export type ArchiveCompetitionMatches = {
  competition: ArchiveCompetition;
  matches: Match[];
};

export type ArchiveCompetitionsResult = {
  competitions: ArchiveCompetitionMatches[];
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
  scores?: {
    final?: string;
    half?: string;
    fullTime?: string;
  };
  playStage?: {
    id: string;
    name: string;
  };
};

function mapApiMatchToMatch(match: ApiMatch): Match {
  const [date, timePart] = match.dateTime.split("T");

  return {
    id: match.matchId,
    date,
    time: timePart?.slice(0, 5),
    homeTeam: match.host.name.trim(),
    awayTeam: match.guest.name.trim(),
    venue: match.stadium?.trim() || undefined,
    round:
      match.playStage?.name ||
      (match.queue !== undefined ? `Kolejka ${match.queue}` : undefined),
    source: "PZPN",
    score: match.scores?.final || match.scores?.fullTime || undefined,
    played: match.state === "Rozegrany",
  };
}

const CLUB_NAME = "GÓRNIK RADLIN";

function isGornikMatch(match: ApiMatch) {
  const homeTeam = match.host.name.toUpperCase();
  const awayTeam = match.guest.name.toUpperCase();

  return homeTeam.includes(CLUB_NAME) || awayTeam.includes(CLUB_NAME);
}

function isTeamMatch(match: ApiMatch, teamId: string) {
  return match.host.id === teamId || match.guest.id === teamId;
}

function getWarsawNowString() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get(
    "hour"
  )}:${get("minute")}:${get("second")}`;
}

function prepareApiMatches(matches: ApiMatch[]): Match[] {
  const nowWarsaw = getWarsawNowString();

  return matches
    .filter(isGornikMatch)
    .filter((match) => match.dateTime >= nowWarsaw)
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .map(mapApiMatchToMatch);
}

function preparePlayedMatches(matches: ApiMatch[]): Match[] {
  const nowWarsaw = getWarsawNowString();

  return matches
    .filter(isGornikMatch)
    .filter((match) => match.dateTime < nowWarsaw)
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
    .map((match) => ({
      ...mapApiMatchToMatch(match),
      played: true,
    }));
}

async function fetchPlayMatches(playId: string): Promise<{
  matches: ApiMatch[];
  updatedAt: Date | null;
}> {
  const proxySecret = process.env.PROXY_SECRET;

  if (!proxySecret) {
    throw new Error("Brak PROXY_SECRET");
  }

  const response = await fetch(
    `${PROXY_URL}/pzpn/plays/${encodeURIComponent(playId)}/matches`,
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

  const matches = (await response.json()) as ApiMatch[];

  const updatedAtHeader = response.headers.get("x-data-updated-at");

  return {
    matches,
    updatedAt: updatedAtHeader ? new Date(updatedAtHeader) : null,
  };
}

async function fetchChampionshipMatches(
  playId: string,
  playStageId: string
): Promise<{
  matches: ApiMatch[];
  updatedAt: Date | null;
}> {
  const proxySecret = process.env.PROXY_SECRET;

  if (!proxySecret) {
    throw new Error("Brak PROXY_SECRET");
  }

  const response = await fetch(
    `${PROXY_URL}/pzpn/plays/${encodeURIComponent(
      playId
    )}/championship-matches?playStageId=${encodeURIComponent(playStageId)}`,
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

  const matches = (await response.json()) as ApiMatch[];

  const updatedAtHeader = response.headers.get("x-data-updated-at");

  return {
    matches,
    updatedAt: updatedAtHeader ? new Date(updatedAtHeader) : null,
  };
}

async function fetchPzpnMatches(team: TeamKey): Promise<TeamMatchesResult> {
  const config = teamConfig[team];

  if (!config.playId) {
    return {
      matches: [],
      playedMatches: [],
      updatedAt: null,
    };
  }

  const result = await fetchPlayMatches(config.playId);

  return {
    matches: prepareApiMatches(result.matches),
    playedMatches: preparePlayedMatches(result.matches),
    updatedAt: result.updatedAt,
  };
}

export async function getTeamScheduleData(
  team: TeamKey
): Promise<TeamMatchesResult> {
  const config = teamConfig[team];

  if (!config.playId) {
    return {
      matches: getFallbackMatches(team),
      playedMatches: [],
      updatedAt: null,
    };
  }

  try {
    const result = await fetchPzpnMatches(team);

    console.log(
      `PZPN OK: ${team} - ${result.matches.length} przyszłych, ${result.playedMatches.length} rozegranych`
    );

    return {
      matches:
        result.matches.length > 0 ? result.matches : getFallbackMatches(team),
      playedMatches: result.playedMatches,
      updatedAt: result.updatedAt,
    };
  } catch (error) {
    console.error(`Błąd pobierania meczów dla ${team}:`, error);

    return {
      matches: getFallbackMatches(team),
      playedMatches: [],
      updatedAt: null,
    };
  }
}

export async function getTeamMatches(team: TeamKey): Promise<Match[]> {
  const result = await getTeamScheduleData(team);

  return result.matches;
}

export async function getArchiveTeamCompetitionMatches(
  team: ArchiveSeasonTeam
): Promise<ArchiveCompetitionsResult> {
  const competitions = await Promise.all(
    team.competitions.map(async (competition) => {
      try {
        let apiMatches: ApiMatch[] = [];

        if (competition.category === "League") {
          const result = await fetchPlayMatches(competition.id);
          apiMatches = result.matches;
        }

        if (competition.category === "Championship") {
          const stages = competition.stages ?? [];

          const stageResults = await Promise.all(
            stages.map((stage) =>
              fetchChampionshipMatches(competition.id, stage.id)
            )
          );

          apiMatches = stageResults.flatMap((result) => result.matches);
        }

        const uniqueMatches = Array.from(
          new Map(apiMatches.map((match) => [match.matchId, match])).values()
        );
        const competitionTeamId = competition.teamId ?? team.teamId;
        const matches = uniqueMatches
          .filter((match) => isTeamMatch(match, competitionTeamId))
          .filter((match) => Boolean(match.dateTime))
          .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
          .map((match) => ({
            ...mapApiMatchToMatch(match),
            played: true,
          }));

        return {
          competition,
          matches,
        };
      } catch (error) {
        console.error(`Błąd pobierania rozgrywek ${competition.name}:`, error);

        return {
          competition,
          matches: [],
        };
      }
    })
  );

  return {
    competitions,
  };
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
