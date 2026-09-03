export type StrategyGroup = "acquisition" | "retargeting" | "retention";

export type Strategy = {
  id: string;
  name: string;
  group: StrategyGroup;
  color: string;
  dailySpend: number;
  roas: number;
  costPerAdd: number;
  purchaseRate: number;
  cpm: number;
  ctr: number;
};

export const strategies: Strategy[] = [
  {
    id: "prospecting",
    name: "Acquisition Prospecting",
    group: "acquisition",
    color: "#0f8b8d",
    dailySpend: 1770,
    roas: 2.85,
    costPerAdd: 10.2,
    purchaseRate: 0.32,
    cpm: 11.5,
    ctr: 0.014,
  },
  {
    id: "reengagement",
    name: "Acquisition Re-Engagement",
    group: "acquisition",
    color: "#d6336c",
    dailySpend: 743,
    roas: 4.1,
    costPerAdd: 6.8,
    purchaseRate: 0.38,
    cpm: 13.2,
    ctr: 0.021,
  },
  {
    id: "retargeting",
    name: "Retargeting",
    group: "retargeting",
    color: "#1c7ed6",
    dailySpend: 679,
    roas: 4.85,
    costPerAdd: 5.4,
    purchaseRate: 0.45,
    cpm: 15.8,
    ctr: 0.027,
  },
  {
    id: "retention",
    name: "Retention",
    group: "retention",
    color: "#5f3dc4",
    dailySpend: 357,
    roas: 2.13,
    costPerAdd: 12.5,
    purchaseRate: 0.28,
    cpm: 9.4,
    ctr: 0.012,
  },
];

export type Group = { id: StrategyGroup; name: string; color: string };

export const groups: Group[] = [
  { id: "acquisition", name: "Acquisition", color: "#0f8b8d" },
  { id: "retargeting", name: "Retargeting", color: "#1c7ed6" },
  { id: "retention", name: "Retention", color: "#5f3dc4" },
];

export type Aggregate = {
  spend: number;
  revenue: number;
  adds: number;
  purchases: number;
  impressions: number;
  clicks: number;
};

export function sumAggregates(list: Aggregate[]): Aggregate {
  const total: Aggregate = {
    spend: 0,
    revenue: 0,
    adds: 0,
    purchases: 0,
    impressions: 0,
    clicks: 0,
  };
  for (const item of list) {
    total.spend += item.spend;
    total.revenue += item.revenue;
    total.adds += item.adds;
    total.purchases += item.purchases;
    total.impressions += item.impressions;
    total.clicks += item.clicks;
  }
  return total;
}

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatUsd = (value: number) => usd0.format(value);
export const formatUsd2 = (value: number) => usd2.format(value);
export const formatInt = (value: number) => integer.format(value);
export const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

function trim(value: number) {
  return String(Number(value.toFixed(2)));
}

export function formatCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (abs >= 1_000) return `${trim(value / 1_000)}k`;
  return trim(value);
}

export type MetricKey =
  | "spend"
  | "roas"
  | "costPerAdd"
  | "purchases"
  | "costPerPurchase"
  | "cpm"
  | "ctr";

export type Metric = {
  key: MetricKey;
  label: string;
  of: (aggregate: Aggregate) => number;
  format: (value: number) => string;
  tick: (value: number) => string;
};

const ratio = (a: number, b: number) => (b > 0 ? a / b : 0);

export const metrics: Record<MetricKey, Metric> = {
  spend: {
    key: "spend",
    label: "Amount Spent",
    of: (a) => a.spend,
    format: formatUsd,
    tick: (v) => `$${formatCompact(v)}`,
  },
  roas: {
    key: "roas",
    label: "ROAS (All)",
    of: (a) => ratio(a.revenue, a.spend),
    format: (v) => v.toFixed(2),
    tick: trim,
  },
  costPerAdd: {
    key: "costPerAdd",
    label: "Cost per Add to Cart",
    of: (a) => ratio(a.spend, a.adds),
    format: formatUsd2,
    tick: (v) => `$${trim(v)}`,
  },
  purchases: {
    key: "purchases",
    label: "Purchases",
    of: (a) => a.purchases,
    format: formatInt,
    tick: formatCompact,
  },
  costPerPurchase: {
    key: "costPerPurchase",
    label: "Cost per Purchase",
    of: (a) => ratio(a.spend, a.purchases),
    format: formatUsd2,
    tick: (v) => `$${trim(v)}`,
  },
  cpm: {
    key: "cpm",
    label: "CPM",
    of: (a) => ratio(a.spend, a.impressions) * 1000,
    format: formatUsd2,
    tick: (v) => `$${trim(v)}`,
  },
  ctr: {
    key: "ctr",
    label: "CTR",
    of: (a) => ratio(a.clicks, a.impressions),
    format: formatPercent,
    tick: (v) => `${trim(v * 100)}%`,
  },
};

export const metricKeys = Object.keys(metrics) as MetricKey[];

const DAY = 86_400_000;
const ANCHOR = Date.UTC(2026, 8, 2);
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

export function rangeDays(range: string): Date[] {
  if (range.startsWith("Custom")) {
    const start = Date.UTC(2026, 8, 27);
    return Array.from({ length: 4 }, (_, i) => new Date(start + i * DAY));
  }
  const count = range.includes("30") ? 30 : 7;
  return Array.from(
    { length: count },
    (_, i) => new Date(ANCHOR - (count - 1 - i) * DAY),
  );
}

export function formatDay(day: Date): string {
  const date = day.getUTCDate();
  const mod10 = date % 10;
  const suffix =
    mod10 === 1 && date !== 11
      ? "st"
      : mod10 === 2 && date !== 12
        ? "nd"
        : mod10 === 3 && date !== 13
          ? "rd"
          : "th";
  return `${MONTHS[day.getUTCMonth()]} ${date}${suffix}`;
}

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

export function dailyAggregate(strategy: Strategy, day: Date): Aggregate {
  const dayNumber = Math.round(day.getTime() / DAY);
  const rand = mulberry32(
    hashString(strategy.id) ^ Math.imul(dayNumber, 2654435761),
  );
  const wobble = (amount: number) => 1 - amount + 2 * amount * rand();
  const spend = strategy.dailySpend * wobble(0.2);
  const revenue = spend * strategy.roas * wobble(0.25);
  const adds = spend / (strategy.costPerAdd * wobble(0.15));
  const purchases = adds * strategy.purchaseRate * wobble(0.1);
  const impressions = (spend / (strategy.cpm * wobble(0.1))) * 1000;
  const clicks = impressions * strategy.ctr * wobble(0.15);
  return { spend, revenue, adds, purchases, impressions, clicks };
}

export type AdSetStatus = "draft" | "active" | "paused";
export type AdPlatform = "google" | "facebook";

export type AdSet = {
  id: number;
  name: string;
  platform: AdPlatform;
  ads: number;
  status: AdSetStatus;
  impressions: number;
  reach: number;
  results: number;
  budget: number;
  spent: number;
  purchases: number;
  registrations: number;
  clicks: number;
  schedule: string;
  ends: string;
};

export const adSets: AdSet[] = [
  {
    id: 1,
    name: "Summer Sale — Search",
    platform: "google",
    ads: 3,
    status: "paused",
    impressions: 48210,
    reach: 31600,
    results: 412,
    budget: 230,
    spent: 1840,
    purchases: 96,
    registrations: 214,
    clicks: 1190,
    schedule: "Monday 3 August 2026, 10:27",
    ends: "Ongoing",
  },
  {
    id: 2,
    name: "Brand Awareness — Video",
    platform: "facebook",
    ads: 2,
    status: "active",
    impressions: 132400,
    reach: 98700,
    results: 2130,
    budget: 300,
    spent: 2460,
    purchases: 61,
    registrations: 388,
    clicks: 2970,
    schedule: "Monday 3 August 2026, 10:27",
    ends: "Ongoing",
  },
  {
    id: 3,
    name: "Product Launch — Feed",
    platform: "facebook",
    ads: 4,
    status: "active",
    impressions: 76900,
    reach: 54200,
    results: 684,
    budget: 250,
    spent: 2010,
    purchases: 143,
    registrations: 271,
    clicks: 1720,
    schedule: "Monday 3 August 2026, 10:27",
    ends: "Monday 31 August 2026, 23:59",
  },
  {
    id: 4,
    name: "Lead Gen — Lookalike",
    platform: "facebook",
    ads: 2,
    status: "active",
    impressions: 41300,
    reach: 29800,
    results: 356,
    budget: 180,
    spent: 1290,
    purchases: 22,
    registrations: 356,
    clicks: 980,
    schedule: "Monday 3 August 2026, 10:27",
    ends: "Ongoing",
  },
  {
    id: 5,
    name: "Back to School Promo",
    platform: "facebook",
    ads: 6,
    status: "draft",
    impressions: 0,
    reach: 0,
    results: 0,
    budget: 400,
    spent: 0,
    purchases: 0,
    registrations: 0,
    clicks: 0,
    schedule: "Monday 24 August 2026, 09:00",
    ends: "Sunday 13 September 2026, 23:59",
  },
  {
    id: 6,
    name: "Flash Sale — Stories",
    platform: "facebook",
    ads: 3,
    status: "active",
    impressions: 58600,
    reach: 44100,
    results: 521,
    budget: 220,
    spent: 1560,
    purchases: 118,
    registrations: 149,
    clicks: 1410,
    schedule: "Monday 3 August 2026, 10:27",
    ends: "Friday 7 August 2026, 23:59",
  },
  {
    id: 7,
    name: "Holiday Retargeting",
    platform: "google",
    ads: 5,
    status: "draft",
    impressions: 0,
    reach: 0,
    results: 0,
    budget: 350,
    spent: 0,
    purchases: 0,
    registrations: 0,
    clicks: 0,
    schedule: "Monday 16 November 2026, 08:00",
    ends: "Thursday 31 December 2026, 23:59",
  },
  {
    id: 8,
    name: "Q3 Performance Max",
    platform: "google",
    ads: 8,
    status: "active",
    impressions: 210500,
    reach: 151200,
    results: 1890,
    budget: 500,
    spent: 4120,
    purchases: 276,
    registrations: 502,
    clicks: 5230,
    schedule: "Wednesday 1 July 2026, 00:00",
    ends: "Wednesday 30 September 2026, 23:59",
  },
  {
    id: 9,
    name: "Newsletter Signups",
    platform: "google",
    ads: 1,
    status: "paused",
    impressions: 22400,
    reach: 18900,
    results: 305,
    budget: 120,
    spent: 610,
    purchases: 4,
    registrations: 305,
    clicks: 640,
    schedule: "Monday 3 August 2026, 10:27",
    ends: "Ongoing",
  },
  {
    id: 10,
    name: "App Install — Display",
    platform: "google",
    ads: 4,
    status: "draft",
    impressions: 0,
    reach: 0,
    results: 0,
    budget: 260,
    spent: 0,
    purchases: 0,
    registrations: 0,
    clicks: 0,
    schedule: "Tuesday 1 September 2026, 10:00",
    ends: "Ongoing",
  },
];

export type InsightTab =
  | "Targeting Insights"
  | "Auction Insights"
  | "Geo & Demo Insights"
  | "Creative Insights";

export type Insight = {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
};

export const insights: Record<InsightTab, Insight> = {
  "Targeting Insights": {
    title: "Targeting",
    description: "How each audience converts for the selected date range.",
    columns: ["Audience", "Spend", "ROAS", "Cost per Add to Cart"],
    rows: [
      ["Lookalike 1% purchasers", "$6,120", "4.32", "$7.10"],
      ["Broad (Advantage+)", "$8,300", "3.05", "$9.20"],
      ["Interest: SaaS founders", "$4,880", "2.41", "$11.60"],
      ["Website visitors, 30 days", "$3,150", "5.12", "$4.90"],
      ["Customer list", "$2,400", "2.90", "$8.40"],
    ],
  },
  "Auction Insights": {
    title: "Auction",
    description: "Who you compete with in the same auctions and how often you win.",
    columns: ["Competitor", "Overlap rate", "Outranking share", "Above rate"],
    rows: [
      ["Tremor", "41%", "58%", "32%"],
      ["Untitled UI", "36%", "61%", "29%"],
      ["Tailwind UI", "28%", "44%", "47%"],
      ["Shadcn Blocks", "19%", "72%", "18%"],
    ],
  },
  "Geo & Demo Insights": {
    title: "Geo & Demo",
    description: "Spend and return by country and age band.",
    columns: ["Segment", "Spend", "ROAS", "Share of spend"],
    rows: [
      ["United States", "$11,200", "3.61", "45%"],
      ["United Kingdom", "$4,300", "3.12", "17%"],
      ["Germany", "$2,900", "2.84", "12%"],
      ["India", "$2,100", "4.05", "8%"],
      ["Age 25–34", "$9,800", "3.72", "39%"],
      ["Age 35–44", "$7,100", "3.35", "29%"],
    ],
  },
  "Creative Insights": {
    title: "Creative",
    description: "Which ads earn the click and which ones earn the sale.",
    columns: ["Creative", "Format", "CTR", "ROAS"],
    rows: [
      ["Build a dashboard in 5 minutes", "Video 9:16", "2.90%", "4.60"],
      ["Before / after: analytics page", "Carousel", "2.20%", "3.80"],
      ["40 free templates", "Static 1:1", "1.70%", "3.10"],
      ["Founder testimonial", "Video 4:5", "1.40%", "2.40"],
    ],
  },
};
