"use client";

/* ============================================================
   Console home. Ported from parts/30-console.js SCREENS.consoleHome.

   Two panels at equal weight: work you can start in one click, and the list of
   things Zavi is currently guessing about. Neither is the footnote. Every
   figure carries the path:line it was read from in /tmp/zavi-main @ 8b3489333.
   ============================================================ */

import { type ReactNode } from "react";
import { Blind, Btn, Chip, Row, Section } from "../../_components/kit";
import {
  CHANNEL_HOLD,
  FREE_DAILY,
  MCP_CLIENTS,
  MCP_TOOLS,
  MCP_URL,
  MIN_HOLD,
  RAIL_CONNECTOR_KEYS,
  afford,
  channelState,
  connState,
  connectorSpec,
  debit,
  flash,
  n,
  nextAction,
  withChannel,
  type ChannelAction,
  type ConnState,
  type ConnectorKey,
  type TabId,
  type TabProps,
  type V2State,
} from "../state";

/* ---------- the four example runs ---------- */

type Example = {
  slug: string;
  title: string;
  what: string;
  tool: string;
  free: boolean;
  hold: number;
  src: string;
  actions: ChannelAction[];
  cannot: string[];
  note: string;
};

/** Each one is a real channel, its real executor, its real hold, and an outcome
 *  instead of a feature. Exported so the channel board can reuse the same
 *  bodies rather than inventing a second set. */
export const EXAMPLES: Example[] = [
  {
    slug: "seo",
    title: "Find what is stopping your pages from ranking",
    what: "Crawls your own public site and ranks every problem blocker, high, medium, with the URL each one was found on.",
    tool: "growth_seo_audit",
    free: true,
    hold: CHANNEL_HOLD,
    src: "packages/shared/src/channels/registry.ts:728 · services/tools/growth/seo_audit.ts:43",
    actions: [
      {
        action_type: "fix",
        title: "Three pages carry the same title tag",
        impact: 4,
        impact_reason: "Duplicate titles make Google pick one page and drop the rest",
        blocking: false,
      },
      {
        action_type: "fix",
        title: "The pricing page has no meta description",
        impact: 3,
        impact_reason: "Google writes its own snippet when you do not",
        blocking: false,
      },
      {
        action_type: "check",
        title: "robots.txt could not be read",
        impact: 3,
        impact_reason:
          "Crawl rules are unknown. That is not the same as crawling is allowed.",
        blocking: true,
      },
    ],
    cannot: ["traffic", "rankings", "impressions", "clicks", "CTR"],
    note: "Everything here is public evidence, read from your own site. It may describe and recommend. It may never be presented as measured results.",
  },
  {
    slug: "geo",
    title: "Find out whether AI assistants can read you and cite you",
    what: "Checks which AI crawlers your site lets in, whether the page actually answers the question, and where the brand is mentioned off-site.",
    tool: "growth_seo_audit",
    free: true,
    hold: CHANNEL_HOLD,
    src: "packages/shared/src/channels/registry.ts:773",
    actions: [
      {
        action_type: "fix",
        title: "robots.txt blocks GPTBot and ClaudeBot",
        impact: 5,
        impact_reason: "Assistants cannot read a page they are not allowed to fetch",
        blocking: true,
      },
      {
        action_type: "page",
        title: "Rewrite the top question into a direct answer",
        impact: 4,
        impact_reason: "An answer engine quotes the sentence that answers the question",
        blocking: false,
      },
    ],
    cannot: ["how often you are actually cited", "which assistant sent a visit"],
    note: "Same crawl as SEO, read for a different question. No connector, so no measured number.",
  },
  {
    slug: "reddit_organic",
    title: "Find the threads where people ask for what you sell",
    what: "Reads public Reddit permalinks, finds buyer questions, and drafts the answers plus one community-native post.",
    tool: "reddit_thread_read",
    free: true,
    hold: CHANNEL_HOLD,
    src: "packages/shared/src/channels/registry.ts:896 · services/tools/reddit/thread_read.ts:178",
    actions: [
      {
        action_type: "reply",
        title: "Draft an answer for the r/smallbusiness thread",
        impact: 4,
        impact_reason: "The asker names your exact problem and no one answered it",
        blocking: false,
      },
      {
        action_type: "text_post",
        title: "One community-native post for the same subreddit",
        impact: 2,
        impact_reason: "Answers first, post second. Posting cold reads as an ad.",
        blocking: false,
      },
    ],
    cannot: [
      "per_comment_scores",
      "collapsed_comment_branches",
      "subreddit_rules_text",
      "account_karma_or_age_gates",
      "positive_confirmation_that_a_reply_is_allowed",
    ],
    note: "Prod holds zero reddit_social connections, so this channel is deliberately connector-free. Not finding the archived marker is NOT the same as confirming the thread accepts replies.",
  },
  {
    slug: "google_ads",
    title: "Read where your ad money actually went",
    what: "Reads campaigns, ad groups, keywords and search terms, then proposes the exact changes worth making.",
    tool: "google_ads",
    free: false,
    hold: CHANNEL_HOLD,
    src: "packages/shared/src/channels/registry.ts:381",
    actions: [],
    cannot: [
      "spend",
      "cost per conversion",
      "return on ad spend",
      "share of searches you appeared in",
    ],
    note: "This channel declares a connector and you have not linked one, so it falls through to advice. It cannot state a number about an account it cannot read.",
  },
];

/* ---------- what Zavi cannot see ---------- */

type BlindSpot = {
  id: string;
  what: string;
  why: string;
  impact: string;
  /** null means no connector closes it. Those rows explain what runs instead
   *  rather than offering a button that cannot work. */
  conn: ConnectorKey | null;
  instead?: string;
  src: string;
};

const BLIND: BlindSpot[] = [
  {
    id: "visits",
    what: "How many people visit, and where they come from",
    why: "No analytics connector. Without one, nothing in this workspace observes a visit.",
    impact:
      "Every claim about your traffic stays a guess, and a goal measured in signups reads as a dash.",
    conn: "google_analytics",
    src: "apps/backend/src/services/growth/hypothesis.ts:121-123",
  },
  {
    id: "after",
    what: "What happens after someone signs up",
    why: "Funnel needs an operator database. Cohorts need Stripe.",
    impact:
      "Zavi can tell you how to get more people to the door. It cannot tell you which ones stayed.",
    conn: "operator_db",
    src: "apps/backend/src/services/growth/hypothesis.ts:121-123",
  },
  {
    id: "searches",
    what: "Which searches you already appear in",
    why: "The site crawl reads your pages, not Google's index. Search performance is a different, connected rail.",
    impact:
      "SEO advice lands as a ranked list of problems, with no impressions, clicks or position beside any of it.",
    conn: "google_search_console",
    src: "apps/backend/src/services/tools/growth/seo_audit.ts:20-26",
  },
  {
    id: "adspend",
    what: "Where your ad money went",
    why: "Google Ads and Meta Ads both declare a connector, and neither is linked.",
    impact: "Both ad channels fall through to advice. Neither can state a spend figure.",
    conn: "google_ads",
    src: "packages/shared/src/channels/registry.ts:304, :381",
  },
  {
    id: "ownposts",
    what: "What your own posts actually reached",
    why: "Instagram and X insights are owned reads. They need the account linked.",
    impact: "Zavi can draft the post. It cannot tell you whether the last one worked.",
    conn: "instagram_social",
    src: "services/tools/instagram/read_insights.ts:163 · x-social/read_post_metrics.ts:100",
  },
  {
    id: "youtube",
    what: "Watch time, impressions, click-through rate and retention on YouTube",
    why: "The public YouTube reads run on a Zavi-owned key and return views, subscribers and video counts only. The rest is analytics-only, and that rail has no tile on this page to click.",
    impact:
      "Zavi can see that a video exists and how many watched it. It cannot see why people stopped watching.",
    conn: null,
    instead:
      "YouTube analytics rides a Pipedream connection whose descriptor declares settingsTile: false, so there is nothing to link here. The channel reads public view and subscriber counts and says the rest is missing.",
    src: "services/tools/youtube/channel_stats.ts:82-88 · connector-descriptor.ts:153",
  },
  {
    id: "reddit",
    what: "Whether a Reddit thread will actually accept your reply",
    why: "There is no connector to fix this one. Prod holds zero reddit_social connections, so the channel reads public permalinks and nothing else.",
    impact:
      "Zavi drafts the answer and tells you it could not confirm the thread is open. You check before you post.",
    conn: null,
    instead:
      "Reddit reads public permalinks with reddit_thread_read. It drafts the answer and returns positive_confirmation_that_a_reply_is_allowed in cannot_see, which is the honest version of not knowing.",
    src: "apps/backend/src/services/tools/reddit/thread_read.ts:178-186",
  },
];

/* ---------- small shared bits ---------- */

function connChip(st: ConnState) {
  if (st === "connected") return <Chip kind="on">Connected</Chip>;
  if (st === "pending") return <Chip kind="warn">Approval sent</Chip>;
  return <Chip>Not connected</Chip>;
}

export function ConnectorLines({
  state,
  keys,
  onConnect,
}: {
  state: V2State;
  keys: ConnectorKey[];
  onConnect: (key: ConnectorKey) => void;
}) {
  return (
    <>
      {keys.map((key) => {
        const spec = connectorSpec(key);
        const st = connState(state, key);
        return (
          <div className="d-conn" key={key}>
            <div className="d-conn-n">
              {spec.label}
              <span>{spec.what}</span>
            </div>
            {connChip(st)}
            {st === "none" ? (
              <Btn kind="quiet" sm onClick={() => onConnect(key)}>
                Connect
              </Btn>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

/* ---------- the screen ---------- */

export function HomeTab({ state, setState, toast, go }: TabProps) {
  const na = nextAction(state);
  const spent = FREE_DAILY - state.creditsDay;

  /* One click opens the approval. Nothing is linked until it is confirmed in
     Settings, which is the second click. */
  function connect(key: ConnectorKey) {
    setState((s) => ({ ...s, connectors: { ...s.connectors, [key]: "pending" } }));
    toast(
      `${connectorSpec(key).label}: approval opened. Nothing is linked until you confirm it in Settings.`,
    );
  }

  function run(i: number) {
    const ex = EXAMPLES[i];
    if (!ex) return;

    setState((s) => {
      if (!afford(s, ex.hold)) {
        const left = s.creditsDay + s.creditsMonth;
        return {
          ...s,
          channels: withChannel(s, ex.slug, {
            lastError: {
              code: "insufficient_credits",
              message: `The reserve raised insufficient_credits and the send returned 402. You have ${n(
                left,
              )} credits left and a channel run holds ${n(
                ex.hold,
              )}. A ${n(MIN_HOLD)}-credit agent run would still go through, so the banner reads low, not depleted.`,
            },
          }),
        };
      }

      const prev = channelState(s, ex.slug);
      const runRow = {
        run_id: `run_${ex.slug}_${prev.runs.length + 1}`,
        channel_slug: ex.slug,
        status: "succeeded" as const,
        provenance: ex.free ? "public" : "none",
        actions: ex.actions,
        cannot_see: ex.cannot,
        note: ex.note,
      };
      return {
        ...s,
        ...debit(s, ex.hold),
        runs: s.runs + 1,
        channels: withChannel(s, ex.slug, {
          lastError: null,
          runs: [...prev.runs, runRow],
          actions: [
            ...prev.actions,
            ...ex.actions.map((a) => ({
              ...a,
              status: "pending" as const,
              channel_slug: ex.slug,
              proposed_at: "just now",
            })),
          ],
        }),
      };
    });

    if (!afford(state, ex.hold)) {
      toast("Refused: insufficient_credits (402)");
      return;
    }
    toast(
      ex.actions.length
        ? `${ex.actions.length} actions waiting on ${ex.slug}`
        : `Run finished with zero actions on ${ex.slug}`,
    );
  }

  function openResult(slug: string) {
    setState((s) => ({ ...s, openChannel: slug }));
    go("runOutput");
  }

  const main = (
    <div className="d-main">
      <p className="kicker">Console</p>
      <h1 className="h1">Run something, then read what it could not see.</h1>
      <p className="lede">
        Two panels, equal weight. On the left, work you can start in one click. Below it, the list
        of things Zavi is currently guessing about. Neither one is the footnote.
      </p>

      <Section
        num="01"
        label="First runs"
        framing={`Four real channels, each described by what you get back rather than what it does. Every run holds ${n(
          CHANNEL_HOLD,
        )} credits before it starts.`}
        id="d-runs"
      >
        <div className="grid2">
          {EXAMPLES.map((ex, i) => (
            <RunCard
              key={ex.slug}
              ex={ex}
              i={i}
              state={state}
              onRun={() => run(i)}
              onOpen={() => openResult(ex.slug)}
            />
          ))}
        </div>
        <p className="muted" style={{ fontSize: 12.5, margin: "14px 0 0" }}>
          The hold is a reserve taken at enqueue, not a price. {n(FREE_DAILY)} free credits a day
          buys two channel runs at {n(CHANNEL_HOLD)} each, and the third is refused with{" "}
          {n(FREE_DAILY - 2 * CHANNEL_HOLD)} credits still on the counter. That is the real
          arithmetic, not a demo limit.
        </p>
      </Section>

      <Section
        num="02"
        label="What Zavi cannot see yet"
        framing="Seven things this workspace is blind to right now. Five have a connector on this page that closes them. Two do not, and say what runs instead."
        id="d-blind"
      >
        {BLIND.map((b) => (
          <BlindRow key={b.id} b={b} state={state} onConnect={connect} onWhy={toast} />
        ))}
      </Section>

      <Section
        num="03"
        label="Nothing is hidden"
        framing="The parts of this screen that are honest limitations, collected so they are not scattered as asides."
      >
        <Row
          title="A run with no connector still runs. It just cannot state a number."
          meta="delivery mode"
          src="apps/backend/src/routes/channels/list.ts:94-108 · packages/shared/src/channels/registry.ts:24-38"
        >
          <p>
            A channel renders as <b>execute</b> only when three things are true at once: readiness
            is <span className="mono">live</span>, the channel declares at least one connector, and
            one of those connectors is actually linked. Anything short of that falls through to{" "}
            <b>produce</b> if the channel has a recipe, and every channel has one.
          </p>
          <p>
            So <span className="mono">planned</span> and <span className="mono">read_only</span>{" "}
            are byte-identical to you. Readiness is an internal honesty invariant, not a switch you
            can feel.
          </p>
        </Row>
        <Row
          title="A site that does not answer is reported, never assumed"
          meta="error_code"
          src="apps/backend/src/services/tools/growth/seo/run.ts:100, :129-131, :134"
        >
          <p>Two real failures, with the exact text the tool returns:</p>
          <p>
            <span className="mono">seo_site_unknown</span>. &ldquo;There&rsquo;s no website on file
            yet, so there&rsquo;s nothing to audit. Add the site URL in Settings and run this
            again.&rdquo;
          </p>
          <p>
            <span className="mono">seo_site_unreachable</span>. &ldquo;Couldn&rsquo;t read any page
            at your site. The site may be down, blocking crawlers, or the URL on file may be
            wrong.&rdquo;
          </p>
          <p>
            An unreadable robots.txt is reported as unknown, which is not the same as &ldquo;crawling
            is allowed&rdquo;.
          </p>
        </Row>
        <Row
          title="Zero paying customers. Launch is the week of 2026-09-21."
          meta="stage"
          src="apps/web/src/lib/workspace/channelActionsApi.ts:80-107"
        >
          <p>
            There is no usage number, no logo and no testimonial on this screen because there is
            nothing true to put there. The run data above is simulated, and it is drawn on the real
            envelope: <span className="mono">run_id</span>, <span className="mono">status</span>,{" "}
            <span className="mono">action_type</span>, <span className="mono">title</span>,{" "}
            <span className="mono">impact</span>, <span className="mono">impact_reason</span>,{" "}
            <span className="mono">blocking</span>, <span className="mono">provenance</span>,{" "}
            <span className="mono">cannot_see</span>, <span className="mono">note</span>.
          </p>
        </Row>
      </Section>
    </div>
  );

  return (
    <div className="rail-layout">
      {main}
      <aside className="d-rail">
        <div className="d-rail-blk">
          <p className="d-rail-h">Do this next</p>
          <p style={{ fontSize: 14.5, fontWeight: 550, margin: "0 0 4px" }}>{na.job}</p>
          <p className="muted" style={{ fontSize: 12.5, margin: "0 0 10px" }}>
            Phase: {na.phase}. This is computed, not chosen: it is the first unmet step in the
            chain.
          </p>
          <Btn
            kind="dark"
            sm
            onClick={() => {
              if (na.act === "focus:d-company") {
                go("plan");
                window.setTimeout(() => flash("d-company"), 80);
              } else if (na.act === "focus:d-blind") {
                flash("d-blind");
              } else if (na.act.startsWith("tab:")) {
                go(na.act.slice(4) as TabId);
              }
            }}
          >
            {na.cta}
          </Btn>
        </div>

        <div className="d-rail-blk">
          <p className="d-rail-h">Connections</p>
          <ConnectorLines state={state} keys={RAIL_CONNECTOR_KEYS} onConnect={connect} />
          <p className="d-rail-note">
            Nothing here is required to run. Each one turns a sentence of advice into a number.
          </p>
        </div>

        <div className="d-rail-blk">
          <p className="d-rail-h">Connect your AI client</p>
          <p className="d-rail-lede">
            Drive your agents from Claude Code, claude.ai or ChatGPT. Paste this URL, approve in the
            browser. There is no token to copy, the client handles that itself.
          </p>
          <code className="d-code">{MCP_URL}</code>
          {MCP_CLIENTS.map((c) => (
            <div style={{ marginTop: 10 }} key={c[0]}>
              <div className="mono">{c[0]}</div>
              <code className="d-code">{c[1]}</code>
              <p className="muted" style={{ fontSize: 12, margin: "4px 0 0" }}>
                {c[2]}
              </p>
            </div>
          ))}
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 550 }}>
              What your client can do once connected ({MCP_TOOLS.length} tools)
            </summary>
            <ul className="d-tools">
              {MCP_TOOLS.map((t) => (
                <li key={t[0]}>
                  <code>{t[0]}</code>
                  <span>{t[1]}</span>
                </li>
              ))}
            </ul>
            <p className="muted" style={{ fontSize: 12, margin: "8px 0 0" }}>
              Side effects route through your approval queue, with one exception: browser-operator
              acts in the browser as it goes, inside its per-run write cap and locked origin.
              Everything else waits for you.
            </p>
          </details>
          <div className="src mono">
            apps/web/src/components/workspace/settings/McpClientsPanel.tsx:27-59
          </div>
        </div>

        <div className="d-rail-blk">
          <p className="d-rail-h">Usage</p>
          {state.runs === 0 ? (
            <>
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                  margin: "0 0 10px",
                }}
              >
                No runs yet. You have {n(state.creditsDay)} free credits today, enough for two runs.
              </p>
              <Btn
                kind="dark"
                sm
                onClick={() => {
                  toast("Highlighted below. It runs on your public site, so nothing needs connecting.");
                  flash("d-run-0");
                }}
              >
                Start the first one
              </Btn>
            </>
          ) : (
            <>
              <table className="sheet">
                <tbody>
                  <tr>
                    <th>Runs today</th>
                    <td>{n(state.runs)}</td>
                  </tr>
                  <tr>
                    <th>Held</th>
                    <td>{n(spent)} credits</td>
                  </tr>
                  <tr>
                    <th>Left today</th>
                    <td>{n(state.creditsDay)} credits</td>
                  </tr>
                  <tr>
                    <th>Monthly pool</th>
                    <td>
                      {state.creditsMonth ? `${n(state.creditsMonth)} credits` : "None on Free"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="muted" style={{ fontSize: 12.5, margin: "8px 0 0" }}>
                Free credits reset daily and do not roll over. The cheapest run any agent can
                reserve is {n(MIN_HOLD)} credits.
              </p>
            </>
          )}
          <div className="src mono">
            routes/public/pricing.ts:34 · services/agents/credits.ts:76, :118
          </div>
        </div>

        <div className="d-rail-blk">
          <p className="d-rail-h">Reference</p>
          <p style={{ fontSize: 13, margin: "0 0 6px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go("upgrade");
              }}
            >
              Plans and credits
            </a>
          </p>
          <p style={{ fontSize: 13, margin: "0 0 6px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go("channels");
              }}
            >
              Every channel and what it needs
            </a>
          </p>
          <p style={{ fontSize: 13, margin: 0 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go("settings");
              }}
            >
              Connectors and AI clients
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ---------- one run card ---------- */

function RunCard({
  ex,
  i,
  state,
  onRun,
  onOpen,
}: {
  ex: Example;
  i: number;
  state: V2State;
  onRun: () => void;
  onOpen: () => void;
}) {
  const ch = channelState(state, ex.slug);
  const ran = ch.runs.length > 0;
  const err = ch.lastError;
  const latest = ran ? ch.runs[ch.runs.length - 1] : null;

  return (
    <div className="d-run" id={`d-run-${i}`}>
      <div className="mono">
        {String(i + 1).padStart(2, "0")} · {ex.slug}
      </div>
      <h3>{ex.title}</h3>
      <p>{ex.what}</p>
      <dl className="d-spec">
        <dt>Channel</dt>
        <dd>{ex.slug}</dd>
        <dt>Instrument</dt>
        <dd>{ex.tool}</dd>
        <dt>Holds</dt>
        <dd>{n(ex.hold)} credits</dd>
        <dt>Needs</dt>
        <dd>{ex.free ? "Nothing connected" : "A Google Ads account, which you have not linked"}</dd>
      </dl>

      {!ran && !err ? (
        <div className="d-foot">
          <Btn kind="dark" sm onClick={onRun}>
            Run it
          </Btn>
          <span className="mono">holds {n(ex.hold)}</span>
        </div>
      ) : null}

      {err ? (
        <div className="d-out">
          <p className="d-err">Refused: {err.code}</p>
          <p>{err.message}</p>
          <div className="d-foot">
            <Btn kind="quiet" sm onClick={onRun}>
              Try it again
            </Btn>
          </div>
        </div>
      ) : null}

      {latest ? (
        <div className="d-out">
          <p>
            <span className="mono">run_id</span> {latest.run_id} ·{" "}
            <span className="mono">status</span> {latest.status} ·{" "}
            <span className="mono">provenance</span> {latest.provenance}
          </p>
          {latest.actions.length ? (
            latest.actions.map((a) => (
              <dl className="d-act" key={a.title}>
                <dt>
                  {a.action_type}
                  {a.blocking ? " · blocking" : ""}
                </dt>
                <dd>
                  <b>{a.title}</b>
                  <br />
                  <span className="muted">
                    impact {a.impact} of 5. {a.impact_reason}.
                  </span>
                </dd>
              </dl>
            ))
          ) : (
            <p className="muted">
              Zero actions. The run finished and had nothing it could honestly propose.
            </p>
          )}
          {latest.cannot_see.length ? (
            <p className="muted" style={{ marginTop: 8 }}>
              <span className="mono">cannot_see</span> {latest.cannot_see.join(", ")}
            </p>
          ) : null}
          {latest.note ? <p className="muted">{latest.note}</p> : null}
          <div className="d-foot">
            <Btn kind="dark" sm onClick={onOpen}>
              Open the result
            </Btn>
            <Btn kind="quiet" sm onClick={onRun}>
              Run it again
            </Btn>
          </div>
        </div>
      ) : null}

      <div className="src mono">{ex.src}</div>
    </div>
  );
}

/* ---------- one blind spot ---------- */

function BlindRow({
  b,
  state,
  onConnect,
  onWhy,
}: {
  b: BlindSpot;
  state: V2State;
  onConnect: (key: ConnectorKey) => void;
  onWhy: (msg: string) => void;
}) {
  const st = b.conn ? connState(state, b.conn) : null;
  let action: ReactNode;
  if (!b.conn) {
    action = (
      <Btn kind="quiet" sm onClick={() => onWhy(b.instead ?? "")}>
        What it reads instead
      </Btn>
    );
  } else if (st === "none") {
    action = <Btn sm onClick={() => onConnect(b.conn as ConnectorKey)}>Connect {connectorSpec(b.conn).label}</Btn>;
  } else {
    action = connChip(st as ConnState);
  }

  return (
    <Blind
      what={b.what}
      why={b.why}
      impact={b.impact}
      action={
        <>
          <div className="d-foot">{action}</div>
          <div className="src mono">{b.src}</div>
        </>
      }
    />
  );
}
