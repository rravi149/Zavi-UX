"use client";

/**
 * Option 4 flow, extracted from page.tsx so it can run in two places:
 *  - standalone at /meta-option-4 (full page, starts at the alert)
 *  - embedded in the dashboard "All actions" drawer (starts at review,
 *    because the channel card in the dashboard already IS the alert)
 */

import { useState } from "react";
import { PageHeader, type Step } from "./_components/PageChrome";
import { AlertScreen } from "./_components/AlertScreen";
import { ReviewScreen } from "./_components/ReviewScreen";
import { RecapScreen } from "./_components/RecapScreen";
import { AppliedScreen } from "./_components/AppliedScreen";
import { FollowUpScreen } from "./_components/FollowUpScreen";
import { moves, type MoveStatus } from "./_data/moves";

export type Option4Step = Step;

export default function Option4Flow({
  embedded = false,
  startAt = "alert",
}: {
  embedded?: boolean;
  startAt?: Step;
}) {
  const [step, setStep] = useState<Step>(startAt);
  const [statuses, setStatuses] = useState<Record<number, MoveStatus>>(() =>
    Object.fromEntries(moves.map((m) => [m.id, "pending" as MoveStatus])),
  );

  function setStatus(id: number, status: MoveStatus) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }

  return (
    <div className={embedded ? "bg-background" : "min-h-screen bg-background"}>
      <PageHeader step={step} />
      {step === "alert" && <AlertScreen onReview={() => setStep("review")} />}
      {step === "review" && (
        <ReviewScreen
          statuses={statuses}
          onApprove={(id) => setStatus(id, "approved")}
          onReject={(id) => setStatus(id, "rejected")}
          onReset={(id) => setStatus(id, "pending")}
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
          onSeeFollowUp={() => setStep("followup")}
        />
      )}
      {step === "followup" && <FollowUpScreen statuses={statuses} />}
    </div>
  );
}
