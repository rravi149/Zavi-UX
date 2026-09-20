import Link from "next/link";
import type { ReactNode } from "react";
import V2Nav from "../_components/V2Nav";
import { Section, Row, Blind, Chip, Inert, SpecTable } from "../_components/kit";

/* SCREENS.pricing, ported from
   docs/wireframes/typesafe-ux/parts/50-commerce.js, with the rows from
   docs/wireframes/typesafe-ux/02-pricing-spec-sheet.html folded in.

   Every price, credit volume, hold, cap and readiness value on this page was
   re-read from the clean checkout at /tmp/zavi-main (praxis origin/main @
   8b3489333) before porting. The path:line citations printed in the rows are
   the ones that were checked, and where the wireframe and the code disagreed
   the code won. */

const TIERS_TS = "apps/backend/src/services/billing/tiers.ts";
const CREDITS_TS = "apps/backend/src/services/agents/credits.ts";
const PRICING_TS = "apps/backend/src/routes/public/pricing.ts";
const REGISTRY = "packages/shared/src/channels/registry.ts";
const PAGE_DATE = "2026-09-20";

/* tiers.ts:32 TIER_PRICE_USD · :39 DEFAULT_TIER_CREDITS
   pricing.ts:34 PUBLIC_FREE_DAILY_FALLBACK · migration
   20260917190000_three_tier_pricing.sql:44 sets free_daily_credits to 1000 */
const DAILY = 1000;
const CREDIT_USD = 0.0025;

const n = (v: number) => v.toLocaleString("en-US");
const usd = (v: number) => "$" + v.toLocaleString("en-US");

type Tier = {
  slug: string;
  name: string;
  usd: number;
  month: number;
  who: string;
  adds: string[];
  channels: string;
  notFor: string[];
};

const TIERS: Tier[] = [
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
      n(DAILY) + " credits a day, no card",
    ],
    channels: "None. Every growth channel starts at Starter.",
    notFor: ["No growth channel runs on Free. Channels start at Starter."],
  },
  {
    slug: "starter",
    name: "Starter",
    usd: 20,
    month: 8_000,
    who: "One person working organic growth, with no ad account to plug in.",
    adds: [
      "Everything in Free",
      "5 more agents: browser-operator, content-design, product-builder, performance-marketer, generated video",
      n(8_000) + " credits a month, plus " + n(DAILY) + " a day",
    ],
    channels:
      "The 9 organic channels: SEO, GEO, LinkedIn, Reddit, X, Instagram, TikTok, YouTube, UGC.",
    notFor: [
      "5 of those 9 organic channels read and recommend. They do not post.",
      "No ad channel, no influencer, no email, no SMS, no engineer, no fundraising.",
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    usd: 120,
    month: 48_000,
    who: "You are running more channels, more often, and the pool is what ran out.",
    adds: ["Everything in Starter", n(48_000) + " credits a month, plus " + n(DAILY) + " a day"],
    channels: "The same 9 as Starter. Growth unlocks no channel Starter does not have.",
    notFor: [
      "Growth unlocks no new channel and no new agent. In the code the only difference from Starter is the size of the credit pool: 48,000 a month instead of 8,000.",
      "If you are not running out of credits on Starter, this buys you nothing.",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    usd: 240,
    month: 96_000,
    who: "You are spending on ads, and you want the engineer and fundraising agents on the same account.",
    adds: [
      "Everything in Growth",
      "Google, Meta and YouTube ads: Zavi reads the account and proposes a change it applies once you approve it",
      "TikTok and ChatGPT ads: reads only, recommends, changes nothing",
      "LinkedIn and Reddit ads: research and a brief you act on yourself, no ad account is read",
      "Email campaigns that send behind an approval, and influencer briefs",
      "SMS: drafts the message set, it cannot send a text",
      "Engineer and fundraising agents",
      n(96_000) + " credits a month, plus " + n(DAILY) + " a day",
    ],
    channels:
      "The 9 organic, plus 10 more: Google Ads, Meta Ads, YouTube Ads, TikTok Ads, ChatGPT Ads, LinkedIn Ads, Reddit Ads, Influencer, Email campaigns, SMS.",
    notFor: [
      "LinkedIn Ads, Reddit Ads and SMS have no connector and no tools. They research and draft. Nothing more.",
      "A tier unlocks a channel. It does not supply your accounts: without the connector linked, the channel drops to advice.",
    ],
  },
];

/* credits.ts:39 RESERVE_ESTIMATE_CREDITS · :118 DEFAULT_RESERVE_ESTIMATE_CREDITS */
const HOLDS: Array<[string, string]> = [
  ["Channel run, every channel", "340"],
  ["Research, advisor, growth-lead, cgo", "320"],
  ["Browser operator", "240"],
  ["Operator, pm, qa, support-lead, chief-of-staff, dispute-response, performance-marketer", "160"],
  ["Fundraising", "500"],
  ["Engineer build", "2,000"],
  ["Product builder", "2,400"],
];

/* apps/web/src/components/marketing/PricingPlans.tsx:441 COST_ROWS */
const PUBLISHED_COSTS: Array<[string, string]> = [
  ["Draft texts", "100 to 300"],
  ["Generate variations", "100 to 300"],
  ["Prototypes", "2,000 to 5,000"],
];

/* registry.ts, 19 rows, each slug line re-checked. `plan` is the lowest tier
   allowed to run the slug, from tiers.ts:74 DEFAULT_TIER_AGENT_MIN. */
const CHANNELS: Array<{
  name: string;
  plan: string;
  does: string;
  state: "live" | "read_only" | "planned";
}> = [
  { name: "Google Ads", plan: "Pro", state: "live", does: "Reads campaigns, ad groups, keywords and search terms, and applies the change you approve" },
  { name: "Meta Ads", plan: "Pro", state: "live", does: "Reads campaigns, ad sets and ads, and applies the change you approve" },
  { name: "YouTube Ads", plan: "Pro", state: "live", does: "Shares the Google Ads connector and tools, same approval rail" },
  { name: "TikTok Ads", plan: "Pro", state: "read_only", does: "One read, a paid-acquisition snapshot. No connector. Recommends only" },
  { name: "ChatGPT Ads", plan: "Pro", state: "read_only", does: "Reads only. Writes an ad a person places" },
  { name: "LinkedIn Ads", plan: "Pro", state: "planned", does: "No connector, no tools. Reads your public page and the Ad Library, writes a brief" },
  { name: "Reddit Ads", plan: "Pro", state: "planned", does: "No connector, no tools. Hands you finished ads you paste into Ads Manager" },
  { name: "Influencer", plan: "Pro", state: "read_only", does: "Reads Analytics and Meta Ads. Proposes a creator brief. Commissions nobody" },
  { name: "Email campaigns", plan: "Pro", state: "live", does: "Drafts and sends through your email connector, behind an approval" },
  { name: "SMS", plan: "Pro", state: "planned", does: "No connector, no tools. Drafts the message set. Cannot send a text" },
  { name: "SEO", plan: "Starter", state: "read_only", does: "Reads Analytics and Search Console, audits, recommends. Does not publish" },
  { name: "GEO", plan: "Starter", state: "read_only", does: "One audit. No connector" },
  { name: "LinkedIn", plan: "Starter", state: "live", does: "Proposes a post and publishes it through the connector" },
  { name: "Reddit", plan: "Starter", state: "read_only", does: "Reads threads. No connector, so it cannot post" },
  { name: "X", plan: "Starter", state: "live", does: "Proposes a post, publishes it, reads back post metrics" },
  { name: "Instagram", plan: "Starter", state: "live", does: "Proposes and publishes through the Instagram Business connector" },
  { name: "TikTok", plan: "Starter", state: "read_only", does: "Reads with the connector linked. It does not post" },
  { name: "YouTube", plan: "Starter", state: "read_only", does: "Reads analytics. It does not upload" },
  { name: "UGC", plan: "Starter", state: "live", does: "No connector by design. Briefs and produces. Commissions nobody" },
];

const STATE_LABEL: Record<"live" | "read_only" | "planned", { label: string; kind?: "on" | "warn" }> = {
  live: { label: "Can act", kind: "on" },
  read_only: { label: "Reads only" },
  planned: { label: "Not built", kind: "warn" },
};

const PROVENANCE: Array<[string, string]> = [
  ["$0 / $20 / $120 / $240 a month", `${TIERS_TS}:32 TIER_PRICE_USD`],
  ["8,000 / 48,000 / 96,000 credits a month", `${TIERS_TS}:39 DEFAULT_TIER_CREDITS`],
  ["1,000 free credits a day, every plan", `${PRICING_TS}:34, migration 20260917190000_three_tier_pricing.sql:44`],
  ["$0.0025 per credit", `${CREDITS_TS}:15 CREDIT_USD`],
  ["A run debits ceil(cost in USD / 0.0025)", `${CREDITS_TS}:22 costToCredits`],
  ["The daily grant refills, it does not accumulate", "migration 20260901190000_free_tier_daily_credit_replenish.sql:5"],
  ["Top-up packs $20 / $120 / $240", `${TIERS_TS}:46 TOPUP_USD_PACKS, ${PRICING_TS}:89`],
  ["Which plan may run which agent", `${TIERS_TS}:74 DEFAULT_TIER_AGENT_MIN`],
  ["An unmapped agent slug needs Pro", `${TIERS_TS}:121 requiredTierFor`],
  ["The plan gate is off until a config flag is on", `${TIERS_TS}:16, :171 tier_gate_enforced`],
  ["Published run ranges, 100 to 300 and 2,000 to 5,000", "apps/web/src/components/marketing/PricingPlans.tsx:441 COST_ROWS"],
  ["Holds of 160 / 240 / 320 / 340 / 500 / 2,000 / 2,400", `${CREDITS_TS}:39, :118`],
  ["20,000 credits per 30 days, about 59 channel runs", `${CREDITS_TS}:62, apps/backend/src/services/channels/budget.ts:13`],
  ["Twelve prod channel runs measured at $0.57 to $1.08, median $0.85", `${CREDITS_TS}:54-64`],
  ["live, read only and planned, per channel", `${REGISTRY}, 19 rows`],
  ["The Pro copy this page argues with", `${PRICING_TS}:61-68`],
  ["Enterprise price, credit volume, SLA, security-review scope", "[NEEDS SOURCE], not defined anywhere in the repo"],
];

const CTA_ROW = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } as const;
const COLS = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 32px", margin: "2px 0 4px" } as const;
const TOPGAP = { marginTop: 14 } as const;
const NO_UNDERLINE = { textDecoration: "none" } as const;
const FIG = { textTransform: "none", fontSize: 12.5 } as const;

/** Two hairline key/value tables side by side. The spec-sheet shape, kit only. */
function Cols({
  a,
  b,
}: {
  a: { head: string[]; rows: ReactNode[][] };
  b: { head: string[]; rows: ReactNode[][] };
}) {
  return (
    <div style={COLS}>
      <SpecTable head={a.head} rows={a.rows} />
      <SpecTable head={b.head} rows={b.rows} />
    </div>
  );
}

const one = (xs: string[]): ReactNode[][] => xs.map((x) => [x]);
const fig = (v: string, key: string) => (
  <span key={key} className="mono" style={FIG}>
    {v}
  </span>
);

export const metadata = {
  title: "Zavi pricing",
  description:
    "Four self-serve plans, one agent. What changes is the credit pool and which channels are unlocked. Every figure is cited to the line of code it came from.",
};

export default function V2Pricing() {
  return (
    <>
      <V2Nav />
      <main className="screen">
        <div className="kicker">Pricing · rev {PAGE_DATE}</div>
        <h1 className="h1">Four self-serve plans.</h1>
        <p className="lede">
          Zavi is one growth agent that reads your own accounts, proposes the next action and
          executes it once you approve. A plan changes two things: the size of your credit pool,
          and which channels are unlocked.
        </p>
        <p style={{ marginBottom: 26 }}>
          <Link href="#limits" className="inert" style={NO_UNDERLINE}>
            Read the limits first
          </Link>
        </p>

        <Section
          num="00"
          label="Plans"
          framing="Four self-serve tiers and one sales-led tier. Every tier runs the same agent. What changes is the credit pool and which channels are unlocked."
        >
          {TIERS.map((t) => (
            <Row
              key={t.slug}
              title={t.name}
              sub={t.who}
              meta={t.usd === 0 ? "$0 / mo" : usd(t.usd) + " / mo"}
              open={t.slug === "pro"}
              src={`${TIERS_TS}:32 TIER_PRICE_USD, :39 DEFAULT_TIER_CREDITS, :74 DEFAULT_TIER_AGENT_MIN`}
            >
              <Cols
                a={{ head: ["Included"], rows: one(t.adds) }}
                b={{
                  head: ["Credits", ""],
                  rows: [
                    ["Monthly pool", t.month ? n(t.month) : "none"],
                    ["Daily grant", n(DAILY)],
                    ["Card required", t.usd === 0 ? "no" : "yes"],
                    [
                      "Top-up pack",
                      t.usd === 0 ? "not on Free" : `${usd(t.usd)}, ${n(t.month)} credits`,
                    ],
                  ],
                }}
              />
              <p style={TOPGAP}>
                <span className="mono">Channels unlocked</span>
                <br />
                {t.channels}
              </p>
              <div style={TOPGAP}>
                <Blind what="What this tier does not do" why={t.notFor[0]} impact={t.notFor[1]} />
              </div>
              <div style={TOPGAP}>
                <Link href="/v2/start" className="btn" style={NO_UNDERLINE}>
                  Start on {t.name}
                </Link>
              </div>
            </Row>
          ))}

          <Row
            title="Enterprise"
            sub="Above the top self-serve rung. Everything here is a conversation."
            meta="Contact"
            src="not defined anywhere in the repo"
          >
            <p>
              More credits, invoicing, a security review and an SLA. Sales-led: there is no
              self-serve Enterprise checkout anywhere in the product.
            </p>
            <p className="needs-source">
              [NEEDS SOURCE] The repo defines no Enterprise price, no credit volume, no SLA target
              and no security-review scope. Those numbers have to come from Ravi before this row can
              say anything more specific.
            </p>
            <div style={TOPGAP}>
              <Inert>Talk to us</Inert>
            </div>
          </Row>
        </Section>

        <Section
          num="01"
          label="How credits work"
          framing="One credit is a unit of model work. Credits are the only meter. There are no seats, no minimums and no per-feature add-ons."
        >
          <Row
            title={`One credit is $${CREDIT_USD} of model work`}
            sub="Every plan's pool divides back to the same rate."
            meta={`$${CREDIT_USD} / credit`}
            open
            src={`${CREDITS_TS}:15 CREDIT_USD, :22 costToCredits`}
          >
            <p>
              A run is charged on what it actually cost to serve, divided by $0.0025 and rounded up
              to the next credit. 8,000 at $0.0025 is $20, 48,000 is $120, 96,000 is $240. The
              credits are sold at the cost of the work.
            </p>
            <Cols
              a={{
                head: ["Sell side", ""],
                rows: [
                  ["Starter", "8,000 for $20"],
                  ["Growth", "48,000 for $120"],
                  ["Pro", "96,000 for $240"],
                ],
              }}
              b={{
                head: ["Burn side", ""],
                rows: [
                  ["Debit", "run cost in USD / $0.0025, rounded up"],
                  ["Unused hold", "refunded at settle"],
                ],
              }}
            />
          </Row>

          <Row
            title={`${n(DAILY)} free credits every day, on every plan`}
            sub="Granted daily, no card. Paid tiers get it on top of their monthly pool."
            meta={`${n(DAILY)} / day`}
            src={`${PRICING_TS}:34, migration 20260917190000_three_tier_pricing.sql:44, ${CREDITS_TS}:285`}
          >
            <p>
              The daily grant refills to {n(DAILY)} at the day boundary. It does not accumulate: an
              unused day is gone. That is also what caps how much any one account can hold at once,
              which is why it works with no card.
            </p>
            <p>
              The value is staff-configurable and read live, not hardcoded. It was 5,000 before
              2026-09-17 and is {n(DAILY)} today. Note for anyone reading the code: the SQL fallback
              in the older migration is still 2,000, so read the config, not the migration.
            </p>
          </Row>

          <Row
            title="Paid credits pool monthly, and reset monthly"
            sub="The monthly pool is what buys a big build. It refills at the roll, it does not carry forward."
            meta="reset monthly"
            src="migration 20260901190000_free_tier_daily_credit_replenish.sql:5"
          >
            <p>
              Your included allowance resets when the billing period rolls. Credits bought as a
              one-time top-up sit in a separate balance the roll does not touch, so a pack you
              bought is still there next month.
            </p>
            <Cols
              a={{
                head: ["Resets"],
                rows: one(["The daily grant, every day", "The monthly pool, every period"]),
              }}
              b={{ head: ["Does not reset"], rows: one(["One-time top-up packs"]) }}
            />
          </Row>

          <Row
            title="What a run costs"
            sub="A channel run is the unit you will hit most often."
            meta="160 to 2,400 credits"
            src={`${CREDITS_TS}:39 RESERVE_ESTIMATE_CREDITS, :118 DEFAULT_RESERVE_ESTIMATE_CREDITS, apps/web/src/components/marketing/PricingPlans.tsx:441 COST_ROWS`}
          >
            <Cols
              a={{
                head: ["Published range", ""],
                rows: PUBLISHED_COSTS.map((r) => [r[0], r[1]]),
              }}
              b={{ head: ["Held at dispatch", ""], rows: HOLDS.map((r) => [r[0], r[1]]) }}
            />
            <p style={TOPGAP}>
              The hold is an estimate taken before the run. The unused part is returned when the run
              settles, so you pay the real cost. 340 is not a guess: twelve completed channel runs
              were measured in prod on 2026-09-04 at $0.57 to $1.08, median $0.85.
            </p>
            <p>
              Worked example on Starter: 8,000 monthly credits plus roughly 30,000 daily credits
              across a month covers about 111 channel runs at 340 each, if you spend nothing else.
              One engineer build takes 2,000 of that.
            </p>
          </Row>

          <Row
            title="Top-up packs"
            sub="One-time purchase when a month runs short."
            meta="$20 / $120 / $240"
            src={`${TIERS_TS}:46 TOPUP_USD_PACKS, ${PRICING_TS}:89`}
          >
            <Cols
              a={{
                head: ["Pack", "Credits"],
                rows: [
                  ["$20", "8,000"],
                  ["$120", "48,000"],
                  ["$240", "96,000"],
                ],
              }}
              b={{
                head: ["Behaviour"],
                rows: one([
                  "One-time, not a subscription",
                  "Survives the period roll",
                  "Same rate as the tiers",
                ]),
              }}
            />
            <p style={TOPGAP}>
              A pack's credits are the monthly pool of the paid tier at the same price. That is
              computed in the code, not typed twice.
            </p>
          </Row>
        </Section>

        <Section
          num="02"
          id="limits"
          label="Limits"
          framing="What you do not get, at the same weight as what you do. Read this before you pick a tier for one specific channel."
        >
          <Row
            title="Three channels sold on Pro are not built"
            sub="They research and draft. They cannot read an ad account or send a message."
            meta="03"
            open
            src={`${REGISTRY}:557 linkedin_ads, :615 reddit_ads, :1401 sms, ${PRICING_TS}:63`}
          >
            <Blind
              what="LinkedIn Ads, Reddit Ads and SMS have no connector and no tools"
              why="All three are marked planned in the channel registry. Planned means the registry row declares an empty connector list and an empty tool list, so there is nothing to read an ad account with, let alone change one. All three record what they measure as the words nothing yet."
              impact="Do not buy Pro for one of these three."
            />
            <SpecTable
              head={["Channel", "What it actually does"]}
              rows={[
                [
                  "LinkedIn Ads",
                  "Reads your public page and the LinkedIn Ad Library and writes a brief. Its own registry row records what it measures as nothing yet.",
                ],
                [
                  "Reddit Ads",
                  "Hands you finished ads. You paste them into Ads Manager yourself. The ads-edit scope is deliberately not requested.",
                ],
                [
                  "SMS",
                  "Reads your phone-capture surface and your consent wording and drafts the message set. Nothing in the repo can send a text.",
                ],
              ]}
            />
            <p style={TOPGAP}>
              This is worth stating plainly because the public tier copy currently sells all three
              by name alongside the ad channels that do work.
            </p>
          </Row>

          <Row
            title="Eight channels can recommend, not act"
            sub="They read and diagnose. They do not post, buy or publish."
            meta="04"
            open
            src={`${REGISTRY} readiness field, 19 rows counted`}
          >
            <p>
              These eight are marked read only: they hold read tools, so they measure and recommend,
              and no write tools, so they do not execute.
            </p>
            <Cols
              a={{ head: ["Read only"], rows: one(["SEO", "GEO", "Reddit", "TikTok"]) }}
              b={{ head: [" "], rows: one(["YouTube", "Influencer", "TikTok Ads", "ChatGPT Ads"]) }}
            />
            <p style={TOPGAP}>
              Eight can execute today: Google Ads, Meta Ads, YouTube Ads, LinkedIn, X, Instagram,
              UGC, Email campaigns. Nineteen channels in total, so eight act, eight advise, three
              are not built.
            </p>
          </Row>

          <Row
            title="Eleven channels need an account you connect"
            sub="Without the connector linked, the channel drops to advice, whatever your tier."
            meta="05"
            src={`${REGISTRY} connectors field, 11 rows non-empty`}
          >
            <p>
              A tier unlocks a channel. It does not supply your accounts. A channel only executes
              when its connector is linked, so paying for Pro with no Google Ads account still gets
              you a recommendation, not a change.
            </p>
            <Cols
              a={{
                head: ["Channel", "Connector needed"],
                rows: [
                  ["Google Ads", "Google Ads"],
                  ["YouTube Ads", "Google Ads"],
                  ["Meta Ads", "Meta Ads"],
                  ["SEO", "Analytics + Search Console"],
                  ["LinkedIn", "LinkedIn"],
                  ["X", "X"],
                ],
              }}
              b={{
                head: [" ", "  "],
                rows: [
                  ["Instagram", "Instagram Business"],
                  ["TikTok", "TikTok"],
                  ["YouTube", "YouTube Analytics"],
                  ["Email campaigns", "Email"],
                  ["Influencer", "Analytics + Meta Ads"],
                ],
              }}
            />
          </Row>

          <Row
            title="Channel spend is capped per 30 days, on top of your plan"
            sub="A separate ceiling under the channel runs, unaffected by your plan."
            meta="20,000 credits / 30d"
            open
            src={`${CREDITS_TS}:62, apps/backend/src/services/channels/budget.ts:13 (SQL default 2,000, prod 20,000)`}
          >
            <p>
              Channel runs draw against a rolling 30-day cap, 20,000 credits in production. At the
              measured 340 credits a run that is roughly 59 channel runs in any 30-day window. The
              cap exists so a scheduled channel cannot quietly drain an account, and it fails
              closed: an error reading the budget denies the run.
            </p>
            <p>
              This is independent of your tier. Buying Pro raises your monthly pool. It does not
              raise this cap.
            </p>
          </Row>

          <Row
            title="Free does not run growth channels"
            sub="Free is chat, research and analysis. No channel executes on it."
            meta="00"
            src={`${TIERS_TS}:74 DEFAULT_TIER_AGENT_MIN, free block`}
          >
            <p>
              Free covers the conversational and analytical agents: operator, research, advisor,
              cgo, growth-lead, pm, chief-of-staff, support-lead, qa, dispute-response,
              onboarding-discovery, seo-geo and supply-demand-balancer. Anything that runs a channel
              starts at Starter.
            </p>
          </Row>

          <Row
            title="Growth adds credits, nothing else"
            sub="You are buying pool size, not features."
            meta="01"
            src={`${TIERS_TS}:74, no agent slug maps to growth`}
          >
            <p>
              Every capability on Growth is already on Starter. If you are on Starter and you are
              not running out of credits, Growth will not give you a new channel, a new agent or a
              new report. Buy it when the pool is the constraint, not before.
            </p>
          </Row>

          <Row
            title="An agent with no tier assigned defaults to Pro"
            sub="Deny-by-default, in both the app and the database."
            meta="02"
            src={`${TIERS_TS}:121 requiredTierFor, :16 and :171 tier_gate_enforced`}
          >
            <p>
              The gate is deny-by-default. A slug missing from the tier map needs Pro, which means a
              new capability can never leak downward into a cheaper tier by being forgotten.
            </p>
            <p>
              One consequence worth knowing: the gate itself is off until a config flag is on.
              Flipping it changes what existing free tenants can run, so it is a deliberate
              decision, not a default.
            </p>
          </Row>

          <Row
            title="Credits do not roll over"
            sub="Daily expires daily. The monthly pool resets at the period roll."
            meta="no rollover"
            src="migration 20260901190000_free_tier_daily_credit_replenish.sql:5, refill-to-N not accumulate"
          >
            <p>
              Plan for the month you are in. An unspent daily grant is gone at the day boundary and
              an unspent monthly pool is gone at the roll. Only one-time top-up packs survive.
            </p>
          </Row>

          <Row
            title="Zavi proposes and executes behind a gate. It does not own the metric yet."
            sub="On our own autonomy ladder, Zavi is L2 to L3."
            meta="L2 to L3"
            open
            src="repo CLAUDE.md, autonomy ladder"
          >
            <Cols
              a={{
                head: ["Where Zavi is", ""],
                rows: [
                  ["L2", "propose"],
                  ["L3", "execute with a gate"],
                ],
              }}
              b={{
                head: ["Not yet", ""],
                rows: [
                  ["L4", "own the metric"],
                  ["L5", "own growth"],
                ],
              }}
            />
            <p style={TOPGAP}>
              Five things have to exist before anyone should call an agent L4: eval coverage you can
              trust on a run nobody watched, a spend guardrail enforced outside the model,
              attribution that proves cause rather than coincidence, a rollback that fires before a
              bad run costs money, and one measured win you can show a stranger. We do not clear
              that bar today, and no surface here says otherwise.
            </p>
          </Row>
        </Section>

        <Section
          num="03"
          label="Compare"
          framing="The same facts as 00 and 02 in one grid. Nothing here is unique to this table."
        >
          <SpecTable
            head={["Capability", "Free", "Starter", "Growth", "Pro"]}
            rows={[
              ["Price per month", "$0", "$20", "$120", "$240"],
              ["Free credits a day", "1,000", "1,000", "1,000", "1,000"],
              ["Credit pool a month", "none", "8,000", "48,000", "96,000"],
              ["Chat, research and analysis", "yes", "yes", "yes", "yes"],
              ["9 organic channels", "no", "yes", "yes", "yes"],
              ["Product builder and content design", "no", "yes", "yes", "yes"],
              ["Ads that can change the account: Google, Meta, YouTube", "no", "no", "no", "yes"],
              ["Ads that read only: TikTok, ChatGPT", "no", "no", "no", "yes"],
              ["Ads with no account access: LinkedIn, Reddit", "no", "no", "no", "brief only"],
              ["Influencer briefs, and email that can send", "no", "no", "no", "yes"],
              ["SMS", "no", "no", "no", "drafts only"],
              ["Engineer and fundraising agents", "no", "no", "no", "yes"],
              ["Top-up packs", "no", "yes", "yes", "yes"],
              ["Credits roll over", "no", "no", "no", "no"],
              ["Channel cap per 30 days", "n/a", "20,000", "20,000", "20,000"],
            ].map((r) => [r[0], ...r.slice(1).map((c, i) => fig(c, r[0] + i))])}
          />
          <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
            Enterprise sits above Pro: more credits, invoicing, a security review and an SLA,
            sales-led. The specific numbers are not defined in the product and are marked [NEEDS
            SOURCE] above.
          </p>

          <div className="hr" />

          <p className="kicker">All 19 channels, by plan</p>
          <SpecTable
            head={["Channel", "Plan", "State", "What it does"]}
            rows={CHANNELS.map((c) => [
              c.name,
              fig(c.plan, c.name + "-plan"),
              <Chip key={c.name + "-state"} kind={STATE_LABEL[c.state].kind}>
                {STATE_LABEL[c.state].label}
              </Chip>,
              c.does,
            ])}
          />
          <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
            Source: {REGISTRY}, 19 rows, and {TIERS_TS}:74 for the plan column.
          </p>
        </Section>

        <Section
          num="04"
          label="Provenance"
          framing="Wireframe only, not for the live page. Every figure above, and where it was read from."
        >
          <SpecTable
            head={["Figure", "Read from"]}
            rows={PROVENANCE.map(([figure, src]) => [
              figure,
              <span key={figure} className="mono" style={{ textTransform: "none", fontSize: 11 }}>
                {src}
              </span>,
            ])}
          />
        </Section>

        <Section
          num="05"
          label="Start"
          framing={`${n(DAILY)} credits a day, no card. If it is not moving your number you have not spent anything.`}
        >
          <div style={{ ...CTA_ROW, padding: "8px 0" }}>
            <Link href="/v2/start" className="btn dark" style={NO_UNDERLINE}>
              Start free
            </Link>
            <Inert>Talk to us</Inert>
          </div>
        </Section>
      </main>
    </>
  );
}
