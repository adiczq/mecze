import Link from "next/link";

import LeagueTable from "@/components/LeagueTable";
import MatchList from "@/components/MatchList";

import { getLeagueTable, getTeamScheduleData } from "@/lib/laczynaspilka";

import { attachMatchVideos } from "@/lib/match-videos";
import { currentSeason } from "@/lib/seasons";
import { teamConfig, type TeamKey } from "@/lib/teams";

type TeamSchedulePageProps = {
  teamKey: TeamKey;
};

function formatLastUpdate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

function supportsLeagueTable(category: string) {
  const normalized = category.trim().toUpperCase();

  const youthCategory = normalized.match(/^([A-G])(?:\d)?/);

  if (youthCategory) {
    const level = youthCategory[1];

    return ["A", "B", "C", "D"].includes(level);
  }

  // Kategorie seniorskie, np.:
  // "Klasa okręgowa", "Klasa B", "IV Liga" itd.
  return true;
}

export default async function TeamSchedulePage({
  teamKey,
}: TeamSchedulePageProps) {
  const team = teamConfig[teamKey];

  const seasonTeam = currentSeason.teams.find((item) => item.id === teamKey);

  const leagueCompetition = seasonTeam?.competitions.find(
    (competition) => competition.category === "League"
  );

  const canShowLeagueTable =
    seasonTeam && leagueCompetition && supportsLeagueTable(seasonTeam.category);

  const [scheduleData, leagueTable] = await Promise.all([
    getTeamScheduleData(teamKey),

    canShowLeagueTable
      ? getLeagueTable(leagueCompetition.id)
      : Promise.resolve(null),
  ]);

  const { matches, playedMatches, updatedAt } = scheduleData;

  const playedMatchesWithVideos = await attachMatchVideos(playedMatches);

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link
          href="/"
          className="muted mb-6 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-blue-600"
        >
          <span>←</span>
          <span>Mecze</span>
        </Link>

        <p className="brand text-sm font-bold uppercase tracking-[0.25em]">
          Górnik Radlin
        </p>

        <h1 className="mt-2 text-4xl font-black text-slate-900">{team.name}</h1>

        <p className="muted mt-3">Terminarz i wyniki drużyny.</p>

        {updatedAt && (
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>↻</span>
            <span>Ostatnia aktualizacja: {formatLastUpdate(updatedAt)}</span>
          </p>
        )}

        <div className="mt-8">
          <MatchList
            matches={matches}
            playedMatches={playedMatchesWithVideos}
            afterFeatured={
              leagueTable && seasonTeam ? (
                <LeagueTable table={leagueTable} teamId={seasonTeam.teamId} />
              ) : null
            }
          />
        </div>
      </div>
    </main>
  );
}
