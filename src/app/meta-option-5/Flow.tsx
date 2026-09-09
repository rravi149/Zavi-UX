"use client";

/**
 * Option 5, the merged option.
 *
 * Built from the five-rater review of Options 1 to 4. It takes Option 4's money
 * ledger and mandatory computed recap, Option 3's willingness to state its own
 * limits, Option 1's always-visible risk text and two-step confirms, and Option
 * 2's compact density, then fixes every verified defect the panel found.
 *
 * Runs standalone at /meta-option-5 (starts at the alert) and embedded in the
 * dashboard drawer (starts at review, since the channel card is already the alert).
 */

import { useState } from "react";
import { moves, type MoveStatus, type DayKey } from "./_data/moves";
import { Shell } from "./_components/ui";
import type { Density } from "./_components/MoveCard";
import AlertScreen from "./_components/AlertScreen";
import ReviewScreen from "./_components/ReviewScreen";
import RecapScreen from "./_components/RecapScreen";
import AppliedScreen from "./_components/AppliedScreen";
import FollowUpScreen from "./_components/FollowUpScreen";

export type Option5Step = "alert" | "review" | "recap" | "applied" | "followup";

export default function Option5Flow({
  embedded = false,
  startAt = "alert",
}: {
  embedded?: boolean;
  startAt?: Option5Step;
}) {
  const [step, setStep] = useState<Option5Step>(startAt);
  const [statuses, setStatuses] = useState<Record<number, MoveStatus>>(() =>
    Object.fromEntries(moves.map((m) => [m.id, "pending" as MoveStatus])),
  );
  // Three levels. "open" shows every evidence table inline, no clicks,
  // which is the density Option 1 had and the others lost.
  const [density, setDensity] = useState<Density>("open");
  const [day, setDay] = useState<DayKey>(0);
  // Rollback and follow-up actions are gated on the founder's own click.
  // Option 3 was marked down for narrating a rollback nobody performed.
  const [reverted, setReverted] = useState<Set<number>>(new Set());
  const [actioned, setActioned] = useState<Set<number>>(new Set());

  function setStatus(id: number, status: MoveStatus) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }
  function setAll(status: MoveStatus) {
    setStatuses(Object.fromEntries(moves.map((m) => [m.id, status])));
  }

  return (
    <Shell embedded={embedded}>
      {step === "alert" && <AlertScreen onReview={() => setStep("review")} />}

      {step === "review" && (
        <ReviewScreen
          statuses={statuses}
          density={density}
          onSetDensity={setDensity}
          onApprove={(id) => setStatus(id, "approved")}
          onReject={(id) => setStatus(id, "rejected")}
          onReset={(id) => setStatus(id, "pending")}
          onApproveAll={() => setAll("approved")}
          onRejectAll={() => setAll("rejected")}
          onContinue={() => setStep("recap")}
        />
      )}

      {step === "recap" && (
        <RecapScreen
          statuses={statuses}
          onBack={() => setStep("review")}
          onApply={() => setStep("applied")}
        />
      )}

      {step === "applied" && (
        <AppliedScreen
          statuses={statuses}
          onSeeFollowUp={() => {
            setDay(0);
            setStep("followup");
          }}
        />
      )}

      {step === "followup" && (
        <FollowUpScreen
          statuses={statuses}
          day={day}
          onSetDay={setDay}
          reverted={reverted}
          onRevert={(id) => setReverted((prev) => new Set(prev).add(id))}
          actioned={actioned}
          onAction={(id) => setActioned((prev) => new Set(prev).add(id))}
          onBack={() => setStep("applied")}
        />
      )}
    </Shell>
  );
}
