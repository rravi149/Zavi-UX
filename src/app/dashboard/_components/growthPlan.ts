// The growth plan payload, shaped exactly like the live product.
//
// Mirrors praxis `apps/web/src/lib/workspace/useGrowthPlan.ts` (origin/main,
// 2026-09-08). The prototype fakes the fetch, so the types are the contract:
// keep them in step with that file and the panel below stays portable.

export type GrowthPlanConfidence = "low" | "medium" | "high";

export type GrowthPlanRow = {
  id: string | null;
  /** "typed" is a growth_plan row. "legacy" is an already-accepted strategy. */
  source: "typed" | "legacy";
  /** Zavi drafted this and the founder has not accepted it yet. */
  pending_acceptance: boolean;
  objective: string;
  target_metric: string | null;
  constraint_statement: string | null;
  constraint_confidence: GrowthPlanConfidence | null;
  version: number;
  updated_at: string | null;
};

export type GrowthBetStatus =
  | "proposed"
  | "accepted"
  | "rejected"
  | "superseded"
  | "done";

export type GrowthBet = {
  id: string;
  channel_slug: string | null;
  intent: string;
  expected_effect: string | null;
  falsifier: string | null;
  status: GrowthBetStatus;
  rejected_reason: string | null;
  /** Plan order, ASCENDING, lower is first. */
  sort_order: number | null;
};

export type GrowthGoal = {
  id: string;
  objective: string;
  target_metric: string;
  target_value: number | null;
  baseline_value: number | null;
  current_value: number | null;
  due_date: string | null;
  status: string;
  priority: number | null;
  source: string | null;
};

export type GrowthGoals = {
  max_active: number | null;
  active_count: number;
  over_cap: boolean;
  items: GrowthGoal[];
};

export type GrowthMetric = {
  key: string;
  label: string;
  unit: string | null;
  value: number | null;
  status: "measured" | "unavailable";
  source: string | null;
  window_end: string | null;
  /** Either both numbers or nothing. A half denominator is not a state. */
  denominator: { spend: number; conversions: number } | null;
  caveat: string | null;
};

export type GrowthChannelAvailability = "measured" | "unavailable" | "none";

export type GrowthChannel = {
  slug: string;
  last_run_at: string | null;
  last_run_status: string | null;
  metric_keys: string[];
  /**
   * Whether the numbers can be read. Deliberately separate from last_run_*:
   * google_ads has run and delivered while its numbers are unreadable, and
   * showing that as "the channel did nothing" would be false.
   */
  metric_availability: GrowthChannelAvailability;
};

export type GrowthChange = {
  id: string;
  entity: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  actor_kind: string | null;
  note: string | null;
  created_at: string | null;
};

/** Sections the server reads independently. An unreadable one is not empty. */
export type GrowthSection =
  | "plan"
  | "bets"
  | "goals"
  | "metrics"
  | "channels"
  | "changes";

export type GrowthPlanPayload = {
  plan: GrowthPlanRow | null;
  bets: GrowthBet[];
  goals: GrowthGoals;
  metrics: GrowthMetric[];
  channels: GrowthChannel[];
  changes: GrowthChange[];
  unreadable: GrowthSection[];
};

const ran = (
  slug: string,
  at: string,
  status: string,
  metric_keys: string[],
  metric_availability: GrowthChannelAvailability,
): GrowthChannel => ({
  slug,
  last_run_at: at,
  last_run_status: status,
  metric_keys,
  metric_availability,
});

const waiting = (slug: string): GrowthChannel => ({
  slug,
  last_run_at: null,
  last_run_status: null,
  metric_keys: [],
  metric_availability: "none",
});

export const growthPlanData: GrowthPlanPayload = {
  plan: {
    id: "plan-1",
    source: "typed",
    pending_acceptance: true,
    objective: "Get to 800 verified hosts and $100k MRR by the end of Q4",
    target_metric: "ad_cpa",
    constraint_statement:
      "Meta Ads is the only channel whose numbers I can read. Everything else is either not connected or connected with nothing readable yet, so any money spent there is spent blind.",
    constraint_confidence: "medium",
    version: 1,
    updated_at: "2026-09-08T09:12:00Z",
  },
  bets: [
    {
      id: "bet-1",
      channel_slug: "meta_ads",
      intent: "Raise Meta Ads budget 40% on the two ad sets under $5 CPA",
      expected_effect: "About 90 more signups a week at roughly the same CPA",
      falsifier: "CPA sits above $6 for three days straight",
      status: "proposed",
      rejected_reason: null,
      sort_order: 1,
    },
    {
      id: "bet-2",
      channel_slug: "seo",
      intent: "Publish 8 city landing pages before spending on a new channel",
      expected_effect: "First ranked impressions in 3-4 weeks, no marginal spend",
      falsifier: "No page reaches page two within 6 weeks",
      status: "proposed",
      rejected_reason: null,
      sort_order: 2,
    },
    {
      id: "bet-3",
      channel_slug: "google_ads",
      intent: "Fix conversion import before spending another dollar here",
      expected_effect: "Google Ads numbers become readable, so the spend is judgeable",
      falsifier: "Conversions still do not land 7 days after the import is wired",
      status: "proposed",
      rejected_reason: null,
      sort_order: 3,
    },
  ],
  goals: {
    max_active: 3,
    active_count: 2,
    over_cap: false,
    items: [
      {
        id: "goal-1",
        objective: "Grow verified hosts to 800 by September",
        target_metric: "suppliers",
        target_value: 800,
        baseline_value: 612,
        current_value: null,
        due_date: "2026-09-30",
        status: "active",
        priority: 10,
        source: "founder",
      },
      {
        id: "goal-2",
        objective: "Grow my MRR to 100k",
        target_metric: "mrr",
        target_value: 100000,
        baseline_value: 900,
        current_value: 1492,
        due_date: "2026-09-30",
        status: "active",
        priority: 20,
        source: "founder",
      },
      {
        id: "goal-3",
        objective: "Grow ARR to $10,000 by Nov 23",
        target_metric: "arr",
        target_value: 10000,
        baseline_value: 4200,
        current_value: 20280,
        due_date: "2026-11-23",
        status: "met",
        priority: 30,
        source: "founder",
      },
      {
        id: "goal-4",
        objective: "Grow Upcar weekly guest signups to 500",
        target_metric: "weekly_signups",
        target_value: 500,
        baseline_value: 180,
        current_value: 3640,
        due_date: null,
        status: "met",
        priority: 40,
        source: "founder",
      },
    ],
  },
  metrics: [
    {
      key: "signups",
      label: "Signups",
      unit: null,
      value: null,
      status: "unavailable",
      source: "operator_db",
      window_end: "2026-09-07",
      denominator: null,
      caveat: null,
    },
    {
      key: "bookings",
      label: "Bookings",
      unit: null,
      value: null,
      status: "unavailable",
      source: "operator_db",
      window_end: "2026-09-07",
      denominator: null,
      caveat: null,
    },
    {
      key: "ad_spend",
      label: "Ad spend",
      unit: "usd",
      value: 1077.23,
      status: "measured",
      source: "meta_ads",
      window_end: "2026-09-07",
      denominator: null,
      caveat: null,
    },
    {
      key: "ad_cpa",
      label: "Ad CPA",
      unit: "usd",
      value: 4.07,
      status: "measured",
      source: "meta_ads",
      window_end: "2026-09-07",
      denominator: { spend: 1077.23, conversions: 265 },
      caveat: "Meta only. It is not your blended CPA.",
    },
    {
      key: "google_ads_spend",
      label: "Google Ads spend",
      unit: "usd",
      value: null,
      status: "unavailable",
      source: "google_ads",
      window_end: "2026-09-07",
      denominator: null,
      caveat: null,
    },
    {
      key: "google_ads_cpa",
      label: "Google Ads CPA",
      unit: "usd",
      value: null,
      status: "unavailable",
      source: "google_ads",
      window_end: "2026-09-07",
      denominator: null,
      caveat: null,
    },
    {
      key: "mrr",
      label: "MRR",
      unit: "usd",
      value: 1492,
      status: "measured",
      source: "stripe",
      window_end: "2026-09-07",
      denominator: null,
      caveat: null,
    },
  ],
  channels: [
    ran("meta_ads", "2026-09-07", "delivered", ["ad_spend", "ad_cpa"], "measured"),
    ran("reddit_ads", "2026-09-07", "running", [], "none"),
    ran("reddit_organic", "2026-09-06", "delivered", [], "none"),
    ran("influencer", "2026-09-05", "delivered", [], "none"),
    ran("youtube_organic", "2026-09-05", "delivered", [], "none"),
    ran(
      "google_ads",
      "2026-09-05",
      "delivered",
      ["google_ads_spend", "google_ads_cpa"],
      "unavailable",
    ),
    ran("seo", "2026-09-05", "delivered", [], "none"),
    ran("youtube_ads", "2026-09-04", "delivered", [], "none"),
    waiting("affiliate"),
    waiting("aso"),
    waiting("community"),
    waiting("content"),
    waiting("email_marketing"),
    waiting("in_product"),
    waiting("lifecycle"),
    waiting("linkedin_ads"),
    waiting("marketplaces"),
    waiting("partnerships"),
    waiting("pr"),
    waiting("push"),
    waiting("referral"),
    waiting("reviews"),
    waiting("sms"),
    waiting("social_organic"),
    waiting("tiktok_ads"),
    waiting("winback"),
  ],
  changes: [
    {
      id: "change-1",
      entity: "growth_plan",
      field: "constraint_statement",
      old_value: null,
      new_value: "Meta Ads is the only readable channel",
      actor_kind: "agent",
      note: "Drafted after reading Meta Ads, Google Ads, Stripe and your site.",
      created_at: "2026-09-08T09:12:00Z",
    },
    {
      id: "change-2",
      entity: "goal",
      field: "status",
      old_value: "active",
      new_value: "met",
      actor_kind: "agent",
      note: "Weekly signups passed 500.",
      created_at: "2026-09-06T16:40:00Z",
    },
    {
      id: "change-3",
      entity: "channel",
      field: "last_run_status",
      old_value: "queued",
      new_value: "delivered",
      actor_kind: "agent",
      note: "Meta Ads cycle completed.",
      created_at: "2026-09-07T07:05:00Z",
    },
  ],
  unreadable: [],
};
