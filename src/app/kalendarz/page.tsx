import Link from "next/link";

import { getGoogleMapsUrl } from "@/lib/maps";
import { getTeamScheduleData } from "@/lib/laczynaspilka";
import { teamConfig, teamKeys } from "@/lib/teams";

type CalendarPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

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

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function isValidDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const params = await searchParams;

  const today = getWarsawDateString();
  const tomorrow = addDays(today, 1);

  const selectedDate = isValidDate(params.date) ? params.date! : today;

  const teamResults = await Promise.all(
    teamKeys.map(async (teamKey) => {
      const data = await getTeamScheduleData(teamKey);

      return [...data.matches, ...data.playedMatches].map((match) => ({
        ...match,
        category: teamConfig[teamKey].name,
      }));
    })
  );

  const matches = Array.from(
    new Map(
      teamResults
        .flat()
        .filter((match) => match.date === selectedDate)
        .map((match) => [match.id, match])
    ).values()
  ).sort((a, b) => (a.time ?? "00:00").localeCompare(b.time ?? "00:00"));

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

        <h1 className="mt-2 text-4xl font-black text-slate-900">
          Mecze według daty
        </h1>

        <p className="muted mt-3">
          Sprawdź, które drużyny grają wybranego dnia.
        </p>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`?date=${today}`}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Dzisiaj
            </Link>

            <Link
              href={`?date=${tomorrow}`}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Jutro
            </Link>
          </div>

          <form
            action="/kalendarz"
            method="GET"
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="date"
              name="date"
              defaultValue={selectedDate}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Pokaż mecze
            </button>
          </form>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
                Terminarz dnia
              </p>

              <h2 className="mt-1 text-2xl font-black capitalize text-slate-900">
                {formatLongDate(selectedDate)}
              </h2>
            </div>

            <span className="muted shrink-0 text-sm">
              {matches.length} {matches.length === 1 ? "mecz" : "meczów"}
            </span>
          </div>

          {matches.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="divide-y divide-slate-200">
                {matches.map((match) => {
                  const isHome = match.homeTeam
                    .toUpperCase()
                    .includes("GÓRNIK RADLIN");

                  return (
                    <div
                      key={match.id}
                      className="grid gap-3 px-5 py-5 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-4 sm:px-6"
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

                        {match.time && (
                          <p className="muted mt-1 text-sm">{match.time}</p>
                        )}
                      </div>

                      <div className="text-sm font-semibold leading-6 sm:text-base">
                        <span
                          className={
                            isHome ? "text-blue-600" : "text-slate-900"
                          }
                        >
                          {match.homeTeam}
                        </span>

                        <span className="mx-2 text-slate-300">–</span>

                        <span
                          className={
                            !isHome ? "text-blue-600" : "text-slate-900"
                          }
                        >
                          {match.awayTeam}
                        </span>

                        {match.score && (
                          <span className="ml-3 font-black text-slate-900">
                            {match.score}
                          </span>
                        )}
                      </div>

                      {match.venue && (
                        <a
                          href={getGoogleMapsUrl(match.venue)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="muted inline-flex items-start gap-1 text-xs transition hover:text-blue-600 sm:max-w-64 sm:justify-self-end sm:text-right"
                        >
                          <span>📍</span>
                          <span>{match.venue}</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="font-bold text-slate-900">Brak meczów tego dnia.</p>

              <p className="muted mt-1 text-sm">Wybierz inną datę.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
