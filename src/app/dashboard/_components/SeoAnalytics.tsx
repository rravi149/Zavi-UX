"use client";

import { Fragment, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  CircleHelp,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { Dropdown, menuItemClass } from "./Dropdown";
import { BarChart } from "./BarChart";

type Severity = "High" | "Medium" | "Low";

type Issue = {
  id: string;
  group: string;
  hint: string;
  title: string;
  detail: string;
  severity: Severity;
};

const seedIssues: Issue[] = [
  {
    id: "sitemap-auth",
    group: "Crawlability and Sitemap",
    hint: "Whether search engines can reach and list every page you publish.",
    title:
      "/premium is in the sitemap but gated behind auth — Googlebot sees a spinner or redirect",
    detail:
      "Serve a public preview of /premium, or drop it from the sitemap so the crawl budget goes to pages that can be indexed.",
    severity: "High",
  },
  {
    id: "spa-metadata",
    group: "SPA Rendering and Canonical Tags",
    hint: "Whether metadata exists in the HTML response, not just after hydration.",
    title:
      "Blog post and blog list metadata is injected client-side only — invisible to social bots and AI crawlers",
    detail:
      "Move the title, description, and canonical tag into the server-rendered head so crawlers read them on the first response.",
    severity: "High",
  },
  {
    id: "structured-author",
    group: "Structured Data",
    hint: "Whether your schema markup matches what Google expects.",
    title:
      "Article structured data uses Organization as author — Google recommends Person for editorial content",
    detail:
      "Set author to a Person with a name and profile URL on every article.",
    severity: "Low",
  },
  {
    id: "lastmod-future",
    group: "Crawlability",
    hint: "Signals that tell crawlers how fresh a page is.",
    title:
      "Both sitemaps contain lastmod dates set in the future — Google will distrust all freshness signals",
    detail:
      "Generate lastmod from the real publish or update timestamp and never post-date it.",
    severity: "Low",
  },
];

const severityStyles: Record<Severity, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-zinc-100 text-zinc-700",
};

const ranges = ["Past one week", "Past 30 days", "Past 3 months"];

const searchQueries = [
  {
    query: "online tutors",
    clicks: 412,
    impressions: 9840,
    ctr: "4.2%",
    position: 7.4,
  },
  {
    query: "dashboard templates",
    clicks: 268,
    impressions: 6120,
    ctr: "4.4%",
    position: 5.1,
  },
  {
    query: "apna tutor",
    clicks: 190,
    impressions: 2310,
    ctr: "8.2%",
    position: 2.3,
  },
  {
    query: "react admin ui kit",
    clicks: 144,
    impressions: 5380,
    ctr: "2.7%",
    position: 9.8,
  },
];

const breakdowns: { title: string; rows: [string, number][] }[] = [
  {
    title: "Top Pages",
    rows: [
      ["/gallery", 702],
      ["/", 641],
      ["/pricing", 288],
      ["/blog/dashboard-patterns", 147],
      ["/t/nimbus-analytics", 74],
    ],
  },
  {
    title: "Top Referrers",
    rows: [
      ["google.com", 1076],
      ["bing.com", 300],
      ["reddit.com", 224],
      ["x.com", 158],
      ["Direct", 94],
    ],
  },
  {
    title: "Top Countries",
    rows: [
      ["United States", 844],
      ["India", 371],
      ["United Kingdom", 258],
      ["Canada", 174],
      ["Germany", 105],
    ],
  },
  {
    title: "Top Browsers",
    rows: [
      ["Chrome", 1198],
      ["Safari", 371],
      ["Edge", 168],
      ["Firefox", 87],
      ["Other", 28],
    ],
  },
  {
    title: "Top Devices",
    rows: [
      ["Desktop", 1092],
      ["Mobile", 664],
      ["Tablet", 96],
    ],
  },
];

const visitorDays = [
  { label: "Aug 27", value: 208 },
  { label: "Aug 28", value: 244 },
  { label: "Aug 29", value: 196 },
  { label: "Aug 30", value: 271 },
  { label: "Aug 31", value: 318 },
  { label: "Sep 1", value: 294 },
  { label: "Sep 2", value: 321 },
];

const cardClass = "rounded-2xl border border-zinc-200 bg-white";
const primaryButtonClass =
  "flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400";
const secondaryButtonClass =
  "h-8 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400";

function HelpTip({ label, text }: { label: string; text: string }) {
  return (
    <Dropdown
      label={label}
      width="w-64"
      trigger={({ open, toggle, id }) => (
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={id}
          onClick={toggle}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
      )}
    >
      {() => (
        <p className="p-1 text-sm leading-relaxed font-normal text-zinc-700">
          {text}
        </p>
      )}
    </Dropdown>
  );
}

export default function SeoAnalytics({ range }: { range: string }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [resolved, setResolved] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(seedIssues[0].id);
  const [advancedSetUp, setAdvancedSetUp] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState(ranges[0]);

  const open = seedIssues.filter((issue) => !resolved.includes(issue.id));
  const highOpen = open.filter((issue) => issue.severity === "High").length;
  const rating =
    highOpen > 0 ? "NEEDS WORK" : open.length > 0 ? "HEALTHY" : "EXCELLENT";
  const ratingClass =
    highOpen > 0
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700";

  const groups = useMemo(() => {
    const map = new Map<string, { hint: string; issues: Issue[] }>();
    for (const issue of seedIssues) {
      const entry = map.get(issue.group) ?? { hint: issue.hint, issues: [] };
      entry.issues.push(issue);
      map.set(issue.group, entry);
    }
    return [...map.entries()];
  }, []);

  function connect() {
    setConnecting(true);
    window.setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 900);
  }

  function fixGroup(groupIssues: Issue[]) {
    setResolved((prev) => [
      ...prev,
      ...groupIssues
        .map((issue) => issue.id)
        .filter((id) => !prev.includes(id)),
    ]);
  }

  const visitors = visitorDays.reduce((sum, day) => sum + day.value, 0);

  return (
    <div className="@container space-y-5">
      <section className={`${cardClass} p-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
              />
            </svg>
          </span>
          <div className="min-w-[12rem] flex-1">
            <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-zinc-900">
              Google Search Console
              {connected && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Connected
                </span>
              )}
            </p>
            <p className="truncate text-sm text-zinc-600">
              {connected
                ? `Queries, clicks and positions for ${range.toLowerCase()}`
                : "Connect to pull real queries, clicks and average position."}
            </p>
          </div>
          {connected ? (
            <button
              type="button"
              onClick={() => setConnected(false)}
              className="h-9 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-100"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              className={primaryButtonClass}
            >
              {connecting && (
                <RefreshCw
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {connecting ? "Connecting…" : "Connect"}
            </button>
          )}
        </div>

        {connected && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th scope="col" className="px-3 py-2.5 text-left font-medium">
                    Query
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-medium"
                  >
                    Clicks
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-medium"
                  >
                    Impressions
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-medium"
                  >
                    CTR
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-right font-medium"
                  >
                    Position
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {searchQueries.map((row) => (
                  <tr key={row.query}>
                    <th
                      scope="row"
                      className="px-3 py-2.5 text-left font-medium text-zinc-900"
                    >
                      {row.query}
                    </th>
                    <td className="px-3 py-2.5 text-right text-zinc-800 tabular-nums">
                      {row.clicks}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-800 tabular-nums">
                      {row.impressions.toLocaleString("en-US")}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-800 tabular-nums">
                      {row.ctr}
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-800 tabular-nums">
                      {row.position.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={cardClass}>
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
          <h3 className="text-xl font-semibold text-zinc-900">SEO Rating</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${ratingClass}`}
          >
            {rating}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-left font-medium">
                  Issues
                </th>
                <th
                  scope="col"
                  className="w-24 px-3 py-2.5 text-left font-medium"
                >
                  Severity
                </th>
                <th
                  scope="col"
                  className="w-32 px-3 py-2.5 text-left font-medium"
                >
                  Status
                </th>
                <th scope="col" className="w-40 px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setResolved(seedIssues.map((issue) => issue.id))
                    }
                    disabled={open.length === 0}
                    className="h-8 cursor-pointer rounded-lg bg-zinc-900 px-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                  >
                    Fix all with Agent
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {groups.map(([group, entry]) => {
                const groupOpen = entry.issues.filter(
                  (issue) => !resolved.includes(issue.id),
                );
                return (
                  <Fragment key={group}>
                    <tr className="bg-white">
                      <th
                        scope="row"
                        colSpan={3}
                        className="px-4 py-3 text-left font-medium text-zinc-900"
                      >
                        <span className="flex items-center gap-2">
                          {group}
                          <HelpTip label={`About ${group}`} text={entry.hint} />
                        </span>
                      </th>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => fixGroup(entry.issues)}
                          disabled={groupOpen.length === 0}
                          className={secondaryButtonClass}
                        >
                          {groupOpen.length === 0 ? "Fixed" : "Fix with Agent"}
                        </button>
                      </td>
                    </tr>
                    {entry.issues.map((issue) => {
                      const isResolved = resolved.includes(issue.id);
                      const isOpen = expanded === issue.id;
                      return (
                        <tr
                          key={issue.id}
                          className={`align-top transition-colors duration-200 ${
                            isOpen ? "bg-zinc-50" : "bg-white"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              onClick={() =>
                                setExpanded(isOpen ? null : issue.id)
                              }
                              className="flex cursor-pointer items-start gap-2 text-left text-zinc-800"
                            >
                              <ChevronDown
                                className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                              />
                              <span className="min-w-0">
                                <span className="block">{issue.title}</span>
                                {isOpen && (
                                  <span className="mt-1 block text-zinc-600">
                                    {issue.detail}
                                  </span>
                                )}
                              </span>
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${severityStyles[issue.severity]}`}
                            >
                              {issue.severity}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            {isResolved ? (
                              <span className="flex items-center gap-1.5 text-emerald-700">
                                <Check className="h-4 w-4" aria-hidden="true" />
                                Resolved
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-zinc-700">
                                <TriangleAlert
                                  className="h-4 w-4 text-amber-500"
                                  aria-hidden="true"
                                />
                                Unresolved
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3" />
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="border-t border-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-600">
          Check how well search engines and AI crawlers can find and understand
          your project, and implement proposed fixes with an agent. The rating
          is based on your published app&apos;s Lighthouse metrics.
        </p>
      </section>

      <section className={`${cardClass} flex flex-wrap items-center gap-3 p-4`}>
        <div className="min-w-[12rem] flex-1">
          <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-zinc-900">
            Advanced analytics
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-sm font-medium text-zinc-700">
              New
            </span>
          </p>
          <p className="mt-0.5 text-sm text-zinc-600">
            {advancedSetUp
              ? "Tracking 3 custom events: signup, template copied, publish."
              : "Track custom events and metrics configured by an agent."}
          </p>
        </div>
        {advancedSetUp ? (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" aria-hidden="true" />
            Set up
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setAdvancedSetUp(true)}
            className={primaryButtonClass}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Set up with Agent
          </button>
        )}
      </section>

      <section className={`${cardClass} p-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[12rem] flex-1">
            <h3 className="text-xl font-semibold text-zinc-900">
              Default analytics
            </h3>
            <p className="mt-0.5 text-sm text-zinc-600">
              Traffic insights based on IP data.
            </p>
          </div>
          <Dropdown
            align="right"
            width="w-56"
            label="Analytics range"
            trigger={({ open: isOpen, toggle, id }) => (
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                {analyticsRange}
                <ChevronDown
                  className="h-4 w-4 text-zinc-500"
                  aria-hidden="true"
                />
              </button>
            )}
          >
            {(close) => (
              <ul>
                {ranges.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        setAnalyticsRange(option);
                        close();
                      }}
                      className={menuItemClass}
                    >
                      <span className="flex-1">{option}</span>
                      {option === analyticsRange && (
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
        </div>

        <div className="mt-3 rounded-xl border border-zinc-200 p-3.5">
          <p className="text-sm text-zinc-600">Visitors</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 tabular-nums">
            {visitors.toLocaleString("en-US")}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            +632 vs previous 7 days (+52%)
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            {visitors.toLocaleString("en-US")} unique IP addresses
          </p>
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-800">
              Visitors over time
            </p>
            <div className="mt-2">
              <BarChart
                height={220}
                labels={visitorDays.map((day) => day.label)}
                values={visitorDays.map((day) => day.value)}
                yLabel="# Visitors"
                xLabel="Time"
                format={(value) => Math.round(value).toLocaleString("en-US")}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {breakdowns.map((breakdown) => {
            const max = Math.max(...breakdown.rows.map(([, value]) => value));
            return (
              <div
                key={breakdown.title}
                className="rounded-xl border border-zinc-200 p-3.5"
              >
                <p className="text-sm font-semibold text-zinc-900">
                  {breakdown.title}
                </p>
                <ul className="mt-3 space-y-1">
                  {breakdown.rows.map(([label, value]) => (
                    <li
                      key={label}
                      className="relative flex h-9 items-center gap-3 overflow-hidden rounded-md px-2 text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 rounded-md bg-sky-100"
                        style={{ width: `${Math.round((value / max) * 100)}%` }}
                      />
                      <span className="relative min-w-0 flex-1 truncate text-zinc-800">
                        {label}
                      </span>
                      <span className="relative shrink-0 font-medium text-zinc-900 tabular-nums">
                        {value.toLocaleString("en-US")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
