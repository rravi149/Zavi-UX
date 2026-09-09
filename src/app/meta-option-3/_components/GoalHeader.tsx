import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { goal } from "../_data/data";
import { Eyebrow } from "./shared";

export default function GoalHeader({
  current,
  gapLabel,
  children,
}: {
  /** Lets the follow-up screen show the goal moving as real results land. */
  current?: number;
  gapLabel?: string;
  children?: ReactNode;
}) {
  const shownCurrent = current ?? goal.current;
  const gap = goal.target - shownCurrent;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">
      <Eyebrow>{goal.eyebrow}</Eyebrow>
      <h1 className="mt-1.5 text-2xl leading-tight font-semibold tracking-tight text-zinc-900 sm:text-[28px]">
        {goal.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl leading-none font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            {shownCurrent}
          </span>
          <span className="text-sm font-medium text-zinc-500">now</span>
        </div>
        <ArrowRight className="mb-1.5 h-5 w-5 shrink-0 text-zinc-300" aria-hidden="true" />
        <div className="flex items-baseline gap-2">
          <span className="text-4xl leading-none font-extrabold tracking-tight text-zinc-400 sm:text-5xl">
            {goal.target}
          </span>
          <span className="text-sm font-medium text-zinc-500">target</span>
        </div>
        <span className="ml-auto flex h-8 shrink-0 items-center rounded-full bg-[#eef2ff] px-3 text-sm font-semibold text-[#3654c9]">
          {gapLabel ?? `${gap} ${goal.unit} to go`}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-500">{goal.setNote}</p>

      {children && <div className="mt-5 border-t border-zinc-100 pt-5">{children}</div>}
    </div>
  );
}
