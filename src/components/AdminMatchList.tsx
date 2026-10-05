"use client";

import { useMemo, useState } from "react";
import type { Match } from "@/lib/types";
import type { TeamKey } from "@/lib/teams";

type AdminMatch = {
  teamKey: TeamKey;
  teamName: string;
  match: Match;
};

type AdminMatchListProps = {
  matches: AdminMatch[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function AdminMatchList({ matches }: AdminMatchListProps) {
  const [selectedTeam, setSelectedTeam] = useState("all");

  const teams = useMemo(() => {
    const map = new Map<string, string>();

    matches.forEach((item) => {
      map.set(item.teamKey, item.teamName);
    });

    return Array.from(map.entries());
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (selectedTeam === "all") {
      return matches;
    }

    return matches.filter((item) => item.teamKey === selectedTeam);
  }, [matches, selectedTeam]);

  return (
    <>
      <div className="mt-8">
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
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-sm"
        >
          <option value="all">Wszystkie drużyny</option>

          {teams.map(([teamKey, teamName]) => (
            <option key={teamKey} value={teamKey}>
              {teamName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {filteredMatches.map(({ teamKey, teamName, match }) => (
          <article
            key={`${teamKey}-${match.id}`}
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
              action="/api/admin/match-video"
              method="POST"
              className="mt-5"
            >
              <input type="hidden" name="matchId" value={match.id} />

              <label
                htmlFor={`youtube-${match.id}`}
                className="text-sm font-bold text-slate-700"
              >
                Link YouTube
              </label>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id={`youtube-${match.id}`}
                  name="youtubeUrl"
                  type="url"
                  defaultValue={match.youtubeUrl || ""}
                  placeholder="https://youtu.be/..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Zapisz
                </button>
              </div>

              {match.youtubeUrl && (
                <p className="mt-2 text-xs font-medium text-green-600">
                  ✓ Nagranie dodane
                </p>
              )}
            </form>
          </article>
        ))}

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
