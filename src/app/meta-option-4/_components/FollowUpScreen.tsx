"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, Check, TrendingDown, TrendingUp } from "lucide-react";
import { Eyebrow, Screen } from "./PageChrome";
import {
  dayMarkers,
  moves,
  type DayMarkerId,
  type MoveStatus,
} from "../_data/moves";

const statusStyle: Record<
  "on-track" | "ahead" | "behind" | "failed",
  { label: string; tone: string; icon: typeof Check }
> = {
  "on-track": { label: "On track", tone: "bg-emerald-50 text-emerald-700", icon: Check },
  ahead: { label: "Ahead of plan", tone: "bg-emerald-50 text-emerald-700", icon: TrendingUp },
  behind: { label: "Behind plan", tone: "bg-amber-50 text-amber-700", icon: TrendingDown },
  failed: { label: "Didn't work", tone: "bg-red-50 text-red-700", icon: AlertTriangle },
};

export function FollowUpScreen({ statuses }: { statuses: Record<number, MoveStatus> }) {
  const [dayId, setDayId] = useState<DayMarkerId>("d7");
  const [actioned, setActioned] = useState<Set<number>>(new Set());

  const statusOf = (id: number) => statuses[id] ?? "pending";
  const approvedMoves = moves.filter((m) => statusOf(m.id) === "approved");
  const withFollowUp = approvedMoves.map((m) => ({ move: m, point: m.followUp[dayId] }));
  const failing = withFollowUp.filter((x) => x.point.status === "failed" || x.point.status === "behind");
  const succeeding = withFollowUp.filter((x) => x.point.status === "on-track" || x.point.status === "ahead");

  return (
    <Screen>
      <Eyebrow>Checking in</Eyebrow>
      <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-zinc-900">
        Did the plan actually work?
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        Jump ahead in time to see how each approved move played out against
        what Zavi projected, no waiting required.
      </p>

      <div className="mt-5 inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-1">
        {dayMarkers.map((marker) => (
          <button
            key={marker.id}
            type="button"
            onClick={() => setDayId(marker.id)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors duration-200 ${
              dayId === marker.id ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {marker.label}
          </button>
        ))}
      </div>

      {approvedMoves.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-[14px] text-zinc-500">
          Nothing was approved, so there is nothing to check in on. Head back
          and approve at least one move to see how it plays out.
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
            <p className="text-[15px] leading-relaxed text-zinc-800">
              {succeeding.length} of {withFollowUp.length} approved moves are{" "}
              {succeeding.length === withFollowUp.length ? "" : "so far "}
              on track or ahead of what Zavi projected.
              {failing.length > 0
                ? ` ${failing.length} ${failing.length === 1 ? "isn't" : "aren't"}, and Zavi has a new recommendation below.`
                : " None of them are behind."}
            </p>
          </div>

          <ul className="mt-5 space-y-3">
            {withFollowUp.map(({ move, point }) => {
              const style = statusStyle[point.status];
              const Icon = style.icon;
              const isActioned = actioned.has(move.id);
              return (
                <li key={move.id} className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${style.tone}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {style.label}
                    </span>
                    <p className="text-[14.5px] font-semibold text-zinc-900">{move.title}</p>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">{point.detail}</p>

                  {point.recommendation && !isActioned && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
                      <p className="flex-1 text-[13.5px] leading-relaxed text-red-800">
                        <span className="font-semibold">Zavi&rsquo;s new call: </span>
                        {point.recommendation}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActioned((prev) => new Set(prev).add(move.id))}
                        className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                      >
                        Take that call
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  {point.recommendation && isActioned && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[13.5px] font-semibold text-emerald-700">
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Done. This will stop draining money starting today, and
                      Zavi will fold it into next week&rsquo;s plan.
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Screen>
  );
}
