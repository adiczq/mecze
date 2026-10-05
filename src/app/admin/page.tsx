import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getTeamScheduleData } from "@/lib/laczynaspilka";
import { attachMatchVideos } from "@/lib/match-videos";
import { teamConfig, teamKeys, type TeamKey } from "@/lib/teams";
import type { Match } from "@/lib/types";

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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

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

        <div className="mt-8 space-y-4">
          {matches.map(({ teamKey, teamName, match }) => (
            <article
              key={`${teamKey}-${match.id}`}
              className="card rounded-3xl border p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="brand text-xs font-bold uppercase tracking-[0.2em]">
                    {teamName}
                  </p>

                  <p className="muted mt-2 text-sm">
                    {formatDate(match.date)}
                    {match.time ? ` • ${match.time}` : ""}
                  </p>
                </div>

                {match.score && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
                    {match.score}
                  </span>
                )}
              </div>

              <div className="mt-4 font-bold text-slate-900">
                {match.homeTeam}
                <span className="mx-2 text-slate-400">–</span>
                {match.awayTeam}
              </div>

              <form
                action="/api/admin/match-video"
                method="POST"
                className="mt-5"
              >
                <input type="hidden" name="matchId" value={match.id} />

                <label
                  htmlFor={`youtube-${match.id}`}
                  className="text-sm font-bold text-slate-700"
                >
                  Link YouTube
                </label>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id={`youtube-${match.id}`}
                    name="youtubeUrl"
                    type="url"
                    defaultValue={match.youtubeUrl || ""}
                    placeholder="https://youtu.be/..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Zapisz
                  </button>
                </div>

                {match.youtubeUrl && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    ✓ Nagranie dodane
                  </p>
                )}
              </form>
            </article>
          ))}

          {matches.length === 0 && (
            <div className="card rounded-3xl border p-6">
              <p className="font-bold text-slate-900">
                Brak rozegranych meczów.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
