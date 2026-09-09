"use client";

/**
 * The nudge that work is waiting. Small, calm, one card. States the diagnosis
 * as a fact and lets the founder judge it, no loaded verbs baked into the
 * framing before they have seen a single number.
 */

import { ClipboardList } from "lucide-react";
import { moves, trappedWeekly } from "../_data/moves";
import { Button, Card, usd } from "./ui";

export default function AlertScreen({ onReview }: { onReview: () => void }) {
  return (
    <Card className="mx-auto max-w-[420px] p-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
        <ClipboardList className="h-5 w-5 text-zinc-500" aria-hidden="true" />
      </div>
      <p className="mt-3.5 text-[15px] leading-snug text-zinc-800">
        {usd(trappedWeekly)} a week going nowhere in your Meta account, {moves.length}{" "}
        changes ready for you to look at.
      </p>
      <div className="mt-4 flex justify-center">
        <Button onClick={onReview}>Review the changes</Button>
      </div>
    </Card>
  );
}
