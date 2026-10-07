import type { Match } from "@/lib/types";

import {
  currentSeason,
  type ArchiveCompetition,
  type ArchiveSeasonTeam,
  type TeamKey,
} from "@/lib/seasons";

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

export type LeagueTableRow = {
  index: number;
  positionStatus: string;
  promotionStatus: string;

  stats: {
    points: number;
    matchesCount: number;
    winsCount: number;
    drawsCount: number;
    losesCount: number;
    goalsCount: number;
    lostGoalsCount: number;
    balanceGoalsCount: number;
  };

  team: {
    id: string;
    name: string;
    logo?: string;
    abbreviation?: string;
  };

  isCancelled: boolean;
};

export type LeagueTableData = {
  league: {
    id: string;
    name: string;
  };

  play: {
    id: string;
    name: string;
    zpn?: {
      id: string;
      name: string;
    };
  };

  rows: LeagueTableRow[];
};

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

type CompetitionFetchResult = {
  matches: ApiMatch[];
  updatedAt: Date | null;
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

function isTeamMatch(match: ApiMatch, teamId: string): boolean {
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

  return `${get("year")}-${get("month")}-${get(
    "day"
  )}T${get("hour")}:${get("minute")}:${get("second")}`;
}

function uniqueApiMatches(matches: ApiMatch[]): ApiMatch[] {
  return Array.from(
    new Map(matches.map((match) => [match.matchId, match])).values()
  );
}

function prepareUpcomingMatches(matches: ApiMatch[]): Match[] {
  const nowWarsaw = getWarsawNowString();

  return matches
    .filter((match) => Boolean(match.dateTime))
    .filter((match) => match.dateTime >= nowWarsaw)
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .map(mapApiMatchToMatch);
}

function preparePlayedMatches(matches: ApiMatch[]): Match[] {
  const nowWarsaw = getWarsawNowString();

  return matches
    .filter((match) => Boolean(match.dateTime))
    .filter((match) => match.dateTime < nowWarsaw)
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
    .map((match) => ({
      ...mapApiMatchToMatch(match),
      played: true,
    }));
}

function getLatestUpdatedAt(dates: Array<Date | null>): Date | null {
  const validDates = dates.filter(
    (date): date is Date =>
      date instanceof Date && !Number.isNaN(date.getTime())
  );

  if (validDates.length === 0) {
    return null;
  }

  return new Date(Math.max(...validDates.map((date) => date.getTime())));
}

async function fetchPlayMatches(
  playId: string
): Promise<CompetitionFetchResult> {
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

export async function getLeagueTable(
  playId: string
): Promise<LeagueTableData | null> {
  const proxySecret = process.env.PROXY_SECRET;

  if (!proxySecret) {
    throw new Error("Brak PROXY_SECRET");
  }

  try {
    const response = await fetch(
      `${PROXY_URL}/pzpn/plays/${encodeURIComponent(playId)}/tables`,
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

      throw new Error(
        `Proxy ${response.status} ${response.statusText}: ${text}`
      );
    }

    return (await response.json()) as LeagueTableData;
  } catch (error) {
    console.error(`Błąd pobierania tabeli ${playId}:`, error);

    return null;
  }
}

async function fetchChampionshipMatches(
  playId: string,
  playStageId: string
): Promise<CompetitionFetchResult> {
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

async function fetchCompetitionMatches(
  competition: ArchiveCompetition
): Promise<CompetitionFetchResult> {
  if (competition.category === "League") {
    return fetchPlayMatches(competition.id);
  }

  const stages = competition.stages ?? [];

  if (stages.length === 0) {
    return {
      matches: [],
      updatedAt: null,
    };
  }

  const stageResults = await Promise.all(
    stages.map((stage) => fetchChampionshipMatches(competition.id, stage.id))
  );

  return {
    matches: uniqueApiMatches(stageResults.flatMap((result) => result.matches)),

    updatedAt: getLatestUpdatedAt(
      stageResults.map((result) => result.updatedAt)
    ),
  };
}

async function fetchPzpnMatches(team: TeamKey): Promise<TeamMatchesResult> {
  const seasonTeam = currentSeason.teams.find(
    (candidate) => candidate.id === team
  );

  if (!seasonTeam) {
    throw new Error(`Brak drużyny ${team} w sezonie ${currentSeason.season}`);
  }

  if (seasonTeam.competitions.length === 0) {
    return {
      matches: [],
      playedMatches: [],
      updatedAt: null,
    };
  }

  const competitionResults = await Promise.all(
    seasonTeam.competitions.map(async (competition) => {
      try {
        const result = await fetchCompetitionMatches(competition);

        const competitionTeamId = competition.teamId ?? seasonTeam.teamId;

        return {
          ok: true as const,
          competition,
          matches: result.matches.filter((match) =>
            isTeamMatch(match, competitionTeamId)
          ),
          updatedAt: result.updatedAt,
        };
      } catch (error) {
        console.error(`Błąd pobierania rozgrywek ${competition.name}:`, error);

        return {
          ok: false as const,
          competition,
          matches: [] as ApiMatch[],
          updatedAt: null,
        };
      }
    })
  );

  const successfulResults = competitionResults.filter((result) => result.ok);

  if (successfulResults.length === 0) {
    throw new Error(`Nie udało się pobrać żadnych rozgrywek dla ${team}`);
  }

  const apiMatches = uniqueApiMatches(
    competitionResults.flatMap((result) => result.matches)
  );

  return {
    matches: prepareUpcomingMatches(apiMatches),

    playedMatches: preparePlayedMatches(apiMatches),

    updatedAt: getLatestUpdatedAt(
      competitionResults.map((result) => result.updatedAt)
    ),
  };
}

export async function getTeamScheduleData(
  team: TeamKey
): Promise<TeamMatchesResult> {
  const seasonTeam = currentSeason.teams.find(
    (candidate) => candidate.id === team
  );

  if (!seasonTeam) {
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
        const result = await fetchCompetitionMatches(competition);

        const competitionTeamId = competition.teamId ?? team.teamId;

        const matches = uniqueApiMatches(result.matches)
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
