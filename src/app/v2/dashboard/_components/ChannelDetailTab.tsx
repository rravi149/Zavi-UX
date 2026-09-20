"use client";

/* SEAM. One channel, opened from the board or from a finished run on Home.
   Handed to the channels agent.

   Contract:
     - the channel is `state.openChannel`; resolve it with `channelSpec(slug)`
     - its runs and actions are `channelState(state, slug)`
     - `deliveryMode(state, spec)` is the ported rule from
       routes/channels/list.ts:94, so this screen can say execute or produce
       without re-deciding it
   Replace this whole component body. Do not change the export name or props. */

import { Btn } from "../../_components/kit";
import { channelSpec, channelState, deliveryMode, type TabProps } from "../state";

export function ChannelDetailTab({ state, go }: TabProps) {
  const slug = state.openChannel;
  const spec = slug ? channelSpec(slug) : null;
  const ch = slug ? channelState(state, slug) : null;

  return (
    <div style={{ maxWidth: 760 }}>
      <p className="kicker">Channel</p>
      <h1 className="h1">{spec ? spec.name : "No channel open."}</h1>
      <div className="d-seam">
        <h2>Handed to the channels agent</h2>
        {spec && ch ? (
          <p style={{ margin: "0 0 10px" }}>
            <span className="mono">{spec.slug}</span> is open. Readiness{" "}
            <span className="mono">{spec.ready}</span>, delivery mode{" "}
            <span className="mono">{deliveryMode(state, spec)}</span>, {ch.runs.length} run
            {ch.runs.length === 1 ? "" : "s"} and {ch.actions.length} action
            {ch.actions.length === 1 ? "" : "s"} on file. All of it is already in shared state.
          </p>
        ) : (
          <p style={{ margin: "0 0 10px" }}>
            Nothing is open. A caller sets <span className="mono">openChannel</span> before
            switching to this tab.
          </p>
        )}
        <div className="d-foot">
          <Btn kind="dark" onClick={() => go("channels")}>
            Back to the board
          </Btn>
          <Btn kind="quiet" onClick={() => go("home")}>
            Back to Home
          </Btn>
        </div>
      </div>
    </div>
  );
}
