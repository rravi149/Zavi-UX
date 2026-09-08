"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { onboardingGroups, onboardingSteps } from "./onboarding";

export default function OnboardingDrawer({
  workspace,
  done,
  notes,
  onToggle,
  onComplete,
}: {
  workspace: string;
  done: string[];
  notes: Record<string, string>;
  onToggle: (id: string) => void;
  onComplete: (id: string, note: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const total = onboardingSteps.length;
  const completed = done.length;
  const percent = Math.round((completed / total) * 100);

  function submit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    if (!note.trim()) return;
    onComplete(id, note.trim());
    setEditing(null);
    setNote("");
  }

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg
            viewBox="0 0 36 36"
            className="h-24 w-24 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#18181b"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${percent} 100`}
              className="transition-[stroke-dasharray] duration-300"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-zinc-900">
            {percent}%
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-900">
            Finish setting up {workspace}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
            {completed} of {total} done. Each step unlocks work Zavi can do on
            its own — the more it can reach, the less sits waiting for your
            approval.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {onboardingGroups.map((group) => {
          const groupDone = group.steps.filter((step) =>
            done.includes(step.id),
          ).length;
          return (
            <section
              key={group.id}
              aria-label={group.title}
              className="overflow-hidden rounded-2xl border border-zinc-200"
            >
              <header className="flex items-center justify-between bg-zinc-50 px-5 py-3">
                <h4 className="text-sm font-semibold tracking-wider text-zinc-700 uppercase">
                  {group.title}
                </h4>
                <span className="text-sm text-zinc-500">
                  {groupDone}/{group.steps.length}
                </span>
              </header>
              <ul className="divide-y divide-zinc-100">
                {group.steps.map((step) => {
                  const isDone = done.includes(step.id);
                  const isEditing = editing === step.id;
                  return (
                    <li key={step.id} className="px-5 py-4">
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isDone}
                          aria-label={`${step.title}: ${isDone ? "done" : "not done"}`}
                          onClick={() => onToggle(step.id)}
                          className={`mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 ${
                            isDone
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-zinc-300 bg-white hover:border-zinc-500"
                          }`}
                        >
                          {isDone && (
                            <Check className="h-4 w-4" strokeWidth={3} />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[15px] font-medium ${
                              isDone
                                ? "text-zinc-400 line-through"
                                : "text-zinc-900"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-sm text-zinc-600">
                            {notes[step.id]
                              ? `You wrote: ${notes[step.id]}`
                              : step.detail}
                          </p>
                        </div>
                        {!isDone && !isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(step.id);
                              setNote("");
                            }}
                            className="shrink-0 cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
                          >
                            Fill in
                          </button>
                        )}
                      </div>
                      {isEditing && (
                        <form
                          onSubmit={(event) => submit(event, step.id)}
                          className="mt-3 ml-11"
                        >
                          <label
                            htmlFor={`note-${step.id}`}
                            className="sr-only"
                          >
                            Details for {step.title}
                          </label>
                          <textarea
                            id={`note-${step.id}`}
                            rows={3}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder={`Tell Zavi about ${step.title.toLowerCase()}…`}
                            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="submit"
                              disabled={!note.trim()}
                              className="cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(null)}
                              className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
