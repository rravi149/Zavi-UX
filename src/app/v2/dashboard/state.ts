/* ============================================================
   V2 dashboard, shared state.

   This is the seam. `page.tsx` owns one `useState<V2State>` and passes
   `{ state, setState, toast, go }` to every tab, so a tab added later reads and
   writes the same object the home tab does. No context, no store library.

   Every figure in the tables below was re-read from /tmp/zavi-main, a clean
   checkout of praxis origin/main @ 8b3489333. The path:line travels with the
   row so a reader can check it without trusting this file.
   ============================================================ */

import type { Dispatch, SetStateAction } from "react";

/* ---------- connectors ---------- */

/** The 13 real connector slugs every screen reads, from
 *  packages/shared/src/connectors/connector-descriptor.ts:42-153. The repo
 *  declares more (stripe:51, pipedream.youtube_analytics_api:153 and the ads
 *  scaffold), but these 13 are the ones with a Settings tile that this
 *  prototype can actually flip, so they are the whole of the state. */
export const CONNECTOR_KEYS = [
  "google_ads",
  "meta_ads",
  "google_analytics",
  "google_search_console",
  "linkedin_social",
  "x_social",
  "instagram_social",
  "tiktok",
  "email",
  "slack",
  "github",
  "operator_db",
  "jira",
] as const;

export type ConnectorKey = (typeof CONNECTOR_KEYS)[number];
export type ConnState = "none" | "pending" | "connected";

/** Labels: apps/backend/src/services/connectors/labels.ts.
 *  unlocks / off: the two halves of what linking changes, from
 *  GettingStartedCard.tsx:69 and the registry's connectors field. */
export type ConnectorSpec = {
  key: ConnectorKey;
  label: string;
  /** One line for the rail: what this connector lets Zavi see. */
  what: string;
  unlocks: string;
  off: string;
};

export const CONNECTORS: ConnectorSpec[] = [
  {
    key: "google_analytics",
    label: "Google Analytics",
    what: "Visits, and where they came from",
    unlocks: "SEO and Influencer read real traffic",
    off: "SEO audits the site and guesses at the traffic",
  },
  {
    key: "google_search_console",
    label: "Search Console",
    what: "Which searches you already appear in",
    unlocks: "SEO reads queries and impressions",
    off: "SEO has no query data",
  },
  {
    key: "operator_db",
    label: "Database",
    what: "What happens after someone signs up",
    unlocks: "Your own numbers, not an estimate of them",
    off: "Zavi reasons from public evidence alone",
  },
  {
    key: "google_ads",
    label: "Google Ads",
    what: "Spend and cost per conversion",
    unlocks: "Google Ads and YouTube Ads can read your account",
    off: "Both drop to advice from public pages",
  },
  {
    key: "meta_ads",
    label: "Meta Ads",
    what: "Spend, cost per result, ROAS, CTR",
    unlocks: "Meta Ads reads campaigns, ad sets and ads",
    off: "Meta Ads recommends without seeing your spend",
  },
  {
    key: "linkedin_social",
    label: "LinkedIn",
    what: "Posts, reactions, comments",
    unlocks: "The LinkedIn channel can publish",
    off: "LinkedIn drafts, you paste",
  },
  {
    key: "x_social",
    label: "X",
    what: "Posts, replies, impressions",
    unlocks: "X can publish and read post metrics",
    off: "X drafts, you paste",
  },
  {
    key: "instagram_social",
    label: "Instagram Business",
    what: "Posts, reach, saves",
    unlocks: "Instagram can publish",
    off: "Instagram drafts, you paste",
  },
  {
    key: "tiktok",
    label: "TikTok",
    what: "Posts, views, likes",
    unlocks: "TikTok can read your account",
    off: "TikTok reads public data only",
  },
  {
    key: "email",
    label: "Email",
    what: "Authentication, opens and clicks",
    unlocks: "Email campaigns can send behind an approval",
    off: "Email campaigns draft only",
  },
  {
    key: "slack",
    label: "Slack",
    what: "Support and team",
    unlocks: "Fills Support and Team in the company brain",
    off: "Those brain slots stay empty",
  },
  {
    key: "github",
    label: "GitHub",
    what: "Engineering",
    unlocks: "Fills Engineering in the company brain",
    off: "That brain slot stays empty",
  },
  {
    key: "jira",
    label: "Jira",
    what: "Engineering and product",
    unlocks: "Fills Engineering and Product",
    off: "Those brain slots stay empty",
  },
];

/** The five the console rail leads with. Analytics first on purpose: a goal with
 *  no measurement source is a guess, and it is the one link that turns most of
 *  them into numbers. */
export const RAIL_CONNECTOR_KEYS: ConnectorKey[] = [
  "google_analytics",
  "google_search_console",
  "operator_db",
  "google_ads",
  "meta_ads",
];

export function connectorSpec(key: ConnectorKey): ConnectorSpec {
  const found = CONNECTORS.find((c) => c.key === key);
  // Every ConnectorKey has a row above; the fallback keeps the type total.
  return found ?? CONNECTORS[0];
}

/* ---------- tiers and credits ---------- */

export type TierSlug = "free" | "starter" | "growth" | "pro";

/** routes/public/pricing.ts:34 PUBLIC_FREE_DAILY_FALLBACK. Config-driven in
 *  prod (system_config.blob.free_daily_credits); 1,000 is the shipped value. */
export const FREE_DAILY = 1000;

/** agents/credits.ts:15 CREDIT_USD. */
export const CREDIT_USD = 0.0025;

/** agents/credits.ts:118 DEFAULT_RESERVE_ESTIMATE_CREDITS, and the per-channel
 *  entries at :76-100. Every channel run holds the same 340 either way. */
export const CHANNEL_HOLD = 340;

/** apps/web/src/lib/workspace/runEstimate.ts:44-47 MIN_RESERVE_ESTIMATE_CREDITS
 *  = min(340 default, 160 for pm/qa/operator/support-lead/dispute-response/
 *  chief-of-staff/performance-marketer). The cheapest run any agent can
 *  reserve, which is NOT the default. */
export const MIN_HOLD = 160;

/** agents/credits.ts:62, services/channels/budget.ts. A rolling 30-day ceiling
 *  under the channel runs. The SQL default is 2,000; production runs 20,000. */
export const CHANNEL_CAP_30D = 20000;

export type TierSpec = {
  slug: TierSlug;
  name: string;
  usd: number;
  month: number;
  who: string;
  adds: string[];
  notFor: string[];
};

/** billing/tiers.ts:32 TIER_PRICE_USD, :39 DEFAULT_TIER_CREDITS,
 *  :74 DEFAULT_TIER_AGENT_MIN for the agent and channel lists. */
export const TIERS: TierSpec[] = [
  {
    slug: "free",
    name: "Free",
    usd: 0,
    month: 0,
    who: "You want to talk to Zavi and read what it finds, without handing over a card.",
    adds: [
      "Chat with Zavi",
      "Research and analysis",
      "13 agents: operator, research, advisor, cgo, growth-lead, pm, chief-of-staff, support-lead, qa, dispute-response, onboarding-discovery, seo-geo, supply-demand-balancer",
      "1,000 credits a day",
    ],
    notFor: ["No growth channel runs on Free. Channels start at Starter."],
  },
  {
    slug: "starter",
    name: "Starter",
    usd: 20,
    month: 8000,
    who: "One person working organic growth, with no ad account to plug in.",
    adds: [
      "Everything in Free",
      "The 9 organic channels: SEO, GEO, LinkedIn, Reddit, X, Instagram, TikTok, YouTube, UGC",
      "5 more agents: browser-operator, content-design, product-builder, performance-marketer, generated video",
      "8,000 credits a month, plus 1,000 a day",
    ],
    notFor: [
      "5 of those 9 organic channels read and recommend. They do not post.",
      "No ad channel, no influencer, no email, no SMS, no engineer, no fundraising.",
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    usd: 120,
    month: 48000,
    who: "You are running more channels, more often, and the pool is what ran out.",
    adds: ["Everything in Starter", "48,000 credits a month, plus 1,000 a day"],
    notFor: [
      "Growth unlocks no new channel and no new agent. In the code the only difference from Starter is the size of the credit pool.",
      "If you are not running out of credits on Starter, this buys you nothing.",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    usd: 240,
    month: 96000,
    who: "You are spending on ads, and you want the engineer and fundraising agents on the same account.",
    adds: [
      "Everything in Growth",
      "Google, Meta and YouTube ads: Zavi reads the account and proposes a change it applies once you approve it",
      "TikTok and ChatGPT ads: reads only, recommends, changes nothing",
      "LinkedIn and Reddit ads: research and a brief you act on yourself, no ad account is read",
      "Influencer and email campaigns",
      "SMS: drafts the message set, cannot send a text",
      "Engineer and fundraising agents",
      "96,000 credits a month, plus 1,000 a day",
    ],
    notFor: [
      "LinkedIn Ads, Reddit Ads and SMS have no connector and no tools. They research and draft. Nothing more.",
      "A tier unlocks a channel. It does not supply your accounts: without the connector linked, the channel drops to advice.",
    ],
  },
];

export function tierSpec(slug: TierSlug): TierSpec {
  return TIERS.find((t) => t.slug === slug) ?? TIERS[0];
}

export function nextTier(slug: TierSlug): TierSpec | null {
  const i = TIERS.findIndex((t) => t.slug === slug);
  return i >= 0 ? (TIERS[i + 1] ?? null) : null;
}

/** agents/credits.ts:39 RESERVE_ESTIMATE_CREDITS, :118 the default. */
export const HOLDS: [string, string][] = [
  ["Channel run (every channel)", "340"],
  ["Research, advisor, growth-lead, cgo", "320"],
  ["Browser operator", "240"],
  [
    "Operator, pm, qa, support-lead, chief-of-staff, dispute-response, performance-marketer",
    "160",
  ],
  ["Fundraising", "500"],
  ["Engineer build", "2,000"],
  ["Product builder", "2,400"],
];

/* ---------- channels ---------- */

export type Readiness = "live" | "read_only" | "planned";
export type ChannelCategory = "paid" | "organic" | "owned";

export type ChannelSpec = {
  slug: string;
  name: string;
  cat: ChannelCategory;
  ready: Readiness;
  /** Connector slugs the channel declares. Only keys in CONNECTOR_KEYS can be
   *  linked from this prototype; `youtube_organic` declares a Pipedream rail
   *  with no Settings tile, which is why its list is empty here and the row
   *  says so rather than offering a button that cannot work. */
  conn: ConnectorKey[];
  /** A connector the registry DOES declare but this page cannot link, because
   *  its descriptor carries `settingsTile: false`. Only youtube_organic has
   *  one today. Kept separate from `conn` so a count of "channels that declare
   *  no connector" stays true to the registry (8 of 19) while no button is
   *  offered that could not work. */
  unlinkable?: string;
  tier: TierSlug;
  needs: string;
  measured: string;
  does: string;
  line: string;
};

/** packages/shared/src/channels/registry.ts:304-1418. Nineteen rows, each
 *  readiness value re-read line by line against origin/main @ 8b3489333. */
export const CHANNELS: ChannelSpec[] = [
  {
    slug: "meta_ads",
    name: "Meta Ads",
    cat: "paid",
    ready: "live",
    conn: ["meta_ads"],
    tier: "pro",
    needs: "Meta Ads account",
    measured: "spend, cost per result, return on ad spend, click-through rate",
    does: "Reads campaigns, ad sets and ads, and proposes changes you approve.",
    line: "registry.ts:304",
  },
  {
    slug: "google_ads",
    name: "Google Ads",
    cat: "paid",
    ready: "live",
    conn: ["google_ads"],
    tier: "pro",
    needs: "Google Ads account",
    measured:
      "spend, cost per conversion, return on ad spend (needs conversion values), share of searches you appeared in (Search only)",
    does: "Reads campaigns, ad groups, keywords, search terms and change history. Its propose tools write an action carrying exec_class, and Approve runs the same dispatch, so an approved change is applied.",
    line: "registry.ts:381",
  },
  {
    slug: "youtube_ads",
    name: "YouTube Ads",
    cat: "paid",
    ready: "live",
    conn: ["google_ads"],
    tier: "pro",
    needs: "Google Ads account",
    measured: "spend, cost per view, view rate",
    does: "Shares the Google Ads tools and the Google Ads connector. Its actions stay on the decisions rail.",
    line: "registry.ts:440",
  },
  {
    slug: "tiktok_ads",
    name: "TikTok Ads",
    cat: "paid",
    ready: "read_only",
    conn: [],
    tier: "pro",
    needs: "Nothing to connect. You paste the numbers from Ads Manager.",
    measured: "plays on public posts, the numbers you paste from Ads Manager",
    does: "One tool, a paid-acquisition snapshot read. No connector. It recommends, it changes nothing.",
    line: "registry.ts:478",
  },
  {
    slug: "chatgpt_ads",
    name: "ChatGPT Ads",
    cat: "paid",
    ready: "read_only",
    conn: [],
    tier: "pro",
    needs: "Nothing to connect yet.",
    measured:
      "spend and clicks on the campaigns Zavi runs for you, CTR and CPC on those campaigns, attributed conversions on those campaigns, the numbers you paste from Ads Manager",
    does: "Reads only. Writes an ad a person places.",
    line: "registry.ts:658",
  },
  {
    slug: "linkedin_ads",
    name: "LinkedIn Ads",
    cat: "paid",
    ready: "planned",
    conn: [],
    tier: "pro",
    needs: "Nothing exists yet. The tile is here to show the gap.",
    measured: "nothing yet",
    does: 'No connector, no tools. It reads your public page and the LinkedIn Ad Library and writes a brief. It measures nothing: the registry row says measured_on is "nothing yet".',
    line: "registry.ts:557",
  },
  {
    slug: "reddit_ads",
    name: "Reddit Ads",
    cat: "paid",
    ready: "planned",
    conn: [],
    tier: "pro",
    needs: "Nothing exists yet. The tile is here to show the gap.",
    measured: "nothing yet",
    does: "No connector, no tools. It hands you finished ads that you paste into Ads Manager yourself. The ads-edit scope is deliberately not requested.",
    line: "registry.ts:615",
  },
  {
    slug: "influencer",
    name: "Influencer",
    cat: "paid",
    ready: "read_only",
    conn: ["google_analytics", "meta_ads"],
    tier: "pro",
    needs: "Google Analytics for the tagged link, Meta Ads for amplified posts",
    measured:
      "creators shortlisted, visits from the brief's tagged link, CPM on posts you amplify yourself",
    does: "Reads. Proposes a creator brief. It commissions nobody.",
    line: "registry.ts:1156",
  },
  {
    slug: "email_marketing",
    name: "Email campaigns",
    cat: "owned",
    ready: "live",
    conn: ["email"],
    tier: "pro",
    needs: "Email account",
    measured:
      "email authentication (SPF/DKIM/DMARC), where you capture signups, opens and clicks your email tool reports",
    does: "Drafts and sends through your email connector, behind an approval card.",
    line: "registry.ts:1332",
  },
  {
    slug: "sms",
    name: "SMS",
    cat: "owned",
    ready: "planned",
    conn: [],
    tier: "pro",
    needs: "Nothing exists yet. The tile is here to show the gap.",
    measured: "nothing yet",
    does: "No connector, no tools. It reads your phone-capture surface and your consent wording and drafts the message set. Nothing in the repo can send a text.",
    line: "registry.ts:1401",
  },
  {
    slug: "seo",
    name: "SEO",
    cat: "organic",
    ready: "read_only",
    conn: ["google_analytics", "google_search_console"],
    tier: "starter",
    needs: "Runs on your public site with nothing connected. Analytics and Search Console turn its advice into numbers.",
    measured: "organic sessions, indexed pages, rankings",
    does: "Reads Analytics and Search Console, audits, recommends. It does not publish.",
    line: "registry.ts:728",
  },
  {
    slug: "geo",
    name: "GEO",
    cat: "organic",
    ready: "read_only",
    conn: [],
    tier: "starter",
    needs: "Nothing to connect. It reads your public site.",
    measured:
      "AI crawler access, whether your page answers the question, off-site brand mentions",
    does: "One tool, an audit. No connector.",
    line: "registry.ts:773",
  },
  {
    slug: "linkedin_organic",
    name: "LinkedIn",
    cat: "organic",
    ready: "live",
    conn: ["linkedin_social"],
    tier: "starter",
    needs: "LinkedIn account",
    measured: "posts, reactions, comments",
    does: "Proposes a post and can publish it through the connector.",
    line: "registry.ts:853",
  },
  {
    slug: "reddit_organic",
    name: "Reddit",
    cat: "organic",
    ready: "read_only",
    conn: [],
    tier: "starter",
    needs: "Nothing to connect. It reads public permalinks.",
    measured: "answers drafted, posts drafted, communities researched",
    does: "Reads threads. No connector, so it cannot post.",
    line: "registry.ts:896",
  },
  {
    slug: "x_organic",
    name: "X",
    cat: "organic",
    ready: "live",
    conn: ["x_social"],
    tier: "starter",
    needs: "X account",
    measured: "posts, replies, impressions",
    does: "Proposes a post, publishes it, reads back post metrics.",
    line: "registry.ts:940",
  },
  {
    slug: "instagram_organic",
    name: "Instagram",
    cat: "organic",
    ready: "live",
    conn: ["instagram_social"],
    tier: "starter",
    needs: "Instagram account",
    measured: "posts, reach, saves",
    does: "Proposes and publishes through the Instagram Business connector.",
    line: "registry.ts:974",
  },
  {
    slug: "tiktok_organic",
    name: "TikTok",
    cat: "organic",
    ready: "read_only",
    conn: ["tiktok"],
    tier: "starter",
    needs: "TikTok account",
    measured: "posts, views, likes",
    does: "Reads with the connector linked. It does not post.",
    line: "registry.ts:1013",
  },
  {
    slug: "youtube_organic",
    name: "YouTube",
    cat: "organic",
    ready: "read_only",
    conn: [],
    unlinkable: "pipedream.youtube_analytics_api",
    tier: "starter",
    needs: "YouTube analytics, which rides a Pipedream rail with no Settings tile. Public view and subscriber counts read with no connector.",
    measured: "views, subscribers, watch time",
    does: "Reads analytics. It does not upload.",
    line: "registry.ts:1283",
  },
  {
    slug: "ugc",
    name: "UGC",
    cat: "organic",
    ready: "live",
    conn: [],
    tier: "starter",
    needs: "Nothing to connect. It writes briefs and searches the contractor bench.",
    measured: "briefs written, creators hired",
    does: "No connector by design. It briefs and produces; it commissions nobody, signs nothing and pays nobody.",
    line: "registry.ts:1073",
  },
];

export function channelSpec(slug: string): ChannelSpec | null {
  return CHANNELS.find((c) => c.slug === slug) ?? null;
}

/* ---------- the MCP surface ---------- */

/* apps/web/src/components/workspace/settings/McpClientsPanel.tsx:27 MCP_URL,
   :32-41 TOOLS (names verbatim), :43-59 CLIENTS. The what-lines and the client
   notes are rewritten here only to drop the arrow and dash characters. */
export const MCP_URL = "https://api.zaviagent.com/mcp";

export const MCP_TOOLS: [string, string][] = [
  ["zavi_ask", "Ask the operator anything. It scopes the work or hands off."],
  ["zavi_list_agents", "List the agents your workspace can run"],
  ["zavi_run_agent", "Run one agent by slug"],
  ["zavi_get_run_status", "Poll a run for status and result"],
  ["zavi_recent_runs", "Recent runs, newest first"],
  ["zavi_read_brain", "Read your company-brain notes"],
  ["zavi_search", "Search notes and runs"],
  ["zavi_fetch", "Fetch one search result in full"],
];

export const MCP_CLIENTS: [string, string, string][] = [
  [
    "Claude Code",
    `claude mcp add --transport http zavi ${MCP_URL}`,
    "Then run /mcp and complete the browser login.",
  ],
  [
    "claude.ai",
    MCP_URL,
    "Settings, Connectors, Add custom connector. Paste the URL, approve in the popup.",
  ],
  [
    "ChatGPT",
    MCP_URL,
    "Settings, Connectors (Developer Mode, admin-enabled workspace). Paste the URL, complete OAuth.",
  ],
];

/** Clipboard that still works when the async API is unavailable. */
export function copyText(text: string, done: () => void) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done, () => copyFallback(text, done));
    return;
  }
  copyFallback(text, done);
}

function copyFallback(text: string, done: () => void) {
  if (typeof document === "undefined") return;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {
    /* nothing else to try */
  }
  document.body.removeChild(ta);
  done();
}

/* ---------- goals ---------- */

/** apps/web/src/components/workspace/goalMetricOptions.ts:32-46. The four
 *  unmeasurable ones are listed on purpose: a founder's real goal is often one
 *  of them, and the hint tells the truth instead of pretending. */
export type MetricOption = {
  value: string;
  label: string;
  measurable: boolean;
  unit: "usd" | "count";
};

export const METRICS: MetricOption[] = [
  { value: "mrr", label: "MRR (monthly recurring revenue)", measurable: true, unit: "usd" },
  { value: "arr", label: "ARR (annual recurring revenue)", measurable: true, unit: "usd" },
  { value: "signups", label: "Signups", measurable: true, unit: "count" },
  { value: "bookings", label: "Bookings", measurable: true, unit: "count" },
  { value: "rentals", label: "Rentals", measurable: true, unit: "count" },
  { value: "activations", label: "Activations", measurable: true, unit: "count" },
  { value: "purchases", label: "Purchases", measurable: true, unit: "count" },
  { value: "gmv", label: "GMV (gross merchandise value)", measurable: false, unit: "usd" },
  { value: "suppliers", label: "Suppliers / hosts", measurable: false, unit: "count" },
  { value: "active users", label: "Active users", measurable: false, unit: "count" },
  { value: "retention", label: "Retention rate", measurable: false, unit: "count" },
];

export type GoalDataSource = { key: string; label: string; automatic: boolean };

/** Ported verbatim from apps/web/src/components/workspace/AutopilotGoalsPanel.tsx:119-140.
 *  The source is derived from the metric, not guessed from the channel: this is
 *  the system that will actually write current_value for the goal. */
export function dataSourceForMetric(metric: string): GoalDataSource {
  const normalized = (metric ?? "").toLowerCase().replace(/[_\-./]+/g, " ");
  if (/book|rental|reservation|\btrip/.test(normalized)) {
    return { key: "connected_database", label: "Connected database", automatic: true };
  }
  if (/\b(?:mrr|arr)\b/.test(normalized)) {
    return { key: "stripe", label: "Stripe", automatic: true };
  }
  if (/sign\s?up/.test(normalized)) {
    return { key: "connected_data", label: "Connected data", automatic: true };
  }
  if (/activat|purchase|order|sale|key\s?action/.test(normalized)) {
    return { key: "product_analytics", label: "Product analytics", automatic: true };
  }
  return { key: "manual", label: "Manual", automatic: false };
}

export type Goal = {
  id: string;
  objective: string;
  target_metric: string;
  metricLabel: string;
  target_value: number | null;
  current_value: number | null;
  due_date: string | null;
  status: "active";
  dataSource: string;
  automatic: boolean;
};

/* ---------- runs ---------- */

/** The envelope a channel action actually arrives on:
 *  apps/web/src/lib/workspace/channelActionsApi.ts:80-107. */
export type ChannelAction = {
  action_type: string;
  title: string;
  impact: number;
  impact_reason: string;
  blocking: boolean;
  status?: "pending" | "approved" | "rejected";
  channel_slug?: string;
  proposed_at?: string;
};

export type ChannelRun = {
  run_id: string;
  channel_slug: string;
  status: "queued" | "running" | "succeeded" | "failed";
  provenance: string;
  actions: ChannelAction[];
  cannot_see: string[];
  note: string;
};

export type ChannelState = {
  runs: ChannelRun[];
  actions: ChannelAction[];
  inPlan: boolean;
  autorun: boolean;
  lastError: { code: string; message: string } | null;
};

export const EMPTY_CHANNEL: ChannelState = {
  runs: [],
  actions: [],
  inPlan: false,
  autorun: false,
  lastError: null,
};

/* ---------- the state ---------- */

export type Company = {
  name: string;
  what: string;
  icp: string;
  competitors: string[];
};

/** Every tab this dashboard can show. `channels`, `channelDetail` and
 *  `runOutput` are declared here and routed by page.tsx; their components are
 *  the seam a second agent fills. */
export type TabId =
  | "home"
  | "plan"
  | "channels"
  | "channelDetail"
  | "runOutput"
  | "settings"
  | "upgrade";

export type V2State = {
  tab: TabId;
  company: Company | null;
  signedIn: boolean;
  tier: TierSlug;
  creditsDay: number;
  creditsMonth: number;
  /** slug to ChannelState. Sparse on purpose: a channel nobody has touched has
   *  no row. Read it through `channelState`, never by index. */
  channels: Record<string, ChannelState>;
  openChannel: string | null;
  /** Runs started in this session, across every channel. */
  runs: number;
  goals: Goal[];
  connectors: Record<ConnectorKey, ConnState>;
  /** Tabs visited, oldest first. The Upgrade tab's "Back to where I was" reads
   *  the last entry that was not itself the upgrade tab. */
  log: TabId[];
};

/** A brand-new tenant: signed in, nothing on file, nothing connected, no runs.
 *  Zeros here are correct. Zavi has no paying customers and launches the week
 *  of 2026-09-21, so there is nothing true to seed. */
export const FRESH_STATE: V2State = {
  tab: "home",
  company: null,
  signedIn: true,
  tier: "free",
  creditsDay: FREE_DAILY,
  creditsMonth: 0,
  channels: {},
  openChannel: null,
  runs: 0,
  goals: [],
  connectors: CONNECTOR_KEYS.reduce(
    (acc, k) => {
      acc[k] = "none";
      return acc;
    },
    {} as Record<ConnectorKey, ConnState>,
  ),
  log: ["home"],
};

/* ---------- the next-action resolver ---------- */

export type NextAction = {
  phase: (typeof PHASES)[number];
  job: string;
  cta: string;
  /** What the button does. `tab:<id>` switches tabs; `focus:<elementId>` also
   *  scrolls to and flashes that element once the tab has rendered. */
  act: string;
};

export const PHASES = ["Discover", "Set up", "First run", "Widen", "Running"] as const;

/** Deterministic. It is the first unmet step in the chain, computed from state
 *  on every render, never chosen by a screen. This is the spine of the design:
 *  if you can read the state you can predict the bar. */
export function nextAction(s: V2State): NextAction {
  if (!s.company) {
    return {
      phase: "Set up",
      job: "Tell Zavi what you sell",
      cta: "Add your company",
      act: "focus:d-company",
    };
  }
  if (!s.signedIn) {
    return {
      phase: "Set up",
      job: "Save this work to an account",
      cta: "Create account",
      act: "tab:settings",
    };
  }
  if (s.runs === 0) {
    return {
      phase: "First run",
      job: "Run one channel and read what comes back",
      cta: "Open channels",
      act: "tab:channels",
    };
  }
  const unconnected = CONNECTOR_KEYS.filter((k) => s.connectors[k] === "none").length;
  if (unconnected > 0) {
    return {
      phase: "Widen",
      job: `Zavi is guessing on ${unconnected} thing${unconnected > 1 ? "s" : ""} it cannot see`,
      cta: "Fix blind spots",
      act: "focus:d-blind",
    };
  }
  return {
    phase: "Running",
    job: "Review what is waiting for you",
    cta: "Open channels",
    act: "tab:channels",
  };
}

/* ---------- shared helpers ---------- */

export const n = (v: number | null | undefined) => Number(v ?? 0).toLocaleString("en-US");
export const money = (v: number) => "$" + Number(v ?? 0).toLocaleString("en-US");

export function connState(s: V2State, key: ConnectorKey): ConnState {
  return s.connectors[key] ?? "none";
}

/** A channel row, or the empty one. Never returns undefined, so a caller can
 *  read `.runs.length` without a guard. */
export function channelState(s: V2State, slug: string): ChannelState {
  return s.channels[slug] ?? EMPTY_CHANNEL;
}

/** Copy-on-write: returns a new channels map with `slug` present and filled. */
export function withChannel(
  s: V2State,
  slug: string,
  patch: Partial<ChannelState>,
): Record<string, ChannelState> {
  const prev = s.channels[slug] ?? EMPTY_CHANNEL;
  return { ...s.channels, [slug]: { ...prev, ...patch } };
}

/** Can this workspace afford a hold right now? Day grant plus monthly pool. */
export function afford(s: V2State, hold: number): boolean {
  return s.creditsDay + s.creditsMonth >= hold;
}

/** Spend `hold`, day grant first. Returns the two new balances. */
export function debit(s: V2State, hold: number): { creditsDay: number; creditsMonth: number } {
  const fromDay = Math.min(s.creditsDay, hold);
  return {
    creditsDay: s.creditsDay - fromDay,
    creditsMonth: s.creditsMonth - (hold - fromDay),
  };
}

/** Ported from apps/backend/src/routes/channels/list.ts:94-108 deliveryModeFor.
 *  `live` readiness means the channel holds write or propose tools; a linked
 *  connector is what makes them usable. Either half alone is not execute.
 *  Every channel has a recipe, so the floor here is always `produce`. */
export function deliveryMode(s: V2State, c: ChannelSpec): "execute" | "produce" {
  const linked = c.conn.some((k) => connState(s, k) === "connected");
  return c.ready === "live" && c.conn.length > 0 && linked ? "execute" : "produce";
}

/** Scroll an element into view and outline it once. Used by the next-action
 *  bar and by the usage panel's "start the first one". */
export function flash(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("d-flash");
  window.setTimeout(() => el.classList.remove("d-flash"), 1100);
}

/* ---------- the props every tab receives ---------- */

export type TabProps = {
  state: V2State;
  setState: Dispatch<SetStateAction<V2State>>;
  /** One line of feedback at the bottom of the screen. Clears itself. */
  toast: (msg: string) => void;
  /** Switch tabs. Records the move in `log` and scrolls to the top. */
  go: (tab: TabId) => void;
};
