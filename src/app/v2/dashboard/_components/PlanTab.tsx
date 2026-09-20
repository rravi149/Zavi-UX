"use client";

/* ============================================================
   Growth plan. Ported from parts/30-console.js SCREENS.growthPlan.

   There is no accept and no draft. What Zavi writes applies the moment it is
   written, every channel it picks lands with "runs on its own" off, and you
   change the plan by editing these sections.
   ============================================================ */

import { useState } from "react";
import { Btn, FlatRow, Row, Section } from "../../_components/kit";
import { ConnectorLines } from "./HomeTab";
import {
  CHANNELS,
  CHANNEL_HOLD,
  CONNECTOR_KEYS,
  METRICS,
  channelState,
  connState,
  connectorSpec,
  dataSourceForMetric,
  deliveryMode,
  n,
  withChannel,
  type ConnectorKey,
  type Goal,
  type TabProps,
} from "../state";

export function PlanTab({ state, setState, toast, go }: TabProps) {
  const [metric, setMetric] = useState(METRICS[0].value);
  const [target, setTarget] = useState("50000");
  const [draftName, setDraftName] = useState("");
  const [draftWhat, setDraftWhat] = useState("");
  const [draftIcp, setDraftIcp] = useState("");
  const [editingCompany, setEditingCompany] = useState(false);

  const inPlanCount = CHANNELS.filter((c) => channelState(state, c.slug).inPlan).length;

  function connect(key: ConnectorKey) {
    setState((s) => ({ ...s, connectors: { ...s.connectors, [key]: "pending" } }));
    toast(
      `${connectorSpec(key).label}: approval opened. Nothing is linked until you confirm it in Settings.`,
    );
  }

  function saveCompany() {
    const name = draftName.trim();
    if (!name) {
      toast("A company needs a name before anything can be written about it.");
      return;
    }
    setState((s) => ({
      ...s,
      company: {
        name,
        what: draftWhat.trim(),
        icp: draftIcp.trim(),
        competitors: s.company?.competitors ?? [],
      },
    }));
    setEditingCompany(false);
    toast(`${name} is on file. Every agent starts from these facts.`);
  }

  function addGoal() {
    const raw = Number(target.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(raw) || raw <= 0) {
      toast("A goal with no number cannot be measured. Give it a target.");
      return;
    }
    const m = METRICS.find((x) => x.value === metric) ?? METRICS[0];
    const shown = m.unit === "usd" ? `$${raw.toLocaleString("en-US")}` : raw.toLocaleString("en-US");
    const label = m.label.replace(/\s*\(.*\)$/, "");
    const source = dataSourceForMetric(m.value);
    const goal: Goal = {
      id: `goal_${Date.now()}`,
      objective: `Grow ${label} to ${shown}`,
      target_metric: m.value,
      metricLabel: label.charAt(0).toUpperCase() + label.slice(1),
      target_value: raw,
      current_value: null,
      due_date: "in 90 days",
      status: "active",
      dataSource: source.label,
      automatic: source.automatic,
    };
    setState((s) => ({ ...s, goals: [...s.goals, goal] }));
    toast(
      source.automatic
        ? `Added. Zavi tracks this one from ${source.label}.`
        : "Added. Nothing measures this today, so you report the value yourself.",
    );
  }

  function removeGoal(id: string) {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
    toast("Goal removed.");
  }

  function togglePlan(slug: string) {
    setState((s) => {
      const prev = channelState(s, slug);
      const inPlan = !prev.inPlan;
      return {
        ...s,
        channels: withChannel(s, slug, { inPlan, autorun: inPlan ? prev.autorun : false }),
      };
    });
    const nowIn = !channelState(state, slug).inPlan;
    toast(
      nowIn
        ? `${slug} added to the plan, with runs-on-its-own off.`
        : `${slug} removed from the plan.`,
    );
  }

  function toggleAutorun(slug: string) {
    setState((s) => {
      const prev = channelState(s, slug);
      return { ...s, channels: withChannel(s, slug, { autorun: !prev.autorun }) };
    });
    const nowOn = !channelState(state, slug).autorun;
    toast(
      nowOn
        ? `${slug} may now run unattended on its cadence.`
        : `${slug} will only run when you ask.`,
    );
  }

  const co = state.company;

  return (
    <div className="d-main" style={{ maxWidth: 920 }}>
      <p className="kicker">Growth plan</p>
      <h1 className="h1">It is always a plan, and you can change it.</h1>
      <p className="lede">
        There is no accept and no draft. What Zavi writes applies the moment it is written, every
        channel it picks lands with &ldquo;runs on its own&rdquo; off, and you change the plan by
        editing these sections.
      </p>

      <Section
        num="01"
        label="Company details"
        framing="One store. Name, the one-line description and competitors all read from and write to the same company facts every agent starts from."
        id="d-company"
        railExtra={
          <div className="src mono">
            apps/web/src/components/workspace/growth/GrowthCompanyCard.tsx:5-10
          </div>
        }
      >
        {co && !editingCompany ? (
          <>
            <FlatRow title="Name" meta="company_facts">
              <p>{co.name}</p>
            </FlatRow>
            <FlatRow title="What it does" meta="company_facts">
              <p>{co.what || "Not set"}</p>
            </FlatRow>
            <FlatRow title="Who it is for" meta="company_facts">
              <p>{co.icp || "Not set"}</p>
            </FlatRow>
            <FlatRow title="Competitors" meta={`${co.competitors.length} on file`}>
              {co.competitors.length ? (
                <>
                  <p>{co.competitors.join(", ")}</p>
                  <p className="muted">
                    This list shapes the plan. It does not feed the Competitor tab&rsquo;s scanner,
                    which keeps its own list.
                  </p>
                </>
              ) : (
                <p className="muted">None on file. The plan is written without them.</p>
              )}
            </FlatRow>
            <div className="d-foot" style={{ marginTop: 14 }}>
              <Btn
                kind="quiet"
                sm
                onClick={() => {
                  setDraftName(co.name);
                  setDraftWhat(co.what);
                  setDraftIcp(co.icp);
                  setEditingCompany(true);
                  toast("Editing the company facts. Save to write them back to the one store.");
                }}
              >
                Edit these facts
              </Btn>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, margin: "0 0 12px" }}>
              {editingCompany
                ? "Editing the one store every agent reads. Saving overwrites it in place, there is no draft copy."
                : "Nothing on file. The plan below is the registry's default order, not a plan about your company."}
            </p>
            <label className="fld">
              <span className="lab">Company name</span>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="What is it called"
              />
            </label>
            <label className="fld">
              <span className="lab">What it does, in one line</span>
              <input
                type="text"
                value={draftWhat}
                onChange={(e) => setDraftWhat(e.target.value)}
                placeholder="The one sentence you would say out loud"
              />
            </label>
            <label className="fld">
              <span className="lab">Who it is for</span>
              <input
                type="text"
                value={draftIcp}
                onChange={(e) => setDraftIcp(e.target.value)}
                placeholder="The person who buys it"
              />
            </label>
            <div className="d-foot">
              <Btn kind="dark" onClick={saveCompany}>
                Save these facts
              </Btn>
              {editingCompany ? (
                <Btn kind="quiet" onClick={() => setEditingCompany(false)}>
                  Cancel
                </Btn>
              ) : null}
              <span className="muted" style={{ fontSize: 12.5 }}>
                Three fields is the minimum a plan can be written against. The full intake asks
                more.
              </span>
            </div>
          </>
        )}
      </Section>

      <Section
        num="02"
        label="Brand voice"
        framing="How the company sounds. Part of every agent's prompt since the personalization block shipped."
        railExtra={
          <div className="src mono">
            apps/web/src/components/workspace/growth/GrowthBrandVoice.tsx:5-17
          </div>
        }
      >
        <Row
          title="How we sound"
          meta="brand_voice"
          open
          src="apps/web/src/components/workspace/growth/GrowthBrandVoice.tsx:5-9"
        >
          <p className="needs-source">Empty.</p>
          <p>
            This field has been in every agent&rsquo;s prompt since the personalization block
            shipped, and no screen ever let anyone fill it, so it was empty for every tenant. It is
            editable here now. Until you write something, the agents write in their own default
            voice.
          </p>
        </Row>
        <Row
          title="Words to never say"
          meta="response_rules"
          src="apps/web/src/components/workspace/growth/GrowthBrandVoice.tsx:15-17"
        >
          <p className="needs-source">Empty.</p>
          <p>
            The list renders into the prompt as one rule line. It is not a new store, it is the
            field the agents already read.
          </p>
        </Row>
      </Section>

      <Section
        num="03"
        label="Active goals"
        framing="Three on this page, twenty on the server. The page asks for focus, it does not rewrite the rule."
        railExtra={
          <div className="src mono">growth/GrowthGoals.tsx:5-16 · goalMetricOptions.ts:32-46</div>
        }
      >
        {state.goals.length === 0 ? (
          <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>
            No goals yet. A goal is what makes a channel&rsquo;s work checkable later: without one,
            every run is judged on whether it read well.
          </p>
        ) : (
          state.goals.map((g) => <GoalRow key={g.id} g={g} onRemove={() => removeGoal(g.id)} />)
        )}

        {state.goals.length >= 3 ? (
          <p className="muted" style={{ fontSize: 13, margin: "14px 0 0" }}>
            Three of three. Add stops here. The server cap stays at twenty so Home and older tenants
            are untouched.
          </p>
        ) : (
          <>
            <div className="d-form">
              <label className="fld" style={{ margin: 0 }}>
                <span className="lab">Metric</span>
                <select value={metric} onChange={(e) => setMetric(e.target.value)}>
                  {METRICS.map((m) => (
                    <option value={m.value} key={m.value}>
                      {m.label}
                      {m.measurable ? "" : " (you report this)"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="fld" style={{ margin: 0 }}>
                <span className="lab">Target</span>
                <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} />
              </label>
              <Btn kind="dark" onClick={addGoal}>
                Add goal
              </Btn>
            </div>
            <p className="muted" style={{ fontSize: 12.5, margin: "10px 0 0" }}>
              A sentence with no number cannot be measured. Seven of the eleven metrics have a real
              measure path today; the other four you report yourself, and the picker says which is
              which rather than pretending.
            </p>
          </>
        )}
      </Section>

      <Section
        num="04"
        label="Channels"
        framing={`Nineteen in the registry. ${inPlanCount} in your plan. Every one lands with runs-on-its-own off: nothing starts working unattended, and nothing can start spending, until you flip that switch.`}
        railExtra={
          <div className="src mono">packages/shared/src/channels/registry.ts:304-1418</div>
        }
      >
        {CHANNELS.map((c) => {
          const ch = channelState(state, c.slug);
          const mode = deliveryMode(state, c);
          const linked = c.conn.some((k) => connState(state, k) === "connected");
          return (
            <Row
              key={c.slug}
              title={c.name}
              sub={`${c.cat}${c.conn.length ? " · needs a connector" : " · nothing to connect"}`}
              meta={`${c.ready}${ch.inPlan ? " · in plan" : ""}`}
              src={`packages/shared/src/channels/${c.line}`}
            >
              <p>
                <b>What it needs.</b> {c.needs}
              </p>
              <p>
                <b>Measured on.</b> {c.measured}
              </p>
              <p>
                <b>Delivery mode right now.</b> <span className="mono">{mode}</span>.{" "}
                {mode === "execute"
                  ? "It can act on the connected account."
                  : "It can describe and recommend. It cannot state a measured number."}
              </p>
              <p>
                <b>Hold per run.</b> {n(CHANNEL_HOLD)} credits.
              </p>
              <div className="d-foot">
                <Btn kind={ch.inPlan ? "quiet" : undefined} sm onClick={() => togglePlan(c.slug)}>
                  {ch.inPlan ? "Remove from plan" : "Add to plan"}
                </Btn>
                {ch.inPlan ? (
                  <Btn kind="quiet" sm onClick={() => toggleAutorun(c.slug)}>
                    {ch.autorun ? "Runs on its own: ON" : "Runs on its own: OFF"}
                  </Btn>
                ) : null}
                <Btn kind="quiet" sm onClick={() => go("channels")}>
                  Open the channel board
                </Btn>
              </div>
              {ch.inPlan && ch.autorun && c.conn.length > 0 && !linked ? (
                <p className="needs-source" style={{ fontSize: 13, marginTop: 8 }}>
                  The switch is on and nothing will fire. The scheduler sweeps a channel only when a
                  declared connector is linked or it declares a connector-free tool.
                </p>
              ) : null}
            </Row>
          );
        })}
      </Section>

      <Section
        num="05"
        label="Connectors"
        framing="The honest edge of what Zavi can measure. A plan built on two connected sources and a plan built on eight look the same on screen, so a thin plan gets blamed on the thinking rather than the inputs."
        railExtra={<div className="src mono">growth/GrowthConnections.tsx:3-17</div>}
      >
        <div className="panel">
          <ConnectorLines state={state} keys={[...CONNECTOR_KEYS]} onConnect={connect} />
        </div>
        <p className="muted" style={{ fontSize: 12.5, margin: "12px 0 0" }}>
          Google Analytics leads on purpose: a goal with no measurement source is a guess, and it is
          the one connection that turns most of them into numbers. Finish an approval in Settings to
          move it from pending to connected.
        </p>
      </Section>
    </div>
  );
}

/* One goal. A goal missing its target or its current value says so in words;
   it never renders "undefined of undefined". */
function GoalRow({ g, onRemove }: { g: Goal; onRemove: () => void }) {
  const parts = [
    g.metricLabel || null,
    g.due_date ? `due ${g.due_date}` : null,
    g.dataSource ? `data source: ${g.dataSource}` : null,
  ].filter(Boolean) as string[];

  /* Never "undefined of undefined": a goal with no target says so, and a goal
     with a target but no reading says which half is missing. */
  const progress =
    g.target_value == null
      ? "no target set"
      : g.current_value == null
        ? `target ${n(g.target_value)}, nothing measured yet`
        : `${n(g.current_value)} of ${n(g.target_value)}`;

  return (
    <div className="d-goal">
      <div>
        <b>{g.objective || "Untitled goal"}</b>
        <em>{parts.length ? parts.join(" · ") : "No metric set yet"}</em>
      </div>
      <div className="mono">{progress}</div>
      <Btn kind="quiet" sm onClick={onRemove}>
        Remove
      </Btn>
    </div>
  );
}
