"use client";

/**
 * What actually changed, in plain language, plus the money effect restated
 * and an honest promise: Zavi checks back on its own schedule and shows the
 * result whether it went well or badly.
 */

import { ArrowRight, Check, Circle } from "lucide-react";
import { computeLedger, dayKeys, moves, type MoveStatus } from "../_data/moves";
import { Button, Card, Stepper, usd } from "./ui";

export default function AppliedScreen({
  statuses,
  onSeeFollowUp,
}: {
  statuses: Record<number, MoveStatus>;
  onSeeFollowUp: () => void;
}) {
  const statusOf = (id: number) => statuses[id] ?? "pending";
  const ledger = computeLedger(statuses);
  const applied = moves.filter((m) => statusOf(m.id) === "approved");
  const untouched = moves.filter((m) => statusOf(m.id) !== "approved");

  const followDays = dayKeys.filter((d) => d !== 0);
  const followDaysLabel =
    followDays.length <= 1
      ? followDays.join("")
      : `${followDays.slice(0, -1).join(", ")} and ${followDays[followDays.length - 1]}`;

  let moneyEffect: string;
  if (ledger.freed === 0 && ledger.committed === 0) {
    moneyEffect = "No spend changed this week.";
  } else if (ledger.committed === 0) {
    moneyEffect = `${usd(ledger.freed)} a week freed, none of it reinvested.`;
  } else if (ledger.freed >= ledger.committed) {
    moneyEffect = `${usd(ledger.freed)} a week freed, ${usd(ledger.committed)} of it going to the budget raise.${
      ledger.banked > 0 ? ` ${usd(ledger.banked)} a week stays banked, unspent.` : ""
    }`;
  } else {
    moneyEffect = `${usd(ledger.committed)} a week now committed, only ${usd(
      ledger.freed,
    )} of it freed. Total Meta spend rises by ${usd(ledger.shortfall)} a week.`;
  }

  return (
    <div>
      <Stepper current="Applied" />

      <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">Applied</h1>
      <p className="mt-1 text-[14px] text-zinc-500">
        {applied.length === 0
          ? "Nothing was changed. Your Meta account stays exactly as it was."
          : `${applied.length} change${applied.length === 1 ? " is" : "s are"} now live in your Meta account.`}
      </p>

      {applied.length > 0 && (
        <Card className="mt-5 divide-y divide-zinc-100 p-0">
          {applied.map((m) => (
            <div key={m.id} className="flex items-start gap-3 px-4 py-3.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <div>
                <p className="text-[14px] font-semibold text-zinc-900">{m.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-zinc-600">{m.detail}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {untouched.length > 0 && (
        <Card tone="muted" className="mt-4 divide-y divide-zinc-200 p-0">
          {untouched.map((m) => (
            <div key={m.id} className="flex items-start gap-3 px-4 py-3.5">
              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              <div>
                <p className="text-[14px] font-semibold text-zinc-700">{m.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-zinc-500">
                  {statusOf(m.id) === "rejected"
                    ? "Declined. Left exactly as it was."
                    : "Not decided. Left exactly as it was, you can come back to it."}
                </p>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card className="mt-5 p-4">
        <p className="text-[12px] font-semibold tracking-wide text-zinc-500 uppercase">
          Money effect
        </p>
        <p className="mt-1.5 text-[14px] leading-snug text-zinc-800">{moneyEffect}</p>
      </Card>

      <p className="mt-5 text-[13px] leading-snug text-zinc-600">
        Zavi checks back in {followDaysLabel} days from now. You will see the result
        whether it went well or badly, not just the wins.
      </p>

      <div className="mt-6 flex justify-end">
        <Button onClick={onSeeFollowUp}>
          See what happens next
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
