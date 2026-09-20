"use client";

/* ============================================================
   The channel board. Ported from parts/40-channels.js SCREENS.channelsList.

   This file is also the BASE LAYER for the other two channel screens: the
   per-tenant row data, the PLATFORMS rows, the delivery-mode helpers and the
   action ledger all live here and are imported by ChannelDetailTab and
   RunOutputTab. It imports nothing from either of them, so the three files
   stack rather than cycle.

   Every product fact was re-read from /tmp/zavi-main, a clean checkout of
   praxis origin/main @ 8b3489333. Row state (waiting, work state, lock) is
   simulated for one prototype tenant. Zavi has no paying customers and
   launches the week of 2026-09-21, so nothing here is a business metric.
   ============================================================ */

import { useSyncExternalStore } from "react";
import { Blind, Btn, Row, Section, SpecTable } from "../../_components/kit";
import {
  CHANNELS,
  CHANNEL_HOLD,
  connState,
  deliveryMode,
  n,
  type ChannelSpec,
  type TabProps,
  type TierSlug,
  type V2State,
} from "../state";

/* ---------- the per-tenant row ---------- */

export type BoardRow = {
  slug: string;
  /** One line about the channel. registry.ts, each row's own description. */
  desc: string;
  /** Tools the registry row declares. Counted from registry.ts, not guessed. */
  tools: number;
  /** Every connector slug the registry declares, including the ones this page
   *  cannot link. `ChannelSpec.conn` in state.ts is the linkable subset, so a
   *  count of "declares no connector" has to read this, not that. */
  declares: string[];
  /** channel_pending_counts. Simulated for this prototype tenant. */
  waiting: number;
  /** tenant_channels.work_state. Simulated for this prototype tenant. */
  state: "idle" | "running" | "needs_review" | "delivered";
  lock: { kind: "soon" } | { kind: "plan"; tier: TierSlug } | null;
};

/** One data row per channel. This map plus `PLATFORMS` is the whole of what
 *  makes one channel page differ from another: no component is keyed on a
 *  slug anywhere in these three files. */
export const BOARD: Record<string, BoardRow> = {
  google_ads: {
    slug: "google_ads",
    desc: "Paid Search and Performance Max campaign actions.",
    tools: 19,
    declares: ["google_ads"],
    waiting: 5,
    state: "needs_review",
    lock: null,
  },
  meta_ads: {
    slug: "meta_ads",
    desc: "Paid acquisition on Facebook and Instagram.",
    tools: 15,
    declares: ["meta_ads"],
    waiting: 3,
    state: "needs_review",
    lock: null,
  },
  youtube_ads: {
    slug: "youtube_ads",
    desc: "Video campaigns bought through Google Ads.",
    tools: 13,
    declares: ["google_ads"],
    waiting: 0,
    state: "running",
    lock: null,
  },
  tiktok_ads: {
    slug: "tiktok_ads",
    desc: "Paid acquisition on TikTok.",
    tools: 1,
    declares: [],
    waiting: 0,
    state: "idle",
    lock: { kind: "plan", tier: "pro" },
  },
  chatgpt_ads: {
    slug: "chatgpt_ads",
    desc: "Paid acquisition in ChatGPT answers.",
    tools: 2,
    declares: [],
    waiting: 0,
    state: "idle",
    lock: { kind: "plan", tier: "pro" },
  },
  linkedin_ads: {
    slug: "linkedin_ads",
    desc: "Paid B2B acquisition on LinkedIn.",
    tools: 0,
    declares: [],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  reddit_ads: {
    slug: "reddit_ads",
    desc: "Paid acquisition on Reddit.",
    tools: 0,
    declares: [],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  influencer: {
    slug: "influencer",
    desc: "Creator partnerships and sponsored placements.",
    tools: 7,
    declares: ["google_analytics", "meta_ads"],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  email_marketing: {
    slug: "email_marketing",
    desc: "One-off sends to your own list.",
    tools: 5,
    declares: ["email"],
    waiting: 4,
    state: "idle",
    lock: { kind: "soon" },
  },
  sms: {
    slug: "sms",
    desc: "Text messaging to your own list.",
    tools: 0,
    declares: [],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  seo: {
    slug: "seo",
    desc: "Non-paid search traffic and the pages that earn it.",
    tools: 6,
    declares: ["google_analytics", "google_search_console"],
    waiting: 1,
    state: "delivered",
    lock: null,
  },
  geo: {
    slug: "geo",
    desc: "Whether AI assistants can read the site and cite the brand.",
    tools: 1,
    declares: [],
    waiting: 1,
    state: "delivered",
    lock: null,
  },
  linkedin_organic: {
    slug: "linkedin_organic",
    desc: "Unpaid posting and presence on LinkedIn.",
    tools: 2,
    declares: ["linkedin_social"],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  reddit_organic: {
    slug: "reddit_organic",
    desc: "Find buyer questions and prepare helpful answers, plus one community-native post.",
    tools: 1,
    declares: [],
    waiting: 4,
    state: "delivered",
    lock: null,
  },
  x_organic: {
    slug: "x_organic",
    desc: "Unpaid posting and presence on X.",
    tools: 2,
    declares: ["x_social"],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  instagram_organic: {
    slug: "instagram_organic",
    desc: "Unpaid posting and presence on Instagram.",
    tools: 3,
    declares: ["instagram_social", "pipedream.instagram_business"],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  tiktok_organic: {
    slug: "tiktok_organic",
    desc: "Unpaid short-form video on TikTok.",
    tools: 5,
    declares: ["tiktok"],
    waiting: 0,
    state: "idle",
    lock: null,
  },
  youtube_organic: {
    slug: "youtube_organic",
    desc: "Owned video channel and its search surface.",
    tools: 4,
    declares: ["pipedream.youtube_analytics_api"],
    waiting: 17,
    state: "idle",
    lock: { kind: "soon" },
  },
  ugc: {
    slug: "ugc",
    desc: "Creator-produced assets the company runs on its own channels. Buys craft, not audience.",
    tools: 3,
    declares: [],
    waiting: 0,
    state: "idle",
    lock: null,
  },
};

export function boardRow(slug: string): BoardRow {
  return (
    BOARD[slug] ?? {
      slug,
      desc: "",
      tools: 0,
      declares: [],
      waiting: 0,
      state: "idle",
      lock: null,
    }
  );
}

/* ---------- the PLATFORMS rows ---------- */

/** apps/web/src/components/workspace/actions/platforms.ts:159. The field NAMES
 *  below were dumped from that file rather than retyped, because the whole
 *  claim of this page is that a channel differs from another by the fields in
 *  its row. Ten rows are `{ name }` alone and four more are `{ name,
 *  charLimit }`, which is the fourteen. Google Ads and Reddit are the two long
 *  rows, at ten fields each. */
export type PlatformSpec = {
  name: string;
  /** Every field name the real row carries, in declaration order. */
  fields: string[];
  charLimit?: number;
  sectionTitle?: string;
  kpiFallback?: "gads" | "reddit";
  outputs?: boolean;
  human?: boolean;
  scan?: boolean;
  settings?: SettingField[];
};

export type SettingField = {
  kind: "list" | "number" | "toggle" | "text";
  id: string;
  label: string;
  help: string;
  itemTypes?: string[];
  verdicts?: boolean;
  suggest?: boolean;
  writesTo?: string;
  on?: string;
  off?: string;
};

export const PLATFORMS: Record<string, PlatformSpec> = {
  meta_ads: { name: "Meta Ads", fields: ["name"] },
  google_ads: {
    name: "Google Ads",
    fields: [
      "name",
      "maxWidth",
      "sectionTitle",
      "outputs",
      "kpiFallback",
      "metricDisplay",
      "metricLayout",
      "connect",
      "extras",
      "settings",
    ],
    sectionTitle: "What Zavi wants to do",
    kpiFallback: "gads",
    outputs: false,
    settings: [
      {
        kind: "list",
        id: "negatives",
        label: "Negative keywords",
        help: "Searches Zavi will not let your ads show on. It never removes one you added.",
        itemTypes: ["phrase", "exact", "broad"],
      },
      {
        kind: "number",
        id: "budget",
        label: "Monthly budget",
        help: "The ceiling Zavi paces against. It will not propose past it.",
        writesTo: "channel.monthly_budget",
      },
      {
        kind: "number",
        id: "tcpa",
        label: "Target cost per conversion",
        help: "What a booked job is worth paying for. Every proposal is judged against this.",
      },
      {
        kind: "toggle",
        id: "maypause",
        label: "Pause a losing campaign",
        help: "Whether Zavi may propose a pause at all.",
        on: "Yes, propose it, with the numbers",
        off: "No, never propose a pause",
      },
      {
        kind: "text",
        id: "landing_page",
        label: "Where a click should land",
        help: "The page Zavi checks against when it reads a campaign.",
      },
    ],
  },
  youtube_ads: { name: "YouTube Ads", fields: ["name", "isDecisionId"] },
  tiktok_ads: { name: "TikTok Ads", fields: ["name"] },
  linkedin_ads: { name: "LinkedIn Ads", fields: ["name"] },
  reddit_ads: { name: "Reddit Ads", fields: ["name"] },
  chatgpt_ads: { name: "ChatGPT Ads", fields: ["name"] },
  seo: { name: "SEO", fields: ["name"] },
  geo: { name: "GEO", fields: ["name"] },
  x_organic: {
    name: "X",
    fields: ["name", "charLimit", "measure", "composerUrl", "extras"],
    charLimit: 280,
  },
  linkedin_organic: {
    name: "LinkedIn",
    fields: ["name", "charLimit", "composerUrl"],
    charLimit: 3000,
  },
  reddit_organic: {
    name: "Reddit",
    fields: [
      "name",
      "charLimit",
      "extras",
      "kpiFallback",
      "metricDisplay",
      "composerUrl",
      "handoffHint",
      "scan",
      "payload",
      "settings",
    ],
    charLimit: 40000,
    kpiFallback: "reddit",
    scan: true,
    settings: [
      {
        kind: "list",
        id: "keywords",
        label: "Keywords",
        help: "Phrases Zavi searches for. The type steers how it reads a thread.",
        itemTypes: [
          "problem",
          "brand",
          "product",
          "competitor",
          "category",
          "comparison",
          "industry",
        ],
        suggest: true,
      },
      {
        kind: "list",
        id: "competitors",
        label: "Competitors",
        help: "Brands Zavi watches for in the same threads, so it can tell you where you are being compared.",
        suggest: true,
      },
      {
        kind: "list",
        id: "communities",
        label: "Communities",
        help: "Where Zavi is allowed to look. It will not post anywhere you have not listed.",
        verdicts: true,
      },
      {
        kind: "toggle",
        id: "autopost",
        label: "Post without asking",
        help: "Off means every reply waits for you, even once an account is connected.",
        on: "Yes, post approved replies itself",
        off: "No, show me every reply first",
      },
    ],
  },
  instagram_organic: { name: "Instagram", fields: ["name", "charLimit"], charLimit: 2200 },
  tiktok_organic: { name: "TikTok", fields: ["name", "charLimit"], charLimit: 2200 },
  youtube_organic: { name: "YouTube", fields: ["name", "charLimit"], charLimit: 5000 },
  ugc: { name: "UGC", fields: ["name"], human: true },
  influencer: { name: "Influencer", fields: ["name"] },
  email_marketing: { name: "Email campaigns", fields: ["name"] },
  sms: { name: "SMS", fields: ["name", "charLimit"], charLimit: 160 },
};

export function platformFor(slug: string): PlatformSpec {
  return PLATFORMS[slug] ?? { name: slug.replace(/_/g, " "), fields: ["name"] };
}

/* ---------- the small shared vocabularies ---------- */

/** ChannelSnapshotPaste.tsx:39. Providers whose numbers a paste can stand in
 *  for, mirroring the enum on get_latest_snapshot.ts. */
export const PASTEABLE = [
  "tiktok_ads",
  "google_ads",
  "meta_ads",
  "linkedin_ads",
  "chatgpt_ads",
];

/** channelDetail.ts:126 MODE_COPY, verbatim. `advise` is listed because the
 *  record declares it; no channel reaches it, because every channel has a
 *  recipe. */
export const MODE_COPY: Record<"execute" | "produce" | "advise", string> = {
  execute: "Zavi can act here. It proposes the change and carries it out once you approve.",
  produce:
    "Zavi makes the thing here, and you do the last step. It cannot post on your behalf yet.",
  advise: "Zavi can read and recommend here, but not act.",
};

/** ChannelsPanel.tsx:390 STATE_LABEL. work_state is an internal enum; this is
 *  what a person reads. `idle` deliberately reads as nothing. */
export const STATE_LABEL: Record<BoardRow["state"], string | null> = {
  idle: null,
  running: "Working on it",
  needs_review: "Ready for you",
  delivered: "Done",
};

/** planUpgrade.ts:15. */
export const TIER_NAME: Record<TierSlug, string> = {
  free: "Free",
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

/**
 * ChannelsPage.tsx:53 waitingClause, ported term for term.
 *
 * Zero renders nothing, because "0 waiting" is the same empty claim with a
 * number stuck on it. The noun stays elided so one action reads "1 waiting"
 * rather than "1 waitings".
 */
export function waitingClause(waiting: number, separator = " · "): string {
  return waiting > 0 ? `${separator}${waiting} waiting` : "";
}

/** True when at least one connector the channel declares is actually linked.
 *  Reads the linkable subset, because a pipedream rail with no Settings tile
 *  can never be linked from this prototype and counting it would make the
 *  mode sentence lie. */
export function linked(s: V2State, c: ChannelSpec): boolean {
  return c.conn.some((k) => connState(s, k) === "connected");
}

/* ---------- the action ledger ---------- */

/* An action card behaves the same on the channel page and on the run page, so
   its status has to outlive a tab switch. `V2State` is not mine to extend and
   `ChannelAction.status` is a three-value union that cannot carry edited,
   snoozed or editing, so the prototype keeps its own ledger here and both
   screens subscribe to it. Module scope plus useSyncExternalStore is the
   smallest thing that makes "approve it here and it changed there" true. */

export type ActionStatus =
  | "pending"
  | "approved"
  | "edited"
  | "rejected"
  | "snoozing"
  | "snoozed"
  | "editing";

export type ActionRecord = { status: ActionStatus; text?: string; back?: string };

const ledger: Record<string, ActionRecord> = {};
const listeners = new Set<() => void>();
let ledgerSnapshot: Record<string, ActionRecord> = {};

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function readLedger() {
  return ledgerSnapshot;
}

/** Merge a patch onto one action and tell every mounted card. */
export function writeAction(key: string, patch: ActionRecord) {
  ledger[key] = { ...ledger[key], ...patch };
  ledgerSnapshot = { ...ledger };
  listeners.forEach((f) => f());
}

export function useActionLedger(): Record<string, ActionRecord> {
  return useSyncExternalStore(subscribe, readLedger, readLedger);
}

export function actionRecord(l: Record<string, ActionRecord>, key: string): ActionRecord {
  return l[key] ?? { status: "pending" };
}

/** The date "Not now" brings a card back on. */
export function plusDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ---------- ordering ---------- */

/* Ordered by what needs you, not by category. Computed from the row, never
   hand-sorted: a list whose order is typed in by hand stops being true the
   first time a count moves. */
function attentionRank(r: BoardRow): number {
  if (r.lock) return r.waiting > 0 ? 3 : 5;
  if (r.waiting > 0) return 1;
  if (r.state === "running") return 2;
  return 4;
}

export function boardOrder(): ChannelSpec[] {
  return [...CHANNELS].sort((a, b) => {
    const ra = boardRow(a.slug);
    const rb = boardRow(b.slug);
    const d = attentionRank(ra) - attentionRank(rb);
    if (d !== 0) return d;
    if (rb.waiting !== ra.waiting) return rb.waiting - ra.waiting;
    return a.name.localeCompare(b.name);
  });
}

/* ---------- the screen ---------- */

export function ChannelsTab({ state, setState, toast, go }: TabProps) {
  const rows = boardOrder();
  const totalWaiting = CHANNELS.reduce((sum, c) => sum + boardRow(c.slug).waiting, 0);
  const lockedWaiting = CHANNELS.filter((c) => boardRow(c.slug).lock?.kind === "soon").reduce(
    (sum, c) => sum + boardRow(c.slug).waiting,
    0,
  );
  const noConnector = CHANNELS.filter((c) => boardRow(c.slug).declares.length === 0).length;
  const noTools = CHANNELS.filter((c) => boardRow(c.slug).tools === 0);
  const seeded =
    connState(state, "google_ads") === "connected" || connState(state, "meta_ads") === "connected";

  function open(slug: string) {
    setState((s) => ({ ...s, openChannel: slug }));
    go("channelDetail");
  }

  /* An explicit, reversible way to see the connected mix. It writes the
     shell's own connector map, so the top bar, the next-action bar and the
     Home tab all move with it. Nothing reads as connected until you press
     this, because a prototype that seeds two ad accounts on load has changed
     state the viewer never touched. */
  function seed() {
    const to = seeded ? "none" : "connected";
    setState((s) => ({
      ...s,
      connectors: { ...s.connectors, google_ads: to, meta_ads: to },
    }));
    toast(
      to === "connected"
        ? "Simulated: Google Ads and Meta Ads now read as connected. Watch the mode sentences change."
        : "Both ad accounts disconnected.",
    );
  }

  return (
    <div className="d-main" style={{ maxWidth: 980 }}>
      <div className="d-head">
        <div>
          <p className="kicker">Channels</p>
          <h1 className="h1">Nineteen surfaces. One page draws all of them.</h1>
        </div>
        <Btn kind="quiet" sm onClick={seed}>
          {seeded ? "Disconnect the two ad accounts" : "Simulate two connected ad accounts"}
        </Btn>
      </div>
      <p className="lede">
        Ordered by what needs you, not by category. {totalWaiting} actions are waiting across the
        account, {lockedWaiting} of them behind a tile that will not open. Open any row to read what
        the registry declares about it, then press Open to see the page it gets.
      </p>
      <p className="d-note">
        Row state on this prototype, the waiting counts and the work states, is simulated for one
        tenant. No figure here is a Zavi business metric. Zavi has no paying customers and launches
        the week of 2026-09-21.
      </p>
      <div className="hr" />

      <Section
        num="01"
        label="The list"
        framing="The claim is the row. The evidence is one click down. Locked rows stay in the same list rather than being hidden, because hiding them is how the work behind them goes missing."
        id="d-board"
      >
        {rows.map((c) => (
          <BoardListRow key={c.slug} c={c} state={state} onOpen={open} onLocked={toast} />
        ))}
      </Section>

      <Section
        num="02"
        label="What the list does not say"
        framing="Readiness is an internal honesty invariant, not a badge. It has exactly one consumer, and planned and read_only are byte identical to a customer."
        id="d-board-truth"
      >
        <FlatReadiness />
        <Row title="The nineteen rows as declared" meta="registry.ts:304" src="packages/shared/src/channels/registry.ts:304-1418">
          <SpecTable
            head={["Channel", "Readiness", "Connectors declared", "Tools"]}
            rows={CHANNELS.map((c) => {
              const r = boardRow(c.slug);
              return [
                <>
                  {c.name} <span className="d-tok">{c.slug}</span>
                </>,
                c.ready,
                r.declares.length === 0 ? (
                  <span className="muted">none</span>
                ) : (
                  r.declares.join(", ")
                ),
                r.tools === 0 ? <span className="needs-source">0</span> : String(r.tools),
              ];
            })}
          />
          <p className="d-note">
            {noConnector} of the 19 declare no connector at all. That count reads the registry, not
            the Settings page: Instagram and YouTube each declare a Pipedream rail as well, and
            YouTube&rsquo;s has no tile to link, so it is a declared connector this page can never
            fill.
          </p>
        </Row>
        <Blind
          what={`${noTools.length} tiles have nothing behind them at all`}
          why={`${noTools
            .map((c) => c.name)
            .join(", ")} each declare an empty connector list and an empty tool list. There is no messaging connector and no sms tool in the repo, no LinkedIn Ads adapter and no Reddit Ads adapter. They can read a public surface and draft, and they cannot send, buy or measure. SMS states it in its own registry row: measured on, nothing yet.`}
          impact="They are in the list on purpose. A tile that shows the gap is honest. A tile quietly missing from the list is a capability a founder assumes they have."
          action={
            <div className="src mono">
              packages/shared/src/channels/registry.ts:557, :615, :1401
            </div>
          }
        />
      </Section>

      <Section
        num="03"
        label="How this page stays one page"
        framing="The test for any change to the channel page: does adding channel 20 cost one data row and zero new components."
        id="d-board-one"
      >
        <Row
          title="A locked tile still says what it is sitting on"
          meta="ChannelsPage.tsx:36"
          src="apps/web/src/components/workspace/layout/ChannelsPage.tsx:36-55"
        >
          <p>
            A locked channel used to say Coming soon and nothing else, which reads as not built yet,
            while behind two of them on this account sit {lockedWaiting} finished actions the
            founder has no way to reach. Coming soon over completed work is worse than an empty
            tile, because an empty tile at least does not promise.
          </p>
          <p>
            The number was already there. It comes from{" "}
            <span className="d-tok">channel_pending_counts</span> and is filled for locked and
            unlocked rows alike. The tile simply never said it. Nothing about the lock changed: it
            is still inert and unopenable.
          </p>
          <p>
            Zero renders nothing, because 0 waiting is the same empty claim with a number stuck on
            it. On this page that is why most rows carry no clause and two do.
          </p>
        </Row>
        <Row
          title="Fourteen of the nineteen PLATFORMS rows are a name and at most a character limit"
          meta="platforms.ts:159"
          src="apps/web/src/components/workspace/actions/platforms.ts:151-159"
        >
          <p>
            What differs between two channel pages is a row in a data file, not a component. Ten
            rows are <span className="d-tok">{"{ name }"}</span> on its own and four more are{" "}
            <span className="d-tok">{"{ name, charLimit }"}</span>. Google Ads and Reddit are the two
            long rows, at ten fields each, and everything long about them is a declared field: a
            width, a section heading, a settings list, a scan endpoint, a payload predicate.
          </p>
          <p>
            A test fails when a registry slug has no row, so channel 20 costs a row there and
            nothing else.
          </p>
        </Row>
        <Row
          title="Two slug reads are left inside the panel, and both are behaviour"
          meta="ChannelPanel.tsx:22"
          src="apps/web/src/components/workspace/layout/ChannelPanel.tsx:22-30"
        >
          <p>
            Inside the shared page, two channels still get one bespoke surface: SEO has an
            instrument panel instead of facts that would claim measurements it cannot read, and Meta
            Ads keeps its own action lane until the generic one is proven.
          </p>
          <p>
            One level up, two channels still have a page of their own: GEO and X. Google Ads came
            off that ladder and Reddit followed it, and both are rows now.
          </p>
          <p>Four exceptions out of nineteen. That number only goes down.</p>
        </Row>
        <FlatHold />
      </Section>
    </div>
  );
}

/* ---------- one row on the board ---------- */

function BoardListRow({
  c,
  state,
  onOpen,
  onLocked,
}: {
  c: ChannelSpec;
  state: V2State;
  onOpen: (slug: string) => void;
  onLocked: (msg: string) => void;
}) {
  const r = boardRow(c.slug);
  const plat = platformFor(c.slug);
  const isLinked = linked(state, c);
  const mode = deliveryMode(state, c);

  /* ChannelsPanel.tsx:820. The subtitle is the waiting count when there is
     one, otherwise the work-state label, otherwise nothing at all. A lock
     rewrites it, and keeps the count as a trailing clause. */
  let sub = r.waiting > 0 ? `${r.waiting} ${r.waiting === 1 ? "action" : "actions"} waiting` : STATE_LABEL[r.state];
  let meta = "";
  if (r.lock?.kind === "soon") {
    sub = `Coming soon${waitingClause(r.waiting)}`;
    meta = "LOCKED";
  } else if (r.lock?.kind === "plan") {
    sub = "Upgrade to run this channel";
    meta = `${TIER_NAME[r.lock.tier]} PLAN`.toUpperCase();
  } else if (r.waiting > 0) {
    meta = String(r.waiting);
  } else if (r.state === "running") {
    meta = "RUNNING";
  }

  const body = (
    <Row
      title={c.name}
      sub={sub ?? ""}
      meta={meta}
      src={`packages/shared/src/channels/${c.line}`}
    >
      <p>{r.desc}</p>
      <table className="sheet">
        <tbody>
          <tr>
            <th>Readiness</th>
            <td>{c.ready}</td>
          </tr>
          <tr>
            <th>Connectors</th>
            <td>
              {r.declares.length === 0
                ? "none declared"
                : `${r.declares.join(", ")}, ${isLinked ? "linked" : "not linked"}`}
            </td>
          </tr>
          <tr>
            <th>Tools</th>
            <td>{r.tools === 0 ? "none" : `${r.tools} declared`}</td>
          </tr>
          <tr>
            <th>Measured on</th>
            <td>{c.measured}</td>
          </tr>
          <tr>
            <th>Mode shown</th>
            <td>{MODE_COPY[mode]}</td>
          </tr>
          <tr>
            <th>PLATFORMS row</th>
            <td>
              {plat.fields.length === 1
                ? "one field, its name"
                : plat.fields.join(", ")}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="d-actbar">
        {r.lock ? (
          <Btn
            kind="quiet"
            sm
            onClick={() =>
              onLocked(
                r.lock?.kind === "soon"
                  ? `Inert in the product too. ${r.waiting} finished ${
                      r.waiting === 1 ? "action stays" : "actions stay"
                    } unreachable until it unlocks.`
                  : `Locked to the ${
                      r.lock?.kind === "plan" ? TIER_NAME[r.lock.tier] : ""
                    } plan. The real tile opens billing settings.`,
              )
            }
          >
            {r.lock.kind === "soon"
              ? "Why this is inert"
              : `Needs the ${TIER_NAME[r.lock.tier]} plan`}
          </Btn>
        ) : (
          <Btn kind="dark" sm onClick={() => onOpen(c.slug)}>
            Open {plat.name}
          </Btn>
        )}
      </div>
    </Row>
  );

  return r.lock ? <div className="d-lockrow">{body}</div> : body;
}

/* ---------- two flat notes ---------- */

function FlatReadiness() {
  return (
    <div className="row flat">
      <div className="row-sum">
        <span className="row-title">Readiness is never shown to a founder</span>
        <span className="row-meta mono">registry.ts:22</span>
        <span />
      </div>
      <div className="row-proof">
        <p>
          The registry says so in its own header. <span className="d-tok">readiness</span> feeds{" "}
          <span className="d-tok">deliveryModeFor</span> and nothing else, where it is one term of a
          three-term AND: readiness is live, the channel declares a connector, and one of those
          connectors is linked. Anything that fails the AND falls through to the produce copy, which
          every channel reaches because every channel has a recipe.
        </p>
        <p>
          So a planned tile and a read_only tile read the same to a customer. The table below is the
          internal view, printed here because this is a design document and not the product.
        </p>
        <div className="src mono">apps/backend/src/routes/channels/list.ts:94-108</div>
      </div>
    </div>
  );
}

function FlatHold() {
  return (
    <div className="row flat">
      <div className="row-sum">
        <span className="row-title">What a run of one of these holds</span>
        <span className="row-meta mono">credits.ts:76</span>
        <span />
      </div>
      <div className="row-proof">
        <p>
          Every channel in this list reserves {n(CHANNEL_HOLD)} credits at enqueue. The reserve is a
          hold, not a price: settlement is on real cost, so over-holding is safe and under-holding
          is not.
        </p>
        <p>
          The product&rsquo;s own empty state still reads &ldquo;About 160 credits&rdquo;, which was
          the default before each channel took ownership of its own executor. This page prints{" "}
          {n(CHANNEL_HOLD)} because that is what the reserve table holds today, and a prototype that
          repeats a string its own code contradicts is worse than no prototype.
        </p>
        <div className="src mono">
          apps/backend/src/services/agents/credits.ts:76-100, :118 ·
          apps/web/src/components/workspace/layout/ChannelEmptyStates.tsx:35
        </div>
      </div>
    </div>
  );
}
