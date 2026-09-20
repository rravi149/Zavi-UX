"use client";

/* ============================================================
   /v2/dashboard, the signed-in shell.

   One `useState<V2State>` lives here. Everything below it is a pure function of
   that object plus `setState`, which is why the next-action bar can be
   deterministic: it is recomputed from state on every render, never set by a
   screen. Tabs are components, not routes, so a run started on Home is still
   there when you come back from Settings.

   Ported from parts/_shell.js (the signed-in top bar, `nextAction`, the phase
   spine) and parts/30-console.js + parts/50-commerce.js (the four tabs).
   ============================================================ */

import { useCallback, useRef, useState } from "react";
import "./dashboard.css";
import {
  FRESH_STATE,
  PHASES,
  nextAction,
  n,
  type TabId,
  type TabProps,
  type V2State,
  flash,
} from "./state";
import { HomeTab } from "./_components/HomeTab";
import { PlanTab } from "./_components/PlanTab";
import { SettingsTab } from "./_components/SettingsTab";
import { UpgradeTab } from "./_components/UpgradeTab";
import { ChannelsTab } from "./_components/ChannelsTab";
import { ChannelDetailTab } from "./_components/ChannelDetailTab";
import { RunOutputTab } from "./_components/RunOutputTab";

/* Which tab owns each focusable anchor. The next-action bar can say "fix the
   blind spots" without knowing where they live. */
const FOCUS_TAB: Record<string, TabId> = {
  "d-company": "plan",
  "d-blind": "home",
  "d-runs": "home",
};

const NAV: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "plan", label: "Plan" },
  { id: "channels", label: "Channels" },
  { id: "settings", label: "Settings" },
];

type Toast = { id: number; msg: string };

export default function DashboardPage() {
  const [state, setState] = useState<V2State>(FRESH_STATE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const toast = useCallback((msg: string) => {
    seq.current += 1;
    const id = seq.current;
    setToasts((t) => [...t, { id, msg }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const go = useCallback((tab: TabId) => {
    setState((s) => (s.tab === tab ? s : { ...s, tab, log: [...s.log, tab] }));
    window.scrollTo(0, 0);
  }, []);

  /* The one place a next-action CTA is interpreted. `tab:` switches; `focus:`
     switches to whichever tab owns the anchor, then outlines it once the new
     tab has painted. */
  const runAct = useCallback(
    (act: string) => {
      if (act.startsWith("tab:")) {
        go(act.slice(4) as TabId);
        return;
      }
      if (act.startsWith("focus:")) {
        const id = act.slice(6);
        go(FOCUS_TAB[id] ?? "home");
        window.setTimeout(() => flash(id), 80);
      }
    },
    [go],
  );

  const na = nextAction(state);
  const tabProps: TabProps = { state, setState, toast, go };

  return (
    <>
      <header className="topbar app">
        <div className="brand">
          <span className="dot" /> Zavi{" "}
          <span className="mono tenant">{state.company ? state.company.name : "no company"}</span>
        </div>
        <nav className="topnav">
          {NAV.map((item) => (
            <a
              key={item.id}
              className={`navlink ${state.tab === item.id ? "on" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="topbar-cta mono credits">
          {n(state.creditsDay)} today
          {state.creditsMonth ? ` · ${n(state.creditsMonth)} this month` : ""}
        </div>
      </header>

      <div className="nextbar">
        <div className="nextbar-in">
          <span className="mono nb-phase">{na.phase}</span>
          <span className="nb-job">{na.job}</span>
          <button type="button" className="btn dark nb-cta" onClick={() => runAct(na.act)}>
            {na.cta}
          </button>
        </div>
        <div className="spine">
          {PHASES.map((p) => (
            <span
              key={p}
              className={`sp ${p === na.phase ? "on" : ""} ${
                PHASES.indexOf(p) < PHASES.indexOf(na.phase) ? "done" : ""
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="screen screen-app">
        <Tab {...tabProps} />
      </div>

      {toasts.length > 0 ? (
        <div className="toasts">
          {toasts.map((t) => (
            <div className="toast" key={t.id}>
              {t.msg}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function Tab(props: TabProps) {
  switch (props.state.tab) {
    case "home":
      return <HomeTab {...props} />;
    case "plan":
      return <PlanTab {...props} />;
    case "settings":
      return <SettingsTab {...props} />;
    case "upgrade":
      return <UpgradeTab {...props} />;
    case "channels":
      return <ChannelsTab {...props} />;
    case "channelDetail":
      return <ChannelDetailTab {...props} />;
    case "runOutput":
      return <RunOutputTab {...props} />;
    default:
      return <HomeTab {...props} />;
  }
}
