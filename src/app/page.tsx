import Link from "next/link";
import { getGoogleMapsUrl } from "@/lib/maps";

import zakiMatches from "@/data/zaki.json";
import trampkarzeMatches from "@/data/trampkarze.json";
import seniorzyMatches from "@/data/seniorzy.json";

import type { Match } from "@/lib/types";

type Team = {
  name: string;
  slug: string;
  description: string;
  source: string;
  matches: Match[];
};

const teams: Team[] = [
  {
    name: "Żaki",
    slug: "zaki",
    description: "Terminarz drużyny Żaków",
    source: "ŚLZPN",
    matches: zakiMatches as Match[],
  },
  {
    name: "Trampkarze",
    slug: "trampkarze",
    description: "Terminarz drużyny Trampkarzy",
    source: "Łączy Nas Piłka",
    matches: trampkarzeMatches as Match[],
  },
  {
    name: "Seniorzy",
    slug: "seniorzy",
    description: "Terminarz drużyny Seniorów",
    source: "Łączy Nas Piłka",
    matches: seniorzyMatches as Match[],
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T12:00:00`));
}

export default function Home() {
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Górnik Radlin
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Mecze
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Najbliższe mecze Żaków, Trampkarzy i Seniorów Górnika Radlin w
            jednym miejscu.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {teams.map((team) => {
            const nextMatch = team.matches[0];
            const isHome = nextMatch
              ? nextMatch.homeTeam.toUpperCase().includes("GÓRNIK RADLIN")
              : false;
            return (
              <Link
                key={team.slug}
                href={`/${team.slug}`}
                className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-blue-400"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {team.source}
                  </span>

                  <span className="text-2xl transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h2 className="text-2xl font-bold">{team.name}</h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {team.description}
                </p>

                <div className="mt-8 border-t border-zinc-800 pt-5">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Najbliższy mecz
                  </p>

                  {nextMatch ? (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-blue-400">
                          {formatDate(nextMatch.date)}
                          {nextMatch.time ? ` • ${nextMatch.time}` : ""}
                        </p>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            isHome
                              ? "bg-blue-600 text-white"
                              : "border border-blue-500/40 bg-blue-950/40 text-blue-300"
                          }`}
                        >
                          {isHome ? "HOME" : "AWAY"}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        <p
                          className={`font-semibold ${
                            isHome ? "text-blue-400" : "text-white"
                          }`}
                        >
                          {nextMatch.homeTeam}
                        </p>

                        <p className="text-sm text-zinc-500">vs</p>

                        <p
                          className={`font-semibold ${
                            !isHome ? "text-blue-400" : "text-white"
                          }`}
                        >
                          {nextMatch.awayTeam}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 font-semibold text-zinc-400">
                      Brak zaplanowanych meczów
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Najbliższe mecze
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Najbliższe spotkania Górnika
          </h2>

          <div className="mt-6 divide-y divide-zinc-800">
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
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        {match.category}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          isHome
                            ? "bg-blue-600 text-white"
                            : "border border-blue-500/40 bg-blue-950/40 text-blue-300"
                        }`}
                      >
                        {isHome ? "HOME" : "AWAY"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-400">
                      {formatDate(match.date)}
                      {match.time ? ` • ${match.time}` : ""}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold">
                      <span className={isHome ? "text-blue-400" : "text-white"}>
                        {match.homeTeam}
                      </span>

                      <span className="mx-2 text-zinc-600">–</span>

                      <span
                        className={!isHome ? "text-blue-400" : "text-white"}
                      >
                        {match.awayTeam}
                      </span>
                    </p>

                    {match.venue && (
                      <a
                        href={getGoogleMapsUrl(match.venue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-start gap-1 text-sm text-zinc-500 transition hover:text-blue-400"
                      >
                        <span>📍</span>
                        <span className="underline decoration-zinc-700 underline-offset-4">
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
