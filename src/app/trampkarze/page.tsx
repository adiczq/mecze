import Link from "next/link";
import MatchList from "@/components/MatchList";
import { getTeamMatches } from "@/lib/laczynaspilka";

export default async function TrampkarzePage() {
  const matches = await getTeamMatches("trampkarze");

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-blue-400"
        >
          <span>←</span>
          <span>Mecze</span>
        </Link>

        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Górnik Radlin
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">Trampkarze</h1>

          <p className="mt-2 text-zinc-400">Najbliższe mecze drużyny.</p>
        </header>

        <MatchList matches={matches} />
      </div>
    </main>
  );
}
