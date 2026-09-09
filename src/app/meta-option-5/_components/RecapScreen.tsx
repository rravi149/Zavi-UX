"use client";

/**
 * The mandatory gate before anything applies. Rated the strongest single
 * mechanism in the whole prototype: a plain-English sentence computed from
 * the founder's actual mix of choices, the money picture at the moment of
 * commitment, and a two-step confirm before anything touches the account.
 */

import { Check, Clock, X } from "lucide-react";
import { consequenceCopy, moves, type MoveStatus } from "../_data/moves";
import { Button, Card, ConfirmAction, Stepper, cx } from "./ui";
import ReallocationFlow from "./ReallocationFlow";

export default function RecapScreen({
  statuses,
  onBack,
  onApply,
}: {
  statuses: Record<number, MoveStatus>;
  onBack: () => void;
  onApply: () => void;
}) {
  const statusOf = (id: number) => statuses[id] ?? "pending";
  const consequence = consequenceCopy(statuses);
  const approved = moves.filter((m) => statusOf(m.id) === "approved");
  const rejected = moves.filter((m) => statusOf(m.id) === "rejected");
  const pending = moves.filter((m) => statusOf(m.id) === "pending");

  const cardTone =
    consequence.tone === "good" ? "good" : consequence.tone === "warn" ? "warn" : "plain";
  const textTone =
    consequence.tone === "good"
      ? "text-emerald-900"
      : consequence.tone === "warn"
        ? "text-amber-900"
        : "text-zinc-800";

  const hasChanges = approved.length > 0;
  const applyLabel = hasChanges
    ? `Apply ${approved.length} change${approved.length === 1 ? "" : "s"}`
    : "Continue with no changes";
  const confirmLabel = hasChanges
    ? `Yes, apply ${approved.length} change${approved.length === 1 ? "" : "s"}`
    : "Yes, leave it as is";
  const confirmQuestion = hasChanges
    ? "Apply these changes to your Meta account?"
    : "Leave your Meta account exactly as it is?";

  return (
    <div>
      <Stepper current="Confirm" />

      <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">
        Before this applies
      </h1>

      <Card tone={cardTone} className={cx("mt-4 p-4 sm:p-5", textTone)}>
        <p className="text-[16px] font-semibold">{consequence.headline}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed">{consequence.body}</p>
      </Card>

      <div className="mt-5">
        <ReallocationFlow statuses={statuses} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Applying now ({approved.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {approved.length === 0 && (
              <li className="text-[13px] text-zinc-400">Nothing approved yet.</li>
            )}
            {approved.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug text-zinc-700">
                {m.title}
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
            {rejected.length === 0 && (
              <li className="text-[13px] text-zinc-400">Nothing declined.</li>
            )}
            {rejected.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug text-zinc-700">
                {m.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-zinc-300 p-4">
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-amber-700">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Still undecided ({pending.length})
          </p>
          <ul className="mt-2 space-y-1.5">
            {pending.length === 0 && (
              <li className="text-[13px] text-zinc-400">Nothing left undecided.</li>
            )}
            {pending.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug text-zinc-700">
                {m.title}
              </li>
            ))}
          </ul>
          {pending.length > 0 && (
            <p className="mt-2 text-[12.5px] text-zinc-500">
              These stay exactly as they are. Nothing happens until you come back and
              decide.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={onBack}>
          Back to the plan
        </Button>
        <ConfirmAction
          label={applyLabel}
          confirmLabel={confirmLabel}
          question={confirmQuestion}
          onConfirm={onApply}
        />
      </div>
    </div>
  );
}
