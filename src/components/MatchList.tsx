import MatchCard from "@/components/MatchCard";
import type { Match } from "@/lib/types";
import StatusCard from "@/components/StatusCard";

type MatchListProps = {
  matches: Match[];
  playedMatches?: Match[];
  emptyMessage?: string;
  archiveMode?: boolean;
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
  playedMatches = [],
  emptyMessage = "Brak meczów do wyświetlenia.",
  archiveMode = false,
}: MatchListProps) {
  console.log("MATCHLIST:", {
    przyszle: matches.length,
    rozegrane: playedMatches.length,
    archiwum: archiveMode,
  });

  if (archiveMode) {
    return (
      <div>
        {playedMatches.length > 0 ? (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
                  Wyniki
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Rozegrane mecze
                </h2>
              </div>

              <span className="muted shrink-0 text-sm">
                {playedMatches.length}{" "}
                {getMatchCountLabel(playedMatches.length)}
              </span>
            </div>

            <div className="grid gap-4">
              {playedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ) : (
          <StatusCard
            title="Brak rozegranych meczów"
            description="Brak wyników do wyświetlenia dla tego sezonu."
          />
        )}
      </div>
    );
  }

  const [nextMatch, ...upcomingMatches] = matches;

  return (
    <div>
      <div id="kolejne" className="scroll-mt-6">
        {nextMatch ? (
          <section>
            <p className="brand mb-3 text-xs font-bold uppercase tracking-[0.25em]">
              Najbliższy mecz
            </p>

            <MatchCard match={nextMatch} featured />
          </section>
        ) : (
          <StatusCard
            title="Brak zaplanowanych meczów"
            description={emptyMessage}
          />
        )}

        {upcomingMatches.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
                  Terminarz
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Kolejne mecze
                  </h2>

                  {playedMatches.length > 0 && (
                    <a
                      href="#rozegrane"
                      className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                      Rozegrane mecze ↓
                    </a>
                  )}
                </div>
              </div>

              <span className="muted shrink-0 text-sm">
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

        {upcomingMatches.length === 0 &&
          nextMatch &&
          playedMatches.length > 0 && (
            <div className="mt-6">
              <a
                href="#rozegrane"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Rozegrane mecze ↓
              </a>
            </div>
          )}
      </div>

      {playedMatches.length > 0 && (
        <section
          id="rozegrane"
          className="mt-14 scroll-mt-6 border-t border-slate-200 pt-10"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
                Wyniki
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Rozegrane mecze
                </h2>

                <a
                  href="#kolejne"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                >
                  ↑ Kolejne mecze
                </a>
              </div>
            </div>

            <span className="muted shrink-0 text-sm">
              {playedMatches.length} {getMatchCountLabel(playedMatches.length)}
            </span>
          </div>

          <div className="grid gap-4">
            {playedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
