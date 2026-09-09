"use client";

import { ArrowRight, Check, Clock, PartyPopper, X } from "lucide-react";
import { Eyebrow, Screen } from "./PageChrome";
import {
  computeLedger,
  formatUsd,
  moves,
  type MoveStatus,
} from "../_data/moves";

export function AppliedScreen({
  statuses,
  onSeeFollowUp,
}: {
  statuses: Record<number, MoveStatus>;
  onSeeFollowUp: () => void;
}) {
  const statusOf = (id: number) => statuses[id] ?? "pending";
  const ledger = computeLedger(statusOf);
  const approved = moves.filter((m) => statusOf(m.id) === "approved");
  const rejected = moves.filter((m) => statusOf(m.id) === "rejected");
  const pending = moves.filter((m) => statusOf(m.id) === "pending");
  const netLine =
    ledger.net > 0
      ? `${formatUsd(ledger.net)} a week lower total Meta spend`
      : ledger.net < 0
        ? `${formatUsd(-ledger.net)} a week higher total Meta spend`
        : "no change to total Meta spend";

  return (
    <Screen>
      <div className="flex items-center gap-2">
        <PartyPopper className="h-5 w-5 text-indigo-600" aria-hidden="true" />
        <Eyebrow>Applied just now</Eyebrow>
      </div>
      <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-zinc-900">
        Here&rsquo;s what actually changed in your Meta account
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        {approved.length} of {moves.length} moves went live just now: {netLine},
        with {formatUsd(ledger.committed)} a week now behind the winning ad.
      </p>

      <ul className="mt-6 space-y-3">
        {moves.map((move) => {
          const status = statusOf(move.id);
          return (
            <li
              key={move.id}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3.5"
            >
              {status === "approved" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
              {status === "rejected" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                  <X className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
              {status === "pending" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-zinc-900">{move.title}</p>
                <p className="text-[13px] text-zinc-500">
                  {status === "approved" && `Live now. ${move.undo}`}
                  {status === "rejected" && "Dismissed. No changes were made."}
                  {status === "pending" && "Still waiting on your call, queued exactly as it was."}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {(rejected.length > 0 || pending.length > 0) && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-[13.5px] leading-relaxed text-zinc-600">
          {pending.length > 0 &&
            `${pending.length} move${pending.length === 1 ? "" : "s"} still ${
              pending.length === 1 ? "sits" : "sit"
            } in the queue with no decision. Nothing about your account changes because of them, either way.`}
        </div>
      )}

      <button
        type="button"
        onClick={onSeeFollowUp}
        className="mt-8 flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
      >
        See how it plays out
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <p className="mt-2 text-[12.5px] text-zinc-400">
        Jump ahead in time to see whether each move worked, including the one
        that didn&rsquo;t.
      </p>
    </Screen>
  );
}
