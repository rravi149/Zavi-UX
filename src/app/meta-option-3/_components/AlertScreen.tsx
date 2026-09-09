"use client";

import { Bell, Sparkles } from "lucide-react";
import { SiMeta } from "react-icons/si";
import { alert, goal } from "../_data/data";
import { Eyebrow } from "./shared";

export default function AlertScreen({ onReview }: { onReview: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef2ff] text-[#3654c9]">
        <Bell className="h-5 w-5" aria-hidden="true" />
      </div>

      <p className="mt-4 text-sm font-medium text-zinc-500">{alert.time}</p>

      <div className="mt-5 w-full max-w-[480px] rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-7">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
            <SiMeta className="h-4 w-4" />
          </span>
          <Eyebrow>Meta Ads</Eyebrow>
        </div>

        <h1 className="mt-3 text-xl leading-snug font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {alert.title}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{alert.body}</p>

        <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-600">
          <Sparkles className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          Ladders up to your goal: {goal.current} &rarr; {goal.target} {goal.unit}
        </div>

        <button
          type="button"
          onClick={onReview}
          className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
        >
          Review the plan
        </button>
      </div>
    </div>
  );
}
