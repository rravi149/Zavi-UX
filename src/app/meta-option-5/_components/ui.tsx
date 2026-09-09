"use client";

/**
 * Option 5 shared primitives. Every screen composes from these.
 * House style follows Zavi-UX: warm ivory ground, restrained blue accent,
 * Plus Jakarta Sans, generous whitespace, soft rounded cards.
 * No em dashes in any user-facing string.
 */

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export const STEPS = ["Review", "Confirm", "Applied", "Result"] as const;
export type StepName = (typeof STEPS)[number];

/** Page ground. `embedded` drops full-viewport sizing for the dashboard drawer. */
export function Shell({
  embedded,
  children,
}: {
  embedded?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("relative", !embedded && "min-h-screen overflow-hidden")}>
      {!embedded && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-[#faf8f4]"
          style={{
            background:
              "radial-gradient(900px 700px at 88% 4%, rgba(99,140,255,0.14), transparent 62%), radial-gradient(500px 420px at 6% 96%, rgba(255,205,160,0.10), transparent 60%), #faf8f4",
          }}
        />
      )}
      <div
        className={cx(
          "relative z-[1] w-full px-5 py-8 sm:px-7",
          // Standalone gets a readable column. Embedded fills the drawer, which
          // expands to 1600px, instead of stranding half the screen as gutter.
          embedded ? "max-w-none" : "mx-auto max-w-[1100px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Stepper({ current }: { current: StepName }) {
  const index = STEPS.indexOf(current);
  return (
    <ol className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
      {STEPS.map((step, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cx(
                "rounded-full px-2.5 py-1 font-semibold",
                active && "bg-zinc-900 text-white",
                done && "bg-zinc-200 text-zinc-600",
                !active && !done && "text-zinc-400",
              )}
            >
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[0.09em] text-zinc-500 uppercase">
      {children}
    </p>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400",
    secondary: "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
    quiet: "text-zinc-600 hover:bg-zinc-100",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  tone = "plain",
}: {
  children: ReactNode;
  className?: string;
  tone?: "plain" | "warn" | "good" | "muted";
}) {
  const tones = {
    plain: "border-zinc-200 bg-white",
    warn: "border-amber-200 bg-amber-50",
    good: "border-emerald-200 bg-emerald-50",
    muted: "border-zinc-200 bg-zinc-50",
  };
  return (
    <div className={cx("rounded-2xl border", tones[tone], className)}>{children}</div>
  );
}

/** Confidence, always shown WITH the sample it rests on. Never a bare vibe word. */
export function Confidence({
  label,
  basis,
  tone,
}: {
  label: string;
  basis: string;
  tone: "strong" | "early" | "thin";
}) {
  const tones = {
    strong: "bg-emerald-100 text-emerald-800",
    early: "bg-sky-100 text-sky-800",
    thin: "bg-amber-100 text-amber-900",
  };
  return (
    <span className="inline-flex flex-wrap items-baseline gap-1.5 text-[12px] leading-snug">
      <span className={cx("rounded-full px-2 py-0.5 font-semibold", tones[tone])}>
        {label}
      </span>
      <span className="text-zinc-500">based on {basis}</span>
    </span>
  );
}

/**
 * The three safety fields. ALWAYS rendered, never behind a disclosure.
 * This is the direct fix for the Options 1/2 bug where risk, do-nothing and
 * undo were authored but unreachable in every view.
 */
export function SafetyBlock({
  risk,
  doNothing,
  undo,
  compact,
}: {
  risk: string;
  doNothing: string;
  undo: string;
  compact?: boolean;
}) {
  const rows = [
    { label: "Risk", body: risk },
    { label: "If you do nothing", body: doNothing },
    { label: "Undo", body: undo },
  ];
  return (
    <dl
      className={cx(
        "grid gap-x-5 gap-y-1.5 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[12.5px] leading-snug",
        compact ? "grid-cols-1" : "sm:grid-cols-3",
      )}
    >
      {rows.map((r) => (
        <div key={r.label}>
          <dt className="text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
            {r.label}
          </dt>
          <dd className="mt-0.5 text-zinc-600">{r.body}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Collapsible. For DETAIL only. Never put safety information in here. */
export function Disclosure({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-zinc-600 hover:text-zinc-900"
      >
        <ChevronDown
          className={cx("h-3.5 w-3.5 transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
        {label}
      </button>
      {open && <div className="mt-2.5">{children}</div>}
    </div>
  );
}

export function EvidenceTable({
  rows,
  confidence,
}: {
  rows: { label: string; value: string; note?: string; tone?: "good" | "bad" }[];
  confidence?: { label: string; basis: string; tone: "strong" | "early" | "thin" };
}) {
  const dot = {
    strong: "bg-emerald-500 text-emerald-700",
    early: "bg-sky-500 text-sky-700",
    thin: "bg-amber-500 text-amber-700",
  };
  return (
    <dl className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200">
      {confidence && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-zinc-50 px-3.5 py-2.5">
          <dt className="text-[13px] font-bold text-zinc-900">Evidence</dt>
          <dd className="flex items-center gap-1.5 text-[13px] font-semibold">
            <span
              aria-hidden="true"
              className={cx("h-2 w-2 rounded-full", dot[confidence.tone].split(" ")[0])}
            />
            <span className={dot[confidence.tone].split(" ")[1]}>{confidence.label}</span>
            <span className="font-normal text-zinc-500">· {confidence.basis}</span>
          </dd>
        </div>
      )}
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-3.5 py-2.5 text-[13px]"
        >
          <dt className="text-zinc-600">{r.label}</dt>
          <dd className="text-right">
            <span
              className={cx(
                "font-bold",
                r.tone === "bad" && "text-red-700",
                r.tone === "good" && "text-emerald-700",
                !r.tone && "text-zinc-900",
              )}
            >
              {r.value}
            </span>
            {r.note && <span className="ml-1.5 text-zinc-500">{r.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The attribution caveat. Rendered once per screen that shows sales figures. */
export function AttributionNote({ text }: { text: string }) {
  return (
    <p className="mt-4 flex items-start gap-2 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[12px] leading-snug text-zinc-500">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </p>
  );
}

export function usd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

/** Two-step confirm. Every live-money action goes through this. */
export function ConfirmAction({
  label,
  confirmLabel,
  question,
  onConfirm,
  variant = "primary",
}: {
  label: string;
  confirmLabel: string;
  question: string;
  onConfirm: () => void;
  variant?: "primary" | "secondary" | "danger";
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <Button variant={variant} onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-medium text-zinc-700">{question}</span>
      <Button
        variant={variant}
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="quiet" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  );
}
