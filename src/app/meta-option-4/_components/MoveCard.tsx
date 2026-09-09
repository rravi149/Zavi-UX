"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import type { Move, MoveStatus } from "../_data/moves";

const roleTone: Record<Move["role"], string> = {
  source: "bg-red-50 text-red-700",
  destination: "bg-emerald-50 text-emerald-700",
  independent: "bg-amber-50 text-amber-700",
};

const confidenceTone: Record<Move["confidence"], string> = {
  "Strong evidence": "bg-emerald-50 text-emerald-700",
  "Early signal": "bg-sky-50 text-sky-700",
  "Not enough data yet": "bg-amber-50 text-amber-700",
};

export function MoveCard({
  move,
  status,
  onApprove,
  onReject,
  onReset,
}: {
  move: Move;
  status: MoveStatus;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={`rounded-2xl border bg-white p-4 sm:p-5 ${
        status === "rejected" ? "border-zinc-200 opacity-70" : "border-zinc-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-14 sm:w-14">
          <img
            src={`https://picsum.photos/seed/${move.adPreviewSeed}/200/200`}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${roleTone[move.role]}`}
            >
              {move.tag}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${confidenceTone[move.confidence]}`}
            >
              {move.confidence}
            </span>
          </div>
          <p className="mt-1.5 text-[16px] leading-snug font-semibold text-zinc-900">
            {move.title}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-zinc-600">{move.oneLiner}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-indigo-50/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-indigo-900">
        <span className="font-semibold">Why this follows: </span>
        {move.linksToConstraint}
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-left text-[13px] font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
      >
        {open ? "Hide the evidence and the tradeoffs" : "See the evidence and what Zavi considered"}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {move.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-zinc-100 px-3 py-2.5">
                <p className="text-[12px] text-zinc-500">{metric.label}</p>
                <p className="mt-0.5 flex items-baseline gap-1.5 text-[14px] font-bold text-zinc-900">
                  <span className="font-medium text-zinc-400 line-through decoration-zinc-300">
                    {metric.before}
                  </span>
                  <span>&rarr;</span>
                  <span>{metric.after}</span>
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[12px] font-semibold tracking-wide text-zinc-500 uppercase">
              What Zavi considered, and rejected
            </p>
            <ul className="mt-1.5 space-y-2">
              {move.alternatives.map((alt) => (
                <li key={alt.option} className="text-[13.5px] leading-relaxed text-zinc-600">
                  <span className="font-semibold text-zinc-800">{alt.option}.</span>{" "}
                  Rejected: {alt.rejectedBecause}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200 px-3.5 py-2.5">
            <p className="text-[13px] leading-relaxed text-zinc-600">
              <span className="font-semibold text-zinc-800">If you do nothing: </span>
              {move.ifNothing}
            </p>
          </div>

          <div className="flex items-start gap-2 text-[13px] text-zinc-600">
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${
                move.risk.level === "Low" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {move.risk.level} risk
            </span>
            <span className="leading-snug">{move.risk.detail}</span>
          </div>

          <p className="text-[12.5px] text-zinc-400">{move.undo}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {status === "pending" && (
          <>
            <button
              type="button"
              onClick={onApprove}
              className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {move.actionLabel}
            </button>
            <button
              type="button"
              onClick={onReject}
              className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-[13.5px] font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-100"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Reject
            </button>
            <span className="ml-auto text-[12.5px] font-medium text-zinc-400">Awaiting your call</span>
          </>
        )}
        {status === "approved" && (
          <>
            <span className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 text-[13.5px] font-semibold text-emerald-700">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Approved
            </span>
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer text-[13px] font-medium text-zinc-500 underline underline-offset-4 hover:text-zinc-800"
            >
              Undo
            </button>
          </>
        )}
        {status === "rejected" && (
          <>
            <span className="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 text-[13.5px] font-semibold text-zinc-500">
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Rejected
            </span>
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer text-[13px] font-medium text-zinc-500 underline underline-offset-4 hover:text-zinc-800"
            >
              Undo
            </button>
          </>
        )}
      </div>
    </li>
  );
}
