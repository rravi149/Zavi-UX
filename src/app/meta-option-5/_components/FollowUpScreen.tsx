"use client";

/**
 * Option 5, Result screen.
 *
 * Two audited defects this file fixes directly:
 *  - Option 3 narrated "rolled back" copy while the button still showed and the
 *    founder had never clicked anything. Here a move stays in its failed state
 *    until `reverted` actually contains its id.
 *  - Confidence labels only ever moved toward caution in the earlier options.
 *    Move 5 proves they move the other way too: it was labeled "Not enough
 *    data yet" and it is winning, and that gets the same visual weight as
 *    move 4's failure, not a footnote.
 */

import { Check, Clock, AlertTriangle, TrendingUp, RotateCcw } from "lucide-react";
import {
  Shell,
  Stepper,
  Eyebrow,
  Button,
  Card,
  AttributionNote,
  ConfirmAction,
  usd,
  cx,
} from "./ui";
import {
  moves,
  outcomes,
  dayKeys,
  dayLabels,
  freeingMoves,
  spendingMoves,
  ATTRIBUTION_NOTE,
  type MoveStatus,
  type DayKey,
  type Outcome,
  type Move,
} from "../_data/moves";

type Props = {
  statuses: Record<number, MoveStatus>;
  day: DayKey;
  onSetDay: (day: DayKey) => void;
  reverted: Set<number>;
  onRevert: (id: number) => void;
  actioned: Set<number>;
  onAction: (id: number) => void;
  onBack: () => void;
};

/* ---------- Status treatment, shared by every result card. ---------- */

const STATUS_META: Record<
  Outcome["status"],
  { label: string; icon: typeof Check; badge: string }
> = {
  tracking: { label: "Too early to call", icon: Clock, badge: "bg-zinc-200 text-zinc-700" },
  hit: { label: "Did what was promised", icon: Check, badge: "bg-emerald-100 text-emerald-800" },
  miss: { label: "Didn't work", icon: AlertTriangle, badge: "bg-red-100 text-red-800" },
  better: { label: "Beat expectations", icon: TrendingUp, badge: "bg-sky-100 text-sky-800" },
};

function cardTone(status: Outcome["status"]): "plain" | "warn" | "good" | "muted" {
  if (status === "hit" || status === "better") return "good";
  if (status === "miss") return "warn";
  return "muted";
}

function StatusBadge({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon: typeof Check;
  tone: string;
}) {
  return (
    <span
      className={cx(
        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
        tone,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ---------- The honest running total. ---------- */

/**
 * Actual dollars, copied straight out of the outcome notes below, nothing
 * derived and nothing rounded up. Moves 1 and 2 report cumulative dollars
 * since the day they went live, so these are the same numbers a founder
 * would read in each move's own note. Day 3 has no entry for move 2 because
 * its own note says the figure has not settled yet.
 */
const CONFIRMED_FREED: Record<number, Partial<Record<DayKey, number | null>>> = {
  1: { 0: 0, 3: 252, 7: 588, 14: 1176 },
  2: { 0: 0, 3: null, 7: 198, 14: 412 },
};

/** The budget raise is a flat weekly commitment, live from the day it was approved. */
const COMMITTED_WEEKLY: Record<number, number> = {
  3: 420,
};

type FreedPart = { move: Move; confirmed: number | null };

function buildRunningTotal(day: DayKey, statuses: Record<number, MoveStatus>) {
  const approvedFreeing = freeingMoves.filter((m) => statuses[m.id] === "approved");
  const approvedSpending = spendingMoves.filter((m) => statuses[m.id] === "approved");
  if (approvedFreeing.length === 0 && approvedSpending.length === 0) return null;

  if (day === 0) {
    return {
      tone: "muted" as const,
      headline: "Nothing to total yet",
      body: "Everything you approved just went live. Give it a few days before Zavi puts a number on any of it.",
    };
  }

  const weeks = day / 7;
  const periodPhrase =
    day === 3 ? "In the first 3 days" : day === 7 ? "In the first week" : "Across both weeks";

  const freedParts: FreedPart[] = approvedFreeing.map((m) => ({
    move: m,
    confirmed: CONFIRMED_FREED[m.id]?.[day] ?? null,
  }));
  const settled = freedParts.filter(
    (p): p is { move: Move; confirmed: number } => p.confirmed !== null,
  );
  const unsettled = freedParts.filter((p) => p.confirmed === null);

  const confirmedFreed = settled.reduce((n, p) => n + p.confirmed, 0);
  const promisedFreed = settled.reduce((n, p) => n + p.move.weeklyDollars * weeks, 0);
  const committed = approvedSpending.reduce(
    (n, m) => n + (COMMITTED_WEEKLY[m.id] ?? m.weeklyDollars) * weeks,
    0,
  );

  if (settled.length === 0 && committed === 0) {
    return {
      tone: "muted" as const,
      headline: "Nothing settled yet",
      body: `${periodPhrase}, none of the approved moves have produced a clean number. Check back at day 7.`,
    };
  }

  const net = Math.round(confirmedFreed - committed);
  const promisedNet = Math.round(promisedFreed - committed);
  const shortfall = promisedNet - net;

  const move4Missed = statuses[4] === "approved" && outcomes[4][day].status === "miss";
  const move5Beating = statuses[5] === "approved" && outcomes[5][day].status === "better";

  let tone: "good" | "warn" | "muted" = net < 0 ? "warn" : "good";
  let headline: string;
  let body: string;

  if (net < 0) {
    headline = "Spending more than it's freed";
    body = `${periodPhrase}, this spent ${usd(Math.round(committed))} while freeing only ${usd(
      Math.round(confirmedFreed),
    )}, a real ${usd(-net)} of new spend, not savings moved around.`;
  } else {
    headline = `${usd(net)} banked, for real`;
    body = `${periodPhrase}, freeing ${usd(Math.round(confirmedFreed))} and spending ${usd(
      Math.round(committed),
    )} nets to ${usd(net)} actually banked.`;
    if (shortfall > 0) {
      body += ` That is ${usd(shortfall)} short of the ${usd(promisedNet)} Zavi projected.`;
    } else if (shortfall < 0) {
      body += ` That is ahead of the ${usd(promisedNet)} Zavi projected.`;
    } else {
      body += ` That matches what Zavi projected.`;
    }
  }

  if (unsettled.length > 0) {
    body += ` ${unsettled.map((p) => p.move.title).join(" and ")} hasn't settled into a real number yet.`;
  }

  if (move4Missed) {
    tone = "warn";
    headline = "A mixed picture";
    body += " Outside this total: the creative refresh failed, exactly the way Zavi warned it might.";
  }
  if (move5Beating) {
    body += " Also outside this total: the placement expansion is beating what Zavi was willing to forecast.";
  }

  return { tone, headline, body };
}

/* ---------- Per-move result cards. ---------- */

function ResultCard({ move, day }: { move: Move; day: DayKey }) {
  const outcome = outcomes[move.id][day];
  const meta = STATUS_META[outcome.status];
  return (
    <Card tone={cardTone(outcome.status)} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={meta.label} icon={meta.icon} tone={meta.badge} />
        <p className="text-[14.5px] font-semibold text-zinc-900">{move.title}</p>
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-700">{outcome.note}</p>
      {outcome.against && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          <span className="font-semibold text-zinc-600">Zavi said: </span>
          {outcome.against}
        </p>
      )}
    </Card>
  );
}

/** Move 4, the creative refresh. Its own warned risk is what happened. */
function Move4Card({
  move,
  day,
  reverted,
  onRevert,
  actioned,
  onAction,
}: {
  move: Move;
  day: DayKey;
  reverted: Set<number>;
  onRevert: (id: number) => void;
  actioned: Set<number>;
  onAction: (id: number) => void;
}) {
  const outcome = outcomes[move.id][day];
  const isReverted = reverted.has(move.id);
  const meta = STATUS_META[outcome.status];

  return (
    <Card tone={isReverted ? "muted" : cardTone(outcome.status)} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {isReverted ? (
          <StatusBadge label="Rolled back" icon={RotateCcw} tone="bg-zinc-200 text-zinc-700" />
        ) : (
          <StatusBadge label={meta.label} icon={meta.icon} tone={meta.badge} />
        )}
        <p className="text-[14.5px] font-semibold text-zinc-900">{move.title}</p>
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-700">
        {isReverted
          ? "You rolled this back. The old images are restored and this test has stopped."
          : outcome.note}
      </p>
      {!isReverted && outcome.against && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          <span className="font-semibold text-zinc-600">Zavi said: </span>
          {outcome.against}
        </p>
      )}

      {!isReverted && outcome.status === "miss" && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
          <p className="text-[13.5px] leading-relaxed text-red-800">
            <span className="font-semibold">The risk Zavi flagged is what happened. </span>
            {move.risk}
          </p>
          <div className="mt-2.5">
            <ConfirmAction
              label="Roll back to the old images"
              confirmLabel="Yes, roll it back"
              question="Restore the previous images and stop this test?"
              variant="danger"
              onConfirm={() => onRevert(move.id)}
            />
          </div>
        </div>
      )}

      {!isReverted && day === 14 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
          {actioned.has(move.id) ? (
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-emerald-700">
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              Paused. This stops spending starting today.
            </p>
          ) : (
            <>
              <p className="text-[13.5px] leading-relaxed text-amber-900">
                <span className="font-semibold">Zavi&rsquo;s new call: </span>
                Pause this ad set, the same way you paused the cart-abandoner ad.
              </p>
              <div className="mt-2.5">
                <ConfirmAction
                  label="Pause this ad set"
                  confirmLabel="Yes, pause it"
                  question="Stop this ad set from spending?"
                  variant="secondary"
                  onConfirm={() => onAction(move.id)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

/** Move 5, the placement expansion. Labeled cautious, is outperforming. */
function Move5Card({ move, day }: { move: Move; day: DayKey }) {
  const outcome = outcomes[move.id][day];
  const meta = STATUS_META[outcome.status];

  return (
    <Card tone={cardTone(outcome.status)} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={meta.label} icon={meta.icon} tone={meta.badge} />
        <p className="text-[14.5px] font-semibold text-zinc-900">{move.title}</p>
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-700">{outcome.note}</p>
      {outcome.against && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
          <span className="font-semibold text-zinc-600">Zavi said: </span>
          {outcome.against}
        </p>
      )}

      {outcome.status === "better" && (
        <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-3">
          <p className="text-[13.5px] leading-relaxed text-sky-900">
            <span className="font-semibold">This one went the other way. </span>
            Zavi labeled this &ldquo;{move.confidence.label}&rdquo; and stayed cautious on purpose.
            {day === 14
              ? " Now that there is more data, that label has moved up to “Early signal.” The caution was calibration, not a hedge against blame."
              : " It is outperforming anyway. The caution was not cover, it was an honest read of a 5-day sample."}
          </p>
        </div>
      )}
    </Card>
  );
}

/* ---------- Screen. ---------- */

export default function FollowUpScreen({
  statuses,
  day,
  onSetDay,
  reverted,
  onRevert,
  actioned,
  onAction,
  onBack,
}: Props) {
  const approvedMoves = moves.filter((m) => statuses[m.id] === "approved");
  const total = buildRunningTotal(day, statuses);

  return (
    <Shell>
      <Stepper current="Result" />
      <Eyebrow>Result</Eyebrow>
      <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-zinc-900">
        Did it actually work?
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        Jump ahead to see how each move you approved played out against what Zavi said would
        happen. Nothing here rewrites what Zavi promised after the fact.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
        <span className="flex items-center gap-1.5 px-2 text-[12px] font-medium text-zinc-500">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Time travel, only so you can review this without waiting days
        </span>
        {dayKeys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onSetDay(k)}
            aria-pressed={day === k}
            className={cx(
              "h-9 cursor-pointer rounded-lg px-3.5 text-sm font-semibold transition-colors duration-150",
              day === k
                ? "bg-zinc-900 text-white"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
            )}
          >
            {dayLabels[k]}
          </button>
        ))}
      </div>

      {approvedMoves.length === 0 ? (
        <Card tone="muted" className="mt-6 p-5 text-center text-[14px] text-zinc-500">
          Nothing was approved, so there is nothing to check in on. Go back and approve at least
          one move to see how it plays out.
        </Card>
      ) : (
        <>
          {total && (
            <Card
              tone={total.tone}
              className={cx("mt-6 p-4 sm:p-5", total.tone === "warn" && "border-amber-300")}
            >
              <p className="text-[15px] font-semibold text-zinc-900">{total.headline}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-700">{total.body}</p>
            </Card>
          )}

          <ul className="mt-5 flex flex-col gap-3">
            {approvedMoves.map((m) => (
              <li key={m.id}>
                {m.id === 4 ? (
                  <Move4Card
                    move={m}
                    day={day}
                    reverted={reverted}
                    onRevert={onRevert}
                    actioned={actioned}
                    onAction={onAction}
                  />
                ) : m.id === 5 ? (
                  <Move5Card move={m} day={day} />
                ) : (
                  <ResultCard move={m} day={day} />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <AttributionNote text={ATTRIBUTION_NOTE} />

      <div className="mt-6">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </Shell>
  );
}
