"use client";

import { ArrowRight, AlertTriangle } from "lucide-react";
import type { Ledger } from "../_data/moves";
import { destinationMoves, formatUsd, sourceMoves, totalTrapped } from "../_data/moves";

function Node({
  label,
  amount,
  tone,
  faded,
}: {
  label: string;
  amount: string;
  tone: "drain" | "fund" | "bank" | "warn";
  faded?: boolean;
}) {
  const toneClass =
    tone === "drain"
      ? "border-red-200 bg-red-50"
      : tone === "fund"
        ? "border-emerald-200 bg-emerald-50"
        : tone === "warn"
          ? "border-amber-300 bg-amber-50"
          : "border-zinc-200 bg-zinc-50";
  return (
    <div
      className={`rounded-xl border px-3.5 py-2.5 text-center transition-opacity duration-200 ${toneClass} ${
        faded ? "opacity-40" : ""
      }`}
    >
      <p className="text-[12px] font-medium text-zinc-600">{label}</p>
      <p className="mt-0.5 text-[17px] font-extrabold tracking-tight text-zinc-900">
        {amount}
      </p>
    </div>
  );
}

function Arrow({ dashed, warn }: { dashed?: boolean; warn?: boolean }) {
  return (
    <div className="flex flex-1 items-center justify-center px-1">
      <div
        className={`h-px w-full ${
          warn ? "border-t-2 border-dashed border-amber-400" : dashed ? "border-t border-dashed border-zinc-300" : "bg-zinc-300"
        }`}
        style={{ height: warn || dashed ? 0 : 1 }}
        aria-hidden="true"
      />
      <ArrowRight
        className={`h-3.5 w-3.5 shrink-0 ${warn ? "text-amber-500" : "text-zinc-400"}`}
        aria-hidden="true"
      />
    </div>
  );
}

export function ReallocationFlow({ ledger }: { ledger: Ledger }) {
  const banked = Math.max(ledger.freed - ledger.committed, 0);
  const extraUnfunded =
    ledger.mismatch?.kind === "unfunded-destination" ? ledger.mismatch.shortfall : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <p className="text-[12px] font-semibold tracking-wide text-zinc-500 uppercase">
        This week&rsquo;s reallocation
      </p>
      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-2">
          {sourceMoves.map((move) => (
            <Node
              key={move.id}
              label={`Move ${move.id} · ${move.title.split(" ").slice(0, 4).join(" ")}…`}
              amount={formatUsd(-move.weeklyDelta)}
              tone="drain"
              faded={!ledger.approvedSources.includes(move)}
            />
          ))}
        </div>

        <Arrow />

        <Node
          label="Freed this week"
          amount={formatUsd(ledger.freed)}
          tone={ledger.freed > 0 ? "fund" : "bank"}
        />

        <Arrow warn={extraUnfunded > 0} />

        <div className="flex flex-1 flex-col gap-2">
          {destinationMoves.map((move) => (
            <Node
              key={move.id}
              label={`Move ${move.id} · the winning ad`}
              amount={formatUsd(move.weeklyDelta)}
              tone={ledger.destinationApproved ? "fund" : "bank"}
              faded={!ledger.destinationApproved}
            />
          ))}
          {banked > 0 && (
            <Node label="Banked, kept as margin" amount={formatUsd(banked)} tone="bank" />
          )}
        </div>
      </div>

      {ledger.mismatch?.kind === "unfunded-destination" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-[13px] leading-snug text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Heads up: you&rsquo;re funding move 2 without freeing enough to pay
            for it. Total Meta spend goes up by {formatUsd(ledger.mismatch.shortfall)} a
            week instead of staying flat, until you approve a source move too.
          </span>
        </div>
      )}
      {ledger.mismatch?.kind === "all-banked" && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-[13px] leading-snug text-zinc-600">
          You&rsquo;re taking the full {formatUsd(totalTrapped)} a week as reduced
          spend rather than reinvesting any of it in move 2. More margin this
          week, but expect roughly 30 to 40 fewer sales than if you&rsquo;d
          funded the winning ad instead.
        </div>
      )}
      {ledger.mismatch?.kind === "partially-banked" && ledger.pendingSources.length === 0 && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-[13px] leading-snug text-zinc-600">
          {formatUsd(ledger.mismatch.freedNotReinvested)} a week is freed but
          not reinvested. That money simply leaves the account as savings
          this week, it doesn&rsquo;t sit idle waiting for a decision.
        </div>
      )}
    </div>
  );
}
