import { redirect } from "next/navigation";

import AdminMatchList from "@/components/AdminMatchList";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getArchiveTeamCompetitionMatches,
  getTeamScheduleData,
} from "@/lib/laczynaspilka";
import { attachMatchVideos } from "@/lib/match-videos";
import { allSeasons, CURRENT_SEASON } from "@/lib/seasons";
import type { TeamKey } from "@/lib/teams";
import type { Match } from "@/lib/types";

type AdminPageProps = {
  searchParams: Promise<{
    season?: string;
    team?: string;
    saved?: string;
    error?: string;
  }>;
};

type AdminMatch = {
  teamId: string;
  teamName: string;
  match: Match;
};

function sortSeasons(seasons: string[]) {
  return [...seasons].sort((a, b) => {
    const aYear = Number(a.split("/")[0]);
    const bYear = Number(b.split("/")[0]);

    return bYear - aYear;
  });
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const selectedSeason =
    params.season && allSeasons[params.season] ? params.season : CURRENT_SEASON;

  const seasonData = allSeasons[selectedSeason];

  let matches: AdminMatch[] = [];

  if (selectedSeason === CURRENT_SEASON) {
    const teamResults = await Promise.all(
      seasonData.teams.map(async (team) => {
        const data = await getTeamScheduleData(team.id as TeamKey);

        const playedMatches = await attachMatchVideos(data.playedMatches);

        return playedMatches.map((match) => ({
          teamId: team.id,
          teamName: team.name,
          match,
        }));
      })
    );

    matches = teamResults.flat();
  } else {
    const teamResults = await Promise.all(
      seasonData.teams.map(async (team) => {
        const data = await getArchiveTeamCompetitionMatches(team);

        const allMatches = data.competitions.flatMap(({ matches }) => matches);

        const uniqueMatches = Array.from(
          new Map(allMatches.map((match) => [match.id, match])).values()
        );

        const playedMatches = await attachMatchVideos(uniqueMatches);

        return playedMatches.map((match) => ({
          teamId: team.id,
          teamName: team.name,
          match,
        }));
      })
    );

    matches = teamResults.flat();
  }

  matches.sort((a, b) => {
    const aDate = `${a.match.date}T${a.match.time || "00:00"}`;
    const bDate = `${b.match.date}T${b.match.time || "00:00"}`;

    return bDate.localeCompare(aDate);
  });

  const seasons = sortSeasons(Object.keys(allSeasons));

  return (
    <main className="page-shell min-h-dvh">
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
              Górnik Radlin
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Panel administratora
            </h1>

            <p className="muted mt-2">
              Nagrania rozegranych meczów · sezon {selectedSeason}
            </p>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Wyloguj
            </button>
          </form>
        </div>

        {params.saved === "1" && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            Nagranie zostało zapisane.
          </div>
        )}

        {params.error === "youtube" && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            Podaj prawidłowy link do YouTube.
          </div>
        )}

        <AdminMatchList
          matches={matches}
          seasons={seasons}
          selectedSeason={selectedSeason}
          initialSelectedTeam={params.team}
        />
      </div>
    </main>
  );
}
