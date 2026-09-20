"use client";

/* SEAM. What one run actually returned. Handed to the channels agent.

   Contract:
     - the run lives on `channelState(state, state.openChannel).runs`, newest last
     - the envelope is `ChannelRun` in ../state, drawn from the real shape in
       apps/web/src/lib/workspace/channelActionsApi.ts:80-107: run_id, status,
       provenance, actions[{action_type,title,impact,impact_reason,blocking}],
       cannot_see[], note
     - `cannot_see` gets the same weight as the actions, never a footnote
   Replace this whole component body. Do not change the export name or props. */

import { Btn } from "../../_components/kit";
import { channelState, type TabProps } from "../state";

export function RunOutputTab({ state, go }: TabProps) {
  const slug = state.openChannel;
  const runs = slug ? channelState(state, slug).runs : [];
  const latest = runs.length > 0 ? runs[runs.length - 1] : null;

  return (
    <div style={{ maxWidth: 760 }}>
      <p className="kicker">Run output</p>
      <h1 className="h1">Handed to the channels agent.</h1>
      <div className="d-seam">
        <h2>What belongs here</h2>
        {latest ? (
          <p style={{ margin: "0 0 10px" }}>
            <span className="mono">{latest.run_id}</span>, status{" "}
            <span className="mono">{latest.status}</span>, provenance{" "}
            <span className="mono">{latest.provenance}</span>. {latest.actions.length} action
            {latest.actions.length === 1 ? "" : "s"} and {latest.cannot_see.length} thing
            {latest.cannot_see.length === 1 ? "" : "s"} it could not see.
          </p>
        ) : (
          <p style={{ margin: "0 0 10px" }}>
            No run is open. A caller sets <span className="mono">openChannel</span> to a channel
            that has run before switching here.
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
