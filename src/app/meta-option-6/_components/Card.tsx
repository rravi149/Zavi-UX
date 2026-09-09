"use client";

/**
 * Option 6 action card. Option 1's shape, which is the shape Ravi picked:
 * a white card, a Why line, and a full evidence table always visible, no clicks.
 *
 * Seven alterations on top of Option 1, each fixing a defect the five-rater
 * review verified in code:
 *  1. Confidence badge names the sample it rests on, so n=3 can never read as
 *     "Strong evidence" with nothing qualifying it.
 *  2. A thin-evidence move LOOKS thin. Amber frame, so the shakiest bet cannot
 *     be approved on a five second skim looking as solid as the other four.
 *  3. "If you do nothing" is a row in the evidence table, so inaction is a
 *     visible option rather than an implied one.
 *  5. Undo is a real control after approval, not a promise in prose.
 */

import { ArrowRight, Check, Undo2, X } from "lucide-react";
import type { Move, MoveStatus } from "../../meta-option-5/_data/moves";

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

const dotTone = {
  strong: { dot: "bg-emerald-500", text: "text-emerald-700" },
  early: { dot: "bg-sky-500", text: "text-sky-700" },
  thin: { dot: "bg-amber-500", text: "text-amber-800" },
} as const;

export default function Card({
  move,
  status,
  rejection,
  onAskApprove,
  onAskReject,
  onReset,
}: {
  move: Move;
  status: MoveStatus;
  /** Why the founder rejected it, captured in the reject modal. */
  rejection?: { reason: string; note: string };
  onAskApprove: () => void;
  onAskReject: () => void;
  onReset: () => void;
}) {
  const thin = move.confidence.tone === "thin";
  const tone = dotTone[move.confidence.tone];

  return (
    <div
      className={cx(
        "flex flex-col rounded-2xl border bg-white p-5",
        // Alteration 2: the weak card looks weak.
        thin ? "border-amber-300 ring-1 ring-amber-100" : "border-zinc-200",
        status === "rejected" && "opacity-60",
      )}
    >
      <p className="text-[15.5px] leading-snug font-bold text-zinc-900">{move.title}</p>

      <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">
        <span className="font-semibold text-zinc-800">Why: </span>
        {move.because}
      </p>

      {/* Evidence. Always open, never behind a disclosure. */}
      <dl className="mt-3.5 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200">
        <div
          className={cx(
            "flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 px-3.5 py-2.5",
            thin ? "bg-amber-50" : "bg-zinc-50",
          )}
        >
          <dt className="text-[13px] font-bold text-zinc-900">Evidence</dt>
          {/* Alteration 1: the label carries its own sample. */}
          <dd className="flex flex-wrap items-baseline gap-1.5 text-[12.5px]">
            <span className="flex items-center gap-1.5 font-semibold">
              <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", tone.dot)} />
              <span className={tone.text}>{move.confidence.label}</span>
            </span>
            <span className="text-zinc-500">{move.confidence.basis}</span>
          </dd>
        </div>

        {move.evidence.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-3.5 py-2.5 text-[13px]"
          >
            <dt className="text-zinc-600">{row.label}</dt>
            <dd className="text-right">
              <span
                className={cx(
                  "font-bold",
                  row.tone === "bad" && "text-red-700",
                  row.tone === "good" && "text-emerald-700",
                  !row.tone && "text-zinc-900",
                )}
              >
                {row.value}
              </span>
              {row.note && <span className="ml-1.5 text-zinc-500">{row.note}</span>}
            </dd>
          </div>
        ))}

        {/* Alteration 3: inaction as a row, in the table, not buried in prose. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 bg-zinc-50/60 px-3.5 py-2.5 text-[13px]">
          <dt className="font-semibold whitespace-nowrap text-zinc-700">If you do nothing</dt>
          <dd className="text-right text-zinc-600 sm:max-w-[62%]">{move.doNothing}</dd>
        </div>
      </dl>

      <p className="mt-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[13px] leading-snug font-medium text-emerald-900">
        {move.expect}
      </p>

      <p className="mt-2.5 text-[12.5px] leading-snug text-zinc-500">
        <span className="font-semibold text-zinc-700">Risk: </span>
        {move.risk}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3.5">
        {status === "pending" && (
          <>
            <button
              type="button"
              onClick={onAskApprove}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve
            </button>
            <button
              type="button"
              onClick={onAskReject}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Reject
            </button>
          </>
        )}

        {status !== "pending" && (
          <>
            <span
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold",
                status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-zinc-100 text-zinc-600",
              )}
            >
              {status === "approved" ? "Approved" : "Left as it is"}
            </span>
            {/* Alteration 5: a real undo. Option 1 promised this in copy and
                removed the item with no control anywhere. */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
            >
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
              Undo
            </button>
            {status === "approved" && (
              <span className="text-[12.5px] text-zinc-500">{move.undo}</span>
            )}
            {status === "rejected" && rejection && (
              <p className="w-full text-[12.5px] leading-snug text-zinc-500">
                <span className="font-semibold text-zinc-700">Your reason: </span>
                {rejection.reason}
                {rejection.note ? `. ${rejection.note}` : ""}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Arrow() {
  return <ArrowRight className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />;
}
