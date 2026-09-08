"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Dropdown, menuItemClass } from "./Dropdown";
import { AreaChart, type ChartSeries } from "./AreaChart";
import { buildPdf, downloadBlob } from "./pdf";
import {
  adSets as initialAdSets,
  dailyAggregate,
  formatCompact,
  formatDay,
  formatInt,
  formatPercent,
  formatUsd,
  formatUsd2,
  groups,
  insights,
  metricKeys,
  metrics,
  rangeDays,
  strategies,
  sumAggregates,
  type AdPlatform,
  type AdSet,
  type AdSetStatus,
  type Aggregate,
  type Group,
  type Insight,
  type MetricKey,
  type StrategyGroup,
} from "./metaData";

const subTabs = [
  "Meta Dashboard",
  "Targeting Insights",
  "Auction Insights",
  "Geo & Demo Insights",
  "Creative Insights",
  "Ad Sets",
] as const;
type SubTab = (typeof subTabs)[number];

export default function MetaAnalytics({ range }: { range: string }) {
  const [subTab, setSubTab] = useState<SubTab>("Meta Dashboard");

  return (
    <div className="@container">
      <div
        role="tablist"
        aria-label="Meta Ads sections"
        className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-zinc-200/60 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {subTabs.map((tab) => {
          const active = tab === subTab;
          return (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setSubTab(tab)}
              className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[15px] whitespace-nowrap transition-colors duration-200 ${
                active
                  ? "bg-white font-medium text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className="pt-5">
        {subTab === "Meta Dashboard" ? (
          <MetaDashboard range={range} />
        ) : subTab === "Ad Sets" ? (
          <AdSetsTable />
        ) : (
          <InsightTable insight={insights[subTab]} />
        )}
      </div>
    </div>
  );
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`flex items-center gap-0.5 text-sm font-medium ${
        up ? "text-emerald-700" : "text-red-600"
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-zinc-900 tabular-nums">
        {value}
      </dd>
      <dd className="mt-0.5">
        <Delta value={delta} />
      </dd>
    </div>
  );
}

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
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
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

function MetricPicker({
  value,
  onChange,
  label,
}: {
  value: MetricKey;
  onChange: (key: MetricKey) => void;
  label: string;
}) {
  return (
    <Dropdown
      align="right"
      width="w-56"
      label={label}
      trigger={({ open, toggle, id }) => (
        <button
          type="button"
          aria-label={`${label}: ${metrics[value].label}`}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={id}
          onClick={toggle}
          className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium whitespace-nowrap text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
        >
          {metrics[value].label}
          <ChevronDown
            className="h-3.5 w-3.5 text-zinc-500"
            aria-hidden="true"
          />
        </button>
      )}
    >
      {(close) => (
        <ul>
          {metricKeys.map((key) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  onChange(key);
                  close();
                }}
                className={menuItemClass}
              >
                <span className="flex-1">{metrics[key].label}</span>
                {key === value && (
                  <Check className="h-4 w-4 text-zinc-900" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}

const toolbarButtonClass =
  "flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50";

function MetaDashboard({ range }: { range: string }) {
  const days = useMemo(() => rangeDays(range), [range]);
  const daily = useMemo(() => {
    const map: Record<string, Aggregate[]> = {};
    for (const strategy of strategies) {
      map[strategy.id] = days.map((day) => dailyAggregate(strategy, day));
    }
    return map;
  }, [days]);
  const [columns, setColumns] = useState<MetricKey[]>([
    "spend",
    "roas",
    "costPerAdd",
  ]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [lineMetric, setLineMetric] = useState<MetricKey>("roas");
  const [compareMetric, setCompareMetric] = useState<MetricKey>("spend");
  const [drillGroup, setDrillGroup] = useState<StrategyGroup>("acquisition");
  const [notice, setNotice] = useState<string | null>(null);

  const visible = strategies.filter(
    (strategy) => !hidden.includes(strategy.id),
  );
  const rows = visible.map((strategy) => ({
    strategy,
    aggregate: sumAggregates(daily[strategy.id]),
  }));
  const total = sumAggregates(rows.map((row) => row.aggregate));
  const labels = days.map(formatDay);
  const overallDaily = days.map((_, index) =>
    sumAggregates(visible.map((strategy) => daily[strategy.id][index])),
  );
  const spendVsCac: ChartSeries[] = [
    {
      id: "spend",
      label: "Spend ($)",
      color: "#10b981",
      values: overallDaily.map((a) => a.spend),
      format: formatUsd,
      tick: (v) => `$${Math.round(v)}`,
    },
    {
      id: "cac",
      label: "CAC ($)",
      color: "#3b82f6",
      values: overallDaily.map((a) => metrics.costPerPurchase.of(a)),
      format: formatUsd2,
      tick: (v) => `$${Math.round(v)}`,
    },
  ];
  const visibleGroups = groups.filter((group) =>
    visible.some((strategy) => strategy.group === group.id),
  );
  const activeDrill =
    visibleGroups.find((group) => group.id === drillGroup) ?? visibleGroups[0];

  function groupDaily(group: StrategyGroup): Aggregate[] {
    const members = visible.filter((strategy) => strategy.group === group);
    return days.map((_, index) =>
      sumAggregates(members.map((strategy) => daily[strategy.id][index])),
    );
  }

  function toSeries(
    id: string,
    label: string,
    color: string,
    key: MetricKey,
    perDay: Aggregate[],
  ): ChartSeries {
    const metric = metrics[key];
    return {
      id,
      label,
      color,
      values: perDay.map(metric.of),
      format: metric.format,
      tick: metric.tick,
    };
  }

  function overviewSeries(group: Group): ChartSeries[] {
    const perDay = groupDaily(group.id);
    return [
      toSeries(
        lineMetric,
        metrics[lineMetric].label,
        group.color,
        lineMetric,
        perDay,
      ),
      toSeries(
        `${compareMetric}-compare`,
        metrics[compareMetric].label,
        "#a1a1aa",
        compareMetric,
        perDay,
      ),
    ];
  }

  function drilldownSeries(group: Group): ChartSeries[] {
    return visible
      .filter((strategy) => strategy.group === group.id)
      .map((strategy) =>
        toSeries(
          strategy.id,
          strategy.name,
          strategy.color,
          lineMetric,
          daily[strategy.id],
        ),
      );
  }

  const drillTotal = activeDrill
    ? sumAggregates(groupDaily(activeDrill.id))
    : null;

  function exportPdf() {
    const cell = (key: MetricKey, aggregate: Aggregate) =>
      metrics[key].format(metrics[key].of(aggregate));
    const lines = [
      `Date range: ${range}`,
      `Strategies: ${visible.map((s) => s.name).join(", ") || "none"}`,
      "",
      ["Strategy", ...columns.map((key) => metrics[key].label)].join("  |  "),
      ["Total", ...columns.map((key) => cell(key, total))].join("  |  "),
      ...rows.map((row) =>
        [
          row.strategy.name,
          ...columns.map((key) => cell(key, row.aggregate)),
        ].join("  |  "),
      ),
    ];
    downloadBlob(buildPdf("Meta Ads overview", lines), "meta-ads-overview.pdf");
    setNotice("Exported meta-ads-overview.pdf");
    window.setTimeout(() => setNotice(null), 2500);
  }

  return (
    <div>
      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold text-zinc-900">
            Last 7 days
          </h3>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Live
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-2 @lg:grid-cols-4">
          <StatCard
            label="Amount spent"
            value={formatUsd(total.spend)}
            delta={76.3}
          />
          <StatCard
            label="Bookings"
            value={formatInt(total.purchases)}
            delta={500}
          />
          <StatCard
            label="CAC"
            value={formatUsd(metrics.costPerPurchase.of(total))}
            delta={-70.6}
          />
          <StatCard
            label="ROAS (all)"
            value={`${metrics.roas.of(total).toFixed(2)}x`}
            delta={1.76}
          />
          <StatCard
            label="Clicks"
            value={formatCompact(total.clicks)}
            delta={128.6}
          />
          <StatCard
            label="Impressions"
            value={formatCompact(total.impressions)}
            delta={64.5}
          />
          <StatCard
            label="CTR"
            value={metrics.ctr.format(metrics.ctr.of(total))}
            delta={1.34}
          />
          <StatCard
            label="CPM"
            value={metrics.cpm.format(metrics.cpm.of(total))}
            delta={7.2}
          />
        </dl>

        <h4 className="mt-6 text-[15px] font-semibold text-zinc-900">
          Spend vs CAC
        </h4>
        <div className="mt-3">
          <AreaChart labels={labels} series={spendVsCac} dualAxis />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-semibold text-zinc-900">Overview</h3>
        <div className="ml-auto flex items-center gap-2">
          <Dropdown
            align="right"
            width="w-64"
            label="Filter data"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className={toolbarButtonClass}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filter Data
                {hidden.length > 0 && (
                  <span className="rounded-full bg-zinc-900 px-2 text-sm font-semibold text-white">
                    {visible.length}
                  </span>
                )}
              </button>
            )}
          >
            {() => (
              <div className="p-1">
                <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                  Strategies
                </p>
                <ul className="mt-2 space-y-1">
                  {strategies.map((strategy) => (
                    <li key={strategy.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100">
                        <input
                          type="checkbox"
                          checked={!hidden.includes(strategy.id)}
                          onChange={() =>
                            setHidden((prev) =>
                              prev.includes(strategy.id)
                                ? prev.filter((id) => id !== strategy.id)
                                : [...prev, strategy.id],
                            )
                          }
                          className="h-4 w-4 accent-zinc-900"
                        />
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: strategy.color }}
                          aria-hidden="true"
                        />
                        {strategy.name}
                      </label>
                    </li>
                  ))}
                </ul>
                {hidden.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHidden([])}
                    className="mt-2 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                  >
                    Show all
                  </button>
                )}
              </div>
            )}
          </Dropdown>
          <button
            type="button"
            onClick={exportPdf}
            className={toolbarButtonClass}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export PDF
          </button>
        </div>
      </div>
      {notice && (
        <p role="status" className="mt-2 text-sm text-emerald-700">
          {notice}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[440px] text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left font-medium">
                <span className="sr-only">Strategy</span>
              </th>
              {columns.map((key, index) => (
                <th key={index} scope="col" className="px-2 py-1.5 text-right">
                  <div className="flex justify-end">
                    <MetricPicker
                      value={key}
                      label={`Column ${index + 1} metric`}
                      onChange={(next) =>
                        setColumns((prev) =>
                          prev.map((current, i) =>
                            i === index ? next : current,
                          ),
                        )
                      }
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            <tr>
              <th
                scope="row"
                className="px-4 py-3 text-left font-semibold text-zinc-900"
              >
                Total
              </th>
              {columns.map((key, index) => (
                <td
                  key={index}
                  className="px-3 py-3 text-right font-medium text-zinc-900 tabular-nums"
                >
                  {metrics[key].format(metrics[key].of(total))}
                </td>
              ))}
            </tr>
            {rows.map(({ strategy, aggregate }) => (
              <tr key={strategy.id}>
                <th
                  scope="row"
                  className="relative px-4 py-3 text-left font-medium text-zinc-900"
                >
                  <span
                    className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full"
                    style={{ backgroundColor: strategy.color }}
                    aria-hidden="true"
                  />
                  {strategy.name}
                </th>
                {columns.map((key, index) => (
                  <td
                    key={index}
                    className="px-3 py-3 text-right text-zinc-800 tabular-nums"
                  >
                    {metrics[key].format(metrics[key].of(aggregate))}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-6 text-center text-zinc-600"
                >
                  No strategies selected. Use Filter Data to add some back.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-100 px-4 py-3">
          <h4 className="flex items-center gap-2 text-[15px] font-semibold text-zinc-900">
            Strategy Status Overview
            <HelpTip
              label="About strategy status"
              text="Each chart plots the daily value of the line metric (coloured, left axis) against the comparison metric (grey, right axis) for one strategy group across the selected date range."
            />
          </h4>
          <div className="ml-auto flex items-center gap-1">
            <MetricPicker
              value={lineMetric}
              onChange={setLineMetric}
              label="Line metric"
            />
            <MetricPicker
              value={compareMetric}
              onChange={setCompareMetric}
              label="Comparison metric"
            />
          </div>
        </div>
        {visibleGroups.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-600">
            Select at least one strategy to see charts.
          </p>
        ) : (
          <div className="grid gap-6 p-4 @xl:grid-cols-2">
            {visibleGroups.map((group) => (
              <AreaChart
                key={group.id}
                title={group.name}
                labels={labels}
                series={overviewSeries(group)}
                dualAxis
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-100 px-4 py-3">
          <h4 className="flex items-center gap-2 text-[15px] font-semibold text-zinc-900">
            Strategy Status Drilldown
            <HelpTip
              label="About the drilldown"
              text="Breaks the selected group into its strategies and plots the line metric for each one, with the group totals for the date range underneath."
            />
          </h4>
          {visibleGroups.length > 0 && (
            <div
              role="tablist"
              aria-label="Drilldown strategy"
              className="ml-auto flex rounded-full bg-zinc-100 p-1"
            >
              {visibleGroups.map((group) => {
                const active = group.id === activeDrill?.id;
                return (
                  <button
                    key={group.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setDrillGroup(group.id)}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {activeDrill && drillTotal ? (
          <div className="p-4">
            <AreaChart
              height={240}
              labels={labels}
              series={drilldownSeries(activeDrill)}
            />
            <dl className="mt-4 grid grid-cols-2 gap-2 @lg:grid-cols-4">
              {(
                ["spend", "roas", "costPerAdd", "purchases"] as MetricKey[]
              ).map((key) => (
                <div
                  key={key}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5"
                >
                  <dt className="text-sm text-zinc-500">
                    {metrics[key].label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-zinc-900 tabular-nums">
                    {metrics[key].format(metrics[key].of(drillTotal))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-zinc-600">
            Select at least one strategy to drill down.
          </p>
        )}
      </section>
    </div>
  );
}

function InsightTable({ insight }: { insight: Insight }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-zinc-900">{insight.title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{insight.description}</p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[440px] text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              {insight.columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={`px-4 py-3 font-medium whitespace-nowrap ${
                    index === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {insight.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th
                      key={index}
                      scope="row"
                      className="px-4 py-3 text-left font-medium text-zinc-900"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={index}
                      className="px-4 py-3 text-right text-zinc-800 tabular-nums"
                    >
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: AdPlatform }) {
  if (platform === "facebook") {
    return (
      <span
        role="img"
        aria-label="Facebook"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1877f2] text-sm font-bold text-white"
      >
        f
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label="Google"
      className="flex h-7 w-7 shrink-0 items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
  );
}

const statusStyles: Record<
  AdSetStatus,
  { label: string; pill: string; dot: string }
> = {
  active: {
    label: "Active",
    pill: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  paused: {
    label: "Paused",
    pill: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  draft: {
    label: "In draft",
    pill: "bg-zinc-100 text-zinc-700",
    dot: "bg-zinc-400",
  },
};

function StatusPill({ status }: { status: AdSetStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-sm font-medium ${style.pill}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {style.label}
    </span>
  );
}

function Switch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? "bg-zinc-900" : "bg-zinc-200"
      }`}
    >
      <span
        className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      >
        {checked && (
          <Check
            className="h-3 w-3 text-zinc-900"
            strokeWidth={3}
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}

type ColumnKey =
  | "impressions"
  | "status"
  | "reach"
  | "results"
  | "costPerResult"
  | "budget"
  | "spent"
  | "purchases"
  | "registrations"
  | "clicks"
  | "ctr"
  | "cpc"
  | "cpm"
  | "frequency"
  | "costPerPurchase"
  | "costPerRegistration"
  | "schedule"
  | "ends";

type Column = {
  key: ColumnKey;
  label: string;
  numeric?: boolean;
  optional?: boolean;
  render: (adSet: AdSet) => ReactNode;
};

const ratio = (a: number, b: number) => (b > 0 ? a / b : 0);
const metricCell = (
  adSet: AdSet,
  value: number,
  format: (v: number) => string,
) => (adSet.status === "draft" ? "—" : format(value));

const adSetColumns: Column[] = [
  {
    key: "impressions",
    label: "Impressions",
    numeric: true,
    render: (a) => metricCell(a, a.impressions, formatInt),
  },
  {
    key: "status",
    label: "Status",
    render: (a) => <StatusPill status={a.status} />,
  },
  {
    key: "reach",
    label: "Reach",
    numeric: true,
    render: (a) => metricCell(a, a.reach, formatInt),
  },
  {
    key: "results",
    label: "Result",
    numeric: true,
    render: (a) => metricCell(a, a.results, formatInt),
  },
  {
    key: "costPerResult",
    label: "Cost per Result",
    numeric: true,
    render: (a) => metricCell(a, ratio(a.spent, a.results), formatUsd2),
  },
  {
    key: "budget",
    label: "Budget",
    numeric: true,
    render: (a) => (
      <span className="block">
        <span className="block text-zinc-900">{formatUsd(a.budget)}</span>
        <span className="block text-sm text-zinc-500">Daily</span>
      </span>
    ),
  },
  {
    key: "spent",
    label: "Amount Spent",
    numeric: true,
    render: (a) => metricCell(a, a.spent, formatUsd),
  },
  {
    key: "purchases",
    label: "Website Purchase",
    numeric: true,
    render: (a) => metricCell(a, a.purchases, formatInt),
  },
  {
    key: "registrations",
    label: "Website Registration",
    numeric: true,
    render: (a) => metricCell(a, a.registrations, formatInt),
  },
  {
    key: "clicks",
    label: "Clicks",
    numeric: true,
    render: (a) => metricCell(a, a.clicks, formatInt),
  },
  {
    key: "ctr",
    label: "CTR",
    numeric: true,
    render: (a) => metricCell(a, ratio(a.clicks, a.impressions), formatPercent),
  },
  {
    key: "cpc",
    label: "CPC",
    numeric: true,
    render: (a) => metricCell(a, ratio(a.spent, a.clicks), formatUsd2),
  },
  {
    key: "cpm",
    label: "CPM",
    numeric: true,
    render: (a) =>
      metricCell(a, ratio(a.spent, a.impressions) * 1000, formatUsd2),
  },
  {
    key: "frequency",
    label: "Frequency",
    numeric: true,
    optional: true,
    render: (a) =>
      metricCell(a, ratio(a.impressions, a.reach), (v) => v.toFixed(2)),
  },
  {
    key: "costPerPurchase",
    label: "Cost per Purchase",
    numeric: true,
    optional: true,
    render: (a) => metricCell(a, ratio(a.spent, a.purchases), formatUsd2),
  },
  {
    key: "costPerRegistration",
    label: "Cost per Registration",
    numeric: true,
    optional: true,
    render: (a) => metricCell(a, ratio(a.spent, a.registrations), formatUsd2),
  },
  { key: "schedule", label: "Schedule", render: (a) => a.schedule },
  { key: "ends", label: "Ends", render: (a) => a.ends },
];

function AdSetsTable() {
  const [rows, setRows] = useState<AdSet[]>(initialAdSets);
  const [selected, setSelected] = useState<number[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<ColumnKey[]>(() =>
    adSetColumns
      .filter((column) => !column.optional)
      .map((column) => column.key),
  );

  const visibleColumns = adSetColumns.filter((column) =>
    visibleKeys.includes(column.key),
  );
  const allSelected = selected.length > 0 && selected.length === rows.length;
  const counts = rows.reduce(
    (acc, row) => ({ ...acc, [row.status]: acc[row.status] + 1 }),
    { active: 0, paused: 0, draft: 0 } as Record<AdSetStatus, number>,
  );

  function setStatus(ids: number[], on: boolean) {
    setRows((prev) =>
      prev.map((row) => {
        if (!ids.includes(row.id)) return row;
        const status: AdSetStatus = on
          ? "active"
          : row.status === "active"
            ? "paused"
            : row.status;
        return { ...row, status };
      }),
    );
  }

  function toggleColumn(key: ColumnKey) {
    setVisibleKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  const smallButtonClass =
    "h-8 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-100";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-xl font-semibold text-zinc-900">Ad sets</h3>
        <p className="text-sm text-zinc-600">
          {counts.active} active · {counts.paused} paused · {counts.draft} in
          draft
        </p>
        {selected.length > 0 && (
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-600">
              {selected.length} selected
            </span>
            <button
              type="button"
              onClick={() => setStatus(selected, true)}
              className={smallButtonClass}
            >
              Turn on
            </button>
            <button
              type="button"
              onClick={() => setStatus(selected, false)}
              className={smallButtonClass}
            >
              Turn off
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="h-8 cursor-pointer rounded-lg px-2 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-zinc-50 text-sm text-zinc-600">
            <tr>
              <th scope="col" className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all ad sets"
                  checked={allSelected}
                  onChange={() =>
                    setSelected(allSelected ? [] : rows.map((row) => row.id))
                  }
                  className="h-4 w-4 cursor-pointer accent-zinc-900"
                />
              </th>
              <th scope="col" className="px-3 py-3 text-left font-medium">
                Off/On
              </th>
              <th scope="col" className="px-3 py-3 text-left font-medium">
                Ad set
              </th>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-3 py-3 font-medium whitespace-nowrap ${
                    column.numeric ? "text-right" : "text-left"
                  }`}
                >
                  {column.key === "status" ? (
                    <span className="inline-flex items-center gap-1">
                      Status
                      <HelpTip
                        label="About ad set status"
                        text="Active ad sets are delivering. Paused ad sets keep their results but stop spending. Drafts haven't launched yet."
                      />
                    </span>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              <th scope="col" className="w-12 px-2 py-2 text-right">
                <div className="flex justify-end">
                  <Dropdown
                    align="right"
                    width="w-60"
                    label="Choose columns"
                    trigger={({ open, toggle, id }) => (
                      <button
                        type="button"
                        aria-label="Add or remove columns"
                        aria-expanded={open}
                        aria-haspopup="dialog"
                        aria-controls={id}
                        onClick={toggle}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-600 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-900"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  >
                    {() => (
                      <ul className="max-h-72 overflow-y-auto">
                        {adSetColumns.map((column) => (
                          <li key={column.key}>
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-normal text-zinc-800 hover:bg-zinc-100">
                              <input
                                type="checkbox"
                                checked={visibleKeys.includes(column.key)}
                                onChange={() => toggleColumn(column.key)}
                                className="h-4 w-4 accent-zinc-900"
                              />
                              {column.label}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Dropdown>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {rows.map((adSet) => {
              const isSelected = selected.includes(adSet.id);
              const on = adSet.status === "active";
              return (
                <tr key={adSet.id} className={isSelected ? "bg-zinc-50" : ""}>
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${adSet.name}`}
                      checked={isSelected}
                      onChange={() =>
                        setSelected((prev) =>
                          prev.includes(adSet.id)
                            ? prev.filter((id) => id !== adSet.id)
                            : [...prev, adSet.id],
                        )
                      }
                      className="h-4 w-4 cursor-pointer accent-zinc-900"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Switch
                      checked={on}
                      label={`Turn ${adSet.name} ${on ? "off" : "on"}`}
                      onChange={() => setStatus([adSet.id], !on)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={adSet.platform} />
                      <div>
                        <p className="font-medium whitespace-nowrap text-zinc-900">
                          {adSet.name}
                        </p>
                        <p className="text-sm whitespace-nowrap text-zinc-500">
                          Results from {adSet.ads} ad
                          {adSet.ads === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </td>
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 py-3 whitespace-nowrap ${
                        column.numeric ? "text-right tabular-nums" : "text-left"
                      }`}
                    >
                      {column.render(adSet)}
                    </td>
                  ))}
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
