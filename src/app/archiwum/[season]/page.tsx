import Link from "next/link";
import { notFound } from "next/navigation";
import { getArchiveSeason } from "@/lib/seasons";

type ArchiveSeasonPageProps = {
  params: Promise<{
    season: string;
  }>;
};

function slugToSeason(slug: string) {
  return slug.replace("-", "/");
}

export default async function ArchiveSeasonPage({
  params,
}: ArchiveSeasonPageProps) {
  const { season: seasonSlug } = await params;

  const seasonName = slugToSeason(seasonSlug);
  const archive = getArchiveSeason(seasonName);

  if (!archive) {
    notFound();
  }

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

        <h1 className="mt-2 text-4xl font-black text-slate-900">
          Archiwum {archive.season}
        </h1>

        <p className="muted mt-3">
          Wyniki drużyn od kategorii Młodzik D wzwyż.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {archive.teams.map((team) => (
            <Link
              key={team.id}
              href={`/archiwum/${seasonSlug}/${team.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-xl font-black text-slate-900">{team.name}</p>

              <p className="mt-1 text-sm text-slate-500">{team.category}</p>

              <p className="mt-4 text-sm font-semibold text-blue-600">
                Zobacz wyniki →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
