"use client";

import { ArrowRight, Radio } from "lucide-react";
import { SiMeta } from "react-icons/si";
import { Eyebrow, Screen } from "./PageChrome";
import { formatUsd, totalTrapped } from "../_data/moves";

export function AlertScreen({ onReview }: { onReview: () => void }) {
  return (
    <Screen>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
          <SiMeta className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-[13px] font-medium text-zinc-500">
          Zavi &middot; just now
        </p>
        <h1 className="mt-2 text-[24px] leading-tight font-semibold tracking-tight text-zinc-900">
          Work is waiting on your Meta account
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
          Zavi found the one thing holding your Meta account back this week,
          and worked out where the money should move instead. Nothing goes
          live until you say so.
        </p>

        <div className="mt-7 rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <Eyebrow>1 constraint found</Eyebrow>
          </div>
          <p className="mt-2 text-[15px] leading-snug font-semibold text-zinc-900">
            {formatUsd(totalTrapped)} a week is financing a dead ad and
            repeat buyers, while your best ad is starved for it.
          </p>
          <p className="mt-2 text-[13px] text-zinc-500">
            1 diagnosis &middot; 5 moves &middot; 2 minutes to review
          </p>
        </div>

        <button
          type="button"
          onClick={onReview}
          className="mt-7 inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
        >
          Review the plan
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="mt-3 text-[13px] text-zinc-400">
          Takes about 2 minutes. You can approve part of it, or none of it.
        </p>
      </div>
    </Screen>
  );
}
