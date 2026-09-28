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

export default function MatchCard({ match, featured = false }: MatchCardProps) {
  const isHome = match.homeTeam.toUpperCase().includes("GÓRNIK RADLIN");

  return (
    <article
      className={`rounded-3xl border bg-zinc-900 p-5 sm:p-6 ${
        featured
          ? "border-blue-500/70 shadow-[0_0_30px_rgba(59,130,246,0.12)]"
          : "border-zinc-800"
      }`}
    >
      {" "}
      <div className="flex items-start justify-between gap-4">
        <div>
          {match.round && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              {match.round}
            </p>
          )}

          <p className="mt-2 text-sm text-zinc-400">
            {formatMatchDate(match.date)}
            {match.time ? ` • ${match.time}` : ""}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            isHome
              ? "bg-blue-600 text-white"
              : "border border-blue-500/40 bg-blue-950/40 text-blue-300"
          }`}
        >
          {isHome ? "HOME" : "AWAY"}
        </span>
      </div>
      <div className="my-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-right">
            <p
              className={`font-bold ${isHome ? "text-blue-400" : "text-white"}`}
            >
              {match.homeTeam}
            </p>
          </div>

          <div className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-black text-zinc-500">
            VS
          </div>

          <div>
            <p
              className={`font-bold ${
                !isHome ? "text-blue-400" : "text-white"
              }`}
            >
              {match.awayTeam}
            </p>
          </div>
        </div>
      </div>
      {match.venue && (
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={getGoogleMapsUrl(match.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm text-zinc-400 transition hover:text-blue-400"
            >
              <span>📍</span>
              <span>{match.venue}</span>
            </a>

            <a
              href={getGoogleMapsUrl(match.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Nawiguj
            </a>
          </div>
        </div>
      )}
    </article>
  );
}
