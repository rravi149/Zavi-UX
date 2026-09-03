"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Trophy,
} from "lucide-react";
import { Dropdown, menuItemClass } from "./Dropdown";
import { AreaChart, type ChartSeries } from "./AreaChart";
import { formatCompact, formatDay, formatInt, rangeDays } from "./metaData";

type Channel = {
  id: string;
  name: string;
  glyph: string;
  color: string;
  chip: string;
  posts: number;
  dailyImpressions: number;
  engagementRate: number;
  clickRate: number;
  followerRate: number;
  trend: number;
};

const channels: Channel[] = [
  {
    id: "x",
    name: "X",
    glyph: "X",
    color: "#18181b",
    chip: "bg-zinc-900 text-white",
    posts: 18,
    dailyImpressions: 7400,
    engagementRate: 0.041,
    clickRate: 0.018,
    followerRate: 0.004,
    trend: 0.22,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    glyph: "in",
    color: "#0a66c2",
    chip: "bg-blue-600 text-white",
    posts: 11,
    dailyImpressions: 4300,
    engagementRate: 0.058,
    clickRate: 0.026,
    followerRate: 0.006,
    trend: 0.34,
  },
  {
    id: "reddit",
    name: "Reddit",
    glyph: "r/",
    color: "#f97316",
    chip: "bg-orange-500 text-white",
    posts: 7,
    dailyImpressions: 5100,
    engagementRate: 0.033,
    clickRate: 0.021,
    followerRate: 0.002,
    trend: -0.08,
  },
  {
    id: "instagram",
    name: "Instagram",
    glyph: "ig",
    color: "#db2777",
    chip: "bg-pink-600 text-white",
    posts: 14,
    dailyImpressions: 3600,
    engagementRate: 0.027,
    clickRate: 0.007,
    followerRate: 0.005,
    trend: 0.05,
  },
  {
    id: "youtube",
    name: "YouTube",
    glyph: "yt",
    color: "#dc2626",
    chip: "bg-red-600 text-white",
    posts: 4,
    dailyImpressions: 2100,
    engagementRate: 0.049,
    clickRate: 0.012,
    followerRate: 0.008,
    trend: 0.12,
  },
];

const topPosts = [
  {
    id: 1,
    channel: "linkedin",
    title: "We rebuilt our analytics page in a day",
    impressions: 18400,
    engagements: 1420,
    clicks: 610,
  },
  {
    id: 2,
    channel: "x",
    title: "Thread: 5 dashboard patterns that convert",
    impressions: 16800,
    engagements: 980,
    clicks: 540,
  },
  {
    id: 3,
    channel: "reddit",
    title: "r/webdev: which dashboard kit would you pick?",
    impressions: 12200,
    engagements: 640,
    clicks: 380,
  },
  {
    id: 4,
    channel: "youtube",
    title: "Build a dashboard in 5 minutes",
    impressions: 9100,
    engagements: 720,
    clicks: 210,
  },
  {
    id: 5,
    channel: "instagram",
    title: "Before / after: the pricing page",
    impressions: 7400,
    engagements: 310,
    clicks: 88,
  },
];

type MetricKey = "impressions" | "engagements" | "clicks" | "followers";

const metricLabels: Record<MetricKey, string> = {
  impressions: "Impressions",
  engagements: "Engagements",
  clicks: "Clicks",
  followers: "New followers",
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;

function dailyImpressions(channel: Channel, day: Date) {
  const dayNumber = Math.round(day.getTime() / DAY);
  const rand = mulberry32(
    hashString(channel.id) ^ Math.imul(dayNumber, 2654435761),
  );
  return channel.dailyImpressions * (0.78 + 0.44 * rand());
}

const cardClass = "rounded-2xl border border-zinc-200 bg-white";

function Delta({
  value,
  compact = false,
}: {
  value: number;
  compact?: boolean;
}) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`flex items-center gap-0.5 font-medium ${
        compact ? "text-xs" : "gap-1 text-sm"
      } ${up ? "text-emerald-700" : "text-red-600"}`}
    >
      <Icon className={compact ? "h-3 w-3" : "h-4 w-4"} aria-hidden="true" />
      {up ? "+" : ""}
      {Math.round(value * 100)}%
    </span>
  );
}

function ChannelBadge({ channel }: { channel: Channel }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${channel.chip}`}
      aria-hidden="true"
    >
      {channel.glyph}
    </span>
  );
}

export default function SocialAnalytics({ range }: { range: string }) {
  const [metric, setMetric] = useState<MetricKey>("impressions");
  const [hidden, setHidden] = useState<string[]>([]);

  const days = useMemo(() => rangeDays(range), [range]);
  const visible = channels.filter((channel) => !hidden.includes(channel.id));

  const perChannel = visible.map((channel) => {
    const daily = days.map((day) => dailyImpressions(channel, day));
    const impressions = daily.reduce((sum, value) => sum + value, 0);
    const engagements = impressions * channel.engagementRate;
    const clicks = impressions * channel.clickRate;
    const followers = impressions * channel.followerRate;
    return { channel, daily, impressions, engagements, clicks, followers };
  });

  const totals = perChannel.reduce(
    (acc, row) => ({
      impressions: acc.impressions + row.impressions,
      engagements: acc.engagements + row.engagements,
      clicks: acc.clicks + row.clicks,
      followers: acc.followers + row.followers,
      posts: acc.posts + row.channel.posts,
    }),
    { impressions: 0, engagements: 0, clicks: 0, followers: 0, posts: 0 },
  );

  const ranked = [...perChannel].sort((a, b) => b.impressions - a.impressions);
  const best = [...perChannel].sort(
    (a, b) =>
      b.engagements / Math.max(1, b.impressions) -
      a.engagements / Math.max(1, a.impressions),
  )[0];
  const mostReach = ranked[0];

  const series: ChartSeries[] = perChannel.map((row) => {
    const factor =
      metric === "impressions"
        ? 1
        : metric === "engagements"
          ? row.channel.engagementRate
          : metric === "clicks"
            ? row.channel.clickRate
            : row.channel.followerRate;
    return {
      id: row.channel.id,
      label: row.channel.name,
      color: row.channel.color,
      values: row.daily.map((value) => value * factor),
      format: (value) => formatInt(Math.round(value)),
      tick: (value) => formatCompact(value),
    };
  });

  const kpis: { key: MetricKey; value: number; delta: number }[] = [
    { key: "impressions", value: totals.impressions, delta: 0.18 },
    { key: "engagements", value: totals.engagements, delta: 0.26 },
    { key: "clicks", value: totals.clicks, delta: 0.11 },
    { key: "followers", value: totals.followers, delta: -0.04 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-semibold text-zinc-900">Social</h3>
        <p className="text-sm text-zinc-600">
          {totals.posts} posts across {visible.length} channels
        </p>
        <div className="ml-auto">
          <Dropdown
            align="right"
            width="w-56"
            label="Channels"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                Channels
                <ChevronDown
                  className="h-4 w-4 text-zinc-500"
                  aria-hidden="true"
                />
              </button>
            )}
          >
            {() => (
              <ul>
                {channels.map((channel) => (
                  <li key={channel.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-800 hover:bg-zinc-100">
                      <input
                        type="checkbox"
                        checked={!hidden.includes(channel.id)}
                        onChange={() =>
                          setHidden((prev) =>
                            prev.includes(channel.id)
                              ? prev.filter((id) => id !== channel.id)
                              : [...prev, channel.id],
                          )
                        }
                        className="h-4 w-4 accent-zinc-900"
                      />
                      {channel.name}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </Dropdown>
        </div>
      </div>

      <dl className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className={`${cardClass} w-36 shrink-0 grow basis-36 px-3 py-3`}
          >
            <dt className="truncate text-xs text-zinc-600">
              {metricLabels[kpi.key]}
            </dt>
            <dd className="mt-1 truncate text-xl font-semibold text-zinc-900 tabular-nums">
              {formatInt(Math.round(kpi.value))}
            </dd>
            <dd className="mt-0.5">
              <Delta value={kpi.delta} compact />
            </dd>
          </div>
        ))}
      </dl>

      {best && mostReach && (
        <section className={`${cardClass} p-4`}>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"
              aria-hidden="true"
            >
              <Trophy className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-zinc-900">
                {best.channel.name} performs best
              </p>
              <p className="mt-0.5 text-sm text-zinc-600">
                {(
                  (best.engagements / Math.max(1, best.impressions)) *
                  100
                ).toFixed(1)}
                % engagement rate on {best.channel.posts} posts.{" "}
                {mostReach.channel.name} has the widest reach at{" "}
                {formatInt(Math.round(mostReach.impressions))} impressions.
              </p>
            </div>
            <Delta value={best.channel.trend} />
          </div>
        </section>
      )}

      <section className={`${cardClass} p-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-[15px] font-semibold text-zinc-900">
            {metricLabels[metric]} by channel
          </h4>
          <div className="ml-auto">
            <Dropdown
              align="right"
              width="w-52"
              label="Chart metric"
              trigger={({ open, toggle, id }) => (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="dialog"
                  aria-controls={id}
                  onClick={toggle}
                  className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {metricLabels[metric]}
                  <ChevronDown
                    className="h-3.5 w-3.5 text-zinc-500"
                    aria-hidden="true"
                  />
                </button>
              )}
            >
              {(close) => (
                <ul>
                  {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          setMetric(key);
                          close();
                        }}
                        className={menuItemClass}
                      >
                        <span className="flex-1">{metricLabels[key]}</span>
                        {key === metric && (
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
        </div>
        <div className="mt-3">
          {series.length > 0 ? (
            <AreaChart
              height={220}
              labels={days.map(formatDay)}
              series={series}
            />
          ) : (
            <p className="py-8 text-center text-sm text-zinc-600">
              Select at least one channel.
            </p>
          )}
        </div>
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-zinc-200 px-4 py-3">
          <h4 className="text-[15px] font-semibold text-zinc-900">
            Channel performance
          </h4>
          <p className="mt-0.5 text-sm text-zinc-600">
            Ranked by impressions for {range.toLowerCase()}.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-left font-medium">
                  Channel
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Impressions
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Share
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Engagements
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Eng. rate
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Clicks
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Posts
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ranked.map((row) => {
                const share = totals.impressions
                  ? row.impressions / totals.impressions
                  : 0;
                return (
                  <tr key={row.channel.id}>
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-medium text-zinc-900"
                    >
                      <span className="flex items-center gap-2.5">
                        <ChannelBadge channel={row.channel} />
                        {row.channel.name}
                      </span>
                    </th>
                    <td className="px-3 py-3 text-right text-zinc-900 tabular-nums">
                      {formatInt(Math.round(row.impressions))}
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center justify-end gap-2">
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100">
                          <span
                            className="block h-full rounded-full bg-zinc-900"
                            style={{ width: `${Math.round(share * 100)}%` }}
                          />
                        </span>
                        <span className="w-9 text-right text-zinc-700 tabular-nums">
                          {Math.round(share * 100)}%
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-zinc-800 tabular-nums">
                      {formatInt(Math.round(row.engagements))}
                    </td>
                    <td className="px-3 py-3 text-right text-zinc-800 tabular-nums">
                      {(row.channel.engagementRate * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-right text-zinc-800 tabular-nums">
                      {formatInt(Math.round(row.clicks))}
                    </td>
                    <td className="px-3 py-3 text-right text-zinc-800 tabular-nums">
                      {row.channel.posts}
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex justify-end">
                        <Delta value={row.channel.trend} />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {ranked.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-zinc-600"
                  >
                    No channels selected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-zinc-200 px-4 py-3">
          <h4 className="text-[15px] font-semibold text-zinc-900">Top posts</h4>
          <p className="mt-0.5 text-sm text-zinc-600">
            What earned the most impressions.
          </p>
        </div>
        <ul className="divide-y divide-zinc-100">
          {topPosts
            .filter((post) => !hidden.includes(post.channel))
            .map((post) => {
              const channel = channels.find((c) => c.id === post.channel);
              const rate = post.engagements / post.impressions;
              return (
                <li key={post.id} className="flex items-center gap-3 px-4 py-3">
                  {channel && <ChannelBadge channel={channel} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {post.title}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {channel?.name} · {formatInt(post.clicks)} clicks
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-zinc-900 tabular-nums">
                      {formatInt(post.impressions)}
                    </p>
                    <p className="text-sm text-zinc-600 tabular-nums">
                      {(rate * 100).toFixed(1)}% eng.
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
