import Link from "next/link";
import MatchList from "@/components/MatchList";
import matchesData from "@/data/trampkarze.json";
import type { Match } from "@/lib/types";

export default function TrampkarzePage() {
  const matches = matchesData as Match[];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-blue-400"
        >
          <span>←</span>
          <span>Mecze</span>
        </Link>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
          Górnik Radlin
        </p>

        <h1 className="mt-2 text-4xl font-black">Trampkarze</h1>

        <p className="mt-3 text-zinc-400">Najbliższe mecze drużyny.</p>

        <div className="mt-8">
          <MatchList matches={matches} />
        </div>
      </div>
    </main>
  );
}
