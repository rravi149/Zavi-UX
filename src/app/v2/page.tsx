import Link from "next/link";
import V2Nav from "./_components/V2Nav";
import { Section, Row, FlatRow, Blind, Chip, Inert, SpecTable } from "./_components/kit";

/* SCREENS.landing, ported from
   docs/wireframes/typesafe-ux/parts/10-marketing.js.

   Every product fact on this page was re-read from the clean checkout at
   /tmp/zavi-main (praxis origin/main @ 8b3489333) before porting. The
   path:line citations printed in the rows are the ones that were checked. */

const REGISTRY = "packages/shared/src/channels/registry.ts";
const PAGE_DATE = "2026-09-20";

type Readiness = "live" | "read_only" | "planned";

const READINESS: Record<Readiness, { label: string; kind?: "on" | "warn" }> = {
  live: { label: "Can act", kind: "on" },
  read_only: { label: "Reads and drafts" },
  planned: { label: "Nothing connected", kind: "warn" },
};

/* Name, group, readiness and the one-line description are verbatim registry
   values. All 19 rows re-checked against the registry before porting. */
const CHANNELS: Array<{
  slug: string;
  name: string;
  cat: "paid" | "organic" | "owned";
  readiness: Readiness;
  desc: string;
}> = [
  { slug: "meta_ads", name: "Meta Ads", cat: "paid", readiness: "live", desc: "Paid acquisition on Facebook and Instagram." },
  { slug: "google_ads", name: "Google Ads", cat: "paid", readiness: "live", desc: "Paid Search and Performance Max campaign actions." },
  { slug: "youtube_ads", name: "YouTube Ads", cat: "paid", readiness: "live", desc: "Video campaigns bought through Google Ads." },
  { slug: "tiktok_ads", name: "TikTok Ads", cat: "paid", readiness: "read_only", desc: "Paid acquisition on TikTok." },
  { slug: "linkedin_ads", name: "LinkedIn Ads", cat: "paid", readiness: "planned", desc: "Paid B2B acquisition on LinkedIn." },
  { slug: "reddit_ads", name: "Reddit Ads", cat: "paid", readiness: "planned", desc: "Paid acquisition on Reddit." },
  { slug: "chatgpt_ads", name: "ChatGPT Ads", cat: "paid", readiness: "read_only", desc: "Paid acquisition in ChatGPT answers." },
  { slug: "influencer", name: "Influencer", cat: "paid", readiness: "read_only", desc: "Creator partnerships and sponsored placements." },
  { slug: "seo", name: "SEO", cat: "organic", readiness: "read_only", desc: "Non-paid search traffic and the pages that earn it." },
  { slug: "geo", name: "GEO", cat: "organic", readiness: "read_only", desc: "Whether AI assistants can read the site and cite the brand." },
  { slug: "linkedin_organic", name: "LinkedIn", cat: "organic", readiness: "live", desc: "Unpaid posting and presence on LinkedIn." },
  { slug: "reddit_organic", name: "Reddit", cat: "organic", readiness: "read_only", desc: "Find buyer questions and prepare helpful answers, plus one community-native post." },
  { slug: "x_organic", name: "X", cat: "organic", readiness: "live", desc: "Unpaid posting and presence on X." },
  { slug: "instagram_organic", name: "Instagram", cat: "organic", readiness: "live", desc: "Unpaid posting and presence on Instagram." },
  { slug: "tiktok_organic", name: "TikTok", cat: "organic", readiness: "read_only", desc: "Unpaid short-form video on TikTok." },
  { slug: "ugc", name: "UGC", cat: "organic", readiness: "live", desc: "Creator-produced assets the company runs on its own channels. Buys craft, not audience, the sibling of Influencer, which buys audience." },
  { slug: "youtube_organic", name: "YouTube", cat: "organic", readiness: "read_only", desc: "Owned video channel and its search surface." },
  { slug: "email_marketing", name: "Email campaigns", cat: "owned", readiness: "live", desc: "One-off sends to your own list." },
  { slug: "sms", name: "SMS", cat: "owned", readiness: "planned", desc: "Text messaging to your own list." },
];

const LIMITS: Array<{ what: string; why: string; src: string }> = [
  {
    what: "Zavi is not L4. It does not own a number unattended",
    why: "The ladder we scope against is L0 manual, L1 assist, L2 propose, L3 execute with a gate, L4 own the metric, L5 own growth. Zavi is L2 to L3. Five bars have to exist before anything here may be called L4: eval coverage, a spend guardrail enforced outside the model, attribution, rollback, and one measured attributed win we could show a stranger. We do not clear that bar yet.",
    src: "CLAUDE.md:15",
  },
  {
    what: "Zero paying customers. No case studies, no testimonials, no logo wall",
    why: "Zavi is pre-launch and goes public the week of 2026-09-21. There is no customer receipt to show you, so this page does not manufacture one. The provenance we do have is Upcar, a live marketplace this fleet runs, and that is our own company rather than a customer win.",
    src: "CLAUDE.md:17",
  },
  {
    what: "No write path to your website",
    why: "The SEO and GEO channels produce paste-ready titles, an answer block, the structured data worth adding and a first-draft page. They do not edit your site. Every step is performed by you or your developer.",
    src: "apps/backend/src/agents/geo/agent.md:15",
  },
  {
    what: "If your site refuses our fetch, Zavi is blind and the run says so",
    why: "A 403, a bot challenge, a consent wall or an oversized page all mean the same thing: we could not read it. That becomes the first line of the output. A well-defended site returns a thinner run, and we prefer that to a confident backwards answer.",
    src: "apps/backend/src/channels/_base/recipe-base.md:141",
  },
  {
    what: "No keyword rankings without Search Console. No traffic estimates, ever",
    why: "Search Console is the only first-party source of a real search position. Analytics gives sessions, and sessions are not rankings. Zavi will not turn either into an estimated traffic number for a page you do not have yet.",
    src: "apps/backend/src/agents/seo/agent.md:163-168",
  },
  {
    what: "AI-answer visibility is diagnosed, never measured",
    why: "Zavi can tell you which AI crawlers your robots.txt admits, whether a self-contained answer survives a JavaScript-free fetch, and whether the brand exists off-site. It cannot give you a citation count, a share of voice or a percentage of AI answers. Those would be invented.",
    src: "apps/backend/src/agents/seo/agent.md:170-172",
  },
  {
    what: "Three channels are a row on a page and nothing more",
    why: "LinkedIn Ads, Reddit Ads and SMS have no connector and no tools. They can research and draft from public evidence, and they cannot open an ad account, send a message or report a number. Their measured-on value in the registry is the words nothing yet.",
    src: `${REGISTRY}:557, 615, 1401`,
  },
  {
    what: "No SOC 2 yet. Single region. No third-party penetration test yet",
    why: "SOC 2 Type I is targeted H2 2026 and Type II H1 2027. Storage is single-region today, with EU storage available on request for committed customers. There is continuous dependency scanning and internal review now; a third-party test is scheduled. No bug bounty yet.",
    src: "apps/web/src/app/security/page.tsx:46-59, 110",
  },
];

const CTA_ROW = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } as const;
const FOOT_ROW = { display: "flex", gap: 26, alignItems: "baseline", flexWrap: "wrap" } as const;
const NO_UNDERLINE = { textDecoration: "none" } as const;
const STRONG = { color: "var(--ink)" } as const;

/** One channel. The claim is the readiness label, so it is never behind a click. */
function ChannelRow({ c }: { c: (typeof CHANNELS)[number] }) {
  const r = READINESS[c.readiness];
  // A channel that can act or read is something you run, so it points at the
  // workspace. The three with no connector and no tools have nothing to open,
  // and V2 has no channel page yet, so they say so rather than pretending.
  const runnable = c.readiness !== "planned";

  return (
    <div className="row flat">
      <div className="row-sum">
        <span className="row-title">
          {runnable ? (
            <Link href="/v2/dashboard" style={NO_UNDERLINE}>
              {c.name}
            </Link>
          ) : (
            <Inert>{c.name}</Inert>
          )}
          <span className="row-sub">{c.desc}</span>
        </span>
        <span className="row-meta">
          <Chip kind={r.kind}>{r.label}</Chip>
        </span>
        <span />
      </div>
    </div>
  );
}

function ChannelGroup({ label, cat }: { label: string; cat: "paid" | "organic" | "owned" }) {
  const rows = CHANNELS.filter((c) => c.cat === cat);
  return (
    <>
      <div className="mono" style={{ paddingTop: 18 }}>
        {label} &middot; {rows.length}
      </div>
      {rows.map((c) => (
        <ChannelRow key={c.slug} c={c} />
      ))}
    </>
  );
}

export default function V2Landing() {
  return (
    <>
      <V2Nav />
      <main className="screen">
        <div style={{ maxWidth: 760 }}>
          <div className="kicker">Lovable for growth</div>
          <h1 className="h1">Tell Zavi the number you want to move.</h1>
          <p className="lede">
            Say it in plain language. Zavi works out what is holding the number back, does the
            work, and shows you what moved and why. Free to start: 1,000 credits a day, no card
            and no sales call.
          </p>
          <div style={CTA_ROW}>
            <Link href="/v2/start" className="btn dark" style={NO_UNDERLINE}>
              Start
            </Link>
            <Link href="/v2/meet" className="btn quiet" style={NO_UNDERLINE}>
              Read the whole spec sheet
            </Link>
          </div>
          <p className="mono" style={{ marginTop: 30, paddingTop: 13, borderTop: "1px solid var(--rule)" }}>
            Autonomy today: <strong style={STRONG}>L2 to L3</strong> &nbsp;&nbsp; Status:{" "}
            <strong style={STRONG}>Pre-launch</strong> &nbsp;&nbsp; Paying customers:{" "}
            <strong style={STRONG}>Zero</strong> &nbsp;&nbsp; Page dated:{" "}
            <strong style={STRONG}>{PAGE_DATE}</strong>
          </p>
        </div>

        <Section
          num="01"
          label="What it does"
          framing="Four claims, each with the file it came from."
        >
          <Row
            title="It owns a growth number, it is not a dashboard with warnings on it"
            meta="01"
            open
            src="CLAUDE.md:7"
          >
            <p>
              The job is: find the real constraint, propose the action, run the experiment, and
              show what changed. A run ends in a decision you can act on today with the evidence
              attached, not a chart that leaves the thinking to you.
            </p>
          </Row>
          <Row
            title="It runs on your data, which is the part a blank-slate agent is missing"
            meta="02"
            src="CLAUDE.md:21"
          >
            <p>
              Connect Google Analytics, Search Console, Meta Ads, Google Ads and the rest, and the
              work is done against what is actually happening in your account rather than against
              generic best practice.
            </p>
            <p>
              The differentiator is growth recipes plus your company&apos;s own knowledge. Models
              can act; the recipe is what is missing.
            </p>
          </Row>
          <Row
            title="Public evidence is real evidence, and it is still not measurement"
            meta="03"
            src="apps/backend/src/channels/_base/recipe-base.md:141, 479"
          >
            <p>
              A page Zavi fetched is evidence. A number is a number only when a connected account
              returned it on that run. A failed fetch tells you we could not read something and
              nothing at all about what was on it, so it never becomes a claim.
            </p>
            <p>
              That separation is written into the instructions every run reads. It is not left to
              the model&apos;s judgement.
            </p>
          </Row>
          <Row
            title="Isolation between customers is enforced in the database, not in application code"
            meta="04"
            src="apps/web/src/app/security/page.tsx:19-44"
          >
            <ul>
              <li>
                Tenant isolation lives in the database itself, so an application bug cannot
                surface one customer&apos;s data to another.
              </li>
              <li>The browser never holds privileged database credentials.</li>
              <li>
                Connector credentials sit in an encrypted vault reachable through one audited
                path.
              </li>
              <li>
                Telemetry carries timings and status codes only. Prompts, model outputs and your
                content never enter it.
              </li>
            </ul>
            <p>What is not in place yet is in section 04 below.</p>
          </Row>
        </Section>

        <Section num="02" label="How it works" framing="Three steps and one gate.">
          <FlatRow title="Enter your website" meta="Step 1">
            <p>Zavi starts understanding your business from the one thing you already have.</p>
          </FlatRow>
          <FlatRow title="Zavi makes your growth plan" meta="Step 2">
            <p>
              It works out what is slowing the business down and writes the plan against that, not
              against a template.
            </p>
          </FlatRow>
          <FlatRow title="Zavi does the work" meta="Step 3">
            <p>
              It drafts the posts and the pages, proposes the budget moves, and brings each one to
              you.
            </p>
          </FlatRow>
          <Row
            title="Then the gate: nothing goes live without your yes"
            meta="Always"
            open
            src="apps/web/src/components/marketing/growth-home/GrowthThreeSteps.tsx:242-260 · CLAUDE.md:15"
          >
            <p>
              Every post, page, email and budget change arrives as a plain-language proposal. Your
              ad spend is billed by each platform to your own ad account, and Zavi moves only
              budget you approved.
            </p>
            <p>
              This is the same fact as limitation 01 read from the other side. The gate is why we
              cannot call this L4, and it is also why you can point it at a live account this
              week.
            </p>
          </Row>
        </Section>

        <Section
          num="03"
          label="What it runs"
          framing="Nineteen channels. The label on each row is what that channel can do today, not what it is called."
        >
          <ChannelGroup label="Paid" cat="paid" />
          <ChannelGroup label="Organic" cat="organic" />
          <ChannelGroup label="Owned" cat="owned" />
          <p className="muted" style={{ fontSize: 13, margin: "16px 0 0" }}>
            A channel that can act or read opens in the workspace. The three with no connector and
            no tools open nothing, because there is nothing to open.{" "}
            <Link href="/v2/pricing">Pricing</Link> says which tier unlocks which channel.
          </p>
          <div className="src mono">{REGISTRY}, 19 rows</div>
        </Section>

        <Section
          num="04"
          label="What it does not do yet"
          framing="Eight limitations, at the same size as the claims. If one of these is a dealbreaker, the page has done its job."
          railExtra={<div className="mono" style={{ marginTop: 8 }}>8 limitations</div>}
        >
          {LIMITS.map((l) => (
            <Blind
              key={l.what}
              what={l.what}
              why={l.why}
              action={<div className="src mono">{l.src}</div>}
            />
          ))}
        </Section>

        <Section
          num="05"
          label="Price"
          framing="Four self-serve tiers. A tier changes which channels you can run and how many credits you get."
          railExtra={<div className="mono" style={{ marginTop: 8 }}>4 tiers</div>}
        >
          <SpecTable
            head={["Tier", "Per month", "What it adds", "Credits"]}
            rows={[
              [
                <b key="t">Free</b>,
                "$0",
                "Chat with Zavi, research and analysis.",
                "1,000 a day",
              ],
              [
                <b key="t">Starter</b>,
                "$20",
                "The 9 organic channels: SEO, GEO, LinkedIn, Reddit, X, Instagram, TikTok, YouTube, UGC.",
                "8,000 a month plus 1,000 a day",
              ],
              [
                <b key="t">Growth</b>,
                "$120",
                "Everything in Starter.",
                "48,000 a month plus 1,000 a day",
              ],
              [
                <b key="t">Pro</b>,
                "$240",
                "Paid ads on Google, Meta, TikTok, LinkedIn, Reddit and YouTube, plus influencer, email and SMS, plus the engineer and fundraising agents.",
                "96,000 a month plus 1,000 a day",
              ],
            ]}
          />
          <p className="muted" style={{ fontSize: 13.5, marginTop: 14 }}>
            Daily credits reset and do not roll over. The monthly pool is what buys a big piece of
            work. Your ad spend is not included in any plan: each platform bills your own ad
            account. Enterprise is the only door that needs a conversation, and it sits above Pro
            rather than in front of it.
          </p>
          <div style={{ ...CTA_ROW, marginTop: 16 }}>
            <Link href="/v2/pricing" className="btn quiet" style={NO_UNDERLINE}>
              See the full price sheet
            </Link>
          </div>
          <div className="src mono">
            apps/backend/src/services/billing/tiers.ts:32-43 &middot;
            apps/backend/src/routes/public/pricing.ts:34, 53-68 &middot; CLAUDE.md:9
          </div>
        </Section>

        <div className="hr" />
        <div style={FOOT_ROW}>
          <p style={{ margin: 0, flex: 1, minWidth: 260, color: "var(--ink-2)", fontSize: 14 }}>
            Paste your website and see what Zavi finds. Free to start, no card, no sales call.
          </p>
          <div style={CTA_ROW}>
            <Link href="/v2/start" className="btn dark" style={NO_UNDERLINE}>
              Start
            </Link>
            <Link href="/v2/meet" className="btn quiet" style={NO_UNDERLINE}>
              Meet Zavi
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
