"use client";

/* ============================================================
   What one run actually returned. Ported from parts/40-channels.js
   SCREENS.runOutput, plus the shared action card both channel screens use.

   THE BLOCK ORDER IS THE REAL ONE: the caveat prints ABOVE the figure it
   undermines, then the figure, then the breakdown, then the ranked actions.

   THE ONE PROPOSED CHANGE, and the reason this screen exists: the reads that
   did not complete are promoted out of a muted disclosure reading "N reads did
   not complete" (ChannelsPanel.tsx:363, a <details> under everything else)
   into a full panel at equal weight. On a thin run it is the entire finding.

   Field names and nesting are exactly what apps/web/src/lib/workspace/
   recipeStep.ts reads. The VALUES are simulated for one prototype tenant.
   Nothing on these two runs is a Zavi business metric.
   ============================================================ */

import { type ReactNode, useState } from "react";
import { Blind, Btn, Chip, Row, Section, SpecTable } from "../../_components/kit";
import {
  actionRecord,
  boardRow,
  platformFor,
  plusDays,
  useActionLedger,
  writeAction,
  type ActionRecord,
} from "./ChannelsTab";
import { channelSpec, type TabProps } from "../state";

/* ---------- the envelope ---------- */

/** recipeStep.ts:61 recipeDeliverable. */
export type Deliverable = { kind: string; kindLabel: string; label: string; content: string };

/** recipeStep.ts:448 singleRecipeStep, :458 recipeStepPosition. */
export type RunAction = {
  key: string;
  position: number;
  of: number;
  blocking: boolean;
  title: string;
  body: string;
  effort: string;
  evidence: string[];
  deliverable: Deliverable | null;
  /** ActionFooter.tsx:3. The button set is keyed on WHAT THE ACTION IS, never
   *  on the channel, so this travels on the action. */
  action_type: "fix" | "check" | "ad" | "post" | "other";
  /** True where a propose_* tool can carry the change out on approval. */
  executable: boolean;
};

/** recipeStep.ts:178 recipeFindings. */
export type Finding = {
  metric_id: string;
  status: "measured" | "failing" | "unmeasured";
  value: string;
  numeric_value: number | null;
  target: number | null;
  unit: string | null;
  direction: "gte" | "lte" | null;
  blocks: string[];
  access: string | null;
  risk: string | null;
  do_nothing: string | null;
  undo: string | null;
};

export type RunEnvelope = {
  key: string;
  slug: string;
  label: string;
  when: string;
  instruments: string;
  /** recipeStep.ts:320 runSummary. */
  summary: { label: string; value: string; unit: string | null; context: string };
  /** recipeStep.ts:338 runCaveat. */
  caveat: { title: string; detail: string; impact: string | null };
  /** recipeStep.ts:359 runBreakdown. */
  breakdown: {
    title: string;
    columns: string[];
    rows: { cells: string[]; status: "pass" | "warn" | "fail" | null }[];
    note: string | null;
  } | null;
  findings: Finding[];
  /** recipeStep.ts:390 runReadsNotDone. */
  reads_not_done: { what: string; why: string; impact: string | null }[];
  actions: RunAction[];
  /** recipeStep.ts:414 recipeMarkdown. */
  rendered_markdown: string | null;
};

export const RUNS: Record<string, RunEnvelope> = {
  gads: {
    key: "gads",
    slug: "google_ads",
    label: "Google Ads, last night",
    when: "Ran last night at 03:12, finished in 6 minutes",
    instruments: "11 of 19 tools ran. Every one that ran came back.",
    summary: {
      label: "of last month's spend",
      value: "38",
      unit: "%",
      context:
        "sat on campaigns whose conversion tracking has reported nothing since the 4th. Those campaigns are being optimised against no signal.",
    },
    caveat: {
      title: "Conversion tracking stopped reporting on the 4th",
      detail:
        "google_ads_conversion_tracking_health returns 0 conversions for the primary action since 2026-09-04, while google_ads_list_campaigns still reports clicks and spend on the same campaigns. Every cost per conversion below is therefore computed on a denominator that stopped moving.",
      impact:
        "Read the cost per conversion column as a floor, not a figure. The real number cannot be worse than shown, and may be much better.",
    },
    breakdown: {
      title: "Campaigns by spend, last 30 days",
      columns: ["Campaign", "Spend", "Cost per conversion", "Verdict"],
      rows: [
        { cells: ["PMax, all products", "$4,180", "no conversions recorded", "fail"], status: "fail" },
        { cells: ["Search, brand", "$1,240", "$18", "pass"], status: "pass" },
        { cells: ["Search, non-brand", "$2,905", "$142", "fail"], status: "fail" },
        { cells: ["Search, competitor terms", "$615", "$88", "warn"], status: "warn" },
      ],
      note: "Four of seven campaigns. The other three spent under $50 between them and are not worth a row.",
    },
    findings: [
      {
        metric_id: "conversion_tracking",
        status: "failing",
        value: "0 conversions recorded since 2026-09-04",
        numeric_value: 0,
        target: 1,
        unit: null,
        direction: "gte",
        blocks: [
          "Every cost per conversion on this account",
          "Any budget proposal that depends on one",
        ],
        access: "none",
        risk: "Low. Re-tagging does not change what is already running.",
        do_nothing: "Spend keeps going to whatever Google guessed.",
        undo: "Remove the tag. Nothing else changes.",
      },
      {
        metric_id: "search_terms",
        status: "measured",
        value: "34 terms, $412, no conversions",
        numeric_value: 34,
        target: 0,
        unit: "terms",
        direction: "lte",
        blocks: [],
        access: "none",
        risk: null,
        do_nothing: null,
        undo: "Delete the negatives. They are additive only.",
      },
      {
        metric_id: "impression_share",
        status: "unmeasured",
        value: "not returned for Performance Max",
        numeric_value: null,
        target: null,
        unit: null,
        direction: null,
        blocks: ["Any claim about how often you appeared"],
        access: null,
        risk: null,
        do_nothing: null,
        undo: null,
      },
    ],
    reads_not_done: [
      {
        what: "Conversion values for the last 30 days",
        why: "google_ads_list_campaigns returned conversion_value = 0 on every row, which is what this account returns when values are not being sent, not a measured zero.",
        impact:
          "Return on ad spend cannot be computed at all. The registry lists it as something this channel is measured on, and this run cannot measure it.",
      },
      {
        what: "Search terms for Performance Max",
        why: "google_ads_search_terms covers Search campaigns only. Performance Max does not expose a search terms report through the API.",
        impact:
          "The largest campaign on the account, $4,180 of the $8,940, is the one campaign whose queries nobody can see. The 34 negatives below cannot protect it.",
      },
      {
        what: "The landing page the non-brand ads point at",
        why: "Two fetches of the booking page timed out after 15 seconds.",
        impact:
          "Zavi cannot tell you whether the $142 cost per conversion is the ads or the page. It is proposing ad-side fixes because that is the side it could read.",
      },
    ],
    actions: [
      {
        key: "gads-b",
        position: 1,
        of: 5,
        blocking: true,
        action_type: "fix",
        executable: false,
        title: "Fix conversion tracking before changing any budget",
        body: "The primary conversion action has recorded nothing for 16 days. Until it reports, every proposal on this page is guessing, including the three below it. Re-fire the tag from the booking confirmation page and let one day of data land.",
        effort: "20 minutes, your site",
        evidence: [
          'google_ads_conversion_tracking_health: primary action "Booking complete", 0 conversions since 2026-09-04',
          "google_ads_change_history: no tag change on the Google side on or near the 4th",
          "google_ads_list_campaigns: clicks and spend unaffected over the same window",
        ],
        deliverable: null,
      },
      {
        key: "gads-1",
        position: 2,
        of: 5,
        blocking: false,
        action_type: "check",
        executable: false,
        title: "Add 34 search terms as negative keywords",
        body: "These 34 terms took $412 and produced nothing in 30 days. None of them is already blocked. Adding them stops the same spend next month without touching a bid.",
        effort: "5 minutes",
        evidence: [
          "google_ads_search_terms: 34 terms, $412 spend, 0 conversions, last 30 days",
          "google_ads_existing_negatives: none of the 34 appears in any existing list",
        ],
        deliverable: {
          kind: "list",
          kindLabel: "List",
          label: "Negative keyword list, phrase match",
          content:
            "free car rental\nhow to rent out my car for free\ncar rental jobs\ncar rental alternatives free\ncar rental hiring near me\n... 29 more",
        },
      },
      {
        key: "gads-2",
        position: 3,
        of: 5,
        blocking: false,
        action_type: "ad",
        executable: true,
        title: "Cut Search, non-brand to $60 a day until tracking is back",
        body: "$142 a conversion against your $45 target, on a denominator that stopped moving. Halving the daily cap holds the position while the tag is fixed, instead of pausing and losing the learning.",
        effort: "2 minutes",
        evidence: [
          "google_ads_list_campaigns: Search, non-brand, $2,905 over 30 days, $96.83 a day",
          "settings: target cost per conversion $45",
        ],
        deliverable: null,
      },
      {
        key: "gads-3",
        position: 4,
        of: 5,
        blocking: false,
        action_type: "ad",
        executable: false,
        title: "Write three responsive search ads for the top ad group",
        body: "The top ad group has run the same two ads since March. Three new headlines against the same keywords gives Google something to rotate.",
        effort: "15 minutes",
        evidence: ['google_ads_list_ads: 2 enabled ads in "Weekend rentals", both created 2026-03-11'],
        deliverable: {
          kind: "ad",
          kindLabel: "Ad",
          label: "Three responsive search ads",
          content:
            "Headline 1: Weekend car, booked in 3 minutes\nHeadline 2: No counter, no queue, no deposit\nHeadline 3: Pick it up two streets away\nDescription 1: Book the car you actually want for the weekend. Insurance included, cancel free up to 24h.",
        },
      },
      {
        key: "gads-4",
        position: 5,
        of: 5,
        blocking: false,
        action_type: "fix",
        executable: false,
        title: "Point the non-brand ads at the booking form, not the home page",
        body: "Every non-brand ad lands on the home page, which asks the visitor to search again. Zavi could not load the booking page to confirm it is faster, so this is a structural call, not a measured one.",
        effort: "10 minutes",
        evidence: ["google_ads_list_ads: final_url is the site root on 6 of 6 non-brand ads"],
        deliverable: null,
      },
    ],
    rendered_markdown: "Full written analysis, 2,140 words, stored on the first action of this run.",
  },

  blocked: {
    key: "blocked",
    slug: "seo",
    label: "SEO, this morning",
    when: "Ran this morning at 07:40, finished in 90 seconds",
    instruments: "1 of 6 tools ran. It came back 403. Four needed a connector nobody has linked.",
    summary: {
      label: "pages read",
      value: "0",
      unit: "of 6",
      context:
        "Your site refused every request this run made, so there is no measurement on this page. What follows is what could not be read and what it would take.",
    },
    caveat: {
      title: "Your site returned 403 to every page Zavi asked for",
      detail:
        "growth_seo_audit requested 6 pages and got 403 Forbidden on all 6. The same URLs return 200 in a normal browser, so this is a bot rule or a firewall, not a broken site. Zavi has no page text, no titles, no headings and no structured data from this run.",
      impact:
        "Nothing below is measured on your live pages. Two of the three things this channel is measured on, indexed pages and rankings, could not be read at all.",
    },
    breakdown: null,
    findings: [
      {
        metric_id: "ai_crawler_access",
        status: "failing",
        value: "403 on all 6 requested pages",
        numeric_value: 0,
        target: 6,
        unit: "pages",
        direction: "gte",
        blocks: [
          "Every other finding this channel can produce",
          "Any claim about your titles, headings or schema",
        ],
        access: "cdn",
        risk: "Low. Allowing a named crawler does not open the site to anything else.",
        do_nothing: "This channel keeps returning nothing every time it runs.",
        undo: "Remove the allow rule.",
      },
      {
        metric_id: "indexability",
        status: "unmeasured",
        value: "not read, the crawl was refused",
        numeric_value: null,
        target: null,
        unit: null,
        direction: null,
        blocks: [],
        access: null,
        risk: null,
        do_nothing: null,
        undo: null,
      },
      {
        metric_id: "rankings",
        status: "unmeasured",
        value: "no Search Console connection on this workspace",
        numeric_value: null,
        target: null,
        unit: null,
        direction: null,
        blocks: ["Anything this channel would say about position"],
        access: null,
        risk: null,
        do_nothing: null,
        undo: null,
      },
    ],
    reads_not_done: [
      {
        what: "Your six most important pages",
        why: "growth_seo_audit got 403 Forbidden on every request. The response carried a Cloudflare ray id, so a bot rule is refusing the crawler by user agent.",
        impact:
          "This is the read everything else on this channel is built from. Titles, headings, structured data and server-rendered text are all unknown, so the run has nothing to rank or compare.",
      },
      {
        what: "Search queries you already rank for",
        why: "google_search_console_query needs the Search Console connector. It is declared on this channel and nobody has linked it.",
        impact:
          "Rankings is one of the three things this channel says it is measured on. Without this read it can never report one, and any position it stated would be inferred.",
      },
      {
        what: "Per page clicks and impressions",
        why: "google_search_console_page_performance, same connector, same reason.",
        impact:
          "Zavi cannot tell which of your pages already earns traffic, so it cannot tell you which one is worth fixing first.",
      },
      {
        what: "The ranked opportunity list",
        why: "google_search_console_opportunities derives its list from the two reads above. With neither, it has nothing to derive from.",
        impact:
          "The one output of this channel that arrives pre-ranked is the one output this run has none of.",
      },
      {
        what: "Organic sessions over time",
        why: "growth_read_metric_history returned an empty series. Nothing has ever written an organic_sessions row for this workspace.",
        impact:
          "No before and after is possible. If you fix the crawl today, this channel still cannot show you what changed.",
      },
    ],
    actions: [
      {
        key: "seo-1",
        position: 1,
        of: 1,
        blocking: true,
        action_type: "fix",
        executable: false,
        title: "Let Zavi's crawler read your site",
        body: "Add an allow rule for Zavi's user agent in your firewall, or turn off the bot-fight rule for the six pages below. This is the only thing on this page worth doing, because every other thing this channel can do is downstream of a read that did not happen.",
        effort: "10 minutes, your host's dashboard",
        evidence: [
          "growth_seo_audit: 403 Forbidden on 6 of 6 requested URLs",
          "response headers carried cf-ray, so the refusal is at the edge, not the origin",
          "the same 6 URLs return 200 to a normal browser",
        ],
        deliverable: {
          kind: "list",
          kindLabel: "List",
          label: "The six URLs that were refused",
          content: "/\n/how-it-works\n/pricing\n/cities/phoenix\n/list-your-car\n/help/insurance",
        },
      },
    ],
    rendered_markdown: null,
  },
};

/** Which run, if any, this prototype authored for a channel. Two only, on
 *  purpose: every field in the envelope has to match the real reader, so
 *  inventing four more Reddit actions would be the one thing this page is
 *  against. */
export const RUN_FOR: Record<string, string> = { google_ads: "gads", seo: "blocked" };

export function runFor(slug: string | null): RunEnvelope | null {
  if (!slug) return null;
  const key = RUN_FOR[slug];
  return key ? RUNS[key] : null;
}

/* ---------- the shared action card ---------- */

/* WHICH BUTTONS A CARD GETS DEPENDS ON WHAT THE ACTION IS, NEVER ON THE
   CHANNEL (ActionFooter.tsx:3). The real sets are:
     post            Copy, Edit, AI edit, Post, Done; menu Reject, Not now, Redo
     ad, executable  Approve, Reject, Ask Zavi; menu Not now, Redo
     ad, otherwise   Done, Reject, Not now, Redo, Ask Zavi
     everything else Done, Reject, Not now, Redo, plus Ask Zavi
   Not now offers Tomorrow, 3 days and 1 week, and 1 week is the default.

   ONE DELIBERATE WIDENING, called out on the page: Edit is drawn wherever a
   deliverable exists, not on post-class rows alone. A founder who can see the
   text should be able to change it before it goes out. */

export function ActionCard({
  a,
  compact,
  toast,
}: {
  a: RunAction;
  compact?: boolean;
  toast: (msg: string) => void;
}) {
  const ledger = useActionLedger();
  const rec: ActionRecord = actionRecord(ledger, a.key);
  const settled = rec.status !== "pending" && rec.status !== "editing" && rec.status !== "snoozing";
  const content = rec.text ?? a.deliverable?.content ?? "";
  const [draft, setDraft] = useState(content);

  function set(status: ActionRecord["status"], extra?: Partial<ActionRecord>) {
    writeAction(a.key, { status, ...extra });
  }

  let head: ReactNode = null;
  if (rec.status === "approved") {
    head = <Chip kind="on">{a.executable ? "Approved, queued" : "Approved"}</Chip>;
  } else if (rec.status === "edited") {
    head = <Chip kind="on">Edited by you</Chip>;
  } else if (rec.status === "snoozed") {
    head = <Chip kind="warn">Not now, back {rec.back}</Chip>;
  } else if (rec.status === "rejected") {
    head = <Chip kind="warn">Rejected</Chip>;
  } else if (a.blocking) {
    head = <Chip kind="warn">Blocking</Chip>;
  }

  let bar: ReactNode;
  if (rec.status === "editing") {
    bar = (
      <div className="d-actbar">
        <Btn
          kind="dark"
          sm
          onClick={() => {
            set("edited", { text: draft });
            toast("Saved. The edited text is what Copy and Post will use.");
          }}
        >
          Save
        </Btn>
        <Btn kind="quiet" sm onClick={() => set("pending")}>
          Cancel
        </Btn>
      </div>
    );
  } else if (rec.status === "snoozing") {
    bar = (
      <>
        <p className="d-note">
          <b>Not now. Bring it back in:</b>
        </p>
        <div className="d-actbar">
          {([1, 3, 7] as const).map((d) => (
            <Btn
              key={d}
              kind={d === 7 ? "dark" : "quiet"}
              sm
              onClick={() => {
                set("snoozed", { back: plusDays(d) });
                toast(`Not now. Back on ${plusDays(d)}.`);
              }}
            >
              {d === 1 ? "Tomorrow" : d === 3 ? "3 days" : "1 week"}
            </Btn>
          ))}
        </div>
      </>
    );
  } else if (rec.status === "pending") {
    bar = (
      <div className="d-actbar">
        <Btn
          kind="dark"
          sm
          onClick={() => {
            set("approved");
            toast(
              a.executable
                ? "Approved. Zavi is carrying this out and will report back on the card."
                : "Marked done.",
            );
          }}
        >
          {a.action_type === "ad" && a.executable ? "Approve" : "Done"}
        </Btn>
        {a.deliverable ? (
          <>
            <Btn
              kind="quiet"
              sm
              onClick={() => toast("Copied. In the product the next click opens the composer with it.")}
            >
              Copy
            </Btn>
            <Btn
              kind="quiet"
              sm
              onClick={() => {
                setDraft(content);
                set("editing");
              }}
            >
              Edit
            </Btn>
          </>
        ) : null}
        <Btn kind="quiet" sm onClick={() => set("snoozing")}>
          Not now
        </Btn>
        <Btn
          kind="quiet"
          sm
          onClick={() => {
            set("rejected");
            toast("Rejected. It will not come back.");
          }}
        >
          Reject
        </Btn>
        <Btn kind="quiet" sm onClick={() => toast("Opens the side chat on this action. Not wired in this prototype.")}>
          Ask Zavi
        </Btn>
      </div>
    );
  } else {
    bar = (
      <div className="d-actbar">
        <Btn
          kind="quiet"
          sm
          onClick={() => toast("Redo re-runs this one action with a note you write. Not wired in this prototype.")}
        >
          Redo with a note
        </Btn>
        {rec.status === "snoozed" ? (
          <Btn
            kind="quiet"
            sm
            onClick={() => {
              set("pending");
              toast("The product has no undo for Not now. It simply reappears on the date.");
            }}
          >
            Bring it back
          </Btn>
        ) : null}
      </div>
    );
  }

  const showDeliverable = a.deliverable && (!compact || rec.status === "editing");

  return (
    <article className={`d-act ${settled ? "settled" : ""}`}>
      <div className="d-head">
        <h4>{a.title}</h4>
        <span className="mono">
          action {a.position} of {a.of}
          {a.effort ? ` · ${a.effort}` : ""}
        </span>
      </div>
      {head ? <div style={{ marginTop: 7 }}>{head}</div> : null}
      {compact ? null : <p className="bd">{a.body}</p>}
      {showDeliverable ? (
        rec.status === "editing" ? (
          <label className="fld" style={{ marginTop: 12 }}>
            <span className="lab">{a.deliverable?.label}</span>
            <textarea
              className="d-ta"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
        ) : (
          <div className="dl">{content}</div>
        )
      ) : null}
      {compact ? null : (
        <div className="ev">
          <ul>
            {a.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {bar}
    </article>
  );
}

/* ---------- findings ---------- */

/** recipeStep.ts:246 findingBand. THE STATUS OUTRANKS THE ARITHMETIC: for some
 *  metrics lower is better and for others higher is, and the schema does not
 *  say which, so the agent's own verdict decides pass from fail. The numbers
 *  separate a near miss from a real miss and nothing else. */
function findingBand(f: Finding): "pass" | "warn" | "fail" | null {
  if (f.numeric_value === null || f.target === null) return null;
  if (f.status === "measured") return "pass";
  if (f.status !== "failing") return null;
  if (f.direction === "lte") {
    return f.numeric_value <= f.target ? "pass" : f.numeric_value <= f.target * 1.5 ? "warn" : "fail";
  }
  if (f.direction === "gte") {
    return f.numeric_value >= f.target ? "pass" : f.numeric_value >= f.target * 0.67 ? "warn" : "fail";
  }
  const a = Math.abs(f.numeric_value);
  const b = Math.abs(f.target);
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  if (hi === 0) return "warn";
  if (lo === 0) return "fail";
  return hi <= lo * 1.5 ? "warn" : "fail";
}

/** recipeStep.ts:170 metricLabel. An unmapped id humanises, it never prints
 *  raw. */
const METRIC_LABEL: Record<string, string> = {
  ai_crawler_access: "AI crawler access",
  indexability: "Indexability",
  page_claims: "Page claims",
  structured_data: "Structured data",
  thin_server_html: "Server-rendered text",
  organic_performance: "Organic performance",
  competitor_serp: "Competitor results",
  core_web_vitals: "Core Web Vitals",
};

function metricLabel(id: string): string {
  if (METRIC_LABEL[id]) return METRIC_LABEL[id];
  const w = id.replace(/[_-]+/g, " ").trim();
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : "Finding";
}

/* ---------- the screen ---------- */

export function RunOutputTab({ state, setState, toast, go }: TabProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const fromChannel = runFor(state.openChannel);
  const r = RUNS[openKey ?? ""] ?? fromChannel ?? RUNS.gads;
  const spec = channelSpec(r.slug);
  const plat = platformFor(r.slug);
  const thin = r.breakdown === null;

  function back() {
    setState((s) => ({ ...s, openChannel: r.slug }));
    go("channelDetail");
  }

  return (
    <div className="d-main" style={{ maxWidth: 980 }}>
      <div className="d-switch">
        <span className="mono" style={{ alignSelf: "center", marginRight: 4 }}>
          Run
        </span>
        {Object.values(RUNS).map((x) => (
          <Btn
            key={x.key}
            kind={x.key === r.key ? "dark" : "quiet"}
            sm
            onClick={() => {
              setOpenKey(x.key);
              setState((s) => ({ ...s, openChannel: x.slug }));
              toast(`${x.label}. The channel behind the page moved with it.`);
            }}
          >
            {x.label}
          </Btn>
        ))}
        <Btn kind="quiet" sm onClick={back}>
          Back to {plat.name}
        </Btn>
        <Btn kind="quiet" sm onClick={() => go("channels")}>
          Back to the board
        </Btn>
      </div>

      <p className="kicker">
        {r.slug} · {r.when}
      </p>
      <h1 className="h1">{r.label}</h1>
      <p className="lede">{r.instruments}</p>
      <p className="d-note">
        Simulated run data for one prototype tenant. The field names and their nesting are the real
        ones; the values are not a Zavi business metric.
      </p>
      <div className="hr" />

      <Section
        num="01"
        label="Before the number"
        framing="The caveat prints above the figure it undermines. A reason to doubt a number, printed under the number, has already let the number land."
        id="d-run-caveat"
        railExtra={<div className="src mono">runCaveat, recipeStep.ts:338</div>}
      >
        <Blind what={r.caveat.title} why={r.caveat.detail} impact={r.caveat.impact ?? undefined} />
      </Section>

      <Section
        num="02"
        label="The number"
        framing="One headline figure. A figure with no label is a number floating on a page, and a label with no figure is a heading for nothing, so the run emits all three or the block is not read at all."
        id="d-run-summary"
        railExtra={<div className="src mono">runSummary, recipeStep.ts:320</div>}
      >
        <div className="d-fig">
          <b>
            {r.summary.value}
            {r.summary.unit ? <span className="u">{r.summary.unit}</span> : null}
          </b>
          <span className="cx">
            <b>{r.summary.label}</b> {r.summary.context}
          </span>
        </div>
        {thin ? (
          <p className="d-note">
            Zero is a real answer here. This run read nothing, and a summary that says zero of six is
            more use than a summary that is quietly absent, because absence reads as &ldquo;we did
            not get round to it&rdquo; rather than &ldquo;you are blocking us&rdquo;.
          </p>
        ) : null}
      </Section>

      <Section
        num="03"
        label="Breakdown"
        framing={
          thin
            ? "Absent on this run, so the section is not drawn."
            : "One small table. Four columns at most, eight rows at most."
        }
        id="d-run-breakdown"
        railExtra={<div className="src mono">runBreakdown, recipeStep.ts:359</div>}
      >
        {r.breakdown ? (
          <>
            <p className="mono">{r.breakdown.title}</p>
            <SpecTable
              head={r.breakdown.columns}
              rows={r.breakdown.rows.map((rw) =>
                rw.cells.map((cell, i) =>
                  i === rw.cells.length - 1 && rw.status ? (
                    <Chip key="verdict" kind={rw.status === "pass" ? "on" : "warn"}>{cell}</Chip>
                  ) : (
                    cell
                  ),
                ),
              )}
            />
            {r.breakdown.note ? <p className="d-note">{r.breakdown.note}</p> : null}
            <p className="d-note">
              A row whose cell count does not match the column count is dropped rather than padded. A
              table that silently invents an empty cell moves every value after it into the wrong
              column, which is worse than showing one row fewer. The status colours the last cell,
              which is the one the status is about.
            </p>
          </>
        ) : (
          <div className="row flat">
            <div className="row-sum">
              <span className="row-title">No breakdown on this run</span>
              <span className="row-meta mono">NOT DRAWN</span>
              <span />
            </div>
            <div className="row-proof">
              <p>
                The run emitted no breakdown block, so this section is not drawn. It does not become
                an empty table with a dash in every cell, and it does not become a sentence
                apologising for itself.
              </p>
              <p>
                The reason is above: nothing was read, so there is nothing to put in rows. A table
                here would be the first place a reader assumed something had been measured.
              </p>
            </div>
          </div>
        )}
      </Section>

      <Section
        num="04"
        label={plat.sectionTitle ?? "What Zavi wants to do"}
        framing="Ranked by the agent. A blocking step wins the headline regardless of position, because it is a precondition for every other step being worth anything. Approve, edit or push a card back and it changes here and on the channel page."
        id="d-run-ranked"
        railExtra={<div className="src mono">singleRecipeStep, recipeStep.ts:448</div>}
      >
        {r.actions.map((a) => (
          <ActionCard key={a.key} a={a} toast={toast} />
        ))}
        <p className="d-note">
          Which buttons a card gets depends on what the action is, never on the channel. One
          widening is proposed here and is not the product today: Edit is drawn wherever the action
          carries a deliverable, not on post rows alone. A founder who can see the text should be
          able to change it before it goes out.
        </p>
      </Section>

      <Section
        num="05"
        label="What Zavi could not read"
        framing={`PROMOTED. Today this is a muted fold reading "${r.reads_not_done.length} reads did not complete", under everything else. That is the wrong weight: on a thin run it is the entire finding.`}
        id="d-run-blind"
        railExtra={<div className="src mono">runReadsNotDone, recipeStep.ts:390</div>}
      >
        <p className="d-note">
          {r.reads_not_done.length} of this run&rsquo;s reads did not complete. Each one says what
          was missed, why, and what it costs, because an item without its cost is engineering
          trivia. &ldquo;Coverage truncated&rdquo; is trivia. &ldquo;Every click from that campaign
          is lost&rdquo; is a finding.
        </p>
        {r.reads_not_done.map((x) => (
          <Blind key={x.what} what={x.what} why={x.why} impact={x.impact ?? undefined} />
        ))}
        <p className="d-note">
          At most six are carried. A run that could not read anything is still a run that has to say
          so in the same voice it would have used for good news.
        </p>
      </Section>

      <Section
        num="06"
        label="Findings"
        framing="The ranked metric readings behind the figure. Eight at most, duplicates by metric id dropped."
        id="d-run-findings"
        railExtra={<div className="src mono">recipeFindings, recipeStep.ts:178</div>}
      >
        <SpecTable
          head={["Metric", "What was read", "Band"]}
          rows={r.findings.map((f) => {
            const band = findingBand(f);
            return [
              metricLabel(f.metric_id),
              <span key="read">
                {f.value}
                {f.blocks.length ? (
                  <>
                    <br />
                    <span className="muted">Blocks: {f.blocks.join("; ")}</span>
                  </>
                ) : null}
              </span>,
              band ? (
                <Chip key="band" kind={band === "pass" ? "on" : "warn"}>{band}</Chip>
              ) : (
                <span key="band" className="muted">
                  no bar
                </span>
              ),
            ];
          })}
        />
        <p className="d-note">
          Unmeasured draws no band even when both numbers are present. A thing we did not check must
          never be drawn as a thing we checked. For the rest the status outranks the arithmetic: for
          some metrics lower is better and for others higher is, and the schema does not say which,
          so the agent&rsquo;s own verdict is what decides pass from fail. The numbers separate a
          near miss from a real miss and nothing else.
        </p>
      </Section>

      <Section
        num="07"
        label="The envelope"
        framing="Every field on this page, its reader, and whether this run carried it. Printed because a prototype that invents an output field is worse than no prototype."
        id="d-run-envelope"
      >
        <SpecTable
          head={["Field on the decision body", "Reader", "Drawn on this run"]}
          rows={[
            [
              <span key="field" className="d-tok">caveat.title / .detail / .impact</span>,
              "runCaveat, recipeStep.ts:338",
              "yes, first",
            ],
            [
              <span key="field" className="d-tok">summary.label / .value / .unit / .context</span>,
              "runSummary, recipeStep.ts:320",
              "yes, second",
            ],
            [
              <span key="field" className="d-tok">
                breakdown.title / .columns / .rows[].cells / .rows[].status / .note
              </span>,
              "runBreakdown, recipeStep.ts:359",
              thin ? "no, absent so not drawn" : "yes, third",
            ],
            [
              <span key="field" className="d-tok">
                step.title / .body / .blocking / .effort / .evidence[] / .deliverable
              </span>,
              "singleRecipeStep, recipeStep.ts:448",
              "yes, one card per action",
            ],
            [
              <span key="field" className="d-tok">position / of</span>,
              "recipeStepPosition, recipeStep.ts:458",
              "yes, in each card's meta",
            ],
            [
              <span key="field" className="d-tok">deliverable.kind / .label / .content</span>,
              "recipeDeliverable, recipeStep.ts:61",
              r.actions.some((a) => a.deliverable) ? "yes" : "no, no action carries one",
            ],
            [
              <span key="field" className="d-tok">
                findings[].metric_id / .status / .value / .numeric_value / .target / .direction /
                .blocks
              </span>,
              "recipeFindings, recipeStep.ts:178",
              "yes",
            ],
            [
              <span key="field" className="d-tok">reads_not_done[].what / .why / .impact</span>,
              "runReadsNotDone, recipeStep.ts:390",
              "yes, promoted",
            ],
            [
              <span key="field" className="d-tok">rendered_markdown</span>,
              "recipeMarkdown, recipeStep.ts:414",
              r.rendered_markdown ? "carried, folded away" : "none on this run",
            ],
          ]}
        />
        <p className="d-note">
          All four run-level blocks ride on the FIRST fanned action only, so every reader returns
          nothing for the other cards in the run. The panel latches the first non-empty value it
          sees rather than reading them live, because closing action one would otherwise take the
          whole run&rsquo;s context off the screen while the actions it explains are still on it.
        </p>
        {r.rendered_markdown ? (
          <Row title="The written analysis" meta="rendered_markdown" src="apps/web/src/lib/workspace/recipeStep.ts:414">
            <p>{r.rendered_markdown}</p>
            <p className="muted">
              Folded away rather than printed. The ranked actions above are what a founder acts on;
              the prose is what they read when they want to argue with one.
            </p>
          </Row>
        ) : null}
        <div className="src mono">
          apps/web/src/components/workspace/layout/ChannelsPanel.tsx:232-371 · {r.slug} ·{" "}
          {boardRow(r.slug).tools} tools declared · registry.ts:{spec ? spec.line.split(":")[1] : ""}
        </div>
      </Section>
    </div>
  );
}
