import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="page-shell min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-md items-center px-5 py-10">
        <div className="card w-full rounded-3xl border p-6 sm:p-8">
          <p className="brand text-xs font-bold uppercase tracking-[0.25em]">
            Górnik Radlin
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Panel administratora
          </h1>

          <p className="muted mt-2 text-sm">
            Zaloguj się, aby zarządzać nagraniami meczów.
          </p>

          <form action="/api/admin/login" method="POST" className="mt-8">
            <label
              htmlFor="password"
              className="text-sm font-bold text-slate-700"
            >
              Hasło
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Wpisz hasło"
            />

            {error === "1" && (
              <p className="mt-3 text-sm font-semibold text-red-600">
                Nieprawidłowe hasło.
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Zaloguj
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
