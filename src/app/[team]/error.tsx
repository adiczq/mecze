"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-shell px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-black text-red-600">
            !
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Nie udało się pobrać terminarza
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Wystąpił chwilowy problem z pobieraniem danych. Spróbuj ponownie za
            moment.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </main>
  );
}
