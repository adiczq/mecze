"use client";

import { Fragment, useState } from "react";
import type { LeagueTableData } from "@/lib/laczynaspilka";

type LeagueTableProps = {
  table: LeagueTableData;
  teamId: string;
  label?: string;
};

function formatBalance(balance: number) {
  if (balance > 0) return `+${balance}`;

  return String(balance);
}

export default function LeagueTable({
  table,
  teamId,
  label,
}: LeagueTableProps) {
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  if (!table.rows.length) {
    return null;
  }

  function toggleTeam(id: string) {
    setExpandedTeamId((current) => (current === id ? null : id));
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          {label ?? "Tabela"}
        </p>

        <h3 className="mt-1 text-lg font-black text-slate-900">
          {table.league.name}
        </h3>

        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          {table.play.name}
        </p>
      </div>

      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
              <th className="w-9 px-2 py-3 text-center sm:w-12">#</th>

              <th className="px-2 py-3 text-left">Drużyna</th>

              <th className="w-9 px-1 py-3 text-center sm:w-12">M</th>

              <th className="hidden w-10 px-1 py-3 text-center sm:table-cell">
                W
              </th>

              <th className="hidden w-10 px-1 py-3 text-center sm:table-cell">
                R
              </th>

              <th className="hidden w-10 px-1 py-3 text-center sm:table-cell">
                P
              </th>

              <th className="hidden w-20 px-1 py-3 text-center md:table-cell">
                Bramki
              </th>

              <th className="w-12 px-2 py-3 text-center sm:w-16">Pkt</th>
            </tr>
          </thead>

          <tbody>
            {table.rows.map((row) => {
              const isGornik = row.team.id === teamId;
              const isExpanded = expandedTeamId === row.team.id;

              return (
                <Fragment key={row.team.id}>
                  <tr
                    onClick={() => toggleTeam(row.team.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleTeam(row.team.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 ${
                      isGornik
                        ? "bg-blue-50 font-bold text-blue-900 hover:bg-blue-100"
                        : "text-slate-700"
                    }`}
                  >
                    <td className="w-9 px-2 py-3 text-center font-bold text-slate-400 sm:w-12">
                      {row.index}
                    </td>

                    <td className="min-w-0 px-2 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {row.team.logo && (
                          <img
                            src={row.team.logo}
                            alt=""
                            className="hidden h-6 w-6 shrink-0 object-contain sm:block"
                          />
                        )}

                        <span className="block min-w-0 truncate">
                          {row.team.name.trim()}
                        </span>
                      </div>
                    </td>

                    <td className="w-9 px-1 py-3 text-center sm:w-12">
                      {row.stats.matchesCount}
                    </td>

                    <td className="hidden px-1 py-3 text-center sm:table-cell">
                      {row.stats.winsCount}
                    </td>

                    <td className="hidden px-1 py-3 text-center sm:table-cell">
                      {row.stats.drawsCount}
                    </td>

                    <td className="hidden px-1 py-3 text-center sm:table-cell">
                      {row.stats.losesCount}
                    </td>

                    <td className="hidden px-1 py-3 text-center md:table-cell">
                      {row.stats.goalsCount}:{row.stats.lostGoalsCount}
                    </td>

                    <td className="w-12 px-2 py-3 text-center font-black sm:w-16">
                      {row.stats.points}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr
                      onClick={() => toggleTeam(row.team.id)}
                      className={`cursor-pointer ${
                        isGornik ? "bg-blue-50/70" : "bg-slate-50/80"
                      }`}
                    >
                      <td colSpan={8} className="px-4 pb-4 pt-1 sm:px-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="mb-4 flex items-center gap-3 sm:hidden">
                            {row.team.logo && (
                              <img
                                src={row.team.logo}
                                alt=""
                                className="h-9 w-9 shrink-0 object-contain"
                              />
                            )}

                            <p className="min-w-0 font-bold text-slate-900">
                              {row.team.name.trim()}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-6">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Mecze
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {row.stats.matchesCount}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Wygrane
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {row.stats.winsCount}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Remisy
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {row.stats.drawsCount}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Porażki
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {row.stats.losesCount}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Bramki
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {row.stats.goalsCount}:
                                {row.stats.lostGoalsCount}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Bilans
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {formatBalance(row.stats.balanceGoalsCount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400 sm:hidden">
        Dotknij wiersza drużyny, aby zobaczyć szczegóły.
      </div>
    </section>
  );
}
