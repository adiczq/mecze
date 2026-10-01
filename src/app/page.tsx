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

  const matchesByTeam = Object.fromEntries(teamMatchesEntries) as Record<
    TeamKey,
    Match[]
  >;

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

  const nextMatch = allUpcomingMatches[0];

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="hero-panel fade-up overflow-hidden rounded-4xl px-6 py-7 sm:px-9 sm:py-9">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200">
            Górnik Radlin
          </p>

          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                Mecze
              </h1>

              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Terminarz wszystkich drużyn Górnika Radlin w jednym miejscu.
              </p>
            </div>

            {nextMatch && (
              <div className="min-w-[230px] rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="live-dot" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">
                    Najbliższy mecz
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold">
                  {formatDate(nextMatch.date)}
                  {nextMatch.time ? ` • ${nextMatch.time}` : ""}
                </p>

                <p className="mt-2 text-base font-bold">{nextMatch.homeTeam}</p>

                <p className="text-sm text-blue-200">vs</p>

                <p className="text-base font-bold">{nextMatch.awayTeam}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          {teams.map((team) => (
            <Link
              key={team.slug}
              href={`/${team.slug}`}
              className="team-tile group rounded-2xl border-t-2 border-t-transparent px-3 py-4 text-center hover:border-blue-300 hover:border-t-blue-500 sm:px-5 sm:py-5"
            >
              <p className="text-sm font-black text-slate-900 sm:text-lg">
                {team.name}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                Terminarz
              </p>

              <p className="mt-2 hidden text-xs text-slate-500 sm:block">
                {team.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="card mt-8 overflow-hidden rounded-3xl">
          <div className="flex items-end justify-between gap-3 px-5 pb-4 pt-6 sm:px-8 sm:pt-8">
            <div>
              <p className="brand text-xs font-bold uppercase tracking-[0.24em]">
                Match center
              </p>

              <h2 className="mt-1 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                Najbliższe spotkania
              </h2>
            </div>

            <span className="shrink-0 text-[11px] font-semibold text-slate-500 sm:text-xs">
              {allUpcomingMatches.length} meczów
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {allUpcomingMatches.slice(0, 8).map((match, index) => {
              const isHome = match.homeTeam
                .toUpperCase()
                .includes("GÓRNIK RADLIN");

              return (
                <div
                  key={`${match.category}-${match.id}`}
                  className="match-row match-enter grid gap-3 px-5 py-5 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-4 sm:px-8"
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="brand text-xs font-bold uppercase tracking-wider">
                        {match.category}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${
                          isHome ? "badge-home" : "badge-away"
                        }`}
                      >
                        {isHome ? "HOME" : "AWAY"}
                      </span>
                    </div>

                    <p className="muted mt-1 text-sm">
                      {formatDate(match.date)}
                      {match.time ? ` • ${match.time}` : ""}
                    </p>
                  </div>

                  <div className="text-sm font-semibold leading-6 sm:text-base">
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
                  </div>

                  {match.venue && (
                    <a
                      href={getGoogleMapsUrl(match.venue)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="muted inline-flex w-full items-start gap-1 text-xs transition hover:text-blue-600 sm:w-auto sm:max-w-64 sm:justify-self-end sm:text-right sm:text-sm"
                    >
                      <span>📍</span>
                      <span>{match.venue}</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
