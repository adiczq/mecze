import MatchList from "@/components/MatchList";
import matchesData from "@/data/seniorzy.json";
import type { Match } from "@/lib/types";

export default function SeniorzyPage() {
  const matches = matchesData as Match[];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-5 py-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
          Górnik Radlin
        </p>

        <h1 className="mt-2 text-4xl font-black">Seniorzy</h1>

        <p className="mt-3 text-zinc-400">Najbliższe mecze drużyny.</p>

        <div className="mt-8">
          <MatchList matches={matches} />
        </div>
      </div>
    </main>
  );
}
