"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Check } from "lucide-react";

export type Step = "alert" | "review" | "recap" | "applied" | "followup";

const STEPS: { id: Step; label: string }[] = [
  { id: "alert", label: "Alert" },
  { id: "review", label: "Review the plan" },
  { id: "applied", label: "What changed" },
  { id: "followup", label: "Did it work" },
];

function stepIndex(step: Step): number {
  if (step === "recap") return 1; // recap sits inside "review" for the stepper
  return STEPS.findIndex((s) => s.id === step);
}

export function Stepper({ step }: { step: Step }) {
  const current = stepIndex(step);
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={`flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold transition-colors duration-200 ${
                active
                  ? "bg-indigo-600 text-white"
                  : done
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {done ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
              {s.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px w-4 shrink-0 bg-zinc-200" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function PageHeader({ step }: { step: Step }) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3.5">
        <Image
          src="/zavi-logo.png"
          alt=""
          width={28}
          height={28}
          className="shrink-0 rounded-lg"
        />
        <span className="text-[15px] font-semibold text-zinc-900">Zavi</span>
        <span className="h-4 w-px bg-zinc-200" aria-hidden="true" />
        <span className="text-[13px] font-medium text-zinc-500">
          Meta Ads &middot; this week&rsquo;s plan
        </span>
        <div className="ml-auto hidden sm:block">
          <Stepper step={step} />
        </div>
      </div>
    </header>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.14em] text-indigo-700 uppercase">
      {children}
    </p>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 [animation:step-in_380ms_cubic-bezier(0.16,1,0.3,1)_both]">
      {children}
    </main>
  );
}
