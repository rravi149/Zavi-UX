"use client";

/**
 * Confirmation modals for Option 6.
 * Every approve and every reject now goes through one of these, so no live
 * change is ever one click away, and a reject always records why.
 */

import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Check, RotateCcw, X } from "lucide-react";
import type { Move } from "../../meta-option-5/_data/moves";

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

export const REJECT_REASONS = [
  "I do not buy the evidence",
  "Too risky for now",
  "Not a priority this week",
  "I want to try something different",
  "I need to understand it better",
  "Something else",
] as const;

function Frame({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/30 [animation:fade-in_150ms_ease-out]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[86vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl [animation:pop-in_180ms_cubic-bezier(0.32,0.72,0,1)]">
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <h2 className="text-[16px] leading-snug font-bold text-zinc-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        <footer className="flex flex-wrap items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-5 py-3.5">
          {footer}
        </footer>
      </div>
    </div>
  );
}

export function ApproveModal({
  move,
  onCancel,
  onConfirm,
}: {
  move: Move;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Frame
      title="Apply this to your Meta account?"
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Yes, apply it
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <span className="ml-auto text-[12px] text-zinc-500">Nothing changes until you press apply.</span>
        </>
      }
    >
      <p className="text-[15px] leading-snug font-bold text-zinc-900">{move.title}</p>
      <dl className="mt-3 space-y-3 text-[13.5px] leading-relaxed">
        <div>
          <dt className="text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
            What changes
          </dt>
          <dd className="mt-0.5 text-zinc-700">{move.detail}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
            What Zavi expects
          </dt>
          <dd className="mt-0.5 text-zinc-700">{move.expect}</dd>
        </div>
        <div className="rounded-xl bg-amber-50 px-3.5 py-2.5">
          <dt className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-amber-900 uppercase">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Risk
          </dt>
          <dd className="mt-0.5 text-amber-900">{move.risk}</dd>
        </div>
        <div className="rounded-xl bg-zinc-50 px-3.5 py-2.5">
          <dt className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-zinc-600 uppercase">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            If you change your mind
          </dt>
          <dd className="mt-0.5 text-zinc-700">{move.undo}</dd>
        </div>
      </dl>
    </Frame>
  );
}

export function RejectModal({
  move,
  onCancel,
  onConfirm,
}: {
  move: Move;
  onCancel: () => void;
  onConfirm: (reason: string, note: string) => void;
}) {
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState("");
  const needsNote = reason === "Something else";
  const ready = reason !== "" && (!needsNote || note.trim().length > 0);

  return (
    <Frame
      title="Why are you leaving this one?"
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            disabled={!ready}
            onClick={() => onConfirm(reason, note.trim())}
            className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            Reject this change
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </>
      }
    >
      <p className="text-[15px] leading-snug font-bold text-zinc-900">{move.title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">
        Zavi uses this to stop suggesting things you do not want. Nothing in your account changes
        either way.
      </p>

      <fieldset className="mt-4">
        <legend className="sr-only">Reason</legend>
        <div className="space-y-1.5">
          {REJECT_REASONS.map((r) => (
            <label
              key={r}
              className={cx(
                "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13.5px] transition-colors",
                reason === r
                  ? "border-zinc-900 bg-zinc-50 font-semibold text-zinc-900"
                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-50",
              )}
            >
              <input
                type="radio"
                name="reject-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="h-4 w-4 accent-zinc-900"
              />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-3.5 block">
        <span className="mb-1 block text-[12px] font-semibold text-zinc-700">
          {needsNote ? "Tell Zavi what it got wrong" : "Anything to add? Optional."}
        </span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={needsNote ? "Required" : "Optional"}
          className="w-full resize-none rounded-xl border border-zinc-300 px-3 py-2.5 text-[13.5px] text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
        />
      </label>
    </Frame>
  );
}

export function BulkModal({
  kind,
  count,
  onCancel,
  onConfirm,
}: {
  kind: "approve" | "reject";
  count: number;
  onCancel: () => void;
  onConfirm: (reason: string, note: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const rejecting = kind === "reject";
  const ready = !rejecting || reason !== "";

  return (
    <Frame
      title={
        rejecting
          ? `Reject all ${count} changes?`
          : `Apply all ${count} changes to your Meta account?`
      }
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            disabled={!ready}
            onClick={() => onConfirm(reason, note.trim())}
            className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            {rejecting ? `Reject all ${count}` : `Yes, apply all ${count}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
        </>
      }
    >
      {rejecting ? (
        <>
          <p className="text-[13.5px] leading-relaxed text-zinc-700">
            This leaves your account exactly as it is. The money Zavi flagged keeps going where it
            is going.
          </p>
          <fieldset className="mt-4">
            <legend className="mb-1.5 text-[12px] font-semibold text-zinc-700">
              Why are you rejecting all of them?
            </legend>
            <div className="space-y-1.5">
              {REJECT_REASONS.map((r) => (
                <label
                  key={r}
                  className={cx(
                    "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13.5px] transition-colors",
                    reason === r
                      ? "border-zinc-900 bg-zinc-50 font-semibold text-zinc-900"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                  )}
                >
                  <input
                    type="radio"
                    name="bulk-reject-reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="h-4 w-4 accent-zinc-900"
                  />
                  {r}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-3.5 block">
            <span className="mb-1 block text-[12px] font-semibold text-zinc-700">
              Anything to add? Optional.
            </span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-none rounded-xl border border-zinc-300 px-3 py-2.5 text-[13.5px] text-zinc-800 outline-none focus:border-zinc-900"
            />
          </label>
        </>
      ) : (
        <p className="text-[13.5px] leading-relaxed text-zinc-700">
          All {count} changes go live together. Each one can still be undone on its own afterwards,
          but they cannot be undone as a group, so it is worth reading each card first if you have
          not.
        </p>
      )}
    </Frame>
  );
}
