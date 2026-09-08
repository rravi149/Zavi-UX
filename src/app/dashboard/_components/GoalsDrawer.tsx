"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Plus,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Dropdown, menuItemClass } from "./Dropdown";
import type { Goal, GoalChannel } from "./types";

const TODAY = Date.UTC(2026, 8, 2);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const categories = ["growth", "retention", "sales", "product", "marketing"];
const channelOptions: { id: GoalChannel; label: string }[] = [
  { id: "facebook", label: "Facebook" },
  { id: "reddit", label: "Reddit" },
  { id: "google", label: "Google" },
  { id: "x", label: "X" },
];

type Status = "done" | "on-track" | "at-risk" | "not-started";
type Filter = "active" | "on-track" | "at-risk" | "done";

const filters: { id: Filter; label: string }[] = [
  { id: "active", label: "Active Goals" },
  { id: "on-track", label: "On track" },
  { id: "at-risk", label: "At risk" },
  { id: "done", label: "Done" },
];

function parseDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function formatDue(iso: string) {
  const date = new Date(parseDate(iso));
  return `${DAYS[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function goalStatus(goal: Goal): Status {
  if (goal.done) return "done";
  if (goal.current <= 0) return "not-started";
  const progress = goal.target > 0 ? goal.current / goal.target : 0;
  const start = parseDate(goal.started);
  const due = parseDate(goal.due);
  const expected =
    due <= start
      ? 1
      : Math.min(1, Math.max(0, (TODAY - start) / (due - start)));
  return progress + 0.1 >= expected ? "on-track" : "at-risk";
}

const statusStyles: Record<Status, { label: string; className: string }> = {
  "not-started": {
    label: "Not started",
    className: "bg-zinc-100 text-zinc-600",
  },
  "on-track": {
    label: "On track",
    className: "bg-emerald-50 text-emerald-700",
  },
  "at-risk": { label: "At risk", className: "bg-red-50 text-red-600" },
  done: { label: "Done", className: "bg-zinc-100 text-zinc-600" },
};

function ChannelAvatar({ channel }: { channel: GoalChannel }) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white";
  switch (channel) {
    case "facebook":
      return (
        <span
          role="img"
          aria-label="Facebook"
          className={`${base} bg-[#1877f2] text-white`}
        >
          f
        </span>
      );
    case "reddit":
      return (
        <span
          role="img"
          aria-label="Reddit"
          className={`${base} bg-orange-500 text-white`}
        >
          r/
        </span>
      );
    case "google":
      return (
        <span
          role="img"
          aria-label="Google"
          className={`${base} bg-white text-[#4285F4] ring-zinc-200`}
        >
          G
        </span>
      );
    default:
      return (
        <span
          role="img"
          aria-label="X"
          className={`${base} bg-zinc-900 text-white`}
        >
          X
        </span>
      );
  }
}

export default function GoalsDrawer({
  goals,
  onAdd,
  onUpdateCurrent,
  onToggleDone,
  onRemove,
}: {
  goals: Goal[];
  onAdd: (goal: {
    title: string;
    target: number;
    unit: "" | "%";
    category: string;
    due: string;
    channels: GoalChannel[];
  }) => void;
  onUpdateCurrent: (id: number, current: number) => void;
  onToggleDone: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const [filter, setFilter] = useState<Filter>("active");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState<"" | "%">("");
  const [category, setCategory] = useState(categories[0]);
  const [due, setDue] = useState("2026-12-31");
  const [channels, setChannels] = useState<GoalChannel[]>(["facebook"]);

  const withStatus = goals.map((goal) => ({ goal, status: goalStatus(goal) }));
  const shown = withStatus.filter(({ status }) =>
    filter === "active" ? status !== "done" : status === filter,
  );
  const heading = filters.find((item) => item.id === filter)?.label ?? "Goals";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(target);
    if (!title.trim() || !Number.isFinite(value) || value <= 0 || !due) return;
    onAdd({
      title: title.trim(),
      target: value,
      unit,
      category,
      due,
      channels,
    });
    setTitle("");
    setTarget("");
    setShowForm(false);
  }

  const inputClass =
    "h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none";

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-[15px] font-semibold text-zinc-900">
          {heading} ({shown.length})
        </p>
        <div className="ml-auto flex items-center gap-1">
          <Dropdown
            align="right"
            width="w-48"
            label="Filter goals"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-label={`Filter goals: ${heading}`}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            )}
          >
            {(close) => (
              <ul>
                {filters.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilter(item.id);
                        close();
                      }}
                      className={menuItemClass}
                    >
                      <span className="flex-1">{item.label}</span>
                      {item.id === filter && (
                        <Check
                          className="h-4 w-4 text-zinc-900"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Dropdown>
          <button
            type="button"
            aria-label="Add goal"
            aria-expanded={showForm}
            aria-controls="add-goal-form"
            onClick={() => setShowForm((value) => !value)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 ${
              showForm
                ? "bg-zinc-900 text-white hover:bg-zinc-700"
                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showForm && (
        <form
          id="add-goal-form"
          onSubmit={submit}
          className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-4"
        >
          <p className="text-sm font-semibold text-zinc-900">Add a goal</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label htmlFor="goal-title" className="sr-only">
              Goal
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Reach 5,000 newsletter subscribers"
              className={`${inputClass} sm:col-span-2`}
            />
            <div className="flex gap-2">
              <label htmlFor="goal-target" className="sr-only">
                Target
              </label>
              <input
                id="goal-target"
                type="number"
                min={1}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                placeholder="Target"
                className={`${inputClass} min-w-0 flex-1`}
              />
              <label htmlFor="goal-unit" className="sr-only">
                Unit
              </label>
              <select
                id="goal-unit"
                value={unit}
                onChange={(event) => setUnit(event.target.value as "" | "%")}
                className={`${inputClass} w-24`}
              >
                <option value="">Count</option>
                <option value="%">Percent</option>
              </select>
            </div>
            <div className="flex gap-2">
              <label htmlFor="goal-category" className="sr-only">
                Category
              </label>
              <select
                id="goal-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`${inputClass} min-w-0 flex-1`}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <label htmlFor="goal-due" className="sr-only">
                Due date
              </label>
              <input
                id="goal-due"
                type="date"
                value={due}
                onChange={(event) => setDue(event.target.value)}
                className={`${inputClass} w-40`}
              />
            </div>
          </div>
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
              Channels
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {channelOptions.map((option) => {
                const active = channels.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setChannels((prev) =>
                        prev.includes(option.id)
                          ? prev.filter((item) => item !== option.id)
                          : [...prev, option.id],
                      )
                    }
                    className={`h-8 cursor-pointer rounded-full border px-3 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={!title.trim() || !target}
              className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add goal
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {shown.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 px-5 py-8 text-center text-sm text-zinc-600">
          Nothing here yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {shown.map(({ goal, status }) => {
            const percent = goal.done
              ? 100
              : Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isExpanded = expanded === goal.id;
            const style = statusStyles[status];
            return (
              <li
                key={goal.id}
                className="rounded-3xl border border-zinc-200 bg-white px-5 py-4"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpanded(isExpanded ? null : goal.id)}
                  className="flex w-full cursor-pointer items-start gap-4 text-left"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                      goal.done
                        ? "bg-zinc-100 text-zinc-500"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                    aria-hidden="true"
                  >
                    {goal.done ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      <TrendingUp className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`line-clamp-2 block text-[17px] leading-snug font-semibold ${
                        goal.done
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900"
                      }`}
                    >
                      {goal.title}
                    </span>
                    <span className="mt-1 block text-sm text-zinc-500">
                      {goal.category} · due: {formatDue(goal.due)}
                    </span>
                    {goal.channels.length > 0 && (
                      <span className="mt-2 flex -space-x-2">
                        {goal.channels.map((channel) => (
                          <ChannelAvatar key={channel} channel={channel} />
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="flex w-36 shrink-0 flex-col items-end gap-2">
                    <span className="text-sm text-zinc-800">
                      target {goal.target.toLocaleString("en-US")}
                      {goal.unit}
                    </span>
                    <span
                      className="h-2 w-full overflow-hidden rounded-full bg-zinc-200"
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${goal.title} progress`}
                    >
                      <span
                        className={`block h-full rounded-full transition-[width] duration-300 ${
                          goal.done ? "bg-emerald-500" : "bg-zinc-900"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-sm font-medium ${style.className}`}
                    >
                      {style.label}
                    </span>
                  </span>
                </button>
                {isExpanded && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
                    <label
                      htmlFor={`goal-current-${goal.id}`}
                      className="text-sm text-zinc-600"
                    >
                      Current
                    </label>
                    <input
                      id={`goal-current-${goal.id}`}
                      type="number"
                      min={0}
                      value={goal.current}
                      disabled={goal.done}
                      onChange={(event) =>
                        onUpdateCurrent(goal.id, Number(event.target.value))
                      }
                      className="h-9 w-28 rounded-lg border border-zinc-200 px-2 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-300 focus:outline-none disabled:bg-zinc-50 disabled:text-zinc-400"
                    />
                    <span className="text-sm text-zinc-600">
                      of {goal.target.toLocaleString("en-US")}
                      {goal.unit} · {percent}%
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleDone(goal.id)}
                        className="h-9 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-100"
                      >
                        {goal.done ? "Reopen" : "Mark done"}
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove goal: ${goal.title}`}
                        onClick={() => onRemove(goal.id)}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
