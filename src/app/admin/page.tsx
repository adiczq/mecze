import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getTeamScheduleData } from "@/lib/laczynaspilka";
import { attachMatchVideos } from "@/lib/match-videos";
import { teamConfig, teamKeys, type TeamKey } from "@/lib/teams";
import type { Match } from "@/lib/types";
import AdminMatchList from "@/components/AdminMatchList";

type AdminPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

type AdminMatch = {
  teamKey: TeamKey;
  teamName: string;
  match: Match;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const teamResults = await Promise.all(
    teamKeys.map(async (teamKey) => {
      const data = await getTeamScheduleData(teamKey);

      const playedMatches = await attachMatchVideos(data.playedMatches);

      return playedMatches.map((match) => ({
        teamKey,
        teamName: teamConfig[teamKey].name,
        match,
      }));
    })
  );

  const matches: AdminMatch[] = teamResults.flat().sort((a, b) => {
    const aDate = `${a.match.date}T${a.match.time || "00:00"}`;

    const bDate = `${b.match.date}T${b.match.time || "00:00"}`;

    return bDate.localeCompare(aDate);
  });

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

            <p className="muted mt-2">Nagrania rozegranych meczów.</p>
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

        <AdminMatchList matches={matches} />
      </div>
    </main>
  );
}
