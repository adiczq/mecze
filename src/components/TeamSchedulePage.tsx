import Link from "next/link";
import MatchList from "@/components/MatchList";
import { getTeamScheduleData } from "@/lib/laczynaspilka";
import { teamConfig, type TeamKey } from "@/lib/teams";
import { attachMatchVideos } from "@/lib/match-videos";

type TeamSchedulePageProps = {
  teamKey: TeamKey;
};

function formatLastUpdate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

export default async function TeamSchedulePage({
  teamKey,
}: TeamSchedulePageProps) {
  const { matches, playedMatches, updatedAt } =
    await getTeamScheduleData(teamKey);

  const playedMatchesWithVideos = await attachMatchVideos(playedMatches);

  const team = teamConfig[teamKey];

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

        <h1 className="mt-2 text-4xl font-black text-slate-900">{team.name}</h1>

        <p className="muted mt-3">Terminarz i wyniki drużyny.</p>

        {updatedAt && (
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>↻</span>
            <span>Ostatnia aktualizacja: {formatLastUpdate(updatedAt)}</span>
          </p>
        )}

        <div className="mt-8">
          <MatchList
            matches={matches}
            playedMatches={playedMatchesWithVideos}
          />
        </div>
      </div>
    </main>
  );
}
