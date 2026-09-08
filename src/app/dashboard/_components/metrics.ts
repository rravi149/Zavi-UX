export type DailyMetric = {
  date: string;
  spend: number;
  results: number;
  impressions: number;
  clicks: number;
};

type Segment = {
  days: number;
  spend: number;
  costPerResult: number;
  cpm: number;
  ctr: number;
};

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseISO(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function daysBetween(start: string, end: string): number {
  const ms = parseISO(end).getTime() - parseISO(start).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatDate(iso: string): string {
  return monthDay.format(parseISO(iso));
}

export function formatRange(start: string, end: string, withYear = false): string {
  const a = parseISO(start);
  const b = parseISO(end);
  const year = withYear ? `, ${b.getFullYear()}` : "";
  if (start === end) return `${monthDay.format(a)}${year}`;
  if (a.getMonth() === b.getMonth()) {
    return `${monthDay.format(a)}–${b.getDate()}${year}`;
  }
  return `${monthDay.format(a)} – ${monthDay.format(b)}${year}`;
}

// Small deterministic jitter so the series looks organic but totals stay exact.
function jitter(index: number): number {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 0.12 - 0.06;
}

export function dailySeries(start: string, segments: Segment[]): DailyMetric[] {
  const rows: DailyMetric[] = [];
  let cursor = start;
  let index = 0;
  for (const segment of segments) {
    const raw = Array.from({ length: segment.days }, (_, i) =>
      segment.spend * (1 + jitter(index + i)),
    );
    // Normalize in 7-day blocks counted back from the segment end, so any
    // whole week aligned to the end of the segment sums to exactly 7 × spend.
    const scaled = raw.slice();
    for (let blockEnd = segment.days; blockEnd > 0; blockEnd -= 7) {
      const blockStart = Math.max(0, blockEnd - 7);
      const block = raw.slice(blockStart, blockEnd);
      const factor = (segment.spend * block.length) / block.reduce((a, b) => a + b, 0);
      for (let i = blockStart; i < blockEnd; i += 1) scaled[i] = raw[i] * factor;
    }
    const targetResults = Math.round((segment.spend * segment.days) / segment.costPerResult);
    let emitted = 0;
    let cumulativeSpend = 0;
    for (let i = 0; i < segment.days; i += 1) {
      const spend = Math.round(scaled[i] * 100) / 100;
      cumulativeSpend += spend;
      const expected = Math.round(
        (cumulativeSpend / (segment.spend * segment.days)) * targetResults,
      );
      const results = Math.max(0, expected - emitted);
      emitted += results;
      const impressions = Math.round((spend / segment.cpm) * 1000);
      const clicks = Math.round(impressions * segment.ctr);
      rows.push({ date: cursor, spend, results, impressions, clicks });
      cursor = addDays(cursor, 1);
    }
    index += segment.days;
  }
  return rows;
}

export type PeriodSummary = {
  days: number;
  spend: number;
  results: number;
  costPerResult: number | null;
  ctr: number | null;
  cpm: number | null;
};

export function summarize(
  daily: DailyMetric[],
  start: string,
  end: string,
): PeriodSummary | null {
  const rows = daily.filter((row) => row.date >= start && row.date <= end);
  if (rows.length === 0) return null;
  const spend = rows.reduce((sum, row) => sum + row.spend, 0);
  const results = rows.reduce((sum, row) => sum + row.results, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  return {
    days: rows.length,
    spend,
    results,
    costPerResult: results > 0 ? spend / results : null,
    ctr: impressions > 0 ? clicks / impressions : null,
    cpm: impressions > 0 ? (spend / impressions) * 1000 : null,
  };
}

export function formatMoney(value: number, cents = false): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

export function formatPercent(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatChange(before: number | null, after: number | null): string | null {
  if (before === null || after === null || before === 0) return null;
  const change = (after - before) / before;
  const rounded = Math.round(change * 100);
  if (rounded === 0) return "0%";
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export function confidenceTone(label: string): { badge: string; dot: string } {
  const text = label.toLowerCase();
  if (text.includes("high")) {
    return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  }
  if (text.includes("risk") || text.includes("low")) {
    return { badge: "bg-red-50 text-red-700", dot: "bg-red-500" };
  }
  return { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
}
