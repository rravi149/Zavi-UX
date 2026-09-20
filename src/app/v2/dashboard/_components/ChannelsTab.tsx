"use client";

/* SEAM. The channel board. Handed to the channels agent.

   Contract:
     - reads `state.channels` (slug to ChannelState) and `CHANNELS` from ../state
     - opens one by setting `openChannel` then `go("channelDetail")`
     - a run debits with `afford` / `debit` from ../state, the same helpers the
       Home tab's example runs use, so the credit counter in the top bar and the
       usage panel on Home both move
   Replace this whole component body. Do not change the export name or the props
   type: page.tsx routes on them. */

import { Btn } from "../../_components/kit";
import { CHANNELS, type TabProps } from "../state";

export function ChannelsTab({ state, go }: TabProps) {
  return (
    <div style={{ maxWidth: 760 }}>
      <p className="kicker">Channels</p>
      <h1 className="h1">Handed to the channels agent.</h1>
      <div className="d-seam">
        <h2>What belongs here</h2>
        <p style={{ margin: "0 0 10px" }}>
          The board for all {CHANNELS.length} channels in the registry, the detail drawer for one,
          and the output of a run. The shared state is already wired: this tab receives the same{" "}
          <span className="mono">state</span> and <span className="mono">setState</span> every other
          tab holds, and <span className="mono">CHANNELS</span> in{" "}
          <span className="mono">state.ts</span> carries each row with its registry line.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          {state.runs === 0
            ? "No runs yet in this workspace."
            : `${state.runs} run${state.runs > 1 ? "s" : ""} so far, started from the Home tab.`}
        </p>
        <div className="d-foot">
          <Btn kind="dark" onClick={() => go("home")}>
            Back to Home
          </Btn>
          <Btn kind="quiet" onClick={() => go("plan")}>
            Open the plan
          </Btn>
        </div>
      </div>
    </div>
  );
}
