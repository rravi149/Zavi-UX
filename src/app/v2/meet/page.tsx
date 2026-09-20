import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import V2Nav from "../_components/V2Nav";
import { Row, Section, SpecTable } from "../_components/kit";

/* /v2/meet: the whole specification for Zavi on one page.
   Ported from docs/wireframes/typesafe-ux/01-meet-zavi.html and
   SCREENS.meetZavi in parts/10-marketing.js, re-checked line by line against
   praxis origin/main @ 8b3489333 on 2026-09-20.

   The ordering is the argument: Limitations is section 02, ahead of Benefits,
   and it is the largest section on the page. Every row carries the path:line
   it was read from, so a reader can go check. */

export const metadata: Metadata = {
  title: "Meet Zavi",
  description:
    "The whole specification: what Zavi is, what it cannot do today, what you get, and what it costs. The limitations section is the largest one on the page.",
};

const LETTER_RAIL: CSSProperties = {
  flex: "0 0 290px",
  borderRight: "1px solid var(--rule)",
  padding: "44px 34px 56px 0",
  position: "sticky",
  top: 0,
  alignSelf: "flex-start",
  maxHeight: "100vh",
  overflow: "auto",
};

const LETTER_P: CSSProperties = {
  margin: "0 0 15px",
  fontSize: 13.5,
  lineHeight: 1.72,
  color: "var(--ink-2)",
};

const META_ROW: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px 26px",
  marginTop: 22,
  paddingTop: 16,
  borderTop: "1px solid var(--rule)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
};

const CLOSING_P: CSSProperties = {
  maxWidth: "66ch",
  fontSize: 15.5,
  lineHeight: 1.7,
  color: "var(--ink-2)",
  margin: "0 0 14px",
};

function Count({ n }: { n: string }) {
  return (
    <div className="mono" style={{ marginTop: 8 }}>
      {n}
    </div>
  );
}

function FounderLetter() {
  return (
    <aside style={LETTER_RAIL}>
      <div className="kicker" style={{ marginBottom: 16 }}>
        From the founder
      </div>
      <p style={{ ...LETTER_P, color: "var(--ink)" }}>
        I built Zavi while running Upcar, a live peer to peer car rental marketplace. The growth
        recipes inside it are the ones I actually ran there, on real operating data, not a
        synthetic demo.
      </p>
      <p style={LETTER_P}>
        I would rather you read the limits before you pay than after. So this page leads with them.
        Zavi today proposes work and executes it behind your approval. It does not run unattended
        on your money, and I am not going to write copy saying it does.
      </p>
      <p style={LETTER_P}>
        There are no customer logos on this page and no testimonials, because there are no paying
        customers yet. We are launching this week. When that changes, the number will appear here
        with its denominator attached.
      </p>
      <p style={LETTER_P}>
        Everything below describes what the code does today. When a limitation stops being true, I
        will change this page, not the pitch.
      </p>
      <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--rule)" }}>
        <div
          style={{
            fontFamily:
              '"Snell Roundhand","Apple Chancery","Segoe Script","Brush Script MT",cursive',
            fontSize: 30,
            lineHeight: 1,
            color: "var(--ink)",
          }}
        >
          Ravi Ramadasu
        </div>
        <div className="mono" style={{ marginTop: 10, color: "var(--ink)" }}>
          Ravi Ramadasu
        </div>
        <div className="mono">Founder, Zavi</div>
      </div>
    </aside>
  );
}

export default function MeetZavi() {
  return (
    <>
      <V2Nav />
      <main className="screen">
        <div style={{ maxWidth: 780 }}>
          <div className="kicker">Meet Zavi</div>
          <h1 className="h1">One agent that owns a growth number.</h1>
          <p className="lede">
            Zavi finds the constraint on your growth, proposes the action, runs it once you say
            yes, and tells you what actually changed. This page is the whole specification: what it
            is, what it cannot do, what you get, and what it costs. The limitations section is the
            largest one on the page, on purpose.
          </p>
          <div style={META_ROW}>
            <span>
              Autonomy today: <b style={{ color: "var(--ink)" }}>L2 to L3</b>
            </span>
            <span>
              Status: <b style={{ color: "var(--ink)" }}>Pre-launch</b>
            </span>
            <span>
              Paying customers: <b style={{ color: "var(--ink)" }}>Zero</b>
            </span>
            <span>
              Last reviewed: <b style={{ color: "var(--ink)" }}>2026-09-20</b>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: 40 }}>
          <FounderLetter />

          <div style={{ flex: "1 1 auto", minWidth: 0, paddingLeft: 44 }}>
            {/* ── 01 PROPERTIES ─────────────────────────────────────────── */}
            <Section
              num="01"
              label="Properties"
              framing="What Zavi is, structurally, before any claim about outcomes."
              id="properties"
              railExtra={<Count n="5 properties" />}
            >
              <Row
                title="Zavi owns a growth metric. It is not a dashboard with warnings on it"
                meta="P.1"
                open
                src="CLAUDE.md:7"
              >
                <p>
                  The job is: find the real constraint, propose the action, run the experiment, and
                  show what changed. The output of a run is a decision you can act on today, with
                  the evidence attached, not a chart that leaves the thinking to you.
                </p>
                <p>
                  You describe what you want in plain language. Zavi explains every recommendation
                  the same way, with the numbers it used underneath.
                </p>
              </Row>

              <Row
                title="Autonomy L2 to L3: it proposes, and it executes behind your gate"
                meta="P.2"
                src="CLAUDE.md:15"
              >
                <p>
                  We scope Zavi against a six rung ladder, and we use these words internally, so
                  you should have them too.
                </p>
                <ul>
                  <li>L0 manual</li>
                  <li>L1 assist</li>
                  <li>L2 propose</li>
                  <li>L3 execute with a gate</li>
                  <li>L4 own the metric</li>
                  <li>L5 own growth</li>
                </ul>
                <p>
                  Zavi sits at L2 to L3 today. Every post, page, email and budget change arrives as
                  a plain language proposal. Nothing goes live until you say yes. See L.1 for what
                  that rules out.
                </p>
              </Row>

              <Row
                title="Nineteen growth channels, reading one shared company brain"
                meta="P.3"
                src="packages/shared/src/channels/registry.ts:304-1440"
              >
                <p>
                  Nine organic: SEO, GEO, LinkedIn, Reddit, X, Instagram, TikTok, YouTube and UGC.
                  Eight paid: Google, Meta, YouTube, TikTok, LinkedIn, Reddit and ChatGPT ads, plus
                  Influencer. Two owned: email campaigns and SMS.
                </p>
                <p>
                  Each channel reads the same company knowledge, so the Reddit post and the Google
                  Ads copy do not describe two different companies. What each one can actually do
                  differs a lot, and the channel pages say so per channel.
                </p>
              </Row>

              <Row
                title="Public evidence is real evidence. It is still not measurement, and Zavi keeps the two apart"
                meta="P.4"
                src="apps/backend/src/channels/_base/recipe-base.md:479"
              >
                <p>
                  A page Zavi fetched is evidence. A number is only a number when a connected
                  account returned it on that run. A failed fetch tells you that we could not read
                  something, and nothing at all about what was on it, so it never becomes a claim
                  that you have no account, or that a link is dead.
                </p>
                <p>
                  This separation is enforced in the channel instructions every run reads, not left
                  to the model’s judgement.
                </p>
              </Row>

              <Row
                title="Isolation between customers is enforced in the database, not in application code"
                meta="P.5"
                src="apps/web/src/app/security/page.tsx:19-44 · CLAUDE.md hard rules 2, 3, 5"
              >
                <p>
                  Four things are true today, and we list them because they are the ones a buyer
                  should check.
                </p>
                <ul>
                  <li>
                    Tenant isolation is enforced in the database itself, so an application bug
                    cannot surface one customer’s data to another.
                  </li>
                  <li>
                    The browser never holds privileged database credentials. Privileged work runs
                    server side through narrow audited procedures.
                  </li>
                  <li>
                    Connector credentials live in an encrypted vault reachable through one audited
                    path.
                  </li>
                  <li>
                    Telemetry carries timings and status codes only. Prompts, model outputs and
                    your content never enter it.
                  </li>
                </ul>
                <p>What is not in place yet is in L.9.</p>
              </Row>
            </Section>

            {/* ── 02 LIMITATIONS ────────────────────────────────────────── */}
            <Section
              num="02"
              label="Limitations"
              framing="What Zavi cannot do today. Written at full size, not as a footnote."
              id="limitations"
              railExtra={<Count n="9 limitations" />}
            >
              <Row
                title="Zavi is not L4. It does not own a number unattended, and we do not claim it does"
                meta="L.1"
                open
                src="CLAUDE.md:15"
              >
                <p>
                  Before anything here may be called L4, five bars have to exist. None of them is a
                  slogan; each is a thing you could inspect.
                </p>
                <ul>
                  <li>
                    <b>Eval coverage.</b> Enough tested behaviour to trust a run nobody watched.
                  </li>
                  <li>
                    <b>A guardrail.</b> A spend limit enforced outside the model, not by asking it
                    nicely.
                  </li>
                  <li>
                    <b>Attribution.</b> Proof the system caused the change, not that the change
                    happened nearby.
                  </li>
                  <li>
                    <b>Rollback.</b> A revert that fires before a bad run costs real money.
                  </li>
                  <li>
                    <b>A receipt.</b> One measured, attributed win we could show a stranger.
                  </li>
                </ul>
                <p>
                  We do not clear that bar yet. Until we do, a human approves the work, which is
                  the honest version of where the product is.
                </p>
              </Row>

              <Row
                title="Zero paying customers. No case studies, no testimonials, no logo wall"
                meta="L.2"
                open
                src="CLAUDE.md:17 · CLAUDE.md, Stage calibration"
              >
                <p>
                  Zavi is pre-launch and goes public this week. There is no customer receipt to
                  show you, so this page does not manufacture one.
                </p>
                <p>
                  The provenance we do have is Upcar, a live peer to peer marketplace the agent
                  fleet runs. That is our own company, and we label it that way rather than
                  dressing it as a customer win.
                </p>
              </Row>

              <Row
                title="Zavi has no write path to your website. Every site fix is handed back to you"
                meta="L.3"
                src="apps/backend/src/agents/geo/agent.md:15 · apps/backend/src/agents/seo/agent.md:311"
              >
                <p>
                  The SEO and GEO channels produce paste-ready titles, an answer block, the JSON-LD
                  worth adding and a first draft page. They do not edit your site. Every step is
                  performed by you or your developer.
                </p>
                <p>
                  If you were expecting an agent that logs into your CMS and ships, that is not
                  what this is today.
                </p>
              </Row>

              <Row
                title="If your site refuses our fetch, Zavi is blind, and the run says so instead of guessing"
                meta="L.4"
                src="apps/backend/src/channels/_base/recipe-base.md:141, 479"
              >
                <p>
                  A 403, a bot challenge, a consent wall or a page over the size limit all mean the
                  same thing: we could not read it. That becomes the first line of the output, and
                  everything below it is explicitly written without those pages.
                </p>
                <p>
                  The practical consequence: a well-defended site returns a thinner run. We prefer
                  that to a confident, backwards answer, which is the most expensive failure mode
                  on any channel because it cites correctly while being wrong.
                </p>
              </Row>

              <Row
                title="No keyword rankings without Search Console. No traffic estimates, ever"
                meta="L.5"
                src="apps/backend/src/agents/seo/agent.md:163-168"
              >
                <p>
                  Search Console is the only first-party source of a real search position. With it
                  unconnected, the honest answer to where do we rank is that Search Console knows
                  and it is not connected.
                </p>
                <p>
                  Analytics, when linked, gives sessions. Sessions are not rankings. Zavi will not
                  turn either into an estimated traffic number for a page you do not have yet.
                </p>
              </Row>

              <Row
                title="AI-answer visibility is diagnosed, never measured. There is no share-of-voice number"
                meta="L.6"
                src="apps/backend/src/agents/seo/agent.md:170-172 · apps/backend/src/agents/geo/agent.md"
              >
                <p>
                  Zavi can tell you which AI crawlers your robots.txt admits, whether your
                  structured data resolves your pages to an entity, whether a self-contained answer
                  survives a JavaScript-free fetch, and whether your brand exists off-site. It
                  hands you a ten-minute self-check to look at today’s answers yourself.
                </p>
                <p>
                  What it cannot give you is a citation count, a share of voice, or a percentage of
                  AI answers. Those numbers would be invented, so the product refuses to produce
                  them.
                </p>
              </Row>

              <Row
                title="Three channels have no connector and no tools at all"
                meta="L.7"
                src="packages/shared/src/channels/registry.ts:557, 615, 1401"
              >
                <p>
                  LinkedIn Ads, Reddit Ads and SMS are declared with an empty connector list and an
                  empty tool list. They can research and draft from public evidence. They cannot
                  open an ad account, move a budget, send a message or report a number, and their
                  measured-on value in the registry is the words nothing yet.
                </p>
                <p>
                  They appear in the product because a visible gap is better than a silent one. Do
                  not buy a tier for them.
                </p>
              </Row>

              <Row
                title="The chargeback-evidence path into your Stripe account is not proven end to end"
                meta="L.8"
                src="CLAUDE.md:17, the CAVEAT paragraph"
              >
                <p>
                  The dispute-response agent is wired, tested and routable, but the connection into
                  a customer’s own Stripe has not been run end to end on a real dispute, and the
                  required key scope has not been confirmed sufficient in production.
                </p>
                <p>
                  So do not buy Zavi for chargeback handling today. Buy it for the growth work, and
                  treat this one as unverified until we say otherwise here.
                </p>
              </Row>

              <Row
                title="No SOC 2 yet. Single region storage. No third-party penetration test yet"
                meta="L.9"
                src="apps/web/src/app/security/page.tsx:46-59 · apps/web/src/app/security/page.tsx:110"
              >
                <ul>
                  <li>
                    <b>SOC 2.</b> In progress. Type I targeted H2 2026, Type II H1 2027. If you are
                    running a security review now, ask and we will share current controls
                    documentation.
                  </li>
                  <li>
                    <b>Data residency.</b> Single region today. EU-region storage available on
                    request for committed customers.
                  </li>
                  <li>
                    <b>Penetration test.</b> Continuous dependency scanning and internal review
                    today. A third-party test is scheduled.
                  </li>
                  <li>
                    <b>Bug bounty.</b> None yet. Report to the security contact and we pay in
                    founder time and a public credit.
                  </li>
                </ul>
              </Row>
            </Section>

            {/* ── 03 BENEFITS ───────────────────────────────────────────── */}
            <Section
              num="03"
              label="Benefits"
              framing="What you get, given everything in 02 is true."
              id="benefits"
              railExtra={<Count n="5 benefits" />}
            >
              <Row
                title="You get the action, not the alert"
                meta="B.1"
                src="apps/web/src/components/marketing/growth-home/GrowthFaq.tsx:22-25"
              >
                <p>
                  Tools report. Zavi does the work: it writes the code, moves the ad budget, drafts
                  the posts and the pages. Each finding arrives paired with the change it would
                  make and what it expects that change to move.
                </p>
                <p>
                  Anything technical, such as a code fix, comes as a diff you can read yourself or
                  hand to a developer.
                </p>
              </Row>

              <Row
                title="It runs on your real data, which is what a general-purpose agent cannot do"
                meta="B.2"
                src="CLAUDE.md:21"
              >
                <p>
                  Connect Google Analytics, Search Console, Meta Ads, Google Ads, Slack, GitHub and
                  your operating database, and the work is done against what is actually happening
                  rather than against a generic best practice.
                </p>
                <p>
                  The difference we sell is not that a model can act. It is the recipe plus your
                  company’s own knowledge, which is the part a blank-slate agent is missing.
                </p>
              </Row>

              <Row
                title="Nothing goes live without your yes, including every budget move"
                meta="B.3"
                src="apps/web/src/components/marketing/growth-home/GrowthHowItWorks.tsx:284"
              >
                <p>
                  Every post, page, email and budget change is a proposal first. Your ad spend is
                  billed by each platform to your own ad account, and Zavi only moves budget you
                  have approved.
                </p>
                <p>
                  This is the same fact as L.1 read from the other side: the gate is the reason we
                  cannot call this L4 yet, and it is also the reason you can run it on a live
                  account this week.
                </p>
              </Row>

              <Row
                title="Free to start. No card, no sales call"
                meta="B.4"
                src="apps/web/src/components/marketing/growth-home/GrowthHero.tsx:33 · apps/backend/src/routes/public/pricing.ts:33"
              >
                <p>
                  You paste your website and get your first recommendations without talking to
                  anyone. Free includes chat, research and analysis, plus a daily credit grant that
                  resets each day.
                </p>
                <p>
                  Enterprise is the only sales-led door, and it exists above Pro rather than in
                  front of it.
                </p>
              </Row>

              <Row
                title="Cancel from settings. Your plan runs to the end of what you paid for"
                meta="B.5"
                src="apps/backend/src/services/billing/tiers.ts:39-44"
              >
                <p>
                  Self-serve up and self-serve down. Daily credits reset and do not roll over. The
                  monthly pool is what buys a large piece of work, and it is what changes between
                  tiers.
                </p>
              </Row>
            </Section>

            {/* ── 04 PRICE ──────────────────────────────────────────────── */}
            <Section
              num="04"
              label="Price"
              framing="Four self-serve tiers. A tier changes which channels you can run and how many credits you get."
              id="price"
              railExtra={<Count n="4 tiers" />}
            >
              <SpecTable
                head={["Tier", "Per month", "What you get"]}
                rows={[
                  [
                    <b key="free">Free</b>,
                    "$0",
                    "Chat with Zavi, research and analysis, onboarding. 1,000 credits a day.",
                  ],
                  [
                    <b key="starter">Starter</b>,
                    "$20",
                    "Everything in Free, plus the 9 organic channels: SEO, GEO, LinkedIn, Reddit, X, Instagram, TikTok, YouTube, UGC. Also the product builder and the performance marketer. 8,000 credits a month plus 1,000 a day.",
                  ],
                  [
                    <b key="growth">Growth</b>,
                    "$120",
                    "Everything in Starter. 48,000 credits a month plus 1,000 a day.",
                  ],
                  [
                    <b key="pro">Pro</b>,
                    "$240",
                    "Everything in Growth, plus paid ads on Google, Meta, TikTok, LinkedIn, Reddit, YouTube and ChatGPT, the influencer, email and SMS channels, and the engineer and fundraising agents. 96,000 credits a month plus 1,000 a day.",
                  ],
                ]}
              />
              <p className="muted" style={{ fontSize: 13.5, marginTop: 14 }}>
                Credit volumes are configurable by us without a deploy, so the live page reads them
                from the pricing endpoint rather than hardcoding them. Your ad spend is not
                included in any plan: each platform bills your own ad account. Enterprise is the
                only tier that needs a conversation.
              </p>
              <p className="muted" style={{ fontSize: 13.5 }}>
                In the code the tier map is deny-by-default: an agent that is not classified needs
                Pro, so nothing can quietly leak into a cheap tier. The LinkedIn Ads, Reddit Ads
                and SMS channels sit in Pro and still cannot act, which is limitation L.7, not a
                feature of the tier.
              </p>
              <div className="src mono">
                apps/backend/src/services/billing/tiers.ts:32-44, 74-119 ·
                apps/backend/src/routes/public/pricing.ts:33, 53-68
              </div>
            </Section>

            {/* ── closing + the one CTA ─────────────────────────────────── */}
            <div style={{ padding: "48px 0 0", borderTop: "1px solid var(--rule)" }}>
              <p style={CLOSING_P}>
                If a claim on this page turns out to be wrong, that is a bug and I want to hear
                about it. If a limitation on this page is a dealbreaker for you, that is the page
                doing its job, and I would rather find out now.
              </p>
              <p style={CLOSING_P}>
                Dated 2026-09-20. This page is reviewed whenever one of the four sections stops
                being accurate.
              </p>
              <div style={{ marginTop: 26 }}>
                <Link
                  className="btn dark"
                  href="/v2/start"
                  style={{ display: "inline-block", textDecoration: "none" }}
                >
                  Paste your website and see what Zavi finds
                </Link>
                <div className="mono" style={{ marginTop: 10 }}>
                  Free to start. No card, no sales call.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
