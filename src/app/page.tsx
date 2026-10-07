import Link from "next/link";

import { getGoogleMapsUrl } from "@/lib/maps";
import { getTeamScheduleData } from "@/lib/laczynaspilka";
import { archiveSeasons } from "@/lib/seasons";
import { teamConfig, teamKeys, type TeamKey } from "@/lib/teams";

import type { Match } from "@/lib/types";

type HomePageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

type Team = {
  key: TeamKey;
  matches: Match[];
} & (typeof teamConfig)[TeamKey];

type MatchWithCategory = Match & {
  category: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T12:00:00`));
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function seasonToSlug(season: string) {
  return season.replace("/", "-");
}

function getWarsawDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);

  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
}

function isValidDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const selectedDate = isValidDate(params.date) ? params.date! : "";

  const today = getWarsawDateString();
  const tomorrow = addDays(today, 1);

  const teamResults = await Promise.all(
    teamKeys.map(async (key) => {
      const data = await getTeamScheduleData(key);

      return {
        key,
        upcomingMatches: data.matches,
        allMatches: [...data.matches, ...data.playedMatches],
      };
    })
  );

  const matchesByTeam = Object.fromEntries(
    teamResults.map(({ key, upcomingMatches }) => [key, upcomingMatches])
  ) as Record<TeamKey, Match[]>;

  const teams: Team[] = teamKeys
    .map((key) => ({
      key,
      ...teamConfig[key],
      matches: matchesByTeam[key],
    }))
    .sort((a, b) => a.order - b.order);

  const archivedSeasons = Object.values(archiveSeasons).sort((a, b) =>
    b.season.localeCompare(a.season)
  );

  const allUpcomingMatches: MatchWithCategory[] = teams
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

  const allSeasonMatches: MatchWithCategory[] = teamResults.flatMap(
    ({ key, allMatches }) =>
      allMatches.map((match) => ({
        ...match,
        category: teamConfig[key].name,
      }))
  );

  const dateMatches = selectedDate
    ? Array.from(
        new Map(
          allSeasonMatches
            .filter((match) => match.date === selectedDate)
            .map((match) => [match.id, match])
        ).values()
      ).sort((a, b) => (a.time ?? "00:00").localeCompare(b.time ?? "00:00"))
    : [];

  const nextMatch = allUpcomingMatches[0];

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="hero-panel overflow-hidden rounded-4xl px-6 py-7 sm:px-9 sm:py-9">
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
              <div className="flex min-w-[230px] flex-col gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur">
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

                  <p className="mt-2 text-base font-bold">
                    {nextMatch.homeTeam}
                  </p>

                  <p className="text-sm text-blue-200">vs</p>

                  <p className="text-base font-bold">{nextMatch.awayTeam}</p>
                </div>

                <Link
                  href="/kalendarz"
                  className="hidden items-center justify-between rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 sm:flex"
                >
                  <span>Mecze według daty</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        <Link
          href="/kalendarz"
          className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50 sm:hidden"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Kalendarz
            </p>

            <p className="mt-0.5">Mecze według daty</p>
          </div>

          <span className="text-lg text-blue-600">→</span>
        </Link>

        <section className="mt-6 grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 sm:gap-4">
          {teams.map((team) => (
            <Link
              key={team.slug}
              href={`/${team.slug}`}
              className="team-tile flex h-[114px] min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4"
            >
              <h3 className="text-[17px] font-bold leading-tight text-slate-900 sm:text-lg">
                {team.name}
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-yellow-600">
                  Terminarz
                </span>

                <span className="text-lg text-yellow-600">→</span>
              </div>
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

        {archivedSeasons.length > 0 && (
          <section className="mt-6 border-t border-slate-200 pt-5">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Archiwum wyników
                </p>

                <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                  Poprzednie sezony od kategorii Młodzik D wzwyż.
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-0 sm:flex sm:flex-wrap sm:justify-end">
                {archivedSeasons.map((archive) => (
                  <Link
                    key={archive.season}
                    href={`/archiwum/${seasonToSlug(archive.season)}`}
                    className="whitespace-nowrap rounded-xl bg-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    {archive.season} →
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
