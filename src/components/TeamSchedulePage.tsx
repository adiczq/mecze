import Link from "next/link";
import MatchList from "@/components/MatchList";
import { getTeamMatches } from "@/lib/laczynaspilka";
import { teamConfig, type TeamKey } from "@/lib/teams";

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
  }).format(date);
}

export default async function TeamSchedulePage({
  teamKey,
}: TeamSchedulePageProps) {
  const matches = await getTeamMatches(teamKey);
  const team = teamConfig[teamKey];
  const lastUpdate = new Date();

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

        <p className="muted mt-3">Najbliższe mecze drużyny.</p>
        <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <span>↻</span>
          <span>Ostatnia aktualizacja: {formatLastUpdate(lastUpdate)}</span>
        </p>
        <div className="mt-8">
          <MatchList matches={matches} />
        </div>
      </div>
    </main>
  );
}
