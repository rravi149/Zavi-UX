"use client";

/* ============================================================
   One channel's page. Ported from parts/40-channels.js SCREENS.channelDetail.

   THE GENERIC PANEL. The same section set renders for every channel, and what
   differs between two channels is a row in a data file, never a component.
   The test, taken verbatim from ChannelPanel.tsx:6: does adding channel 20
   cost one data row and zero new components.

   Switch the channel at the top across five genuinely different rows and read
   section 06 again: a live channel with a connector, a read_only channel with
   no connector at all, a read_only channel that declares two connectors the
   tenant has not linked, and two planned channels with zero connectors and
   zero tools. Nothing above changes component.

   Two slug reads remain, and both are behaviour, not configuration
   (ChannelPanel.tsx:22-30): SEO gets an instrument panel instead of facts that
   would claim measurements it cannot read, and Meta Ads keeps its own action
   lane until the generic one is proven. This page draws the first.
   ============================================================ */

import { useState } from "react";
import { Blind, Btn, Inert, Row, Section, SpecTable } from "../../_components/kit";
import {
  MODE_COPY,
  PASTEABLE,
  boardRow,
  linked,
  platformFor,
  waitingClause,
  type SettingField,
} from "./ChannelsTab";
import { ActionCard, RUNS, runFor } from "./RunOutputTab";
import {
  CHANNEL_HOLD,
  afford,
  channelSpec,
  channelState,
  connState,
  debit,
  deliveryMode,
  n,
  withChannel,
  type ChannelSpec,
  type ConnectorKey,
  type TabProps,
  type V2State,
} from "../state";

/** Five rows worth switching between. Any row on the board opens this same
 *  page; these five are the ones that differ most. */
const SWITCH = ["google_ads", "reddit_organic", "seo", "linkedin_ads", "sms"];

export function ChannelDetailTab(props: TabProps) {
  const { state, go } = props;
  const c = state.openChannel ? channelSpec(state.openChannel) : null;

  /* The guard is its own component so the page below it can take a channel
     that is known to exist. Keying on the slug also resets the page's local
     tab and scan state when the channel changes, which is what a founder
     expects from switching channel. */
  if (!c) {
    return (
      <div className="d-main" style={{ maxWidth: 760 }}>
        <p className="kicker">Channel</p>
        <h1 className="h1">No channel is open.</h1>
        <p className="lede">
          A caller sets <span className="d-tok">openChannel</span> before switching to this tab. The
          board is where that happens.
        </p>
        <div className="d-actbar">
          <Btn kind="dark" onClick={() => go("channels")}>
            Back to the board
          </Btn>
        </div>
      </div>
    );
  }

  return <ChannelPage key={c.slug} {...props} c={c} />;
}

function ChannelPage({ c, state, setState, toast, go }: TabProps & { c: ChannelSpec }) {
  const [tabWanted, setTabWanted] = useState<"overview" | "settings">("overview");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    maypause: true,
    autopost: false,
  });
  const [scanned, setScanned] = useState(false);

  const r = boardRow(c.slug);
  const plat = platformFor(c.slug);
  const mode = deliveryMode(state, c);
  const isLinked = linked(state, c);
  const ch = channelState(state, c.slug);
  const run = runFor(c.slug);

  /* DERIVED, not stored. Switching from a channel that has a Settings tab to
     one that does not would otherwise leave the page on a tab with no bar. */
  const hasSettings = Boolean(plat.settings?.length);
  const tab = hasSettings && tabWanted === "settings" ? "settings" : "overview";

  function open(next: string) {
    setState((s) => ({ ...s, openChannel: next }));
    window.scrollTo(0, 0);
  }

  function connect(key: ConnectorKey) {
    setState((s) => ({ ...s, connectors: { ...s.connectors, [key]: "connected" } }));
    toast(
      "Linked. Watch the mode sentence, the Account row, the schedule section and the table in 06 all change.",
    );
  }

  /* The same helpers the Home tab's example runs use, so the credit counter in
     the top bar and the usage panel on Home both move. */
  function startRun() {
    if (!afford(state, CHANNEL_HOLD)) {
      const left = state.creditsDay + state.creditsMonth;
      setState((s) => ({
        ...s,
        channels: withChannel(s, c.slug, {
          lastError: {
            code: "insufficient_credits",
            message: `The reserve raised insufficient_credits and the send returned 402. You have ${n(
              left,
            )} credits left and a channel run holds ${n(CHANNEL_HOLD)}.`,
          },
        }),
      }));
      toast("Refused: insufficient_credits (402)");
      return;
    }
    setState((s) => {
      const prev = channelState(s, c.slug);
      return {
        ...s,
        ...debit(s, CHANNEL_HOLD),
        runs: s.runs + 1,
        channels: withChannel(s, c.slug, {
          lastError: null,
          runs: [
            ...prev.runs,
            {
              run_id: `run_${c.slug}_${prev.runs.length + 1}`,
              channel_slug: c.slug,
              status: "running" as const,
              provenance: isLinked ? "connector" : "public",
              actions: [],
              cannot_see: [],
              note: "Started from the channel page. Actions land here when it finishes.",
            },
          ],
        }),
      };
    });
    toast(
      `Started. It holds ${n(CHANNEL_HOLD)} credits and takes a few minutes; the actions land here when it finishes.`,
    );
  }

  const started = ch.runs.length > 0;
  const workState = started ? "running" : r.state;

  const header = (
    <>
      <div className="d-switch">
        <span className="mono" style={{ alignSelf: "center", marginRight: 4 }}>
          Switch channel
        </span>
        {SWITCH.map((s) => (
          <Btn key={s} kind={s === c.slug ? "dark" : "quiet"} sm onClick={() => open(s)}>
            {platformFor(s).name}
          </Btn>
        ))}
        <Btn kind="quiet" sm onClick={() => go("channels")}>
          Back to the list
        </Btn>
      </div>

      <p className="kicker">
        {c.cat} · {c.slug}
        {waitingClause(r.waiting)}
      </p>
      <h1 className="h1">{plat.name}</h1>
      <p className="lede">
        {r.desc}
        <br />
        <span className="muted">{MODE_COPY[mode]}</span>
      </p>

      {hasSettings ? (
        <div className="d-tabs">
          <button
            type="button"
            className={`d-tab ${tab === "overview" ? "on" : ""}`}
            onClick={() => setTabWanted("overview")}
          >
            Overview
            {r.waiting > 0 ? <span className="d-pill">{r.waiting}</span> : null}
          </button>
          <button
            type="button"
            className={`d-tab ${tab === "settings" ? "on" : ""}`}
            onClick={() => setTabWanted("settings")}
          >
            Settings
          </button>
        </div>
      ) : null}
    </>
  );

  if (tab === "settings") {
    return (
      <div className="d-main" style={{ maxWidth: 980 }}>
        {header}
        <Section
          num="01"
          label="Settings"
          framing="Built from the fields the row declares. The tab draws nothing that does not work: a field whose value lives in another store is read only with its real home named, and Suggest appears only where the field names an endpoint that exists."
          id="d-ch-settings"
          railExtra={
            <div className="src mono">
              apps/web/src/components/workspace/layout/ChannelTabs.tsx · platforms.ts:159
            </div>
          }
        >
          {(plat.settings ?? []).map((f) => (
            <SettingRow
              key={f.id}
              f={f}
              on={Boolean(toggles[f.id])}
              onToggle={() => setToggles((t) => ({ ...t, [f.id]: !t[f.id] }))}
              toast={toast}
            />
          ))}
        </Section>
        <Section
          num="02"
          label="What is not a field here"
          framing="A value the product computes is not a setting the founder configures."
          id="d-ch-notfield"
        >
          <div className="row flat">
            <div className="row-sum">
              <span className="row-title">Autonomy is not on this tab</span>
              <span className="row-meta mono">DERIVED</span>
              <span />
            </div>
            <div className="row-proof">
              <p>
                The delivery mode column has never held anything but its default on any row of any
                tenant, so the computed three-term AND is the only source that exists. It is a
                status the system reports, not a setting. Putting it here, even read only, would
                teach the opposite. The mode is already stated in prose at the top of this page.
              </p>
            </div>
          </div>
          <div className="row flat">
            <div className="row-sum">
              <span className="row-title">Cadence is not on this tab</span>
              <span className="row-meta mono">ONE WRITER</span>
              <span />
            </div>
            <div className="row-proof">
              <p>
                The page already mounts a schedule. A second cadence control would be two widgets
                writing one schedule: the founder changes the one that loses and the run never
                moves.
              </p>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="d-main" style={{ maxWidth: 980 }}>
      {header}

      <Section
        num="01"
        label="Facts"
        framing={
          c.slug === "seo"
            ? "SEO is one of the two remaining slug reads in this component. It gets an instrument panel, because generic facts here would claim measurements the channel cannot read."
            : "Three rows, and a fourth only when the probe has something honest to say. An absent block is not drawn; it never becomes an empty shell with a dash in it."
        }
        id="d-ch-facts"
        railExtra={
          <div className="src mono">
            apps/web/src/components/workspace/layout/ChannelPanel.tsx:22-30
          </div>
        }
      >
        <Facts c={c} state={state} started={started} onConnect={connect} />
      </Section>

      <Section
        num="02"
        label="Setup"
        framing="Each of these gates itself on its own data. None of them is a field that would be on for every channel, because a field whose value is always on is configuration, not data."
        id="d-ch-setup"
      >
        <Setup
          c={c}
          isLinked={isLinked}
          scanned={scanned}
          onScan={() => {
            setScanned(true);
            toast("Sweep started. Freshness counts the complete and partial statuses only.");
          }}
          toast={toast}
        />
      </Section>

      <Section
        num="03"
        label="Numbers"
        framing="Drawn only when the row names a dashboard payload. Fourteen of the nineteen name none and fetch nothing."
        id="d-ch-numbers"
        railExtra={<div className="src mono">platforms.ts:177, :284 kpiFallback</div>}
      >
        <Numbers c={c} />
      </Section>

      <Section
        num="04"
        label={plat.sectionTitle ?? "Next steps"}
        framing={
          plat.sectionTitle
            ? "This heading is a field in the Google Ads row. Every other channel gets the default, which is what the drawer has always called it."
            : "The default heading. The ranked list the backend has been computing all along."
        }
        id="d-ch-actions"
      >
        {run ? (
          <>
            {run.actions.map((a, i) => (
              <ActionCard key={a.key} a={a} compact={i > 0} toast={toast} />
            ))}
            <p className="d-note">
              The top-ranked action is open. The rest carry their verbs and open on the run page. A
              blocking step wins the headline regardless of position, because it is a precondition
              for every other step being worth anything. Approve or reject one here and it is
              already approved or rejected there.
            </p>
            <div className="d-actbar">
              <Btn
                kind="dark"
                sm
                onClick={() => {
                  setState((s) => ({ ...s, openChannel: run.slug }));
                  go("runOutput");
                }}
              >
                Open the full run
              </Btn>
            </div>
          </>
        ) : r.waiting > 0 ? (
          <div className="d-emptybox">
            <p>
              <b>
                {r.waiting} {r.waiting === 1 ? "action is" : "actions are"} waiting on this channel.
              </b>
            </p>
            <p className="d-note">
              This prototype authors the full run envelope for two channels only, Google Ads and
              SEO, because every field in it has to match the real reader. Rather than invent four
              Reddit actions, it says so. Open Google Ads or SEO to see the real block order and the
              real verbs.
            </p>
            <div className="d-actbar">
              {Object.values(RUNS).map((x) => (
                <Btn
                  key={x.key}
                  kind="quiet"
                  sm
                  onClick={() => {
                    setState((s) => ({ ...s, openChannel: x.slug }));
                    go("runOutput");
                  }}
                >
                  Open the {x.label.split(",")[0]} run
                </Btn>
              ))}
            </div>
          </div>
        ) : (
          <Empty c={c} workState={workState} onRun={startRun} />
        )}
        {ch.lastError ? (
          <p className="needs-source" style={{ fontSize: 13, marginTop: 10 }}>
            Refused: {ch.lastError.code}. {ch.lastError.message}
          </p>
        ) : null}
      </Section>

      <Section
        num="05"
        label="Runs"
        framing="A closed disclosure at the foot of Overview, not a third tab. A tab is for a place a founder goes; a fold over ten rows is not one."
        id="d-ch-runs"
        railExtra={
          <div className="src mono">
            apps/web/src/components/workspace/layout/ChannelRunDrawer.tsx
          </div>
        }
      >
        <Row
          title="Run history"
          meta={r.state === "idle" && !started ? "NONE YET" : `${started ? 4 : 3} RUNS`}
        >
          <SpecTable
            head={["Started", "Finished", "Result"]}
            rows={[
              ...(started
                ? [["Just now", <span key="running" className="muted">still running</span>, "Started from this page. Nothing to report yet."]]
                : []),
              ...(run ? [[run.when.split(",")[0], "ok", run.instruments]] : []),
              ["A week ago", "ok", "Finished. No action met the bar."],
              ["Two weeks ago", "failed", "Timed out reading the site. No steps produced."],
            ]}
          />
          <p className="d-note">
            A run that failed must not look identical to a channel nobody has asked to work. That is
            why the empty states above are five and not two.
          </p>
        </Row>
      </Section>

      <Section
        num="06"
        label="The same page, every channel"
        framing="The test for any change here: does adding channel 20 cost one data row and zero new components. This table is that test, run against the channel you are looking at."
        id="d-ch-proof"
        railExtra={
          <div className="src mono">
            apps/web/src/components/workspace/layout/ChannelPanel.tsx:6-30
          </div>
        }
      >
        <Surfaces c={c} isLinked={isLinked} />
        <p className="d-note">
          Switch the channel at the top and read this table again. Nothing above changes component.{" "}
          {plat.name} differs from every other channel by the fields in its row and by nothing else.
        </p>
        <p className="d-note">
          The whole difference between {plat.name} and the other eighteen is{" "}
          {plat.fields.length === 1 ? "one field" : `${plat.fields.length} fields`} in platforms.ts
          plus its registry row: <span className="d-tok">{plat.fields.join(", ")}</span>.
        </p>
      </Section>
    </div>
  );
}

/* ---------- 01 Facts ---------- */

function Facts({
  c,
  state,
  started,
  onConnect,
}: {
  c: ChannelSpec;
  state: V2State;
  started: boolean;
  onConnect: (key: ConnectorKey) => void;
}) {
  const r = boardRow(c.slug);
  const isLinked = linked(state, c);

  /* ChannelPanel.tsx:238. SEO gets an instrument panel instead of generic
     facts that would claim measurements the channel cannot read. */
  if (c.slug === "seo") {
    const gsc = connState(state, "google_search_console");
    const ga = connState(state, "google_analytics");
    return (
      <>
        <div className="panel">
          <p className="kicker" style={{ marginBottom: 10 }}>
            Instruments
          </p>
          <table className="sheet">
            <tbody>
              <tr>
                <th>Your site, 6 pages</th>
                <td>
                  Public crawl. Needs nothing connected.{" "}
                  <span className="needs-source">Returned 403 this morning.</span>
                </td>
              </tr>
              <tr>
                <th>Search Console</th>
                <td>
                  {gsc === "connected" ? (
                    <>
                      Connected. Queries, page performance and the ranked opportunity list can run
                      on the next sweep.
                    </>
                  ) : (
                    <>
                      Not connected. Queries, page performance and the ranked opportunity list all
                      need it.
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <th>Analytics</th>
                <td>
                  {ga === "connected"
                    ? "Connected. Organic sessions come from here."
                    : "Not connected. Organic sessions come from here."}
                </td>
              </tr>
              <tr>
                <th>Metric history</th>
                <td>
                  Connected, and empty. Nothing has written an organic_sessions row for this
                  workspace.
                </td>
              </tr>
            </tbody>
          </table>
          <p className="d-note">
            The generic Account, Last worked and Measured on rows are not drawn on this channel. An
            Account row would say Not connected next to an instrument panel that already says which
            reads that costs, and a Measured on row would print rankings for a channel that cannot
            currently read one.
          </p>
        </div>
        {gsc !== "connected" ? (
          <div className="d-actbar">
            <Btn kind="quiet" sm onClick={() => onConnect("google_search_console")}>
              Connect an account to get real numbers here
            </Btn>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <table className="sheet">
        <tbody>
          <tr>
            <th>Account</th>
            <td>
              {r.declares.length === 0
                ? "Nothing to connect yet"
                : isLinked
                  ? "Connected"
                  : "Not connected"}
            </td>
          </tr>
          <tr>
            <th>Last worked</th>
            <td>{started ? "Today" : r.state === "idle" ? "Never" : "Yesterday"}</td>
          </tr>
          <tr>
            <th>Measured on</th>
            <td>{c.measured}</td>
          </tr>
        </tbody>
      </table>
      {c.conn.length > 0 && !isLinked ? (
        <div className="d-actbar">
          <Btn kind="quiet" sm onClick={() => onConnect(c.conn[0])}>
            Connect an account to get real numbers here
          </Btn>
        </div>
      ) : null}
      {r.declares.length === 0 ? (
        <p className="d-note">
          No connector is declared for this channel, so there is no account row to fill and no
          button to draw. That is not a gap in the page, it is the registry row.
        </p>
      ) : null}
      {c.conn.length === 0 && r.declares.length > 0 ? (
        <p className="d-note">
          This channel declares <span className="d-tok">{r.declares.join(", ")}</span>, and that
          descriptor carries settingsTile: false, so there is no tile on this page to link. The
          button is absent rather than present and broken.
        </p>
      ) : null}
    </>
  );
}

/* ---------- 02 Setup ---------- */

function Setup({
  c,
  isLinked,
  scanned,
  onScan,
  toast,
}: {
  c: ChannelSpec;
  isLinked: boolean;
  scanned: boolean;
  onScan: () => void;
  toast: (msg: string) => void;
}) {
  const plat = platformFor(c.slug);
  const out: React.ReactNode[] = [];

  if (PASTEABLE.includes(c.slug)) {
    out.push(
      <Row
        key="paste"
        title="Paste last month's numbers from Ads Manager"
        meta="OPTIONAL"
        src="apps/web/src/components/workspace/layout/ChannelSnapshotPaste.tsx:39"
      >
        <p>
          Drawn only on the five paid channels whose numbers a paste can stand in for. It sits above
          the human lane because whether Zavi can see your numbers changes what the run produces,
          while the human lane is about who executes it.
        </p>
        <p>
          {c.slug === "linkedin_ads"
            ? "On this channel it is the only number source that exists. LinkedIn Ads declares no connector and no tool, so a paste is the whole instrument."
            : "On this channel it is a fallback. The connector is the first source."}
        </p>
        <div className="d-actbar">
          <Btn
            kind="quiet"
            sm
            onClick={() => toast("Opens the paste box: period start, period end, and the block you copied.")}
          >
            Paste a snapshot
          </Btn>
        </div>
      </Row>,
    );
  }

  if (plat.human) {
    out.push(
      <Row
        key="human"
        title="Hire a vetted human for this"
        meta="HUMAN LANE"
        src="packages/shared/src/channels/registry.ts:1149"
      >
        <p>
          Present only on channels where a vetted human can take the work. UGC is the one channel
          that declares it today.
        </p>
      </Row>,
    );
  }

  if (plat.scan) {
    out.push(
      <Row
        key="scan"
        title="Scan now"
        meta={scanned ? "SCANNED JUST NOW" : "SCANNED 3H AGO"}
        src="apps/web/src/components/workspace/actions/platforms.ts:313"
      >
        <p>
          Reddit is the only row that declares a scan endpoint. Freshness is computed from the
          channel&rsquo;s own dashboard payload, so the control costs the page no second request.
        </p>
        <p>
          A failed sweep also stamps the timestamp, so freshness counts the complete and partial
          statuses only. That is Reddit&rsquo;s knowledge of its own statuses and it stays in
          Reddit&rsquo;s data row, not in a component every channel shares.
        </p>
        <div className="d-actbar">
          <Btn kind="quiet" sm onClick={onScan}>
            {scanned ? "Scan again" : "Scan now"}
          </Btn>
        </div>
      </Row>,
    );
  }

  if (isLinked) {
    out.push(
      <Row
        key="sched"
        title="Schedule"
        meta="ONE PER CHANNEL"
        src="apps/web/src/components/workspace/layout/ChannelPanel.tsx:322"
      >
        <p>
          One schedule per channel; saving replaces the existing one. Each run stages drafts for
          your approval.
        </p>
        <p>
          Drawn only when the account is linked and the channel can run. A schedule for a channel
          that cannot see anything would fire runs that produce nothing.
        </p>
        <div className="d-actbar">
          <Btn
            kind="quiet"
            sm
            onClick={() => toast("Opens the schedule editor. One per channel; saving replaces the existing one.")}
          >
            Weekly, Monday 07:00
          </Btn>
        </div>
      </Row>,
    );
  } else {
    out.push(
      <div className="row flat" key="nosched">
        <div className="row-sum">
          <span className="row-title">Schedule</span>
          <span className="row-meta mono">NOT DRAWN</span>
          <span />
        </div>
        <div className="row-proof">
          <p>
            The account is not linked, so there is no schedule section. Nothing is greyed out and
            nothing says coming soon. The section is simply absent, which is the rule this page
            follows everywhere: an absent block means the section is not drawn, never an empty shell
            with a dash in it.
          </p>
        </div>
      </div>,
    );
  }

  return <>{out}</>;
}

/* ---------- 03 Numbers ---------- */

function Numbers({ c }: { c: ChannelSpec }) {
  const plat = platformFor(c.slug);

  if (!plat.kpiFallback) {
    return (
      <div className="row flat">
        <div className="row-sum">
          <span className="row-title">Headline numbers</span>
          <span className="row-meta mono">NOT DRAWN</span>
          <span />
        </div>
        <div className="row-proof">
          <p>
            This row names no dashboard payload, so the page draws no numbers and fetches nothing.
            Fourteen of the nineteen channels are in this state today. It is the absence of a
            declared field, not a missing feature on this channel.
          </p>
        </div>
      </div>
    );
  }

  const vals: [string, string, string][] =
    plat.kpiFallback === "gads"
      ? [
          ["Spend", "$8,940", "last 30 days"],
          ["Cost per conversion", "$142", "against a $45 target"],
          ["Spend vs plan", "74%", "of a $12,000 month"],
        ]
      : [
          ["Brand mentions", "12", "last 7 days"],
          ["Reply opportunities", "31", "open threads"],
          ["Relevant posts", "48", "matched a keyword"],
        ];

  const note =
    plat.kpiFallback === "gads"
      ? "Six numbers do not fit the 880 pixel body, so this row declares a wider one. Three lead and the rest fall to More numbers. That width is a field in the data row, not a component."
      : "Five numbers over five tables. The keys are the ones the payload already carries and the labels are the bespoke page's labels, word for word. channel_metrics holds zero rows for every channel in production, so these arrive through the row's fallback adapter.";

  return (
    <>
      <div className="d-nums">
        {vals.map(([label, value, ctx]) => (
          <div className="d-num" key={label}>
            <div className="mono">{label}</div>
            <div className="v">{value}</div>
            <div className="d-note">{ctx}</div>
          </div>
        ))}
      </div>
      <p className="d-note">{note}</p>
      {plat.kpiFallback === "gads" ? (
        <p className="d-note">
          <Inert>More numbers</Inert> holds the other three. It is the one affordance on this page
          that is deliberately not wired, because the fold is a real control and inventing its
          contents would be inventing three more figures.
        </p>
      ) : null}
      <p className="d-note">
        Simulated for one prototype tenant. Zavi has zero paying customers, so there is no real
        account behind these three.
      </p>
      {plat.kpiFallback === "reddit" ? (
        <Blind
          what="The Strategy tab has no generic home at all"
          why="Reddit's bespoke page had a Comment and post strategy tab. When the page came off the special-case ladder, its three action sections turned out to be re-shaped copies of one query the ranked lane already reads and orders, and its opportunity list is a table this row's extras already draw. The strategy tab is the part that did not decompose, and it has nowhere to go on the shared page yet."
          impact="Written down here rather than quietly dropped. A tab is for a place a founder goes; this one has not been proven to be one, and until it is, the honest state is that it is missing."
        />
      ) : null}
    </>
  );
}

/* ---------- 04 empty states ---------- */

/** The five causes of an empty list. ChannelEmptyStates.tsx. A run that failed
 *  must not look identical to a channel nobody has asked to work. */
function Empty({
  c,
  workState,
  onRun,
}: {
  c: ChannelSpec;
  workState: string;
  onRun: () => void;
}) {
  const r = boardRow(c.slug);
  const name = platformFor(c.slug).name;
  const cost = <span className="d-note">Holds {n(CHANNEL_HOLD)} credits</span>;

  if (workState === "running") {
    return (
      <div className="d-emptybox">
        <p>
          <b>Zavi is working this channel</b> <span className="muted">started just now</span>
        </p>
        <p className="d-note">
          It reads your site, checks what search engines can see, and comes back with the steps
          worth doing. This usually takes a few minutes.
        </p>
        <p className="d-note">
          Deliberately honest about what it does not know: this shows that work is in flight and how
          long it has been, not a fake percentage or an invented step name. Per-step progress needs
          the run&rsquo;s event stream, which this endpoint does not carry.
        </p>
        <div className="d-actbar">
          <Btn kind="quiet" sm onClick={onRun}>
            Run it again
          </Btn>
          {cost}
        </div>
      </div>
    );
  }

  if (workState === "needs_review") {
    return (
      <div className="d-emptybox">
        <p>The last run did not finish, so there are no steps yet.</p>
        <div className="d-actbar">
          <Btn kind="dark" sm onClick={onRun}>
            Run it again
          </Btn>
          {cost}
        </div>
      </div>
    );
  }

  if (workState === "delivered") {
    return (
      <div className="d-emptybox">
        <p>Zavi worked this channel and found nothing that needs doing right now.</p>
        <p className="d-note">
          There is deliberately no &ldquo;all caught up&rdquo; and no &ldquo;N done this
          week&rdquo;. Neither signal exists: delivered means Zavi found nothing, which is a
          different sentence from you handled them all.
        </p>
        <div className="d-actbar">
          <Btn kind="quiet" sm onClick={onRun}>
            Run it again
          </Btn>
          {cost}
        </div>
      </div>
    );
  }

  return (
    <div className="d-emptybox">
      <p>Nothing yet. Ask Zavi to work this channel and it will put its next steps here.</p>
      {r.tools === 0 ? (
        <p className="d-note">
          This channel declares no tools and no connectors. A run of it reads your public surfaces
          and drafts; it cannot send, buy or measure anything, and it says so rather than producing
          a number.
        </p>
      ) : null}
      <div className="d-actbar">
        <Btn kind="dark" sm onClick={onRun}>
          Run {name} now
        </Btn>
        {cost}
      </div>
    </div>
  );
}

/* ---------- 06 the one-component proof ---------- */

function Surfaces({ c, isLinked }: { c: ChannelSpec; isLinked: boolean }) {
  const plat = platformFor(c.slug);
  const rows: [string, string, string][] = [
    [
      "Description and mode copy",
      "drawn",
      "Always. The mode sentence comes from the three-term AND, not from the row.",
    ],
    [
      "Tab bar",
      plat.settings ? "drawn" : "not drawn",
      plat.settings
        ? `Overview and Settings, because the row declares ${plat.settings.length} fields.`
        : "One tab is no bar. A thin channel reads as a plain page instead of an unfinished one.",
    ],
    [
      "Facts list",
      c.slug === "seo" ? "replaced" : "drawn",
      c.slug === "seo"
        ? "SEO has an instrument panel instead of facts that would claim measurements it cannot read."
        : "Account, Last worked, Measured on. What changed appears only when the probe has something honest to say.",
    ],
    [
      "Snapshot paste",
      PASTEABLE.includes(c.slug) ? "drawn" : "not drawn",
      "Gates itself on its own five-channel set, not on a field in the row.",
    ],
    [
      "Human lane",
      plat.human ? "drawn" : "not drawn",
      "Gates on the registry row's human block. UGC is the only channel that declares one.",
    ],
    [
      "Scan control",
      plat.scan ? "drawn" : "not drawn",
      "Gates on the row's scan endpoint. Reddit is the only row that has one.",
    ],
    [
      "Schedule",
      isLinked ? "drawn" : "not drawn",
      "Connected and runnable. Both terms, every time.",
    ],
    [
      "Headline numbers",
      plat.kpiFallback ? "drawn" : "not drawn",
      "Gates on the row naming a dashboard payload.",
    ],
    [
      "Ranked actions",
      "drawn",
      plat.sectionTitle
        ? `Headed "${plat.sectionTitle}" because the row says so. Every other channel gets "Next steps".`
        : "Headed Next steps, the default.",
    ],
    ["Run log", "drawn", "A closed disclosure at the foot of Overview, not a third tab."],
    [
      "Outputs strip",
      plat.outputs === false ? "not drawn" : "drawn",
      plat.outputs === false
        ? "The row says outputs false. The strip is pinned and sat over the campaign table."
        : "Pinned. On for every channel whose row does not say otherwise.",
    ],
  ];

  return (
    <SpecTable
      head={["Surface", `On ${plat.name}`, "Why"]}
      rows={rows.map(([a, b, why]) => [
        a,
        b === "not drawn" ? <span className="muted">{b}</span> : <b>{b}</b>,
        why,
      ])}
    />
  );
}

/* ---------- one settings field ---------- */

function SettingRow({
  f,
  on,
  onToggle,
  toast,
}: {
  f: SettingField;
  on: boolean;
  onToggle: () => void;
  toast: (msg: string) => void;
}) {
  let control: React.ReactNode;

  if (f.kind === "toggle") {
    control = (
      <div className="d-actbar">
        <Btn kind={on ? "dark" : "quiet"} sm onClick={onToggle}>
          {on ? f.on : f.off}
        </Btn>
        <span className="d-note">{on ? "On" : "Off"}. Press to change.</span>
      </div>
    );
  } else if (f.writesTo) {
    control = (
      <Blind
        what="Read only here"
        why={`This value's real home is ${f.writesTo}, which the pacing bar reads and a dedicated route writes. Editing it here would save a second budget nothing enforces.`}
        impact="The server refuses the write, and the row declares it too. Either signal alone leaves one direction open, so the tab takes the union of both."
      />
    );
  } else if (f.kind === "list") {
    control = (
      <>
        {f.itemTypes ? (
          <p className="d-note">Each item carries a type: {f.itemTypes.join(", ")}.</p>
        ) : f.verdicts ? null : (
          <p className="d-note">
            No types. The underlying table has no type column, and mirroring the keyword types would
            have invented a taxonomy it cannot store.
          </p>
        )}
        {f.verdicts ? (
          <p className="d-note">
            Each community also carries what its rules say: founders may answer, unclear, or self
            promotion is banned. The unset state is its own option and is where most communities
            sit. A form with no empty option would fall back to the first entry and persist
            &ldquo;allowed&rdquo; for every subreddit nobody has checked, which is a claim about
            somebody else&rsquo;s rules.
          </p>
        ) : null}
        <div className="d-actbar">
          <Btn kind="quiet" sm onClick={() => toast("Adds a row to the list. Not wired in this prototype.")}>
            Add
          </Btn>
          {f.suggest ? (
            <Btn
              kind="quiet"
              sm
              onClick={() =>
                toast("Writes both the keyword and the competitor list in one call, which is why both lists are on this tab.")
              }
            >
              Suggest some
            </Btn>
          ) : null}
        </div>
        {f.suggest ? null : (
          <p className="d-note">
            No Suggest button. There is no suggestion producer for this field, and a button that
            does nothing is worse than no button.
          </p>
        )}
      </>
    );
  } else {
    control = (
      <div className="d-actbar">
        <Btn kind="quiet" sm onClick={() => toast("Edits the field. Not wired in this prototype.")}>
          Edit
        </Btn>
      </div>
    );
  }

  return (
    <div className="row flat">
      <div className="row-sum">
        <span className="row-title">{f.label}</span>
        <span className="row-meta mono">{f.kind}</span>
        <span />
      </div>
      <div className="row-proof">
        <p>{f.help}</p>
        {control}
      </div>
    </div>
  );
}
