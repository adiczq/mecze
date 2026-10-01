import Link from "next/link";
import { getGoogleMapsUrl } from "@/lib/maps";
import { getTeamMatches } from "@/lib/laczynaspilka";
import { teamConfig, teamKeys, type TeamKey } from "@/lib/teams";

import type { Match } from "@/lib/types";

type Team = {
  key: TeamKey;
  matches: Match[];
} & (typeof teamConfig)[TeamKey];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T12:00:00`));
}

export default async function Home() {
  const teamMatchesEntries = await Promise.all(
    teamKeys.map(async (key) => {
      const matches = await getTeamMatches(key);

      return [key, matches] as const;
    })
  );

  const matchesByTeam = Object.fromEntries(
    teamMatchesEntries
  ) as Record<TeamKey, Match[]>;

  const teams: Team[] = teamKeys
    .map((key) => ({
      key,
      ...teamConfig[key],
      matches: matchesByTeam[key],
    }))
    .sort((a, b) => a.order - b.order);

  const allUpcomingMatches = teams
    .flatMap((team) =>
      team.matches.map((match) => ({
        ...match,
        category: team.name,
      }))
    )
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time ?? "00:00"}`).getTime() -
        new Date(`${b.date}T${b.time ?? "00:00"}`).getTime()
    );

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header className="mb-10">
          <p className="brand mb-2 text-sm font-semibold uppercase tracking-[0.3em]">
            Górnik Radlin
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Mecze
          </h1>

          <p className="muted mt-3 max-w-2xl text-base sm:text-lg">
            Terminarz drużyn Górnika Radlin.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-3 gap-2 md:hidden">
          {teams.map((team) => (
            <Link
              key={team.slug}
              href={`/${team.slug}`}
              className="card flex min-h-20 flex-col items-center justify-center rounded-2xl px-2 text-center transition active:scale-95"
            >
              <span className="text-sm font-bold text-slate-900">
                {team.name}
              </span>

              <span className="soft-text mt-1 text-[10px] uppercase tracking-wide">
                Terminarz
              </span>
            </Link>
          ))}
        </section>

        <section className="hidden gap-5 md:grid md:grid-cols-3">
          {teams.map((team) => {
            const nextMatch = team.matches[0];
            const isHome = nextMatch
              ? nextMatch.homeTeam.toUpperCase().includes("GÓRNIK RADLIN")
              : false;

            return (
              <Link
                key={team.slug}
                href={`/${team.slug}`}
                className="card group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-blue-300"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {team.source}
                  </span>

                  <span className="text-2xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {team.name}
                </h2>

                <p className="muted mt-3 text-sm leading-6">
                  {team.description}
                </p>

                <div className="mt-8 border-t border-slate-200 pt-5">
                  <p className="soft-text text-xs uppercase tracking-widest">
                    Najbliższy mecz
                  </p>

                  {nextMatch ? (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="brand text-sm font-semibold">
                          {formatDate(nextMatch.date)}
                          {nextMatch.time ? ` • ${nextMatch.time}` : ""}
                        </p>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            isHome ? "badge-home" : "badge-away"
                          }`}
                        >
                          {isHome ? "HOME" : "AWAY"}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        <p
                          className={`font-semibold ${
                            isHome ? "text-blue-600" : "text-slate-900"
                          }`}
                        >
                          {nextMatch.homeTeam}
                        </p>

                        <p className="soft-text text-sm">vs</p>

                        <p
                          className={`font-semibold ${
                            !isHome ? "text-blue-600" : "text-slate-900"
                          }`}
                        >
                          {nextMatch.awayTeam}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="muted mt-2 font-semibold">
                      Brak zaplanowanych meczów
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </section>

        <section className="card mt-12 rounded-3xl p-6 sm:p-8">
          <p className="brand text-sm font-semibold uppercase tracking-[0.25em]">
            Najbliższe mecze
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Najbliższe spotkania Górnika
          </h2>

          <div className="mt-6 divide-y divide-slate-200">
            {allUpcomingMatches.slice(0, 6).map((match) => {
              const isHome = match.homeTeam
                .toUpperCase()
                .includes("GÓRNIK RADLIN");

              return (
                <div
                  key={`${match.category}-${match.id}`}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="brand text-xs font-bold uppercase tracking-wider">
                        {match.category}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          isHome ? "badge-home" : "badge-away"
                        }`}
                      >
                        {isHome ? "HOME" : "AWAY"}
                      </span>
                    </div>

                    <p className="muted mt-2 text-sm">
                      {formatDate(match.date)}
                      {match.time ? ` • ${match.time}` : ""}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold">
                      <span
                        className={isHome ? "text-blue-600" : "text-slate-900"}
                      >
                        {match.homeTeam}
                      </span>

                      <span className="mx-2 text-slate-300">–</span>

                      <span
                        className={!isHome ? "text-blue-600" : "text-slate-900"}
                      >
                        {match.awayTeam}
                      </span>
                    </p>

                    {match.venue && (
                      <a
                        href={getGoogleMapsUrl(match.venue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="muted mt-1 inline-flex items-start gap-1 text-sm transition hover:text-blue-600"
                      >
                        <span>📍</span>
                        <span className="underline decoration-slate-300 underline-offset-4">
                          {match.venue}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}