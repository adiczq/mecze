export default function Loading() {
  return (
    <main className="page-shell px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-8 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-5"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="h-5 animate-pulse rounded bg-slate-200" />
                <div className="mx-auto h-8 w-12 animate-pulse rounded-full bg-slate-200" />
                <div className="h-5 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="mt-5 h-4 w-40 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
