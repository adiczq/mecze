import MatchCard from "@/components/MatchCard";
import type { Match } from "@/lib/types";
import StatusCard from "@/components/StatusCard";

type MatchListProps = {
  matches: Match[];
  emptyMessage?: string;
};

function getMatchCountLabel(count: number) {
  if (count === 1) return "mecz";

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
  ) {
    return "mecze";
  }

  return "meczów";
}

export default function MatchList({
  matches,
  emptyMessage = "Brak meczów do wyświetlenia.",
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <StatusCard
        title="Brak zaplanowanych meczów"
        description={emptyMessage}
      />
    );
  }

  const [nextMatch, ...upcomingMatches] = matches;

  return (
    <div>
      <section>
        <p className="brand mb-3 text-xs font-bold uppercase tracking-[0.25em]">
          Najbliższy mecz
        </p>

        <MatchCard match={nextMatch} featured />
      </section>

      {upcomingMatches.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
                Terminarz
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Kolejne mecze
              </h2>
            </div>

            <span className="muted text-sm">
              {upcomingMatches.length}{" "}
              {getMatchCountLabel(upcomingMatches.length)}
            </span>
          </div>

          <div className="grid gap-4">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
