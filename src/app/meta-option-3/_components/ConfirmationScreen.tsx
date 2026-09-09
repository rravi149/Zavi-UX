"use client";

import { ArrowRight, Check } from "lucide-react";
import { moves } from "../_data/data";
import { ConfirmationMoveCard, type DecisionStatus } from "./MoveCard";

export default function ConfirmationScreen({
  decisions,
  onSeeFollowUp,
  onBack,
}: {
  decisions: Record<number, DecisionStatus>;
  onSeeFollowUp: () => void;
  onBack: () => void;
}) {
  const approved = moves.filter((m) => decisions[m.id] === "approved");
  const rejected = moves.filter((m) => decisions[m.id] !== "approved");

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-5 px-5 py-10 sm:px-0">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer self-start text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-900"
      >
        &larr; Back to review
      </button>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Check className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="mt-3 text-2xl leading-tight font-semibold tracking-tight text-zinc-900 sm:text-[28px]">
          Here&apos;s exactly what changed
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
          You approved {approved.length} of {moves.length}
          {rejected.length > 0
            ? `, and left ${rejected.length} as ${rejected.length === 1 ? "it is" : "they are"}.`
            : "."}{" "}
          Zavi is applying these changes to your Meta Ads account now.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {moves.map((move) => (
          <ConfirmationMoveCard key={move.id} move={move} status={decisions[move.id]} />
        ))}
      </ul>

      <button
        type="button"
        onClick={onSeeFollowUp}
        className="flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-zinc-900 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
      >
        See how it's going, days from now
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
