import { getGoogleMapsUrl } from "@/lib/maps";
import type { Match } from "@/lib/types";

type MatchCardProps = {
  match: Match;
  featured?: boolean;
};

type MatchOutcome = "win" | "draw" | "loss" | null;

function getMatchOutcome(match: Match): MatchOutcome {
  if (!match.played || !match.score) {
    return null;
  }

  const scoreMatch = match.score.match(/(\d+)\s*:\s*(\d+)/);

  if (!scoreMatch) {
    return null;
  }

  const homeScore = Number(scoreMatch[1]);
  const awayScore = Number(scoreMatch[2]);

  if (homeScore === awayScore) {
    return "draw";
  }

  const isHome = match.homeTeam.toUpperCase().includes("GÓRNIK RADLIN");

  if (isHome) {
    return homeScore > awayScore ? "win" : "loss";
  }

  return awayScore > homeScore ? "win" : "loss";
}

function getOutcomeBar(outcome: MatchOutcome) {
  switch (outcome) {
    case "win":
      return "bg-emerald-500";
    case "draw":
      return "bg-amber-400";
    case "loss":
      return "bg-red-500";
    default:
      return "";
  }
}

function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

export default function MatchCard({ match, featured = false }: MatchCardProps) {
  const isHome = match.homeTeam.toUpperCase().includes("GÓRNIK RADLIN");

  const isPlayed = match.played === true;
  const outcome = getMatchOutcome(match);
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-4 transition sm:rounded-3xl sm:p-6 ${
        featured
          ? "featured-match border-blue-700 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-700 text-white shadow-[0_16px_40px_rgba(30,64,175,0.22)]"
          : "card"
      }`}
    >
      {!featured && outcome && (
        <div
          className={`absolute inset-y-0 left-0 w-[2px] ${getOutcomeBar(outcome)}`}
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          {match.round && (
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em] ${
                featured ? "text-blue-200" : "brand"
              }`}
            >
              {match.round}
            </p>
          )}

          <p
            className={`mt-1.5 text-xs sm:mt-2 sm:text-sm ${
              featured ? "text-blue-100" : "muted"
            }`}
          >
            {formatMatchDate(match.date)}
            {match.time ? ` • ${match.time}` : ""}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            featured
              ? isHome
                ? "bg-white text-blue-700"
                : "border border-white/25 bg-white/10 text-white"
              : isHome
                ? "badge-home"
                : "badge-away"
          }`}
        >
          {isHome ? "HOME" : "AWAY"}
        </span>
      </div>

      <div className="my-3 sm:my-5">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
          <div className="text-center sm:text-right">
            <p
              className={`text-sm font-bold sm:text-base ${
                featured
                  ? "text-white"
                  : isHome
                    ? "text-blue-600"
                    : "text-slate-900"
              }`}
            >
              {match.homeTeam}
            </p>
          </div>

          <div
            className={`mx-auto min-w-[52px] rounded-full border px-2.5 py-1.5 text-center text-xs font-black sm:min-w-[56px] sm:px-3 sm:py-2 ${
              featured
                ? "border-white/20 bg-white/10 text-white"
                : isPlayed && match.score
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            {isPlayed && match.score ? match.score : "VS"}
          </div>

          <div className="text-center sm:text-left">
            <p
              className={`text-sm font-bold sm:text-base ${
                featured
                  ? "text-white"
                  : !isHome
                    ? "text-blue-600"
                    : "text-slate-900"
              }`}
            >
              {match.awayTeam}
            </p>
          </div>
        </div>
      </div>

      {((!isPlayed && match.venue) || match.youtubeUrl) && (
        <div
          className={`border-t pt-3 pb-0 sm:pt-4 sm:pb-1 ${
            featured ? "border-white/15" : "border-slate-200"
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {!isPlayed && match.venue && (
                <a
                  href={getGoogleMapsUrl(match.venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-start gap-2 text-sm transition ${
                    featured
                      ? "text-blue-100 hover:text-white"
                      : "muted hover:text-blue-600"
                  }`}
                >
                  <span>📍</span>
                  <span>{match.venue}</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {match.youtubeUrl && (
                <a
                  href={match.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  ▶ Obejrzyj mecz
                </a>
              )}

              {!isPlayed && match.venue && (
                <a
                  href={getGoogleMapsUrl(match.venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex w-fit items-center rounded-xl px-3.5 py-2 text-sm font-bold transition sm:px-4 ${
                    featured
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Nawiguj
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
