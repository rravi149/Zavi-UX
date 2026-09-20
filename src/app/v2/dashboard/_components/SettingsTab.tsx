"use client";

/* ============================================================
   Settings, connectors and AI clients.
   Ported from parts/50-commerce.js SCREENS.settingsConnectors.

   A connector is what turns advice into action. Linking one costs nothing and
   changes what the channels can do, which is why it sits above the plan here.
   Two clicks each: start the approval, then confirm it. Both clicks are real,
   and the result is visible on the Home tab immediately.
   ============================================================ */

import { Btn, Chip, Inert, Row, Section } from "../../_components/kit";
import {
  CHANNELS,
  CHANNEL_CAP_30D,
  CONNECTORS,
  FREE_DAILY,
  MCP_CLIENTS,
  MCP_TOOLS,
  MCP_URL,
  connState,
  copyText,
  money,
  n,
  tierSpec,
  type ConnectorKey,
  type ConnectorSpec,
  type Readiness,
  type TabProps,
} from "../state";

function stateChip(r: Readiness) {
  if (r === "live") return <Chip kind="on">live</Chip>;
  if (r === "planned") return <Chip kind="warn">planned, not built</Chip>;
  return <Chip>read only</Chip>;
}

export function SettingsTab({ state, setState, toast, go }: TabProps) {
  const linked = CONNECTORS.filter((c) => connState(state, c.key) === "connected");
  const pending = CONNECTORS.filter((c) => connState(state, c.key) === "pending");
  const plan = tierSpec(state.tier);
  /* Channels whose registry row declares an empty connectors array. Computed,
     not typed, so the sentence can never drift from the table under it. */
  const noConnector = CHANNELS.filter((c) => c.conn.length === 0 && !c.unlinkable);

  /* none to pending to connected, one click each. The second click is the one
     that actually changes what a channel can do. */
  function advance(c: ConnectorSpec) {
    const cur = connState(state, c.key);
    if (cur === "connected") return;
    const next = cur === "none" ? "pending" : "connected";
    setState((s) => ({ ...s, connectors: { ...s.connectors, [c.key]: next } }));
    toast(
      next === "pending"
        ? `${c.label}: approval opened. Confirm it to finish.`
        : `${c.label} connected. ${c.unlocks}.`,
    );
  }

  function disconnect(c: ConnectorSpec) {
    setState((s) => ({ ...s, connectors: { ...s.connectors, [c.key]: "none" } }));
    toast(`${c.label} disconnected. ${c.off}.`);
  }

  function copy(value: string, label: string) {
    copyText(value, () => toast(`${label} copied to the clipboard`));
  }

  return (
    <div>
      <p className="kicker">Settings</p>
      <h1 className="h1">Connectors, and the clients that drive Zavi.</h1>
      <p className="lede">
        A connector is what turns advice into action. Linking one costs nothing and changes what
        the channels can do, which is why it sits above the plan on this page.
      </p>

      <div className="panel" style={{ marginBottom: 18 }}>
        <div className="mono d-meter">Workspace</div>
        <p style={{ margin: "6px 0 0", fontSize: 15 }}>
          {linked.length} of {CONNECTORS.length} connectors linked
          {pending.length ? `, ${pending.length} waiting on you` : ""}. Zavi is guessing on the
          rest.
        </p>
        <div className={`d-bar ${linked.length === 0 ? "low" : ""}`}>
          <i style={{ width: `${Math.round((linked.length / CONNECTORS.length) * 100)}%` }} />
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
          Linking a connector is free and changes what the channels can do. It is the cheapest
          upgrade on this page, and it is not an upgrade.
        </p>
      </div>

      <Section
        num="00"
        label="Connectors"
        framing="Two clicks each: start the approval, then confirm it. Everything you link changes the console home and the channel list."
      >
        {CONNECTORS.map((c) => {
          const s = connState(state, c.key);
          const meta =
            s === "connected" ? "connected" : s === "pending" ? "waiting on you" : "not connected";
          return (
            <Row
              key={c.key}
              title={c.label}
              sub={c.unlocks}
              meta={meta}
              src="packages/shared/src/connectors/connector-descriptor.ts:42-153 · GettingStartedCard.tsx:69"
            >
              <p>
                <b>Connected:</b> {c.unlocks}.
              </p>
              <p>
                <b>Not connected:</b> {c.off}.
              </p>
              {s === "pending" ? (
                <p className="needs-source">
                  Zavi is waiting. Nothing reads your account until you finish the approval.
                </p>
              ) : null}
              <div className="d-foot" style={{ marginTop: 12 }}>
                {s === "connected" ? (
                  <Btn kind="quiet" sm onClick={() => disconnect(c)}>
                    Disconnect
                  </Btn>
                ) : (
                  <Btn kind="dark" sm onClick={() => advance(c)}>
                    {s === "none" ? "Connect" : "I approved it in the popup"}
                  </Btn>
                )}
                {s === "connected" ? <Chip kind="on">live</Chip> : null}
                {s === "pending" ? <Chip kind="warn">pending</Chip> : null}
              </div>
            </Row>
          );
        })}
      </Section>

      <Section
        num="01"
        label="Where connecting does not help"
        framing="The honest half. Some channels have nothing to link, and two different reasons for it."
      >
        <Row
          title={`${noConnector.length} of ${CHANNELS.length} channels declare no connector at all`}
          meta="by design or not built"
          open
          sub="An empty connector list is not always a gap. Sometimes it is."
          src="registry.ts connectors field: 8 of 19 rows empty (:478, :557, :615, :658, :773, :896, :1073, :1401)"
        >
          <p>
            These declare an empty connector list in the registry. Two different reasons, and the
            difference matters.
          </p>
          <div className="d-cols">
            <div>
              <h4>Not built yet</h4>
              <ul className="d-kv">
                <li>LinkedIn Ads, no ad connector exists</li>
                <li>Reddit Ads, the ads-edit scope is not requested</li>
                <li>SMS, no messaging connector in the repo</li>
              </ul>
            </div>
            <div>
              <h4>By design, still useful</h4>
              <ul className="d-kv">
                <li>GEO, audits from public evidence</li>
                <li>Reddit, reads public threads</li>
                <li>ChatGPT Ads and TikTok Ads, read only</li>
                <li>UGC, briefs and produces, commissions nobody</li>
              </ul>
            </div>
          </div>
          <p style={{ marginTop: 12 }}>
            No amount of connecting or upgrading changes the first column. It needs code.
          </p>
          <p style={{ marginTop: 12 }}>
            A ninth is a third case. YouTube declares{" "}
            <span className="mono">pipedream.youtube_analytics_api</span>, a connector that is real
            and carries <span className="mono">settingsTile: false</span>, so there is no tile on
            this page to click. It is not missing and it is not by design. It is reachable from
            somewhere that is not here, and saying so is better than an empty row.
          </p>
        </Row>

        <Row
          title="What your links change, channel by channel"
          meta={`${CHANNELS.length} channels`}
          sub="Tier unlocks it. Readiness decides whether it can act. The connector decides whether it can see."
          src="packages/shared/src/channels/registry.ts, 19 rows"
        >
          <table className="sheet">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Tier</th>
                <th>State</th>
                <th>What it does for you right now</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => {
                const needs = c.conn as ConnectorKey[];
                const allLinked =
                  needs.length > 0 && needs.every((k) => connState(state, k) === "connected");
                let verdict: string;
                if (c.ready === "planned") {
                  verdict = "Researches and drafts. Nothing to connect.";
                } else if (needs.length > 0 && !allLinked) {
                  verdict = `Advice only until ${needs.join(" and ")} ${
                    needs.length > 1 ? "are" : "is"
                  } linked.`;
                } else if (c.unlinkable) {
                  verdict = `Reads and recommends. Its connector (${c.unlinkable}) has no tile on this page.`;
                } else if (c.ready === "read_only") {
                  verdict = "Reads and recommends. It does not act.";
                } else {
                  verdict = "Can act, behind your approval.";
                }
                return (
                  <tr key={c.slug}>
                    <td>{c.name}</td>
                    <td className="mono d-fig">{c.tier}</td>
                    <td>{stateChip(c.ready)}</td>
                    <td>
                      {verdict}
                      <span className="src mono" style={{ marginTop: 4, display: "block" }}>
                        {c.line}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Section>

      <Section
        num="02"
        label="AI clients"
        framing="Zavi has shipped a remote MCP server since 2026-05-20. This is the surface for it."
      >
        <Row
          title="The server URL"
          meta="OAuth 2.1"
          open
          sub="Drive your agents from Claude Code, claude.ai or ChatGPT."
          src="apps/web/src/components/workspace/settings/McpClientsPanel.tsx:27 MCP_URL"
        >
          <div className="d-cline">
            <code className="d-code">{MCP_URL}</code>
            <Btn kind="quiet" sm onClick={() => copy(MCP_URL, "Server URL")}>
              Copy
            </Btn>
          </div>
          <p>
            Paste it into your client and approve in the browser. There is no token to copy: the
            OAuth client stores and refreshes its own.
          </p>
        </Row>

        <Row
          title="Three clients, three snippets"
          meta="copy and paste"
          open
          sub="Every copy button on this screen writes to the real clipboard."
          src="apps/web/src/components/workspace/settings/McpClientsPanel.tsx:43 CLIENTS"
        >
          {MCP_CLIENTS.map((c) => (
            <div style={{ marginBottom: 14 }} key={c[0]}>
              <div className="d-cline">
                <b>{c[0]}</b>
                <Btn kind="quiet" sm onClick={() => copy(c[1], c[0])}>
                  Copy
                </Btn>
              </div>
              <code className="d-code">{c[1]}</code>
              <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
                {c[2]}
              </p>
            </div>
          ))}
        </Row>

        <Row
          title="What your client can do once connected"
          meta={`${MCP_TOOLS.length} tools`}
          sub="The eight tools the server advertises, named before you connect rather than after."
          src="McpClientsPanel.tsx:32 TOOLS · services/mcp/server/zavi-inbound.ts"
        >
          <ul className="d-tools">
            {MCP_TOOLS.map((t) => (
              <li key={t[0]}>
                <code>{t[0]}</code>
                <span>{t[1]}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 12 }}>
            Side effects route through your approval queue, with one exception: browser-operator
            acts in the browser as it goes, within its per-run write cap and locked origin.
            Everything else waits for you.
          </p>
        </Row>

        <Row
          title="Access tokens"
          meta="headless only"
          sub="For the case the OAuth login cannot cover."
          src="apps/web/src/components/workspace/settings/McpClientsPanel.tsx:159 TokensCard"
        >
          <p>
            Only needed for a script, a CI job, or a client that cannot do the browser login. A
            token carries your own access to this workspace, including running agents, so treat it
            like a password. The raw value is shown exactly once.
          </p>
          <p className="muted">
            Most people never need one. It is deliberately the second thing on this panel.
          </p>
          <div style={{ marginTop: 12 }}>
            <Inert>New token</Inert>
          </div>
        </Row>
      </Section>

      <Section num="03" label="Plan" framing="What you are on, and what it meters.">
        <Row
          title="Plan and credits"
          meta={`${plan.name} · ${n(state.creditsDay + state.creditsMonth)} credits`}
          sub="The meter, in one place."
          src="billing/tiers.ts:32, :39 · agents/credits.ts:62"
        >
          <ul className="d-kv">
            <li>
              <span className="k">Plan</span>&nbsp; {plan.name}
              {plan.usd ? `, ${money(plan.usd)} a month` : ", no card"}
            </li>
            <li>
              <span className="k">Daily grant</span>&nbsp; {n(state.creditsDay)} of {n(FREE_DAILY)}{" "}
              left today
            </li>
            <li>
              <span className="k">Monthly pool</span>&nbsp; {n(state.creditsMonth)}
              {plan.month ? ` of ${n(plan.month)}` : ", no pool on this plan"}
            </li>
            <li>
              <span className="k">Channel cap</span>&nbsp; {n(CHANNEL_CAP_30D)} credits per 30 days,
              independent of plan
            </li>
          </ul>
          <div style={{ marginTop: 12 }}>
            <Btn kind="dark" onClick={() => go("upgrade")}>
              Change plan
            </Btn>
          </div>
        </Row>
      </Section>
    </div>
  );
}
