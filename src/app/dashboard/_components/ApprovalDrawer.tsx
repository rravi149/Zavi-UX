"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import {
  BookOpen,
  MessageSquare,
  CalendarDays,
  Check,
  Eye,
  FileSearch,
  Image as ImageIcon,
  ListChecks,
  Play,
  Minus,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import type { ApprovalRequest } from "./types";
import {
  addDays,
  confidenceTone,
  daysBetween,
  formatChange,
  formatDate,
  formatMoney,
  formatPercent,
  formatRange,
  summarize,
  type DailyMetric,
  type PeriodSummary,
} from "./metrics";

function actionVerb(title: string): string {
  const beforeQuote = title.split(/["“”]/)[0].trim();
  const phrase = beforeQuote.replace(/\s+(on|in|for|from|to)$/i, "").trim();
  return phrase || title;
}

function leadingNumber(text: string): number | null {
  const match = text.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function impactIcon(label: string): ComponentType<{ className?: string }> {
  const key = label.toLowerCase();
  if (/spent|spend|budget|amount/.test(key)) return Wallet;
  if (/cost|cpa|cpm|cpc|price/.test(key)) return Receipt;
  if (/purchase|conversion|booking|signup|result/.test(key)) return ShoppingBag;
  return TrendingUp;
}

function impactTrend(
  before: string,
  value: string,
): { icon: ComponentType<{ className?: string }>; tone: string } {
  const from = leadingNumber(before);
  const to = leadingNumber(value);
  if (from === null || to === null || from === to) {
    return { icon: Minus, tone: "text-zinc-400" };
  }
  const up = to > from;
  return {
    icon: up ? TrendingUp : TrendingDown,
    tone: up ? "text-emerald-600" : "text-red-600",
  };
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <h4 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
      <Icon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
      {children}
    </h4>
  );
}

const toneClass: Record<string, string> = {
  good: "text-emerald-700",
  bad: "text-red-700",
  neutral: "text-zinc-600",
};

type MetricRow = {
  label: string;
  read: (summary: PeriodSummary) => number | null;
  format: (value: number) => string;
  better?: "up" | "down";
};

function DateComparison({
  daily,
  resultNoun,
}: {
  daily: DailyMetric[];
  resultNoun: string;
}) {
  const dataStart = daily[0].date;
  const dataEnd = daily[daily.length - 1].date;
  const totalDays = daysBetween(dataStart, dataEnd);
  const presets = [7, 14, 30].filter((days) => days <= totalDays);
  if (presets.length === 0) presets.push(totalDays);

  const [preset, setPreset] = useState<number | "custom">(presets[0]);
  const [customStart, setCustomStart] = useState(
    addDays(dataEnd, -(presets[0] - 1)),
  );
  const [customEnd, setCustomEnd] = useState(dataEnd);

  const end = preset === "custom" ? customEnd : dataEnd;
  const start = preset === "custom" ? customStart : addDays(dataEnd, -(preset - 1));
  const valid = start <= end;
  const length = valid ? daysBetween(start, end) : 0;
  const prevEnd = addDays(start, -1);
  const prevStart = addDays(prevEnd, -(length - 1));
  const current = valid ? summarize(daily, start, end) : null;
  const previous = valid ? summarize(daily, prevStart, prevEnd) : null;

  const singular = resultNoun.replace(/s$/, "");
  const rows: MetricRow[] = [
    { label: "Money spent", read: (s) => s.spend, format: (v) => formatMoney(v) },
    {
      label: resultNoun.charAt(0).toUpperCase() + resultNoun.slice(1),
      read: (s) => s.results,
      format: (v) => v.toLocaleString("en-US"),
      better: "up",
    },
    {
      label: `Cost per ${singular}`,
      read: (s) => s.costPerResult,
      format: (v) => formatMoney(v, true),
      better: "down",
    },
    {
      label: "People who clicked",
      read: (s) => s.ctr,
      format: (v) => formatPercent(v),
      better: "up",
    },
    {
      label: "Cost per 1,000 views",
      read: (s) => s.cpm,
      format: (v) => formatMoney(v, true),
      better: "down",
    },
  ];

  const chip = (active: boolean) =>
    `h-9 cursor-pointer rounded-lg px-3 text-sm font-semibold transition-colors duration-200 ${
      active
        ? "bg-zinc-900 text-white"
        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
    }`;

  return (
    <section className="mt-6 border-t border-zinc-200 pt-6">
      <SectionTitle icon={CalendarDays}>Compare by date</SectionTitle>
      <p className="mt-1 text-sm text-zinc-500">
        Pick a period to compare it with the one right before it. Data covers{" "}
        {formatRange(dataStart, dataEnd, true)}.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {presets.map((days) => (
          <button
            key={days}
            type="button"
            aria-pressed={preset === days}
            onClick={() => setPreset(days)}
            className={chip(preset === days)}
          >
            Last {days} days
          </button>
        ))}
        <button
          type="button"
          aria-pressed={preset === "custom"}
          onClick={() => setPreset("custom")}
          className={chip(preset === "custom")}
        >
          Custom dates
        </button>
      </div>

      {preset === "custom" && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            From
            <input
              type="date"
              value={customStart}
              min={dataStart}
              max={dataEnd}
              onChange={(event) => setCustomStart(event.target.value)}
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            To
            <input
              type="date"
              value={customEnd}
              min={dataStart}
              max={dataEnd}
              onChange={(event) => setCustomEnd(event.target.value)}
              className="h-10 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900"
            />
          </label>
          {!valid && (
            <p className="text-sm font-medium text-red-700">
              The start date must be on or before the end date.
            </p>
          )}
        </div>
      )}

      {valid && (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Metric</th>
                <th className="px-3 py-2 text-right font-medium whitespace-nowrap">
                  <span className="font-semibold text-zinc-900">
                    {formatRange(prevStart, prevEnd)}
                  </span>
                  {" · "}Before
                </th>
                <th className="px-3 py-2 text-right font-medium whitespace-nowrap">
                  <span className="font-semibold text-zinc-900">
                    {formatRange(start, end)}
                  </span>
                  {" · "}Selected
                </th>
                <th className="px-3 py-2 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map((row) => {
                const before = previous ? row.read(previous) : null;
                const after = current ? row.read(current) : null;
                const change = formatChange(before, after);
                let tone = "neutral";
                if (change && change !== "0%" && row.better && before !== null && after !== null) {
                  tone = (after > before) === (row.better === "up") ? "good" : "bad";
                }
                return (
                  <tr key={row.label}>
                    <td className="px-3 py-2 font-medium text-zinc-600">{row.label}</td>
                    <td className="px-3 py-2 text-right text-zinc-700">
                      {before === null ? "—" : row.format(before)}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-zinc-900">
                      {after === null ? "—" : row.format(after)}
                    </td>
                    <td className={`px-3 py-2 text-right font-semibold ${toneClass[tone]}`}>
                      {change ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {valid && !previous && (
        <p className="mt-2 text-sm text-zinc-500">
          Nothing to compare against yet — delivery started on {formatDate(dataStart)}.
        </p>
      )}
      {valid && previous && previous.days < length && (
        <p className="mt-2 text-sm text-zinc-500">
          Only {previous.days} of {length} days are available before {formatDate(start)}, so
          the “before” column covers {formatRange(dataStart, prevEnd)}.
        </p>
      )}
    </section>
  );
}

export default function ApprovalDrawer({
  request,
  expanded = false,
  onClose,
  onAskZavi,
}: {
  request: ApprovalRequest;
  expanded?: boolean;
  onClose: () => void;
  onAskZavi: (text: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const verb = request.actionLabel ?? actionVerb(request.title);
  const hasData =
    Boolean(request.preview) ||
    request.impact.length > 0 ||
    Boolean(request.evidence) ||
    Boolean(request.daily && request.daily.length > 0);
  const twoColumn = expanded && hasData;

  function approve() {
    request.onApprove();
    onClose();
  }

  function reject() {
    request.onDismiss();
    onClose();
  }

  const whySection = (
    <section
      className={`rounded-2xl border border-zinc-200 bg-zinc-50 p-4 ${twoColumn ? "" : "mt-5"}`}
    >
      <SectionTitle icon={ShieldCheck}>Why this needs your approval</SectionTitle>
      <p className="mt-2 text-sm leading-relaxed font-medium text-zinc-700">{request.why}</p>
    </section>
  );

  const planSection = (
    <section className="mt-6 border-t border-zinc-200 pt-6">
      <SectionTitle icon={ListChecks}>What happens when you approve</SectionTitle>
      <ol className="mt-3 space-y-2">
        {request.plan.map((step, index) => (
          <li
            key={step}
            className="flex items-start gap-3 text-sm leading-relaxed font-medium text-zinc-700"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );

  const creativeSection = request.creative ? (
    <section className="mt-6 border-t border-zinc-200 pt-6">
      <SectionTitle icon={ImageIcon}>Ad preview</SectionTitle>
      <div className="mt-3 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
          <img
            src={request.creative.image}
            alt={request.creative.caption}
            className="h-full w-full object-cover"
          />
          {request.creative.kind === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <Play className="h-8 w-8 fill-white text-white" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">
            {request.creative.caption}
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-600">
            {request.creative.kind === "video" ? "Video ad" : "Image ad"} · currently live
          </p>
        </div>
      </div>
    </section>
  ) : null;

  const previewSection = request.preview ? (
    <section className="mt-6 border-t border-zinc-200 pt-6">
      <SectionTitle icon={Eye}>{request.preview.label}</SectionTitle>
      <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed whitespace-pre-line text-zinc-800">
        {request.preview.body}
      </div>
    </section>
  ) : null;

  const impactSection =
    request.impact.length > 0 ? (
      <section className="mt-6 border-t border-zinc-200 pt-6">
        <SectionTitle icon={TrendingUp}>Expected impact</SectionTitle>
        {request.impactPeriod && (
          <p className="mt-1 text-sm font-medium text-zinc-600">
            <span className="font-semibold text-zinc-900">
              {request.impactPeriod.after.range}
            </span>
            {" · "}
            {request.impactPeriod.after.note}, compared with {request.impactPeriod.before.range}
            {" · "}
            {request.impactPeriod.before.note}
          </p>
        )}
        <ul className="mt-3 grid gap-3">
          {request.impact.map((stat) => {
            const Icon = impactIcon(stat.label);
            const trend = stat.before
              ? impactTrend(stat.before, stat.value)
              : null;
            const TrendIcon = trend?.icon;
            return (
              <li
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900">{stat.label}</p>
                  {stat.before && trend && TrendIcon && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-zinc-600">
                      <span className="truncate">
                        was {stat.before}
                        {request.impactPeriod && ` · ${request.impactPeriod.before.range}`}
                      </span>
                      <TrendIcon className={`h-4 w-4 shrink-0 ${trend.tone}`} aria-hidden="true" />
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-2xl leading-tight font-bold tracking-tight text-zinc-900">
                  {stat.value}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    ) : null;

  const evidenceSection = request.evidence ? (
    <section className="mt-6 border-t border-zinc-200 pt-6">
      <SectionTitle icon={FileSearch}>Evidence</SectionTitle>
      <div className="mt-3 rounded-2xl border border-zinc-200">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
          <p className="text-sm font-semibold text-zinc-800">What Zavi looked at</p>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold ${confidenceTone(request.evidence.confidence).badge}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${confidenceTone(request.evidence.confidence).dot}`}
              aria-hidden="true"
            />
            {request.evidence.confidence}
          </span>
        </div>
        <dl className="divide-y divide-zinc-100">
          {request.evidence.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
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
    </section>
  ) : null;

  const compareSection =
    request.daily && request.daily.length > 0 ? (
      <DateComparison
        daily={request.daily}
        resultNoun={request.resultNoun ?? "results"}
      />
    ) : null;

  const sourcesSection = (
    <section className="mt-6 border-t border-zinc-200 pt-6">
      <SectionTitle icon={BookOpen}>Based on</SectionTitle>
      <ul className="mt-3 flex flex-wrap gap-2">
        {request.sources.map((source) => (
          <li
            key={source}
            className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700"
          >
            {source}
          </li>
        ))}
      </ul>
    </section>
  );

  const footer = (
    <div className="sticky bottom-0 -mx-6 -mb-5 mt-auto flex shrink-0 flex-col gap-3 border-t border-zinc-200 bg-white px-6 py-4">
      {confirming && (
        <p className="text-sm font-medium text-zinc-700">
          {verb} now? {request.undo}
        </p>
      )}
      <div className="flex items-center gap-2">
        {confirming ? (
          <>
            <button
              type="button"
              onClick={approve}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Yes, {verb.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label={`${verb} — review before Zavi applies this change`}
              title={`${verb} — review before Zavi applies this change`}
              onClick={() => setConfirming(true)}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              {verb}
            </button>
            <button
              type="button"
              onClick={reject}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Reject
            </button>
            <button
              type="button"
              aria-label="Ask Zavi about this"
              title="Ask Zavi about this"
              onClick={() => {
                onAskZavi(`About "${request.title}" — `);
                onClose();
              }}
              className="ml-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (twoColumn) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0">
          <h3 className="text-2xl leading-snug font-bold text-zinc-900">
            {request.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{request.detail}</p>
        </div>
        <div className="mt-5 grid min-h-0 flex-1 grid-cols-12 grid-rows-[minmax(0,1fr)] gap-x-10">
          <div className="col-span-5 min-h-0 overflow-y-auto pb-8">
            {whySection}
            {planSection}
            {sourcesSection}
          </div>
          <div className="col-span-7 min-h-0 overflow-y-auto pb-8 [&>*:first-child]:mt-0 [&>*:first-child]:border-t-0 [&>*:first-child]:pt-0">
            {creativeSection}
            {previewSection}
            {impactSection}
            {evidenceSection}
            {compareSection}
          </div>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="pb-8">
        <h3 className="text-2xl leading-snug font-bold text-zinc-900">
          {request.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{request.detail}</p>
        {whySection}
        {planSection}
        {creativeSection}
        {previewSection}
        {impactSection}
        {evidenceSection}
        {compareSection}
        {sourcesSection}
      </div>
      {footer}
    </div>
  );
}
