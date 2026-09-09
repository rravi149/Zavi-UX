"use client";

import { ArrowRight, Check, ChevronDown, Play, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import type { Move } from "../_data/data";
import { confidenceTone, followUpTone } from "./shared";

export type DecisionStatus = "pending" | "approved" | "rejected" | "reverted";

const riskLead = (risk: string) => risk.split(". ")[0];
const riskRest = (risk: string) => risk.split(". ").slice(1).join(". ");

function FullPicture({ move }: { move: Move }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-900"
      >
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        {open ? "Hide the full picture" : "See the full picture and the numbers"}
      </button>

      {open && (
        <div className="mt-3 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
          <div>
            <p className="text-sm font-semibold text-zinc-800">What Zavi considered and ruled out</p>
            <ul className="mt-2 space-y-2">
              {move.alternatives.map((alt) => (
                <li key={alt.option} className="text-sm leading-snug text-zinc-600">
                  <span className="font-medium text-zinc-800">{alt.option}.</span>{" "}
                  {alt.reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-zinc-800">If this goes wrong</p>
              <p className="mt-1 text-sm leading-snug text-zinc-600">{move.risk}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800">If you do nothing</p>
              <p className="mt-1 text-sm leading-snug text-zinc-600">{move.doNothing}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-800">The numbers behind this</p>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold ${confidenceTone(move.confidence).badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${confidenceTone(move.confidence).dot}`}
                  aria-hidden="true"
                />
                {move.confidenceLabel}
              </span>
            </div>
            <dl className="mt-2 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
              {move.evidence.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 px-3 py-2">
                  <dt className="text-sm font-medium text-zinc-600">{row.label}</dt>
                  <dd className="text-right text-sm">
                    <span
                      className={`font-bold ${
                        row.tone === "bad"
                          ? "text-red-700"
                          : row.tone === "good"
                            ? "text-emerald-700"
                            : "text-zinc-900"
                      }`}
                    >
                      {row.value}
                    </span>
                    {row.note && (
                      <span
                        className={`ml-1 font-medium ${
                          row.tone === "bad"
                            ? "text-red-600"
                            : row.tone === "good"
                              ? "text-emerald-600"
                              : "text-zinc-600"
                        }`}
                      >
                        {row.note}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-800">Undo</p>
            <p className="mt-1 text-sm leading-snug text-zinc-600">{move.undo}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CardShell({ move, children }: { move: Move; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
          <img
            src={move.creative.image}
            alt={move.creative.caption}
            className="h-full w-full object-cover"
          />
          {move.creative.kind === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <Play className="h-4 w-4 fill-white text-white" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base leading-snug font-semibold text-zinc-900">{move.title}</p>
          <p className="mt-0.5 text-sm leading-snug text-zinc-500">{move.oneLiner}</p>
        </div>
      </div>
      {children}
    </li>
  );
}

export function ReviewMoveCard({
  move,
  status,
  onApprove,
  onReject,
}: {
  move: Move;
  status: DecisionStatus;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const tone = confidenceTone(move.confidence);
  const decided = status === "approved" || status === "rejected";

  return (
    <CardShell move={move}>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-sm font-semibold text-[#3654c9]">
          {move.goalContribution}
        </span>
        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold ${tone.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          {move.confidenceLabel}
        </span>
      </div>

      <p className="mt-3 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-700">
        <span className="font-semibold text-zinc-900">Why this matters: </span>
        {move.ladder}
      </p>

      <FullPicture move={move} />

      {decided ? (
        <div className="mt-4 flex items-center gap-2">
          {status === "approved" ? (
            <span className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
              <Check className="h-4 w-4" aria-hidden="true" />
              Approved
            </span>
          ) : (
            <span className="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-100 px-3 text-sm font-semibold text-zinc-600">
              <X className="h-4 w-4" aria-hidden="true" />
              Rejected
            </span>
          )}
          <button
            type="button"
            onClick={() => (status === "approved" ? onReject(move.id) : onApprove(move.id))}
            className="cursor-pointer text-sm font-medium text-zinc-500 underline underline-offset-4 transition-colors duration-200 hover:text-zinc-900"
          >
            Change my mind
          </button>
        </div>
      ) : confirming ? (
        <div className="mt-4 rounded-xl border border-zinc-300 bg-zinc-50 p-3">
          <p className="text-sm font-semibold text-zinc-900">{move.actionVerb} now?</p>
          <ol className="mt-2 space-y-1">
            {move.plan.map((step, index) => (
              <li key={step} className="flex gap-2 text-sm leading-snug text-zinc-600">
                <span className="shrink-0 font-semibold text-zinc-400">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onApprove(move.id);
              }}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Yes, {move.actionVerb.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {move.actionVerb}
          </button>
          <button
            type="button"
            onClick={() => onReject(move.id)}
            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Not now
          </button>
        </div>
      )}
    </CardShell>
  );
}

export function ConfirmationMoveCard({ move, status }: { move: Move; status: DecisionStatus }) {
  return (
    <CardShell move={move}>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {status === "approved" ? (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Changed
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-sm font-semibold text-zinc-600">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Left as is
          </span>
        )}
        {status === "approved" && move.trend && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-600">
            {move.trend.label}
            <span className="text-zinc-400 line-through decoration-zinc-300">{move.trend.before}</span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            <span className="font-bold text-zinc-900">{move.trend.after}</span>
          </span>
        )}
      </div>
      {status === "approved" && (
        <p className="mt-2 text-sm text-zinc-500">
          Zavi checks back in {move.checkInDays} day{move.checkInDays === 1 ? "" : "s"}.
        </p>
      )}
    </CardShell>
  );
}

export function FollowUpMoveCard({
  move,
  status,
  day,
  onRevert,
}: {
  move: Move;
  status: DecisionStatus;
  day: number;
  onRevert: (id: number) => void;
}) {
  if (status === "rejected") {
    return (
      <CardShell move={move}>
        <p className="mt-3 text-sm text-zinc-500">
          You didn&apos;t approve this one. Nothing changed, and there is nothing to report back on.
        </p>
      </CardShell>
    );
  }

  const pastPoints = move.followUp.filter((point) => point.day <= day);
  const latest = pastPoints[pastPoints.length - 1];

  if (!latest) {
    return (
      <CardShell move={move}>
        <p className="mt-3 text-sm text-zinc-500">
          Approved. Zavi checks back in {move.checkInDays} day{move.checkInDays === 1 ? "" : "s"}.
        </p>
      </CardShell>
    );
  }

  const tone = followUpTone(latest.status);
  const reverted = status === "reverted";

  return (
    <CardShell move={move}>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ${tone.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          {reverted ? "Rolled back" : tone.label}
        </span>
        <span className="text-sm font-medium text-zinc-500">{latest.label}</span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-zinc-700">{latest.note}</p>

      {latest.metrics && latest.metrics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {latest.metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-zinc-100 px-3 py-2">
              <p className="text-base leading-tight font-extrabold tracking-tight text-zinc-900">{m.value}</p>
              <p className="text-sm text-zinc-600">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {latest.status === "miss" && !reverted && (
        <button
          type="button"
          onClick={() => onRevert(move.id)}
          className="mt-4 flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Roll it back
        </button>
      )}
    </CardShell>
  );
}
