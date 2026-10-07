export type CompetitionCategory = "League" | "Championship";

export type ArchiveCompetitionStage = {
  id: string;
  name: string;
};

export type ArchiveCompetition = {
  id: string;
  name: string;
  category: CompetitionCategory;
  label: string;

  // Przydatne, jeśli wiosna/jesień mają różne teamId.
  teamId?: string;

  stages?: ArchiveCompetitionStage[];
};

export type ArchiveSeasonTeam = {
  id: string;
  name: string;
  teamId: string;
  category: string;
  competitions: ArchiveCompetition[];

  leagueId?: string;

  // Pola używane przez aktualny sezon.
  slug?: string;
  description?: string;
  source?: string;
  order?: number;

  // false = drużyna istnieje w bieżącym sezonie,
  // ale po zakończeniu sezonu nie trafia do archiwum.
  // Domyślnie true.
  archive?: boolean;
};

export type ArchiveSeason = {
  season: string;
  teams: ArchiveSeasonTeam[];
};