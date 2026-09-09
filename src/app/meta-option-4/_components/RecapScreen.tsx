"use client";

import { ArrowLeft, Check, Clock, X } from "lucide-react";
import { Eyebrow, Screen } from "./PageChrome";
import {
  computeLedger,
  formatUsd,
  moves,
  totalDestination,
  totalTrapped,
  type MoveStatus,
} from "../_data/moves";

function consequenceCopy(ledger: ReturnType<typeof computeLedger>): string {
  if (!ledger.mismatch) {
    if (ledger.freed === 0 && ledger.committed === 0) {
      return "No money moves in this batch. Whatever you approved here is either an early warning fix or has no dollar impact.";
    }
    return `This applies cleanly: ${formatUsd(ledger.freed)} a week freed and ${formatUsd(
      ledger.committed,
    )} a week redeployed exactly as the plan proposed, no shortfall and nothing left stranded.`;
  }
  if (ledger.mismatch.kind === "unfunded-destination") {
    return `You're funding the winning ad without freeing the money that was supposed to pay for it. This adds ${formatUsd(
      ledger.mismatch.shortfall,
    )} a week in genuinely new Meta spend, not a reallocation. That's a real choice, more sales, more spend, just go in knowing it's additive, not a swap.`;
  }
  if (ledger.mismatch.kind === "all-banked") {
    return `You're taking the full ${formatUsd(
      totalTrapped,
    )} a week as reduced spend instead of reinvesting any of it. Expect roughly 30 to 40 fewer sales a week than if you'd funded move 2, but higher margin this week. Nothing wrong with that call, it's just the one you're making.`;
  }
  return `${formatUsd(
    ledger.mismatch.freedNotReinvested,
  )} a week comes out of the account as savings rather than going toward the ${formatUsd(
    totalDestination,
  )} a week the winning ad could absorb. It doesn't sit idle waiting, it simply leaves as margin this week.`;
}

export function RecapScreen({
  statuses,
  onBack,
  onApply,
}: {
  statuses: Record<number, MoveStatus>;
  onBack: () => void;
  onApply: () => void;
}) {
  const statusOf = (id: number) => statuses[id] ?? "pending";
  const ledger = computeLedger(statusOf);
  const approved = moves.filter((m) => statusOf(m.id) === "approved");
  const rejected = moves.filter((m) => statusOf(m.id) === "rejected");
  const pending = moves.filter((m) => statusOf(m.id) === "pending");

  return (
    <Screen>
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-1.5 text-[13.5px] font-medium text-zinc-500 hover:text-zinc-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to the plan
      </button>

      <Eyebrow>Before you apply</Eyebrow>
      <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-zinc-900">
        Here&rsquo;s exactly what this partial approval does
      </h1>

      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <p className="text-[15px] leading-relaxed text-zinc-800">{consequenceCopy(ledger)}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Applying now ({approved.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {approved.length === 0 && <li className="text-[13px] text-zinc-400">Nothing approved yet.</li>}
            {approved.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug text-zinc-700">
                Move {m.id}: {m.actionLabel}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-500">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Declined ({rejected.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {rejected.length === 0 && <li className="text-[13px] text-zinc-400">Nothing declined.</li>}
            {rejected.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug text-zinc-700">
                Move {m.id}: {m.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-dashed border-zinc-300 p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-amber-700">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Still waiting on you ({pending.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {pending.length === 0 && <li className="text-[13px] text-zinc-400">Nothing left pending.</li>}
            {pending.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug text-zinc-700">
                Move {m.id}: {m.title}
              </li>
            ))}
          </ul>
          {pending.length > 0 && (
            <p className="mt-2 text-[12.5px] text-zinc-500">
              These stay queued exactly as they are. Nothing happens to them
              until you come back and decide.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-[14px] font-semibold text-zinc-800 transition-colors duration-200 hover:bg-zinc-100"
        >
          Change my decisions
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={approved.length === 0 && rejected.length === 0}
          className="flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply {approved.length} change{approved.length === 1 ? "" : "s"} now
        </button>
      </div>
    </Screen>
  );
}
