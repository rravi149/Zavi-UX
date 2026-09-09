"use client";

/**
 * A live ledger of where the money goes. Recomputes from computeLedger on
 * every render, so it always reflects the founder's current approve/reject
 * mix, never a snapshot taken at page load.
 *
 * No chart library. Boxes and arrows only, built from Tailwind + lucide-react,
 * and it stacks vertically instead of overflowing at narrow widths.
 */

import { AlertTriangle, ArrowRight, PiggyBank } from "lucide-react";
import {
  computeLedger,
  freeingMoves,
  spendingMoves,
  type MoveStatus,
} from "../_data/moves";
import { Card, cx, usd } from "./ui";

type NodeTone = "drain" | "fund" | "pool" | "bank";

const nodeTones: Record<NodeTone, string> = {
  drain: "border-red-200 bg-red-50",
  fund: "border-emerald-200 bg-emerald-50",
  pool: "border-sky-200 bg-sky-50",
  bank: "border-zinc-200 bg-zinc-50",
};

function MoneyNode({
  title,
  amount,
  tone,
  dimmed,
}: {
  title: string;
  amount: number;
  tone: NodeTone;
  dimmed?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border px-3.5 py-3 text-center transition-opacity duration-200",
        nodeTones[tone],
        dimmed && "opacity-40",
      )}
    >
      <p className="text-[12px] leading-snug font-medium text-zinc-600">{title}</p>
      <p className="mt-1 text-[18px] font-extrabold tracking-tight text-zinc-900">
        {usd(amount)}
      </p>
    </div>
  );
}

function FlowArrow({ warn }: { warn?: boolean }) {
  return (
    <div className="flex items-center justify-center px-1 py-1 sm:py-0">
      <ArrowRight
        className={cx(
          "h-4 w-4 shrink-0 rotate-90 sm:rotate-0",
          warn ? "text-amber-500" : "text-zinc-300",
        )}
        aria-hidden="true"
      />
    </div>
  );
}

export default function ReallocationFlow({
  statuses,
}: {
  statuses: Record<number, MoveStatus>;
}) {
  const ledger = computeLedger(statuses);
  const statusOf = (id: number) => statuses[id] ?? "pending";

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] font-bold tracking-[0.09em] text-zinc-500 uppercase">
        Where the money goes
      </p>

      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-2">
          {freeingMoves.map((m) => (
            <MoneyNode
              key={m.id}
              title={m.title}
              amount={m.weeklyDollars}
              tone="drain"
              dimmed={statusOf(m.id) !== "approved"}
            />
          ))}
        </div>

        <FlowArrow />

        <MoneyNode title="Freed this week" amount={ledger.freed} tone="pool" />

        <FlowArrow warn={ledger.state === "unfunded"} />

        <div className="flex flex-1 flex-col gap-2">
          {spendingMoves.map((m) => (
            <MoneyNode
              key={m.id}
              title={m.title}
              amount={m.weeklyDollars}
              tone="fund"
              dimmed={statusOf(m.id) !== "approved"}
            />
          ))}
          {ledger.banked > 0 && (
            <MoneyNode title="Banked, unspent" amount={ledger.banked} tone="bank" />
          )}
        </div>
      </div>

      {ledger.state === "empty" && (
        <p className="mt-4 text-[13px] leading-snug text-zinc-500">
          Nothing has been approved yet, so nothing moves. Every figure above sits at zero
          until you decide.
        </p>
      )}

      {ledger.state === "unfunded" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-[13px] leading-snug text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            You are funding the budget raise without freeing enough to pay for it. Total
            Meta spend goes up by {usd(ledger.shortfall)} a week. That is new spend, not a
            reallocation.
          </span>
        </div>
      )}

      {ledger.state === "banking" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-zinc-50 px-3.5 py-3 text-[13px] leading-snug text-zinc-600">
          <PiggyBank className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <span>
            You are keeping the {usd(ledger.freed)} a week you freed rather than putting
            it back to work. Expect roughly 30 to 40 fewer sales a week than if you had
            funded the budget raise, traded for margin instead.
          </span>
        </div>
      )}

      {ledger.state === "balanced" && (
        <p className="mt-4 text-[13px] leading-snug text-zinc-600">
          {usd(ledger.committed)} a week moves to the budget raise. Total spend does not
          rise.
          {ledger.banked > 0 && ` ${usd(ledger.banked)} a week stays unspent.`}
        </p>
      )}
    </Card>
  );
}
