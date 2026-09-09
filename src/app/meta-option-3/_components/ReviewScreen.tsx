"use client";

import { Check, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { bestCaseWeeklyAdd, confirmedWeeklyAdd, goal, moves, reclaimedWeeklyBudget } from "../_data/data";
import GoalHeader from "./GoalHeader";
import { ReviewMoveCard, type DecisionStatus } from "./MoveCard";

export default function ReviewScreen({
  decisions,
  onApprove,
  onReject,
  onApproveAll,
  onContinue,
}: {
  decisions: Record<number, DecisionStatus>;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onApproveAll: () => void;
  onContinue: () => void;
}) {
  const [confirmingAll, setConfirmingAll] = useState(false);
  const decidedCount = moves.filter((m) => decisions[m.id] !== "pending").length;

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-5 px-5 py-10 sm:px-0">
      <GoalHeader>
        <p className="text-[15px] leading-relaxed text-zinc-700">
          This week&apos;s plan: cut the ad losing money, hand its budget to the ad that&apos;s
          working, stop paying to re-reach people who already bought, and place two bets on top.
          The confirmed part of that,{" "}
          <span className="font-semibold text-zinc-900">
            +{confirmedWeeklyAdd.low} to {confirmedWeeklyAdd.high} sales a week
          </span>
          , comes from one move. Stacking every upside Zavi can actually put a number on gets you
          to roughly{" "}
          <span className="font-semibold text-zinc-900">
            +{bestCaseWeeklyAdd.low} to {bestCaseWeeklyAdd.high} sales a week
          </span>{" "}
          in the best case, still under a third of the {goal.gap}-sale gap, before counting
          whatever the riskiest move adds, which is too new to size honestly.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-700">
          It also frees up about{" "}
          <span className="font-semibold text-zinc-900">${reclaimedWeeklyBudget} a week</span> in
          reclaimed budget, money that isn&apos;t buying sales today, which becomes fuel for the
          next round once this one proves out. Closing the rest of the gap likely means a new
          channel, a better landing page, or a new offer, none of which are in this batch.
        </p>
      </GoalHeader>

      <ul className="flex flex-col gap-3">
        {moves.map((move) => (
          <ReviewMoveCard
            key={move.id}
            move={move}
            status={decisions[move.id]}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </ul>

      <div className="sticky bottom-4 z-10 flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center">
        {confirmingAll ? (
          <>
            <p className="flex-1 px-1 text-sm font-medium text-zinc-700">
              Approve all 5? Each one still checks back on its own schedule, and you can reject
              or roll back anything that doesn&apos;t hold up.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmingAll(false);
                  onApproveAll();
                }}
                className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Yes, approve all
              </button>
              <button
                type="button"
                onClick={() => setConfirmingAll(false)}
                className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setConfirmingAll(true)}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve all
            </button>
            <button
              type="button"
              onClick={() => moves.forEach((m) => onReject(m.id))}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Reject all
            </button>
            <span className="text-sm text-zinc-500 sm:ml-1">
              {decidedCount} of {moves.length} decided
            </span>
            <button
              type="button"
              onClick={onContinue}
              disabled={decidedCount === 0}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[#3654c9] px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2c46ab] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 sm:ml-auto"
            >
              See what changed
            </button>
            <button
              type="button"
              title="Ask Zavi about this plan"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
