"use client";

/**
 * Option 5 move card.
 *
 * Fixes from the five-rater review, encoded as hard constraints here:
 *  - SafetyBlock (risk, do-nothing cost, undo) renders ALWAYS, dense or full,
 *    never behind a Disclosure. Options 1/2 authored this content and then
 *    gated it behind a broken condition, so it was never actually reachable.
 *    That was named the single worst trust violation in the review.
 *  - Confidence always carries its basis, never a bare word.
 *  - One taxonomy only: the role tag (frees / spends / no money moves) is a
 *    plain, uncolored label. Confidence is the only pill that carries color
 *    meaning here, so the two systems never compete for the reader's eye the
 *    way Option 4's colored-role-plus-colored-confidence pills did.
 *  - Approve and Reject are the same size and always both visible.
 */

import { ArrowDownRight, ArrowUpRight, Check, Minus, RotateCcw, X } from "lucide-react";
import type { Move, MoveStatus } from "../_data/moves";
import { Button, Confidence, ConfirmAction, Disclosure, EvidenceTable, SafetyBlock, cx, usd } from "./ui";

const roleCopy: Record<Move["role"], { label: string; icon: typeof ArrowDownRight }> = {
  frees: { label: "Frees money", icon: ArrowDownRight },
  spends: { label: "Spends money", icon: ArrowUpRight },
  neutral: { label: "No money moves", icon: Minus },
};

function RoleTag({ role, weeklyDollars }: { role: Move["role"]; weeklyDollars: number }) {
  const { label, icon: Icon } = roleCopy[role];
  const amount = role === "neutral" ? null : usd(weeklyDollars);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
      {amount && <span className="text-zinc-400">&middot; {amount}/wk</span>}
    </span>
  );
}

export type Density = "compact" | "full" | "open";

export default function MoveCard({
  move,
  status,
  density,
  onApprove,
  onReject,
  onReset,
}: {
  move: Move;
  status: MoveStatus;
  density: Density;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
}) {
  const dense = density === "compact";
  // "open" is for the operator who wants every number on screen at once, the
  // thing Option 1 did well. Nothing behind a click, no disclosure to open.
  const open = density === "open";

  const workings = (
    <div className="space-y-3">
      <EvidenceTable rows={move.evidence} confidence={move.confidence} />
      <div>
        <p className="text-[12px] font-semibold tracking-wide text-zinc-500 uppercase">
          What Zavi considered, and ruled out
        </p>
        <ul className="mt-1.5 space-y-2">
          {move.considered.map((alt) => (
            <li key={alt.option} className="text-[13.5px] leading-relaxed text-zinc-600">
              <span className="font-semibold text-zinc-800">{alt.option}.</span> {alt.why}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <li>
      <div
        className={cx(
          "rounded-2xl border bg-white p-4 sm:p-5",
          status === "rejected" ? "border-zinc-200 opacity-70" : "border-zinc-200",
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <RoleTag role={move.role} weeklyDollars={move.weeklyDollars} />
          {dense && (
            <Confidence
              label={move.confidence.label}
              basis={move.confidence.basis}
              tone={move.confidence.tone}
            />
          )}
        </div>

        <p className="mt-2 text-[16px] leading-snug font-semibold text-zinc-900">{move.title}</p>

        {!dense && (
          <p className="mt-1.5 rounded-xl bg-sky-50/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-sky-950">
            <span className="font-semibold">Why this follows: </span>
            {move.because}
          </p>
        )}

        {!dense && <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">{move.detail}</p>}

        <div className="mt-3">
          <SafetyBlock risk={move.risk} doNothing={move.doNothing} undo={move.undo} compact={dense} />
        </div>

        {!dense && (
          <div className="mt-3 rounded-xl border border-zinc-200 px-3.5 py-2.5">
            <p className="text-[13px] leading-relaxed text-zinc-600">
              <span className="font-semibold text-zinc-800">What Zavi expects: </span>
              {move.expect}
            </p>
          </div>
        )}

        {open && <div className="mt-3">{workings}</div>}

        {!dense && !open && (
          <Disclosure label="See the workings">{workings}</Disclosure>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {status === "pending" && (
            <>
              <ConfirmAction
                label="Approve"
                confirmLabel="Yes, approve"
                question="Apply this to your Meta account?"
                onConfirm={onApprove}
              />
              <Button variant="secondary" onClick={onReject}>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Reject
              </Button>
              <span className="ml-auto text-[12.5px] font-medium text-zinc-400">Awaiting your call</span>
            </>
          )}
          {status === "approved" && (
            <>
              <span className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-emerald-50 px-4 text-sm font-semibold text-emerald-700">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Approved
              </span>
              <Button variant="quiet" onClick={onReset}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Change my mind
              </Button>
            </>
          )}
          {status === "rejected" && (
            <>
              <span className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-zinc-100 px-4 text-sm font-semibold text-zinc-500">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Rejected
              </span>
              <Button variant="quiet" onClick={onReset}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Change my mind
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
