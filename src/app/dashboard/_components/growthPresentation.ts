// Ported from praxis `components/workspace/growth/growthPresentation.ts`
// (origin/main, 2026-09-08). Same rules, same wording, no live data behind it.

import type { GrowthGoal, GrowthPlanPayload } from "./growthPlan";

export function humanize(value: string): string {
  return value
    .replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\b(Seo|Sms|Ugc|Aso|Cpa|Cac|Mrr|Arr|Gmv|Pr|Ai)\b/g, (word) =>
      word.toUpperCase(),
    );
}

export function formatValue(
  value: number | null | undefined,
  unit?: string | null,
): string {
  if (value === null || value === undefined) return "—";
  const number = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
  if (["usd", "dollars", "currency"].includes(unit?.toLowerCase() ?? ""))
    return `$${number}`;
  return ["percent", "percentage", "pct"].includes(unit?.toLowerCase() ?? "")
    ? `${number}%`
    : number;
}

/** Dates render in one timezone so two people reading the plan see one date. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function goalProgress(goal: GrowthGoal): number | null {
  const {
    current_value: current,
    target_value: target,
    baseline_value: baseline,
  } = goal;
  if (
    current === null ||
    target === null ||
    baseline === null ||
    target === baseline
  )
    return null;
  return Math.round(
    Math.max(
      0,
      Math.min(100, ((current - baseline) / (target - baseline)) * 100),
    ),
  );
}

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  preview?: string;
  owner: "You" | "AI";
};

export function attentionItems(data: GrowthPlanPayload): AttentionItem[] {
  const items: AttentionItem[] = [];
  if (!data.unreadable.includes("bets")) {
    for (const bet of data.bets.filter((bet) => bet.status === "proposed")) {
      items.push({
        id: bet.id,
        title: bet.intent,
        detail: [
          bet.expected_effect,
          bet.falsifier && `Reconsider if: ${bet.falsifier}`,
        ]
          .filter(Boolean)
          .join(" · "),
        owner: "You",
      });
    }
  }
  if (!data.unreadable.includes("channels")) {
    const pending = data.channels.filter((channel) => !channel.last_run_at);
    if (pending.length)
      items.push({
        id: "pending-channels",
        title: `${pending.length} ${
          pending.length === 1
            ? "channel awaiting its"
            : "channels awaiting their"
        } first run`,
        detail:
          "These channels have not run yet, so there are no execution results to review.",
        preview: `${pending
          .slice(0, 5)
          .map((channel) => humanize(channel.slug))
          .join(" · ")}${pending.length > 5 ? ` +${pending.length - 5}` : ""}`,
        owner: "AI",
      });
  }
  if (!data.unreadable.includes("goals") && data.goals.over_cap)
    items.push({
      id: "goal-cap",
      title: "Prioritize your active goals",
      detail: `${data.goals.active_count} active${
        data.goals.max_active === null ? "" : ` · limit ${data.goals.max_active}`
      }. Edit a goal to pause it.`,
      owner: "You",
    });
  return items;
}
