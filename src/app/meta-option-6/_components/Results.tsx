"use client";

/**
 * Alteration 7: the results view Option 1 never had.
 * Option 1 was approve and forget. Nothing ever told the founder whether the
 * $85 a day or the 30 to 40 sales actually happened. Same card grid, same
 * evidence table shape, outcomes in place of forecasts.
 */

import { AlertTriangle, ArrowUpRight, Check, Clock } from "lucide-react";
import {
  ATTRIBUTION_NOTE,
  dayKeys,
  dayLabels,
  moves,
  outcomes,
  type DayKey,
  type MoveStatus,
} from "../../meta-option-5/_data/moves";

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

const statusStyle = {
  hit: { label: "Did what it promised", cls: "bg-emerald-100 text-emerald-800", Icon: Check },
  better: { label: "Beat expectations", cls: "bg-sky-100 text-sky-800", Icon: ArrowUpRight },
  miss: { label: "Did not work", cls: "bg-red-100 text-red-800", Icon: AlertTriangle },
  tracking: { label: "Too early to judge", cls: "bg-zinc-100 text-zinc-600", Icon: Clock },
} as const;

export default function Results({
  statuses,
  day,
  onSetDay,
  reverted,
  onRevert,
  onBack,
}: {
  statuses: Record<number, MoveStatus>;
  day: DayKey;
  onSetDay: (d: DayKey) => void;
  reverted: Set<number>;
  onRevert: (id: number) => void;
  onBack: () => void;
}) {
  const approved = moves.filter((m) => statuses[m.id] === "approved");
  const misses = approved.filter((m) => outcomes[m.id][day].status === "miss").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.09em] text-zinc-500 uppercase">
            Did it work
          </p>
          <h1 className="mt-1.5 text-[28px] leading-tight font-bold text-zinc-900">
            {approved.length === 0
              ? "Nothing was applied"
              : misses > 0
                ? "A mixed picture"
                : "Tracking as expected"}
          </h1>
        </div>
        <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
          {dayKeys.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={day === d}
              onClick={() => onSetDay(d)}
              className={cx(
                "cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors",
                day === d ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800",
              )}
            >
              {dayLabels[d]}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-[13px] text-zinc-500">
        Time travel is a prototype control, so you do not have to wait two weeks to see this.
      </p>

      {approved.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
          You did not approve anything, so there is nothing to report. Nothing changed in your
          account.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {approved.map((move) => {
            const o = outcomes[move.id][day];
            const s = statusStyle[o.status];
            const isReverted = reverted.has(move.id);
            return (
              <div
                key={move.id}
                className={cx(
                  "flex flex-col rounded-2xl border bg-white p-5",
                  o.status === "miss" && !isReverted ? "border-red-200" : "border-zinc-200",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold",
                      isReverted ? "bg-zinc-100 text-zinc-600" : s.cls,
                    )}
                  >
                    <s.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {isReverted ? "Rolled back by you" : s.label}
                  </span>
                </div>

                <p className="mt-2.5 text-[15px] leading-snug font-bold text-zinc-900">
                  {move.title}
                </p>

                <dl className="mt-3 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 bg-zinc-50 px-3.5 py-2.5 text-[13px]">
                    <dt className="font-bold text-zinc-900">What happened</dt>
                    <dd className="text-zinc-500">{dayLabels[day]}</dd>
                  </div>
                  <div className="px-3.5 py-2.5 text-[13px] leading-relaxed text-zinc-700">
                    {isReverted
                      ? "You rolled this back. The previous settings are live again."
                      : o.note}
                  </div>
                  {o.against && !isReverted && (
                    <div className="px-3.5 py-2.5 text-[13px] leading-relaxed">
                      <span className="font-semibold text-zinc-800">Against what Zavi said: </span>
                      <span className="text-zinc-600">{o.against}</span>
                    </div>
                  )}
                  <div className="px-3.5 py-2.5 text-[12.5px] leading-relaxed text-zinc-500">
                    <span className="font-semibold text-zinc-700">Zavi warned: </span>
                    {move.risk}
                  </div>
                </dl>

                {o.status === "miss" && !isReverted && (
                  <button
                    type="button"
                    onClick={() => onRevert(move.id)}
                    className="mt-3.5 inline-flex h-10 w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                  >
                    Roll this back
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-5 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[12px] leading-snug text-zinc-500">
        {ATTRIBUTION_NOTE}
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 inline-flex h-10 cursor-pointer items-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
      >
        Back to the changes
      </button>
    </div>
  );
}
