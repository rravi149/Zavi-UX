"use client";

/**
 * Option 3 flow, extracted from page.tsx so it can run in two places:
 *  - standalone at /meta-option-3 (full page, starts at the alert)
 *  - embedded in the dashboard "All actions" drawer (starts at review,
 *    because the channel card in the dashboard already IS the alert)
 */

import { useState } from "react";
import { moves } from "./_data/data";
import AlertScreen from "./_components/AlertScreen";
import ReviewScreen from "./_components/ReviewScreen";
import ConfirmationScreen from "./_components/ConfirmationScreen";
import FollowUpScreen from "./_components/FollowUpScreen";
import type { DecisionStatus } from "./_components/MoveCard";

export type Option3View = "alert" | "review" | "confirmation" | "followup";

function initialDecisions(): Record<number, DecisionStatus> {
  const record: Record<number, DecisionStatus> = {};
  for (const move of moves) record[move.id] = "pending";
  return record;
}

export default function Option3Flow({
  embedded = false,
  startAt = "alert",
}: {
  embedded?: boolean;
  startAt?: Option3View;
}) {
  const [view, setView] = useState<Option3View>(startAt);
  const [decisions, setDecisions] =
    useState<Record<number, DecisionStatus>>(initialDecisions);
  const [day, setDay] = useState(0);

  function approve(id: number) {
    setDecisions((prev) => ({ ...prev, [id]: "approved" }));
  }
  function reject(id: number) {
    setDecisions((prev) => ({ ...prev, [id]: "rejected" }));
  }
  function approveAll() {
    setDecisions((prev) => {
      const next = { ...prev };
      for (const move of moves) next[move.id] = "approved";
      return next;
    });
  }
  function revert(id: number) {
    setDecisions((prev) => ({ ...prev, [id]: "reverted" }));
  }

  // Embedded runs inside a drawer that owns its own scroll and background,
  // so drop the full-viewport height and the fixed page glow.
  return (
    <div
      className={
        embedded
          ? "relative"
          : "relative min-h-screen overflow-hidden bg-[#faf8f4]"
      }
    >
      {!embedded && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "radial-gradient(900px 700px at 88% 4%, rgba(99,140,255,0.16), transparent 62%), radial-gradient(500px 420px at 6% 96%, rgba(255,205,160,0.12), transparent 60%)",
          }}
        />
      )}

      <div className="relative z-[1]">
        {view === "alert" && <AlertScreen onReview={() => setView("review")} />}

        {view === "review" && (
          <ReviewScreen
            decisions={decisions}
            onApprove={approve}
            onReject={reject}
            onApproveAll={approveAll}
            onContinue={() => setView("confirmation")}
          />
        )}

        {view === "confirmation" && (
          <ConfirmationScreen
            decisions={decisions}
            onBack={() => setView("review")}
            onSeeFollowUp={() => {
              setDay(0);
              setView("followup");
            }}
          />
        )}

        {view === "followup" && (
          <FollowUpScreen
            decisions={decisions}
            day={day}
            onSetDay={setDay}
            onRevert={revert}
            onBack={() => setView("confirmation")}
          />
        )}
      </div>
    </div>
  );
}
