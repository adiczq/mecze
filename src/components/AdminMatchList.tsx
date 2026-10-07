"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Match } from "@/lib/types";

type AdminMatch = {
  teamId: string;
  teamName: string;
  match: Match;
};

type AdminMatchListProps = {
  matches: AdminMatch[];
  seasons: string[];
  selectedSeason: string;
  initialSelectedTeam?: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "deleted" | "error";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function AdminMatchList({
  matches,
  seasons,
  selectedSeason,
  initialSelectedTeam,
}: AdminMatchListProps) {
  const router = useRouter();

  const teams = useMemo(() => {
    const map = new Map<string, string>();

    matches.forEach((item) => {
      map.set(item.teamId, item.teamName);
    });

    return Array.from(map.entries()).sort((a, b) =>
      a[1].localeCompare(b[1], "pl")
    );
  }, [matches]);

  const initialTeam =
    initialSelectedTeam &&
    matches.some((item) => item.teamId === initialSelectedTeam)
      ? initialSelectedTeam
      : "all";

  const [selectedTeam, setSelectedTeam] = useState(initialTeam);

  const [statuses, setStatuses] = useState<Record<string, SaveStatus>>({});

  const [savedUrls, setSavedUrls] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      matches.map(({ match }) => [match.id, match.youtubeUrl || ""])
    )
  );

  const filteredMatches = useMemo(() => {
    if (selectedTeam === "all") {
      return matches;
    }

    return matches.filter((item) => item.teamId === selectedTeam);
  }, [matches, selectedTeam]);

  function changeSeason(season: string) {
    const params = new URLSearchParams();

    params.set("season", season);

    router.push(`/admin?${params.toString()}`);
  }

  async function saveVideo(
    event: React.FormEvent<HTMLFormElement>,
    matchId: string
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();

    setStatuses((current) => ({
      ...current,
      [matchId]: "saving",
    }));

    try {
      const response = await fetch("/api/admin/match-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się zapisać nagrania.");
      }

      setSavedUrls((current) => ({
        ...current,
        [matchId]: youtubeUrl,
      }));

      setStatuses((current) => ({
        ...current,
        [matchId]: youtubeUrl ? "saved" : "deleted",
      }));
    } catch (error) {
      console.error(error);

      setStatuses((current) => ({
        ...current,
        [matchId]: "error",
      }));
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="season-filter"
            className="text-sm font-bold text-slate-700"
          >
            Sezon
          </label>

          <select
            id="season-filter"
            value={selectedSeason}
            onChange={(event) => changeSeason(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="team-filter"
            className="text-sm font-bold text-slate-700"
          >
            Drużyna
          </label>

          <select
            id="team-filter"
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Wszystkie drużyny</option>

            {teams.map(([teamId, teamName]) => (
              <option key={teamId} value={teamId}>
                {teamName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {filteredMatches.length}{" "}
          {filteredMatches.length === 1 ? "mecz" : "meczów"}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {filteredMatches.map(({ teamId, teamName, match }) => {
          const status = statuses[match.id] || "idle";
          const savedUrl = savedUrls[match.id] || "";

          return (
            <article
              key={`${teamId}-${match.id}`}
              className="card rounded-3xl border p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="brand text-xs font-bold uppercase tracking-[0.2em]">
                    {teamName}
                  </p>

                  <p className="muted mt-2 text-sm">
                    {formatDate(match.date)}
                    {match.time ? ` • ${match.time}` : ""}
                  </p>
                </div>

                {match.score && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
                    {match.score}
                  </span>
                )}
              </div>

              <div className="mt-4 font-bold text-slate-900">
                {match.homeTeam}
                <span className="mx-2 text-slate-400">–</span>
                {match.awayTeam}
              </div>

              <form
                onSubmit={(event) => saveVideo(event, match.id)}
                className="mt-5"
              >
                <input type="hidden" name="matchId" value={match.id} />

                <label
                  htmlFor={`youtube-${teamId}-${match.id}`}
                  className="text-sm font-bold text-slate-700"
                >
                  Link YouTube
                </label>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id={`youtube-${teamId}-${match.id}`}
                    name="youtubeUrl"
                    type="url"
                    defaultValue={savedUrl}
                    placeholder="https://youtu.be/..."
                    onChange={() =>
                      setStatuses((current) => ({
                        ...current,
                        [match.id]: "idle",
                      }))
                    }
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="submit"
                    disabled={status === "saving"}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "saving" ? "Zapisywanie..." : "Zapisz"}
                  </button>
                </div>

                {status === "saved" && (
                  <p className="mt-2 text-xs font-semibold text-green-600">
                    ✓ Nagranie zapisane
                  </p>
                )}

                {status === "deleted" && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Nagranie zostało usunięte.
                  </p>
                )}

                {status === "error" && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    Nie udało się zapisać nagrania.
                  </p>
                )}

                {status === "idle" && savedUrl && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    ✓ Nagranie dodane
                  </p>
                )}
              </form>
            </article>
          );
        })}

        {filteredMatches.length === 0 && (
          <div className="card rounded-3xl border p-6">
            <p className="font-bold text-slate-900">
              Brak rozegranych meczów dla tej drużyny.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
