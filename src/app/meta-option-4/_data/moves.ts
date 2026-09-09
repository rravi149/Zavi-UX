/**
 * Option 4: "The constraint and the reallocation."
 *
 * Same five Meta recommendations and the same underlying numbers as the rest
 * of the prototype (see ../dashboard/_components/plainCopy.ts and
 * ChannelPanel.tsx's "meta-ads" block). This file re-organizes them around a
 * single diagnosis instead of five disconnected cards: two ads are draining
 * money (the sources), one ad is starved for it (the destination), and two
 * more are early warnings of the same disease before it costs anything.
 *
 * Numbers marked "derived" are arithmetic on the prototype's own numbers
 * (a total, a fraction, an annualized figure) added for the strategy layer
 * that the other two options don't show. Nothing here invents a new fact.
 */

export type MoveRole = "source" | "destination" | "independent";
export type MoveStatus = "pending" | "approved" | "rejected";
export type Confidence = "Strong evidence" | "Early signal" | "Not enough data yet";

export type Metric = { label: string; before: string; after: string };
export type Alternative = { option: string; rejectedBecause: string };

export type FollowUpPoint = {
  status: "on-track" | "ahead" | "behind" | "failed";
  detail: string;
  recommendation?: string;
};

export type Move = {
  id: number;
  role: MoveRole;
  /** Weekly dollars. Negative = frees money. Positive = costs new money. 0 = no money moves. */
  weeklyDelta: number;
  tag: string;
  title: string;
  actionLabel: string;
  oneLiner: string;
  linksToConstraint: string;
  metrics: Metric[];
  confidence: Confidence;
  risk: { level: "Low" | "Medium"; detail: string };
  alternatives: Alternative[];
  ifNothing: string;
  undo: string;
  adPreviewSeed: string;
  /** Keyed by day marker id: "d3" | "d7" | "d14". */
  followUp: Record<"d3" | "d7" | "d14", FollowUpPoint>;
};

export const moves: Move[] = [
  {
    id: 1,
    role: "source",
    weeklyDelta: -588,
    tag: "Draining money",
    title: "Turn off the retargeting ad that stopped paying for itself",
    actionLabel: "Turn it off",
    oneLiner:
      "Cost per sale on this ad is $19.60, more than double the $8.21 the rest of the account gets for the same dollar.",
    linksToConstraint:
      "This is one of the two places the trapped money is sitting. Turning it off is what frees the first $588 a week.",
    metrics: [
      { label: "Money spent this week", before: "$588", after: "$0" },
      { label: "Cost per sale", before: "$19.60", after: "n/a, paused" },
      { label: "Sales this week", before: "30", after: "0, redirected" },
    ],
    confidence: "Strong evidence",
    risk: {
      level: "Low",
      detail:
        "Turning it off only stops it showing. The ad, its audience and its history stay saved, and Zavi checks again in 3 days before suggesting deletion.",
    },
    alternatives: [
      {
        option: "Leave it running because it still brings in some sales",
        rejectedBecause:
          "Those sales cost 2.4 times the going rate. The same $588 spent where the rest of the account spends it would buy roughly twice as many sales.",
      },
      {
        option: "Delete it outright today",
        rejectedBecause:
          "Zavi keeps a 3 day window before anything is removed for good, in case the numbers move once it is off.",
      },
    ],
    ifNothing:
      "Keeps costing $588 a week at more than double the going rate, quietly, until someone happens to notice.",
    undo: "Turn the ad back on from this plan or from your Meta Ads account. Nothing about it is deleted.",
    adPreviewSeed: "zavi-cart-abandoners",
    followUp: {
      d3: {
        status: "on-track",
        detail: "Off for 3 days. $252 saved so far. No drop in support messages, no one has noticed it's gone.",
      },
      d7: {
        status: "on-track",
        detail: "$588 saved this week, exactly as expected. Audience and history are still sitting untouched in Meta.",
      },
      d14: {
        status: "on-track",
        detail: "$1,176 saved across two weeks. Nothing recovered when checked again on day 3, so this is safe to archive for good.",
      },
    },
  },
  {
    id: 2,
    role: "destination",
    weeklyDelta: 420,
    tag: "Where the money goes",
    title: "Put the freed money behind the ad already returning $3.09 for every $1",
    actionLabel: "Raise the budget",
    oneLiner:
      "This ad has held a $3.09 return on every $1 spent since Aug 25, and it runs out of budget most days rather than running out of people to reach.",
    linksToConstraint:
      "This is the destination. It is the one ad in the account proven to make good use of an extra dollar, and today it is capped, not by demand, but by its own daily budget.",
    metrics: [
      { label: "Daily budget", before: "$120", after: "$180" },
      { label: "Return per $1 spent", before: "$3.09", after: "$3.09, holding" },
      { label: "Sales per week", before: "168", after: "~200, +30 to 40" },
    ],
    confidence: "Strong evidence",
    risk: {
      level: "Low",
      detail:
        "Cost per sale has been flat since Aug 25. The raise is capped and Zavi watches it daily, dropping it back to $120 on its own if a sale ever costs more than $12.",
    },
    alternatives: [
      {
        option: "Raise it further, to $250 a day",
        rejectedBecause:
          "History only validates a jump this size. A bigger raise risks pushing the ad past the audience where a $3.09 return still holds, before this jump is even confirmed.",
      },
      {
        option: "Split the freed money across two ads instead of concentrating it here",
        rejectedBecause:
          "This is the only ad with two straight weeks of a stable return. Splitting the bet thins a sure thing to fund a maybe.",
      },
    ],
    ifNothing:
      "Keeps hitting its daily cap most days and turning away buyers who were ready to purchase, while $588 a week sits doing nothing two ads over.",
    undo: "Set the daily budget back to $120 from this plan or your Meta Ads account, any time.",
    adPreviewSeed: "zavi-acquisition-prospecting",
    followUp: {
      d3: {
        status: "on-track",
        detail: "Cost per sale holding at $10.60, comfortably under the $12 ceiling Zavi set. No auto revert triggered.",
      },
      d7: {
        status: "ahead",
        detail: "35 more sales than the same week last month, right in the 30 to 40 range predicted. Spend is on pace for the extra $420 a week.",
      },
      d14: {
        status: "ahead",
        detail: "70 extra sales across two weeks. Cost per sale ticked up slightly to $11.40, still under the $12 ceiling. Holding at $180 a day.",
      },
    },
  },
  {
    id: 3,
    role: "independent",
    weeklyDelta: 0,
    tag: "Early warning",
    title: "Swap in fresh pictures before this one becomes the next dead ad",
    actionLabel: "Use new pictures",
    oneLiner:
      "The same people have now seen this ad 4.2 times each, clicks are down 38%, and cost per sale has already crept to about $20, the same range as the ad you just turned off.",
    linksToConstraint:
      "Same disease as the ad you're pausing, caught earlier. If nothing changes here, this becomes a second version of move 1 in a matter of weeks instead of a fix today.",
    metrics: [
      { label: "Times each person has seen it", before: "2.1", after: "resets to 1" },
      { label: "Share of people who click", before: "0.62%", after: "1.1% to 1.4%, projected" },
      { label: "Cost per sale", before: "~$20", after: "$10 to $12, projected" },
    ],
    confidence: "Early signal",
    risk: {
      level: "Low",
      detail: "Same audience, same budget, same placements. Only the picture changes, and it can be switched back in one click.",
    },
    alternatives: [
      {
        option: "Turn it off the same way as move 1",
        rejectedBecause:
          "Unlike move 1, the drop-off tracks tightly with how many times people have seen it, not with the audience itself. That points at creative fatigue, which a refresh can fix, not a dead audience, which can't.",
      },
      {
        option: "Wait another week and see if it recovers on its own",
        rejectedBecause:
          "Frequency and cost per sale are both moving the wrong way. Waiting is what turned move 1 into a $588 a week problem instead of a $85 a day one.",
      },
    ],
    ifNothing:
      "Likely turns into a second dead ad within weeks: same symptoms, same trajectory, another line item to catch later instead of a cheap fix now.",
    undo: "Switch the new pictures off and bring the old one back from this plan, in one click.",
    adPreviewSeed: "zavi-winback-carousel",
    followUp: {
      d3: {
        status: "behind",
        detail: "New pictures live for 3 days. Click share moved from 0.62% to 0.68%, well short of the 1.1% to 1.4% Zavi projected.",
      },
      d7: {
        status: "failed",
        detail: "A full week in and click share is still 0.71%. Cost per sale is now $21, worse than before the refresh and squarely in dead-ad territory. The picture wasn't the problem.",
        recommendation: "Zavi now recommends pausing this ad set the same way as move 1, instead of trying a second refresh.",
      },
      d14: {
        status: "failed",
        detail: "Two weeks in, cost per sale is $23 and still climbing. This is now costing more than the ad you shut off in week one. Waiting on your call to pause it.",
        recommendation: "Pause this ad set and move its ~$290 a week toward the ad from move 2, the same play as move 1.",
      },
    },
  },
  {
    id: 4,
    role: "source",
    weeklyDelta: -210,
    tag: "Draining money",
    title: "Stop paying to reach people who already bought",
    actionLabel: "Leave them out",
    oneLiner:
      "12% of the money aimed at new customers, about $210 a week, is reaching people who already bought in the last 30 days.",
    linksToConstraint:
      "This is the second place the trapped money is sitting. Excluding recent buyers is what frees the other $210 a week.",
    metrics: [
      { label: "Wasted each week", before: "$210", after: "$0" },
      { label: "Share of budget reaching past buyers", before: "12%", after: "0%" },
      { label: "Ads affected", before: "3 of 3 new customer ads", after: "3 of 3 fixed" },
    ],
    confidence: "Early signal",
    risk: {
      level: "Low",
      detail: "Ads aimed at past buyers on purpose, like win-back and retention, are completely untouched. Only the new customer ads change.",
    },
    alternatives: [
      {
        option: "Leave it, 12% doesn't sound like much",
        rejectedBecause:
          "It compounds. $210 a week is about $10,900 a year spent on people who cannot become a new customer because they already are one.",
      },
      {
        option: "Exclude recent buyers everywhere, including retention and win-back campaigns",
        rejectedBecause:
          "Those campaigns exist specifically to reach past buyers. The mistake is only in the new-customer ads, so the fix only touches those.",
      },
    ],
    ifNothing:
      "Keeps quietly compounding: about $10,900 a year spent reaching people who already converted, for zero new customers.",
    undo: "Remove the exclusion from this plan or your Meta Ads account, any time.",
    adPreviewSeed: "zavi-prospecting-exclusion",
    followUp: {
      d3: {
        status: "on-track",
        detail: "$90 recovered in the first 3 days, on pace for the full $210 a week.",
      },
      d7: {
        status: "on-track",
        detail: "$204 recovered this week, 3% under the $210 estimate. New-customer sales didn't move, so this is confirmed working as intended.",
      },
      d14: {
        status: "on-track",
        detail: "$420 recovered over two weeks with no drop in new-customer purchases. Doing exactly what it was supposed to.",
      },
    },
  },
  {
    id: 5,
    role: "independent",
    weeklyDelta: 0,
    tag: "Idle budget",
    title: "Let Meta show this ad in more places",
    actionLabel: "Open up the spots",
    oneLiner:
      "This ad only runs in 2 of 6 available placements, so about $80 a day of the budget you already approved for it never gets the chance to spend.",
    linksToConstraint:
      "Different flavor of the same underlying problem: dollars not working as hard as they could. This money is already committed, it just isn't being deployed.",
    metrics: [
      { label: "Budget actually used", before: "60%", after: "95%+, projected" },
      { label: "Places it can appear", before: "2 of 6", after: "6 of 6" },
      { label: "Sales this week", before: "20", after: "32 to 33, projected" },
    ],
    confidence: "Not enough data yet",
    risk: {
      level: "Medium",
      detail: "This ad has only been live since Sep 3, so there isn't much history to judge it on yet. The switch itself is free and reversible.",
    },
    alternatives: [
      {
        option: "Wait another week for more history before touching it",
        rejectedBecause:
          "Every day at 60% pacing is another ~$80 that never gets the chance to become a sale. The switch is free and reversible, so there's no reason to wait on that, only on trusting the result.",
      },
      {
        option: "Raise its budget instead of opening placements",
        rejectedBecause:
          "It isn't budget-constrained, it's placement-constrained. More budget wouldn't fix the reason it can't spend what it already has.",
      },
    ],
    ifNothing:
      "Keeps leaving about $80 a day of already-committed budget unspent, with reach capped at 2 of 6 placements indefinitely.",
    undo: "Go back to choosing placements yourself from your Meta Ads account, any time.",
    adPreviewSeed: "zavi-launch-q4-promo",
    followUp: {
      d3: {
        status: "ahead",
        detail: "Pacing jumped from 60% to 91% in three days, a little faster than projected.",
      },
      d7: {
        status: "ahead",
        detail: "Pacing steady at 95%+. 34 sales this week versus 20 the week before the switch, in line with the high end of the estimate.",
      },
      d14: {
        status: "ahead",
        detail: "Two weeks of full pacing, 68 sales total. Confidence upgraded from \"not enough data\" to \"early signal\", worth trusting with real budget now.",
      },
    },
  },
];

export const moveById = new Map(moves.map((move) => [move.id, move]));

export const sourceMoves = moves.filter((move) => move.role === "source");
export const destinationMoves = moves.filter((move) => move.role === "destination");
export const independentMoves = moves.filter((move) => move.role === "independent");

/** Total weekly dollars sitting in the wrong place today, before any approval. */
export const totalTrapped = -sourceMoves.reduce((sum, move) => sum + move.weeklyDelta, 0);
/** Full funding the plan proposes moving into the winning ad. */
export const totalDestination = destinationMoves.reduce((sum, move) => sum + move.weeklyDelta, 0);
/** What's left over if every source and every destination move is approved. */
export const totalBanked = totalTrapped - totalDestination;

/** Derived: this week's Meta spend, summed from the "before" figures behind every move. */
export const estimatedWeeklySpend = 588 + 840 + 289 + 250 + 840; // ≈ $2,807
export const trappedShareOfSpend = totalTrapped / estimatedWeeklySpend; // ≈ 0.284

export function formatUsd(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;
}

export type Ledger = {
  freed: number; // weekly $ freed by approved source moves
  committed: number; // weekly $ committed by approved destination moves
  net: number; // freed - committed. Positive = net savings, negative = net new spend
  approvedSources: Move[];
  approvedDestinations: Move[];
  rejectedSources: Move[];
  pendingSources: Move[];
  destinationApproved: boolean;
  destinationRejected: boolean;
  destinationPending: boolean;
  /** Set when the approved set breaks the plan's own causal logic. */
  mismatch:
    | { kind: "unfunded-destination"; shortfall: number }
    | { kind: "all-banked" }
    | { kind: "partially-banked"; freedNotReinvested: number }
    | null;
};

export function computeLedger(statusOf: (id: number) => MoveStatus): Ledger {
  const approvedSources = sourceMoves.filter((m) => statusOf(m.id) === "approved");
  const rejectedSources = sourceMoves.filter((m) => statusOf(m.id) === "rejected");
  const pendingSources = sourceMoves.filter((m) => statusOf(m.id) === "pending");
  const approvedDestinations = destinationMoves.filter((m) => statusOf(m.id) === "approved");

  const freed = -approvedSources.reduce((sum, m) => sum + m.weeklyDelta, 0);
  const committed = approvedDestinations.reduce((sum, m) => sum + m.weeklyDelta, 0);
  const net = freed - committed;

  const destinationStatus = destinationMoves.length ? statusOf(destinationMoves[0].id) : "pending";

  let mismatch: Ledger["mismatch"] = null;
  if (destinationStatus === "approved" && freed < committed) {
    mismatch = { kind: "unfunded-destination", shortfall: committed - freed };
  } else if (destinationStatus === "rejected" && freed === totalTrapped && freed > 0) {
    mismatch = { kind: "all-banked" };
  } else if (destinationStatus !== "approved" && freed > 0) {
    mismatch = { kind: "partially-banked", freedNotReinvested: freed };
  }

  return {
    freed,
    committed,
    net,
    approvedSources,
    approvedDestinations,
    rejectedSources,
    pendingSources,
    destinationApproved: destinationStatus === "approved",
    destinationRejected: destinationStatus === "rejected",
    destinationPending: destinationStatus === "pending",
    mismatch,
  };
}

export const dayMarkers = [
  { id: "d3" as const, label: "3 days later" },
  { id: "d7" as const, label: "7 days later" },
  { id: "d14" as const, label: "14 days later" },
];

export type DayMarkerId = (typeof dayMarkers)[number]["id"];
