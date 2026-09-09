"use client";

import { ArrowRight } from "lucide-react";
import { Eyebrow, Screen } from "./PageChrome";
import { MoveCard } from "./MoveCard";
import { ReallocationFlow } from "./ReallocationFlow";
import {
  computeLedger,
  formatUsd,
  independentMoves,
  moves,
  totalBanked,
  totalDestination,
  totalTrapped,
  trappedShareOfSpend,
  type MoveStatus,
} from "../_data/moves";

export function ReviewScreen({
  statuses,
  onApprove,
  onReject,
  onReset,
  onContinue,
}: {
  statuses: Record<number, MoveStatus>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onReset: (id: number) => void;
  onContinue: () => void;
}) {
  const statusOf = (id: number) => statuses[id] ?? "pending";
  const ledger = computeLedger(statusOf);
  const decidedCount = moves.filter((m) => statusOf(m.id) !== "pending").length;
  const approvedCount = moves.filter((m) => statusOf(m.id) === "approved").length;

  return (
    <Screen>
      <Eyebrow>The constraint</Eyebrow>
      <h1 className="mt-2 text-[26px] leading-tight font-semibold tracking-tight text-zinc-900 sm:text-[30px]">
        {formatUsd(totalTrapped)} a week, roughly {Math.round(trappedShareOfSpend * 100)}%
        of what you spend on Meta, is financing an ad that already failed and
        people who already bought. Your best ad is stuck at a budget cap.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        That is the one thing holding the account back this week, not five
        separate problems. Below is a single move: stop the leak, fund the
        ad that&rsquo;s proven it can use the money, and two smaller fixes that
        stop the same problem from showing up again.
      </p>

      <div className="mt-6">
        <ReallocationFlow ledger={ledger} />
      </div>

      <p className="mt-3 text-[13px] text-zinc-500">
        If everything below is approved as proposed: {formatUsd(totalTrapped)} freed,{" "}
        {formatUsd(totalDestination)} redeployed into the winning ad, and{" "}
        {formatUsd(totalBanked)} kept as recovered margin instead of gambled
        on unproven placements.
      </p>

      <section className="mt-10">
        <Eyebrow>The move</Eyebrow>
        <h2 className="mt-1.5 text-[18px] font-semibold text-zinc-900">
          Stop the leak, fund the winner
        </h2>
        <p className="mt-1 text-[14px] text-zinc-600">
          These three are one decision. Approving them separately still works,
          but the ledger above will tell you when the pieces don&rsquo;t add up.
        </p>
        <ul className="mt-4 space-y-4">
          {moves
            .filter((m) => m.role !== "independent")
            .map((move) => (
              <MoveCard
                key={move.id}
                move={move}
                status={statusOf(move.id)}
                onApprove={() => onApprove(move.id)}
                onReject={() => onReject(move.id)}
                onReset={() => onReset(move.id)}
              />
            ))}
        </ul>
      </section>

      <section className="mt-10">
        <Eyebrow>Before it costs you anything</Eyebrow>
        <h2 className="mt-1.5 text-[18px] font-semibold text-zinc-900">
          Two early warnings of the same problem
        </h2>
        <p className="mt-1 text-[14px] text-zinc-600">
          No money moves for these two. They&rsquo;re here because they&rsquo;re
          early versions of the exact pattern above, and catching it now is
          cheaper than catching it later.
        </p>
        <ul className="mt-4 space-y-4">
          {independentMoves.map((move) => (
            <MoveCard
              key={move.id}
              move={move}
              status={statusOf(move.id)}
              onApprove={() => onApprove(move.id)}
              onReject={() => onReject(move.id)}
              onReset={() => onReset(move.id)}
            />
          ))}
        </ul>
      </section>

      <div className="sticky bottom-4 mt-10 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <p className="hidden text-[13px] font-medium text-zinc-500 sm:block">
          {decidedCount} of {moves.length} decided
          {decidedCount > 0 ? `, ${approvedCount} approved` : ""}
        </p>
        <button
          type="button"
          disabled={decidedCount === 0}
          onClick={onContinue}
          className="ml-auto flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </Screen>
  );
}
