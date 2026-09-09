"use client";

// The Growth plan surface, matching the shipped product.
//
// Mirrors praxis `components/workspace/growth/GrowthCommandCenter.tsx` and its
// sub-components (origin/main, 2026-09-08; PRs #2499 "the plan could be
// drafted, never accepted, and never redone" and #2501 "accepting a plan is
// what puts channels to work"). Section order, copy and states are the live
// ones; the data is local and the writes are simulated.
//
// THE ONE STATE THAT OWES A DECISION is a draft the founder has not accepted:
// until they do, the plan steers nothing. Accepting is what puts the plan's
// channels to work, which is why "What Zavi is working on" is empty before the
// accept and populated after it.
//
// THREE COLOR TREATMENTS, switched in the header (`data-gp-theme`, tokens in
// globals.css). They are not three paint jobs. Each spends color on a
// different thing:
//   paper  · none. The neutral control.
//   signal · color is DATA STATE. Readable / unreadable / not connected get a
//            fixed three-step scale, and one violet is reserved for the single
//            thing waiting on the founder. The hero carries the North Star
//            reversed out of deep pine-teal, and nothing else shouts.
//   fleet  · color is THE CHANNEL. Platform brand colors run from the channel
//            rows into the coverage bar and the hero's top edge; every decision
//            stays strictly black and white.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  Database,
  Megaphone,
  Pencil,
  Plus,
  Radio,
  SearchCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import {
  SiGoogleads,
  SiInstagram,
  SiMeta,
  SiReddit,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { Panel, PanelHeader } from "./Panel";
import {
  growthPlanData,
  type GrowthChannel,
  type GrowthGoal,
  type GrowthMetric,
  type GrowthPlanPayload,
} from "./growthPlan";
import {
  attentionItems,
  formatDate,
  formatValue,
  goalProgress,
  humanize,
} from "./growthPresentation";

/* -------------------------------------------------------------- treatments */

const THEMES = [
  { id: "paper", label: "Paper", swatch: "#e4e4e7" },
  { id: "signal", label: "Signal", swatch: "#0e3b43" },
  { id: "fleet", label: "Fleet", swatch: "#ff4500" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
const THEME_KEY = "zavi.growth.theme";

/* ---------------------------------------------------------------- channels */

const channelLogos: Record<
  string,
  { icon: LucideIcon | typeof SiMeta; color: string }
> = {
  meta_ads: { icon: SiMeta, color: "#0064E0" },
  google_ads: { icon: SiGoogleads, color: "#4285F4" },
  linkedin_ads: { icon: FaLinkedin, color: "#0A66C2" },
  reddit_ads: { icon: SiReddit, color: "#FF4500" },
  reddit_organic: { icon: SiReddit, color: "#FF4500" },
  tiktok_ads: { icon: SiTiktok, color: "#111111" },
  youtube_ads: { icon: SiYoutube, color: "#FF0000" },
  youtube_organic: { icon: SiYoutube, color: "#FF0000" },
  instagram_organic: { icon: SiInstagram, color: "#E1306C" },
  seo: { icon: SearchCheck, color: "#0284C7" },
  geo: { icon: Sparkles, color: "#7C3AED" },
  influencer: { icon: Megaphone, color: "#059669" },
};

function channelOf(slug: string) {
  return channelLogos[slug.replace(/[-.]/g, "_")];
}

function ChannelLabel({ slug, muted }: { slug: string; muted?: boolean }) {
  const logo = channelOf(slug);
  const Icon = logo?.icon ?? Radio;
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        style={{ backgroundColor: muted ? undefined : (logo?.color ?? "#a1a1aa") }}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
          muted ? "bg-[var(--gp-track)] text-[var(--gp-ink-soft)]" : ""
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="whitespace-nowrap">{humanize(slug)}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ pieces */

function Button({
  children,
  onClick,
  disabled,
  primary,
  className = "",
  ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  className?: string;
  "aria-expanded"?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200 disabled:cursor-default disabled:opacity-40 ${
        primary
          ? "border-[var(--gp-decide)] bg-[var(--gp-decide)] text-[var(--gp-decide-ink)] hover:opacity-90"
          : "border-[var(--gp-line-strong)] bg-transparent text-[var(--gp-ink)] hover:bg-[var(--gp-track)]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function SectionHead({
  icon: Icon,
  title,
  meta,
  action,
}: {
  icon: LucideIcon;
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon
        className="h-4 w-4 shrink-0 text-[var(--gp-head-icon)]"
        aria-hidden="true"
      />
      <h2 className="text-[15px] font-semibold text-[var(--gp-ink)]">{title}</h2>
      {meta !== undefined && (
        <span className="text-sm text-[var(--gp-ink-soft)]">{meta}</span>
      )}
      {action && <span className="ml-auto">{action}</span>}
    </div>
  );
}

function Meter({
  value,
  label,
  mosaic,
}: {
  value: number;
  label: string;
  mosaic?: boolean;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--gp-track)]"
    >
      <div
        className={`h-full rounded-full ${mosaic ? "gp-mosaic" : ""}`}
        style={{
          width: `${value}%`,
          backgroundColor: mosaic ? undefined : "var(--gp-measured)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------- goals */

function GoalRow({ goal, onEdit }: { goal: GrowthGoal; onEdit: () => void }) {
  const progress = goalProgress(goal);
  return (
    <div className="grid grid-cols-1 items-center gap-3 border-b border-[var(--gp-line)] py-3.5 last:border-b-0 sm:grid-cols-2">
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-[var(--gp-ink)]">
          {goal.objective}
        </p>
        <p className="mt-0.5 text-sm text-[var(--gp-ink-soft)]">
          {humanize(goal.target_metric)} ·{" "}
          {goal.due_date ? `Due ${formatDate(goal.due_date)}` : "No due date"}
          {goal.status !== "active" && ` · ${humanize(goal.status)}`}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex justify-between gap-2 text-sm tabular-nums">
            <span className="text-[var(--gp-ink)]">
              {formatValue(goal.current_value)}{" "}
              <span className="text-[var(--gp-ink-mute)]">
                / {formatValue(goal.target_value)}
              </span>
            </span>
            <span
              className="text-[var(--gp-ink-soft)]"
              style={
                progress === null && goal.current_value === null
                  ? { color: "var(--gp-unreadable)" }
                  : undefined
              }
            >
              {progress === null
                ? goal.current_value === null
                  ? "Awaiting data"
                  : "No baseline"
                : `${progress}%`}
            </span>
          </div>
          {progress !== null && (
            <Meter value={progress} label={`${goal.objective} progress`} />
          )}
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${goal.objective}`}
          className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-[var(--gp-ink-soft)] transition-colors duration-200 hover:text-[var(--gp-ink)]"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
      </div>
    </div>
  );
}

function GrowthGoals({
  data,
  onOpenGoals,
}: {
  data: GrowthPlanPayload;
  onOpenGoals: () => void;
}) {
  const unavailable = data.unreadable.includes("goals");
  const active = data.goals.items.filter((goal) => goal.status === "active");
  const others = data.goals.items.filter((goal) => goal.status !== "active");
  return (
    <section
      aria-label="Active goals"
      className="mt-8 border-t border-[var(--gp-line)] pt-6"
    >
      <SectionHead
        icon={Target}
        title="Active goals"
        meta={
          unavailable
            ? undefined
            : `${data.goals.active_count}${
                data.goals.max_active === null
                  ? ""
                  : ` / ${data.goals.max_active}`
              }`
        }
        action={
          <Button onClick={onOpenGoals}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add goal
          </Button>
        }
      />
      {unavailable ? (
        <p className="py-3 text-sm text-[var(--gp-ink-soft)]">
          Goals could not be loaded.
        </p>
      ) : (
        <>
          {active.length === 0 && (
            <p className="py-3 text-sm text-[var(--gp-ink-soft)]">
              No active goals. Add a measurable outcome to track.
            </p>
          )}
          {active.map((goal) => (
            <GoalRow key={goal.id} goal={goal} onEdit={onOpenGoals} />
          ))}
          {others.length > 0 && (
            <details className="mt-2 text-sm text-[var(--gp-ink-soft)]">
              <summary className="cursor-pointer py-2">
                Other goals · {others.length}
              </summary>
              {others.map((goal) => (
                <GoalRow key={goal.id} goal={goal} onEdit={onOpenGoals} />
              ))}
            </details>
          )}
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------- needs attention */

function NeedsAttention({
  data,
  onViewChannels,
  onDiscuss,
}: {
  data: GrowthPlanPayload;
  onViewChannels: () => void;
  onDiscuss?: () => void;
}) {
  const items = attentionItems(data);
  const partial = data.unreadable.some((part) =>
    ["bets", "channels", "goals"].includes(part),
  );
  return (
    <section
      aria-label="Needs Attention"
      className="mt-8 border-t border-[var(--gp-line)] pt-6"
    >
      <SectionHead
        icon={CircleAlert}
        title="Needs Attention"
        meta={`${items.length}${partial ? "+ · partial view" : ""}`}
      />
      {items.length === 0 && (
        <p className="py-2 text-sm text-[var(--gp-ink-soft)]">
          {data.unreadable.length
            ? "No actions in the available data."
            : "No open blockers or decisions."}
        </p>
      )}
      <div className="divide-y divide-[var(--gp-line)]">
        {items.map((item) => (
          <div key={item.id} className="py-3">
            <div className="flex items-start gap-2.5">
              {/* The rail says who owes the move: you, or Zavi. */}
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    item.owner === "You"
                      ? "var(--gp-decide-quiet)"
                      : "var(--gp-none)",
                }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold text-[var(--gp-ink)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--gp-ink-soft)]">
                  {item.detail ||
                    "Discuss this proposal with your growth officer."}
                </p>
                {item.preview && (
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <p className="min-w-0 text-sm text-[var(--gp-ink-mute)]">
                      {item.preview}
                    </p>
                    <button
                      type="button"
                      onClick={onViewChannels}
                      className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-[var(--gp-ink-soft)] transition-colors duration-200 hover:text-[var(--gp-ink)]"
                    >
                      View channels
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {item.owner === "You" && onDiscuss && (
                  <button
                    type="button"
                    onClick={onDiscuss}
                    className="mt-1.5 flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                    style={{ color: "var(--gp-decide-quiet)" }}
                  >
                    Discuss decision
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- channel review */

const executionLabels: Record<string, string> = {
  delivered: "Delivered",
  running: "Running",
  needs_review: "Needs review",
  idle: "Cycle complete",
};
const measurementLabels: Record<GrowthChannel["metric_availability"], string> = {
  measured: "Readable",
  unavailable: "Unavailable",
  none: "Not connected",
};
const measurementColor: Record<GrowthChannel["metric_availability"], string> = {
  measured: "var(--gp-measured)",
  unavailable: "var(--gp-unreadable)",
  none: "var(--gp-none)",
};

function ChannelReview({
  channels,
  metrics,
  unavailable,
  metricsUnavailable,
  reviewRef,
  showAll,
  onToggleAll,
  fleet,
}: {
  channels: GrowthChannel[];
  metrics: GrowthMetric[];
  unavailable: boolean;
  metricsUnavailable: boolean;
  reviewRef: RefObject<HTMLElement | null>;
  showAll: boolean;
  onToggleAll: () => void;
  fleet: boolean;
}) {
  const sorted = [...channels].sort(
    (a, b) =>
      Number(Boolean(b.last_run_at)) - Number(Boolean(a.last_run_at)) ||
      a.slug.localeCompare(b.slug),
  );
  const visible = showAll ? sorted : sorted.slice(0, 6);
  return (
    <section
      ref={reviewRef}
      tabIndex={-1}
      aria-label="Channel review"
      className="mt-8 scroll-mt-4 border-t border-[var(--gp-line)] pt-6 focus-visible:outline-none"
    >
      <SectionHead
        icon={Radio}
        title="Channel review"
        action={
          unavailable ? undefined : (
            <span className="text-sm text-[var(--gp-ink-soft)]">
              {channels.filter((channel) => channel.last_run_at).length} of{" "}
              {channels.length} have run
            </span>
          )
        }
      />
      {unavailable ? (
        <p className="text-sm text-[var(--gp-ink-soft)]">
          Channels could not be loaded.
        </p>
      ) : channels.length === 0 ? (
        <p className="text-sm text-[var(--gp-ink-soft)]">
          No channels to review yet.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-[var(--gp-line-strong)] bg-[var(--gp-hero-bg,#fff)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--gp-table-head)] text-[var(--gp-ink-soft)]">
                <tr>
                  {[
                    "Channel",
                    "Execution",
                    "Last run",
                    "Data",
                    "Latest result",
                  ].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-4 py-2.5 font-medium whitespace-nowrap"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gp-line)]">
                {visible.map((channel) => {
                  const values = metricsUnavailable
                    ? []
                    : metrics.filter(
                        (metric) =>
                          channel.metric_keys.includes(metric.key) &&
                          metric.status === "measured" &&
                          metric.value !== null,
                      );
                  const started = Boolean(channel.last_run_at);
                  // Fleet paints the row's own channel down its left edge; the
                  // other treatments leave it off entirely.
                  const edge: CSSProperties = fleet
                    ? {
                        boxShadow: `inset 3px 0 0 0 ${
                          started
                            ? (channelOf(channel.slug)?.color ?? "#14161a")
                            : "#dcdfe5"
                        }`,
                      }
                    : {};
                  return (
                    <tr
                      key={channel.slug}
                      style={edge}
                      className="hover:bg-[var(--gp-track)]"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-semibold whitespace-nowrap text-[var(--gp-ink)]"
                      >
                        <ChannelLabel slug={channel.slug} muted={!started} />
                      </th>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5"
                          style={{
                            color:
                              channel.last_run_status === "delivered"
                                ? "var(--gp-measured)"
                                : "var(--gp-ink-soft)",
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {started
                            ? (executionLabels[channel.last_run_status ?? ""] ??
                              "Ran")
                            : "Not started"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--gp-ink-soft)]">
                        {formatDate(channel.last_run_at)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          style={{
                            color: metricsUnavailable
                              ? "var(--gp-ink-soft)"
                              : measurementColor[channel.metric_availability],
                          }}
                        >
                          {metricsUnavailable
                            ? "Unknown"
                            : measurementLabels[channel.metric_availability]}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[var(--gp-ink)]">
                        {values.length ? (
                          values.map((metric) => (
                            <div key={metric.key}>
                              {formatValue(metric.value, metric.unit)}{" "}
                              <span className="text-[var(--gp-ink-soft)]">
                                {metric.label}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[var(--gp-ink-mute)]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {channels.length > 6 && (
            <Button
              className="mt-3 border-transparent"
              aria-expanded={showAll}
              onClick={onToggleAll}
            >
              {showAll
                ? "Show fewer channels"
                : `View all ${channels.length} channels`}
            </Button>
          )}
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- data health */

function MeasurementCoverage({
  channels,
  unavailable,
  fleet,
}: {
  channels: GrowthChannel[];
  unavailable: boolean;
  fleet: boolean;
}) {
  const measured = channels.filter(
    (channel) => channel.metric_availability === "measured",
  ).length;
  const missing = channels.filter(
    (channel) => channel.metric_availability !== "measured",
  );
  const unconnected = missing.filter(
    (channel) => channel.metric_availability === "none",
  ).length;
  const unreadable = missing.length - unconnected;
  const coverage = channels.length
    ? Math.round((measured / channels.length) * 100)
    : null;
  return (
    <div className="py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-[var(--gp-ink)]">
          Channel measurement coverage
        </h3>
        <span className="tabular-nums text-[var(--gp-ink-soft)]">
          {unavailable
            ? "Unknown"
            : coverage === null
              ? "No channels connected"
              : `${measured} / ${channels.length} channels measured · ${coverage}%`}
        </span>
      </div>
      {!unavailable && coverage !== null && (
        <div className="mt-2">
          <Meter
            value={coverage}
            label="Channel measurement coverage"
            mosaic={fleet}
          />
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[var(--gp-ink-soft)]">
        <p>
          {unavailable
            ? "Measurement data could not be loaded."
            : coverage === null
              ? "Coverage will appear when channels are connected."
              : missing.length === 0
                ? "All channels have readable measurements."
                : `${missing.length} missing measurement${
                    missing.length === 1 ? "" : "s"
                  } · ${unconnected} not connected · ${unreadable} unreadable`}
        </p>
        {(unavailable || missing.length > 0) && (
          <p className="font-semibold text-[var(--gp-ink)]">AI owns follow-up</p>
        )}
      </div>
      {!unavailable && missing.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer font-medium text-[var(--gp-ink-soft)]">
            View channel measurement gaps ({missing.length})
          </summary>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-[var(--gp-line-strong)]">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Channels missing measurements
              </caption>
              <thead className="bg-[var(--gp-table-head)] text-[var(--gp-ink-soft)]">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Channel
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Measurement gap
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gp-line)]">
                {missing.map((channel) => (
                  <tr key={channel.slug}>
                    <th
                      scope="row"
                      className="px-4 py-2.5 font-semibold text-[var(--gp-ink)]"
                    >
                      <ChannelLabel
                        slug={channel.slug}
                        muted={!channel.last_run_at}
                      />
                    </th>
                    <td className="px-4 py-2.5">
                      <span
                        style={{
                          color:
                            measurementColor[channel.metric_availability],
                        }}
                      >
                        {channel.metric_availability === "none"
                          ? "No metric connected"
                          : "Numbers unavailable"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

function DataHealth({
  data,
  fleet,
}: {
  data: GrowthPlanPayload;
  fleet: boolean;
}) {
  const unknown = data.unreadable.includes("metrics");
  const readable = data.metrics.filter(
    (metric) => metric.status === "measured" && metric.value !== null,
  );
  const missingGoals = data.unreadable.includes("goals")
    ? []
    : data.goals.items.filter(
        (goal) => goal.status === "active" && goal.current_value === null,
      );
  return (
    <section
      aria-label="Data Health"
      className="mt-8 border-t border-[var(--gp-line)] pt-6"
    >
      <SectionHead icon={Database} title="Data Health" />
      <MeasurementCoverage
        channels={data.channels}
        unavailable={data.unreadable.includes("channels") || unknown}
        fleet={fleet}
      />
      <details className="border-t border-[var(--gp-line)] pt-3">
        <summary className="cursor-pointer text-sm">
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--gp-ink)]">
              Metric details
            </span>
            <span className="text-[var(--gp-ink-soft)]">
              {unknown
                ? "Metrics unavailable"
                : data.metrics.length === 0
                  ? "No metrics connected"
                  : `${readable.length} / ${data.metrics.length} metrics readable`}
              {missingGoals.length > 0 &&
                ` · ${missingGoals.length} goal${
                  missingGoals.length === 1 ? "" : "s"
                } awaiting data`}
            </span>
          </span>
        </summary>
        <div className="mt-3 divide-y divide-[var(--gp-line)] text-sm">
          {unknown && (
            <p className="py-2 text-[var(--gp-ink-soft)]">
              Metrics could not be loaded. Measurement coverage is unknown.
            </p>
          )}
          {!unknown &&
            data.metrics.map((metric) => {
              const measured =
                metric.status === "measured" && metric.value !== null;
              return (
                <div key={metric.key} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-[var(--gp-ink)]">
                      {metric.label}
                    </span>
                    <span
                      className="tabular-nums"
                      style={{
                        color: measured
                          ? "var(--gp-ink)"
                          : "var(--gp-unreadable)",
                      }}
                    >
                      {measured
                        ? formatValue(metric.value, metric.unit)
                        : "Unavailable"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[var(--gp-ink-soft)]">
                    {metric.source
                      ? humanize(metric.source)
                      : "No source connected"}{" "}
                    · Through {formatDate(metric.window_end)}
                  </p>
                  {metric.denominator && (
                    <p className="mt-0.5 text-[var(--gp-ink-soft)]">
                      {formatValue(metric.denominator.spend, "usd")} spend /{" "}
                      {formatValue(metric.denominator.conversions)} conversions
                    </p>
                  )}
                  {metric.caveat && (
                    <p
                      className="mt-0.5"
                      style={{ color: "var(--gp-unreadable)" }}
                    >
                      {metric.caveat}
                    </p>
                  )}
                </div>
              );
            })}
          {!unknown && data.metrics.length === 0 && (
            <p className="py-2 text-[var(--gp-ink-soft)]">
              No metrics connected yet.
            </p>
          )}
          {missingGoals.length > 0 && (
            <p className="py-3 text-[var(--gp-ink-soft)]">
              Goals awaiting measurement:{" "}
              {missingGoals.map((goal) => goal.objective).join(", ")} · AI owns
              follow-up
            </p>
          )}
        </div>
      </details>
    </section>
  );
}

/* -------------------------------------------------------------------- page */

export default function GrowthPlanPanel({
  onOpenGoals,
  onDiscuss,
}: {
  onOpenGoals: () => void;
  onDiscuss?: () => void;
}) {
  const [data, setData] = useState<GrowthPlanPayload>(growthPlanData);
  const [theme, setTheme] = useState<ThemeId>("paper");
  const [accepting, setAccepting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAllChannels, setShowAllChannels] = useState(false);
  const channelReviewRef = useRef<HTMLElement>(null);

  // The pick survives a reload, so a treatment can be lived with rather than
  // glanced at.
  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved && THEMES.some((option) => option.id === saved))
      setTheme(saved as ThemeId);
  }, []);

  const pickTheme = (id: ThemeId) => {
    setTheme(id);
    window.localStorage.setItem(THEME_KEY, id);
  };

  const fleet = theme === "fleet";
  const plan = data.unreadable.includes("plan") ? null : data.plan;

  /**
   * Accept the drafted strategy.
   *
   * This is the whole point of the page: until it happens the plan steers
   * nothing, and accepting is what puts the plan's channels to work, so the
   * accepted bets appear in "What Zavi is working on" only after this runs.
   */
  const accept = () => {
    setAccepting(true);
    window.setTimeout(() => {
      setData((current) => ({
        ...current,
        plan: current.plan
          ? { ...current.plan, pending_acceptance: false }
          : null,
        bets: current.bets.map((bet) =>
          bet.status === "proposed" && (bet.sort_order ?? 99) <= 2
            ? { ...bet, status: "accepted" }
            : bet,
        ),
      }));
      setAccepting(false);
    }, 500);
  };

  /** Start over: back to question one. Confirmed, because it discards a plan. */
  const startOver = () => {
    setResetting(true);
    window.setTimeout(() => {
      setData((current) => ({ ...current, plan: null, bets: [] }));
      setResetting(false);
      setConfirmReset(false);
    }, 400);
  };

  const metric = data.unreadable.includes("metrics")
    ? undefined
    : data.metrics.find(
        (item) => item.key === plan?.target_metric && item.status === "measured",
      );

  const bets = useMemo(
    () =>
      data.unreadable.includes("bets")
        ? []
        : data.bets.filter(
            (bet) => bet.status === "accepted" || bet.status === "done",
          ),
    [data],
  );

  const viewChannels = () => {
    setShowAllChannels(true);
    channelReviewRef.current?.focus({ preventScroll: true });
    channelReviewRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <Panel>
      <PanelHeader>
        <Target
          className="h-5 w-5 shrink-0 text-[var(--gp-head-icon)]"
          aria-hidden="true"
        />
        <h2 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-zinc-900">
          Growth
        </h2>
        {/* Three treatments to live with, not a settings surface. */}
        <div
          role="group"
          aria-label="Color treatment"
          className="flex shrink-0 items-center gap-1 rounded-lg bg-zinc-100 p-1"
        >
          {THEMES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => pickTheme(option.id)}
              aria-pressed={theme === option.id}
              className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors duration-200 ${
                theme === option.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: option.swatch }}
              />
              {option.label}
            </button>
          ))}
        </div>
      </PanelHeader>

      <div
        data-gp-theme={theme}
        className="min-h-0 flex-1 overflow-y-auto bg-[var(--gp-page)] px-5 py-5 text-[var(--gp-ink)]"
      >
        {data.unreadable.length > 0 && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--gp-unreadable)",
              color: "var(--gp-unreadable)",
            }}
          >
            <CircleAlert className="h-4 w-4" aria-hidden="true" />
            Could not load {data.unreadable.map(humanize).join(", ")}. Missing
            data is unknown.
            <Button className="ml-auto" onClick={() => setData(growthPlanData)}>
              Retry
            </Button>
          </div>
        )}

        <section
          aria-label="Plan and North Star"
          className="overflow-hidden rounded-2xl border"
          style={{
            background: "var(--gp-hero-bg)",
            borderColor: "var(--gp-hero-border)",
            color: "var(--gp-hero-ink)",
          }}
        >
          {/* Fleet's hero wears the fleet: every platform, in its own color. */}
          {fleet && <div className="gp-mosaic h-1.5 w-full" aria-hidden="true" />}
          <div className="px-5 py-5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className="font-medium tracking-widest uppercase"
                style={{ color: "var(--gp-hero-ink-soft)" }}
              >
                The plan
              </span>
              {plan && (
                <span
                  className="ml-auto rounded-full px-2.5 py-0.5"
                  style={
                    plan.pending_acceptance
                      ? {
                          backgroundColor: "var(--gp-chip)",
                          color: "var(--gp-chip-ink)",
                        }
                      : { color: "var(--gp-hero-ink-soft)" }
                  }
                >
                  {plan.pending_acceptance
                    ? "Draft, not accepted yet"
                    : plan.source === "legacy"
                      ? "Accepted strategy"
                      : `Version ${plan.version}`}
                </span>
              )}
            </div>

            <h3 className="mt-3 max-w-3xl text-2xl leading-snug font-semibold tracking-tight">
              {plan?.objective ??
                (data.unreadable.includes("plan")
                  ? "Your plan is temporarily unavailable"
                  : "Your growth plan")}
            </h3>

            {!plan && !data.unreadable.includes("plan") && (
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--gp-hero-ink-soft)" }}
              >
                Define the outcome, identify the constraint, and choose where to
                focus.
              </p>
            )}

            {plan && (
              <div
                className="mt-5 grid gap-5 border-t pt-4 md:grid-cols-2"
                style={{ borderColor: "var(--gp-hero-rule)" }}
              >
                <div>
                  <p
                    className="text-sm font-medium tracking-wide uppercase"
                    style={{ color: "var(--gp-hero-ink-mute)" }}
                  >
                    North Star
                  </p>
                  <p className="mt-2 text-[15px] font-medium">
                    {metric?.label ??
                      (plan.target_metric
                        ? humanize(plan.target_metric)
                        : "Metric not set")}
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                    {metric?.value !== null && metric?.value !== undefined ? (
                      formatValue(metric.value, metric.unit)
                    ) : (
                      <span
                        className="text-sm font-normal"
                        style={{ color: "var(--gp-hero-ink-soft)" }}
                      >
                        Awaiting measurement
                      </span>
                    )}
                  </p>
                  {metric?.denominator && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--gp-hero-ink-soft)" }}
                    >
                      {formatValue(metric.denominator.spend, "usd")} spend /{" "}
                      {formatValue(metric.denominator.conversions)} conversions
                    </p>
                  )}
                  {metric?.caveat && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--gp-hero-ink-mute)" }}
                    >
                      {metric.caveat}
                    </p>
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium tracking-wide uppercase"
                    style={{ color: "var(--gp-hero-ink-mute)" }}
                  >
                    Primary constraint
                  </p>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--gp-hero-ink-soft)" }}
                  >
                    {plan.constraint_statement ?? "Not identified yet."}
                  </p>
                  {plan.constraint_confidence && (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--gp-hero-ink-mute)" }}
                    >
                      {humanize(plan.constraint_confidence)} confidence · AI
                      assessment
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* A draft the founder has not accepted is the ONE state where the
                page owes them a decision, so it says so in words. */}
            {plan?.pending_acceptance && (
              <p
                className="mt-4 text-sm"
                style={{ color: "var(--gp-hero-ink-soft)" }}
              >
                Zavi drafted this. It does not steer any channel until you
                accept it.
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {plan?.pending_acceptance && (
                <button
                  type="button"
                  onClick={accept}
                  disabled={accepting}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--gp-hero-decide)",
                    color: "var(--gp-hero-decide-ink)",
                  }}
                >
                  {accepting ? "Accepting…" : "Accept this plan"}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              {onDiscuss && (
                <button
                  type="button"
                  onClick={onDiscuss}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200"
                  style={{
                    borderColor: "var(--gp-hero-rule)",
                    color: "var(--gp-hero-ink)",
                  }}
                >
                  {plan ? "Discuss plan" : "Draft growth plan"}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              {/* Only offered once a plan exists. Before that the intake is
                  already on screen and there is nothing to start over from. */}
              {plan &&
                (confirmReset ? (
                  <>
                    <button
                      type="button"
                      onClick={startOver}
                      disabled={resetting}
                      className="cursor-pointer text-sm font-medium underline underline-offset-2 disabled:opacity-40"
                      style={{ color: "var(--gp-hero-ink)" }}
                    >
                      {resetting ? "Starting over…" : "Yes, start over"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="cursor-pointer text-sm underline underline-offset-2"
                      style={{ color: "var(--gp-hero-ink-soft)" }}
                    >
                      Keep this plan
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="cursor-pointer text-sm underline underline-offset-2 hover:opacity-80"
                    style={{ color: "var(--gp-hero-ink-soft)" }}
                  >
                    Start over
                  </button>
                ))}
              {confirmReset && (
                <span
                  className="text-sm"
                  style={{ color: "var(--gp-hero-ink-soft)" }}
                >
                  This clears the plan and asks you the three questions again.
                </span>
              )}
              {plan?.updated_at && (
                <span
                  className="text-sm"
                  style={{ color: "var(--gp-hero-ink-mute)" }}
                >
                  Updated {formatDate(plan.updated_at)}
                </span>
              )}
            </div>
          </div>
        </section>

        {bets.length > 0 && (
          <section
            aria-label="What Zavi is working on"
            className="mt-5 rounded-2xl border px-5 py-5"
            style={{
              backgroundColor: "var(--gp-working-bg)",
              borderColor: "var(--gp-working-border)",
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium tracking-widest text-[var(--gp-ink-soft)] uppercase">
                What Zavi is working on
              </span>
              <span className="ml-auto text-[var(--gp-ink-soft)]">
                {bets.length === 1 ? "1 channel" : `${bets.length} channels`}
              </span>
            </div>
            <ol className="mt-4 divide-y divide-[var(--gp-line)]">
              {bets.map((bet) => (
                <li key={bet.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-8 w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor: bet.channel_slug
                        ? (channelOf(bet.channel_slug)?.color ??
                          "var(--gp-measured)")
                        : "var(--gp-measured)",
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[15px] leading-snug font-semibold text-[var(--gp-ink)]">
                      {bet.intent}
                    </p>
                    <p className="mt-1 text-sm text-[var(--gp-ink-soft)]">
                      {bet.channel_slug
                        ? humanize(bet.channel_slug)
                        : "No channel"}
                      {bet.expected_effect && ` · ${bet.expected_effect}`}
                    </p>
                    {bet.falsifier && (
                      <p className="mt-1 text-sm text-[var(--gp-ink-mute)]">
                        Reconsider if: {bet.falsifier}
                      </p>
                    )}
                    {bet.status === "rejected" && bet.rejected_reason && (
                      <p className="mt-1 text-sm text-[var(--gp-ink-mute)]">
                        You said no: {bet.rejected_reason}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <GrowthGoals data={data} onOpenGoals={onOpenGoals} />

        <NeedsAttention
          data={data}
          onViewChannels={viewChannels}
          onDiscuss={onDiscuss}
        />

        <ChannelReview
          reviewRef={channelReviewRef}
          showAll={showAllChannels}
          onToggleAll={() => setShowAllChannels(!showAllChannels)}
          channels={data.channels}
          metrics={data.metrics}
          unavailable={data.unreadable.includes("channels")}
          metricsUnavailable={data.unreadable.includes("metrics")}
          fleet={fleet}
        />

        <DataHealth data={data} fleet={fleet} />

        <details className="mt-8 border-t border-[var(--gp-line)] pt-5 text-sm text-[var(--gp-ink-soft)]">
          <summary className="cursor-pointer">
            Activity ·{" "}
            {data.unreadable.includes("changes")
              ? "Unavailable"
              : data.changes.length
                ? `${data.changes.length} updates`
                : "No changes yet"}
          </summary>
          <div className="mt-2 divide-y divide-[var(--gp-line)]">
            {!data.unreadable.includes("changes") &&
              data.changes.map((change) => (
                <div key={change.id} className="py-2.5">
                  <p className="text-[var(--gp-ink)]">
                    {humanize(change.entity)}
                    {change.field && ` · ${humanize(change.field)}`}
                    {change.old_value && ` · ${change.old_value}`}
                    {change.new_value ? ` → ${change.new_value}` : " changed"}
                  </p>
                  {change.note && <p className="mt-1">{change.note}</p>}
                  <p className="mt-1 text-[var(--gp-ink-mute)]">
                    {formatDate(change.created_at)}
                    {change.actor_kind && ` · ${humanize(change.actor_kind)}`}
                  </p>
                </div>
              ))}
          </div>
        </details>
      </div>
    </Panel>
  );
}
