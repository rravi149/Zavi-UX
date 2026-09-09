"use client";

/**
 * Option 5 review screen. The merge of Option 3's honest-scope discipline and
 * Option 2's density toggle, built on a diagnosis that always shows its own
 * arithmetic (the single biggest miss the raters found in Option 4).
 */

import {
  ATTRIBUTION_NOTE,
  freeingMoves,
  moves,
  neutralMoves,
  noPercentageNote,
  trappedWeekly,
  type MoveStatus,
} from "../_data/moves";
import MoveCard, { type Density } from "./MoveCard";
import ReallocationFlow from "./ReallocationFlow";
import { AttributionNote, Button, ConfirmAction, Eyebrow, EvidenceTable, Stepper, cx, usd } from "./ui";

export default function ReviewScreen({
  statuses,
  density,
  onSetDensity,
  onApprove,
  onReject,
  onReset,
  onApproveAll,
  onRejectAll,
  onContinue,
}: {
  statuses: Record<number, MoveStatus>;
  density: Density;
  onSetDensity: (d: Density) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onReset: (id: number) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onContinue: () => void;
}) {
  const statusOf = (id: number) => statuses[id] ?? "pending";
  const decidedCount = moves.filter((m) => statusOf(m.id) !== "pending").length;

  const cartAd = moves.find((m) => m.id === 1)!;
  const pastBuyers = moves.find((m) => m.id === 2)!;
  const growthMove = moves.find((m) => m.id === 3)!;
  const moneyMoves = moves.filter((m) => m.role !== "neutral");

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 py-8 sm:px-7">
      <Stepper current="Review" />

      {/* The diagnosis */}
      <Eyebrow>The diagnosis</Eyebrow>
      <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight text-zinc-900 sm:text-[30px]">
        {usd(trappedWeekly)} a week is buying nothing.
      </h1>

      <div className="mt-4 max-w-lg">
        <EvidenceTable
          rows={[
            { label: "The cart-abandoner ad", value: usd(cartAd.weeklyDollars), note: "Sep 1 to 7" },
            { label: "Reaching past buyers", value: usd(pastBuyers.weeklyDollars), note: "Sep 1 to 7" },
          ]}
        />
        <p className="mt-2 text-[13px] font-semibold text-zinc-700">
          {usd(cartAd.weeklyDollars)} + {usd(pastBuyers.weeklyDollars)} = {usd(trappedWeekly)} a week
        </p>
      </div>

      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-500">{noPercentageNote}</p>

      {/* Honest scope, as figures rather than a paragraph. The point survives the
          skim: most of this batch is a leak fix, only one move forecasts sales. */}
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {[
          {
            n: "1 of 5",
            head: "forecasts more sales",
            body: `${growthMove.title}. Roughly 30 to 40 a week, on the thinnest sample here.`,
            tone: "sky",
          },
          {
            n: `${freeingMoves.length} of 5`,
            head: "free money, add no sales",
            body: `${usd(trappedWeekly)} a week stops going where it is going.`,
            tone: "emerald",
          },
          {
            n: `${neutralMoves.length} of 5`,
            head: "early warnings, no money moves",
            body: "Nothing to fund. Decide these on their own.",
            tone: "zinc",
          },
        ].map((c) => (
          <div
            key={c.head}
            className={cx(
              "rounded-xl border px-3.5 py-3",
              c.tone === "sky" && "border-sky-200 bg-sky-50",
              c.tone === "emerald" && "border-emerald-200 bg-emerald-50",
              c.tone === "zinc" && "border-zinc-200 bg-zinc-50",
            )}
          >
            <p className="text-[19px] leading-none font-bold text-zinc-900">{c.n}</p>
            <p className="mt-1 text-[13px] font-semibold text-zinc-800">{c.head}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-zinc-600">{c.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-zinc-600">
        Plainly: this batch is mostly a leak fix, not a growth plan.
      </p>

      {/* Reallocation summary */}
      <div className="mt-6">
        <ReallocationFlow statuses={statuses} />
      </div>

      {/* Density. "Everything open" answers the one thing Option 1 did better
          than anything else: every number on screen at once, nothing behind a click. */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
        <Eyebrow>The moves</Eyebrow>
        <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
          {(
            [
              ["compact", "Compact"],
              ["full", "Full detail"],
              ["open", "Everything open"],
            ] as [Density, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={density === value}
              onClick={() => onSetDensity(value)}
              className={cx(
                "cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors duration-150",
                density === value
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-800",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped moves: money moves first */}
      <section className="mt-4">
        <h2 className="text-[16px] font-semibold text-zinc-900">One reallocation, three moves</h2>
        <p className="mt-1 text-[13.5px] text-zinc-600">
          These three move the same money. Deciding them separately still works, the reallocation
          summary above will just show the mismatch.
        </p>
        <ul className={cx("mt-4", density === "open" ? "grid gap-4 lg:grid-cols-2 2xl:grid-cols-3" : "space-y-4")}>
          {moneyMoves.map((move) => (
            <MoveCard
              key={move.id}
              move={move}
              status={statusOf(move.id)}
              density={density}
              onApprove={() => onApprove(move.id)}
              onReject={() => onReject(move.id)}
              onReset={() => onReset(move.id)}
            />
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[16px] font-semibold text-zinc-900">No money moves for these two</h2>
        <p className="mt-1 text-[13.5px] text-zinc-600">
          Early warnings, not part of the reallocation above. Decide each on its own.
        </p>
        <ul className={cx("mt-4", density === "open" ? "grid gap-4 lg:grid-cols-2 2xl:grid-cols-3" : "space-y-4")}>
          {neutralMoves.map((move) => (
            <MoveCard
              key={move.id}
              move={move}
              status={statusOf(move.id)}
              density={density}
              onApprove={() => onApprove(move.id)}
              onReject={() => onReject(move.id)}
              onReset={() => onReset(move.id)}
            />
          ))}
        </ul>
      </section>

      <AttributionNote text={ATTRIBUTION_NOTE} />

      <div className="sticky bottom-4 mt-10 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <ConfirmAction
          label="Approve all"
          confirmLabel="Yes, approve all"
          question="Approve all 5? You can still reject or change your mind on any one."
          onConfirm={onApproveAll}
          variant="secondary"
        />
        <Button variant="secondary" onClick={onRejectAll}>
          Reject all
        </Button>
        <span className="text-[12.5px] font-medium text-zinc-500">
          {decidedCount} of {moves.length} decided
        </span>
        <Button variant="primary" onClick={onContinue} className="ml-auto">
          Continue
        </Button>
      </div>
    </div>
  );
}
