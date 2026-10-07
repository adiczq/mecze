import { season2022_2023 } from "./2022-2023";
import { season2023_2024 } from "./2023-2024";
import { season2024_2025 } from "./2024-2025";
import { season2025_2026 } from "./2025-2026";
import { season2026_2027, type TeamKey } from "./2026-2027";

import type { ArchiveSeason, ArchiveSeasonTeam } from "./types";

export type {
  ArchiveCompetition,
  ArchiveCompetitionStage,
  ArchiveSeason,
  ArchiveSeasonTeam,
  CompetitionCategory,
} from "./types";

export type { TeamKey } from "./2026-2027";

export const CURRENT_SEASON = "2026/2027";

export const allSeasons: Record<string, ArchiveSeason> = {
  [season2026_2027.season]: season2026_2027,
  [season2025_2026.season]: season2025_2026,
  [season2024_2025.season]: season2024_2025,
  [season2023_2024.season]: season2023_2024,
  [season2022_2023.season]: season2022_2023,
};

export const currentSeason = allSeasons[CURRENT_SEASON];

if (!currentSeason) {
  throw new Error(
    `Nie znaleziono konfiguracji aktualnego sezonu ${CURRENT_SEASON}`
  );
}

/**
 * Wszystkie zakończone sezony.
 *
 * Drużyny z archive: false są automatycznie usuwane.
 * Dzięki temu np. Żaki i Orliki nie pojawią się później
 * w archiwum wyników.
 */
export const archiveSeasons: Record<string, ArchiveSeason> = Object.fromEntries(
  Object.entries(allSeasons)
    .filter(([season]) => season !== CURRENT_SEASON)
    .map(([season, data]) => [
      season,
      {
        ...data,
        teams: data.teams.filter((team) => team.archive !== false),
      },
    ])
);

export function getSeason(season: string): ArchiveSeason | null {
  return allSeasons[season] ?? null;
}

export function getArchiveSeason(season: string): ArchiveSeason | null {
  return archiveSeasons[season] ?? null;
}

export function getArchiveTeam(
  season: string,
  teamSlug: string
): ArchiveSeasonTeam | null {
  const archive = getArchiveSeason(season);

  if (!archive) {
    return null;
  }

  return (
    archive.teams.find(
      (team) => team.id === teamSlug || team.slug === teamSlug
    ) ?? null
  );
}

type CurrentTeamConfig = {
  name: string;
  slug: string;
  description: string;
  source: string;
  playId: string;
  teamId: string;
  order: number;
};

/**
 * Kompatybilność z dotychczasową aplikacją.
 *
 * teamConfig nie przechowuje już danych.
 * Jest automatycznie generowany z CURRENT_SEASON.
 */
export const teamConfig = Object.fromEntries(
  currentSeason.teams.map((team) => {
    const competition = team.competitions[0];

    if (
      !team.slug ||
      !team.description ||
      !team.source ||
      team.order === undefined ||
      !competition
    ) {
      throw new Error(`Niepełna konfiguracja aktualnej drużyny: ${team.name}`);
    }

    return [
      team.id,
      {
        name: team.name,
        slug: team.slug,
        description: team.description,
        source: team.source,
        playId: competition.id,
        teamId: team.teamId,
        order: team.order,
      },
    ];
  })
) as Record<TeamKey, CurrentTeamConfig>;

export const teamKeys = Object.keys(teamConfig) as TeamKey[];
