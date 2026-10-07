import Link from "next/link";
import { notFound } from "next/navigation";

import LeagueTable from "@/components/LeagueTable";
import MatchList from "@/components/MatchList";

import {
  getArchiveTeamCompetitionMatches,
  getLeagueTable,
} from "@/lib/laczynaspilka";

import { getArchiveTeam } from "@/lib/seasons";

type ArchiveTeamPageProps = {
  params: Promise<{
    season: string;
    team: string;
  }>;
};

function slugToSeason(slug: string) {
  return slug.replace("-", "/");
}

function supportsLeagueTable(category: string) {
  const normalized = category.trim().toUpperCase();

  const youthCategory = normalized.match(/^([A-G])(?:\d)?/);

  if (youthCategory) {
    const level = youthCategory[1];

    return ["A", "B", "C", "D"].includes(level);
  }

  return true;
}

export default async function ArchiveTeamPage({
  params,
}: ArchiveTeamPageProps) {
  const { season: seasonSlug, team: teamSlug } = await params;

  const season = slugToSeason(seasonSlug);
  const team = getArchiveTeam(season, teamSlug);

  if (!team) {
    notFound();
  }

  const { competitions } = await getArchiveTeamCompetitionMatches(team);

  const canHaveTable = supportsLeagueTable(team.category);

  const competitionsWithTables = await Promise.all(
    competitions.map(async ({ competition, matches }) => {
      const table =
        canHaveTable && competition.category === "League"
          ? await getLeagueTable(competition.id)
          : null;

      return {
        competition,
        matches,
        table,
      };
    })
  );

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link
          href={`/archiwum/${seasonSlug}`}
          className="muted mb-6 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-blue-600"
        >
          <span>←</span>
          <span>Archiwum {season}</span>
        </Link>

        <p className="brand text-sm font-bold uppercase tracking-[0.25em]">
          Górnik Radlin
        </p>

        <h1 className="mt-2 text-4xl font-black text-slate-900">{team.name}</h1>

        <p className="muted mt-3">
          {team.category} · sezon {season}
        </p>

        <div className="mt-10 space-y-14">
          {competitionsWithTables.map(({ competition, matches, table }) => (
            <section key={competition.id}>
              <div className="mb-5">
                <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
                  {competition.label}
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {competition.name}
                </h2>
              </div>

              {table && (
                <div className="mb-8">
                  <LeagueTable
                    table={table}
                    teamId={competition.teamId ?? team.teamId}
                  />
                </div>
              )}

              <MatchList matches={[]} playedMatches={matches} archiveMode />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
