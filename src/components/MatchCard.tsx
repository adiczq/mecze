import { getGoogleMapsUrl } from "@/lib/maps";
import type { Match } from "@/lib/types";

type MatchCardProps = {
  match: Match;
  featured?: boolean;
};

function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

export default function MatchCard({
  match,
  featured = false,
}: MatchCardProps) {
  const isHome = match.homeTeam.toUpperCase().includes("GÓRNIK RADLIN");

  return (
    <article
      className={`card rounded-3xl p-5 transition sm:p-6 ${
        featured
          ? "border-blue-300 shadow-[0_12px_35px_rgba(37,99,235,0.12)]"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {match.round && (
            <p className="brand text-xs font-bold uppercase tracking-[0.2em]">
              {match.round}
            </p>
          )}

          <p className="muted mt-2 text-sm">
            {formatMatchDate(match.date)}
            {match.time ? ` • ${match.time}` : ""}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            isHome ? "badge-home" : "badge-away"
          }`}
        >
          {isHome ? "HOME" : "AWAY"}
        </span>
      </div>

      <div className="my-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-right">
            <p
              className={`font-bold ${
                isHome ? "text-blue-600" : "text-slate-900"
              }`}
            >
              {match.homeTeam}
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-400">
            VS
          </div>

          <div>
            <p
              className={`font-bold ${
                !isHome ? "text-blue-600" : "text-slate-900"
              }`}
            >
              {match.awayTeam}
            </p>
          </div>
        </div>
      </div>

      {match.venue && (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={getGoogleMapsUrl(match.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="muted inline-flex items-start gap-2 text-sm transition hover:text-blue-600"
            >
              <span>📍</span>
              <span>{match.venue}</span>
            </a>

            <a
              href={getGoogleMapsUrl(match.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Nawiguj
            </a>
          </div>
        </div>
      )}
    </article>
  );
}