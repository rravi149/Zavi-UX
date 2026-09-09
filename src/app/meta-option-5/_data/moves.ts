/**
 * Option 5 data.
 *
 * Same five Meta recommendations and the same measured numbers as Options 1-4.
 * What differs is what this option refuses to claim, and what it shows its work on.
 *
 * Findings from the five-rater review that this data layer fixes:
 *  - No unsourced denominator. Option 4 divided by a hardcoded $2,807 the founder
 *    never saw, and one term of it contradicted its own evidence. There is no clean
 *    account-wide total available here at all: move 4 covers 3 prospecting ad sets
 *    and move 2 IS one of them, so summing double counts. So this option states
 *    trapped dollars only, from two rows in the same window, and says why there is
 *    no percentage.
 *  - No stale figures. Frequency is 4.2 (current) everywhere, never 2.1 (Aug 17).
 *  - Confidence carries its sample size inline, so "confident" is never a vibe.
 *  - Risk, do-nothing cost and reversibility are REQUIRED fields, rendered always,
 *    never gated behind a toggle or a broken condition.
 *  - The learning-phase reset risk, present in the source data but dropped from the
 *    Options 1/2 rewrite, is restored.
 *  - No headline credits one move's forecast to the whole batch.
 */

export type MoveRole = "frees" | "spends" | "neutral";
export type MoveStatus = "pending" | "approved" | "rejected";

export type EvidenceRow = {
  label: string;
  value: string;
  note?: string;
  tone?: "good" | "bad";
};

export type Move = {
  id: number;
  title: string;
  /** Plain sentence naming what changes. No rhetorical questions, no loaded verbs. */
  detail: string;
  role: MoveRole;
  /** Weekly dollars this move frees (frees) or costs (spends). 0 for neutral. */
  weeklyDollars: number;
  /** Why this follows from the diagnosis. */
  because: string;
  /** Confidence, stated WITH the sample it rests on. */
  confidence: { label: string; basis: string; tone: "strong" | "early" | "thin" };
  /** Always rendered. Never behind a disclosure. */
  risk: string;
  /** Always rendered. Never behind a disclosure. */
  doNothing: string;
  /** Always rendered. Never behind a disclosure. */
  undo: string;
  /** Behind "See the workings". Detail, not safety information. */
  evidence: EvidenceRow[];
  /** Behind "See the workings". */
  considered: { option: string; why: string }[];
  /** What Zavi will and will not claim about the result. */
  expect: string;
};

export const ATTRIBUTION_NOTE =
  "Every sales figure here is what Meta reports. It usually counts a sale within 7 days of a click, and it tends to flatter ads shown to people who already know you. Treat these as directional, not audited.";

export const moves: Move[] = [
  {
    id: 1,
    title: "Turn off the cart-abandoner ad",
    detail:
      "Stops the Retargeting, Cart Abandoners ad set from spending. It keeps its history and can be switched back on.",
    role: "frees",
    weeklyDollars: 588,
    because:
      "This is the larger half of the money going nowhere. It is spending every day and selling at more than twice what your other ads manage.",
    confidence: {
      label: "Strong",
      basis: "4 weeks of this ad's own results, plus the campaign average",
      tone: "strong",
    },
    risk:
      "Low. Switching it off only stops it showing. You keep the ad, its comments and its history.",
    doNothing:
      "It keeps spending about $85 a day at $19.60 a sale, against a $8.21 campaign average. Roughly $588 a week continues to buy very little.",
    undo: "Switch it back on from this panel. Delivery restarts within the hour.",
    expect:
      "Frees $588 a week. This move on its own does not add sales, it stops losing money.",
    evidence: [
      { label: "Spend behind this call", value: "$588", note: "Sep 1 to 7" },
      { label: "Purchases in that window", value: "30" },
      {
        label: "Cost per sale, trend",
        value: "$8.21 to $19.60",
        note: "2.4x higher than the week before",
        tone: "bad",
      },
      { label: "What your other ads manage", value: "$8.21", note: "campaign average" },
    ],
    considered: [
      {
        option: "Lower its budget instead of switching it off",
        why: "At $19.60 a sale it is already worse than doing nothing with that money, so a smaller amount of the same loss is still a loss.",
      },
      {
        option: "Refresh its creative first",
        why: "Its click rate is steady. The problem is who it is reaching, not the picture, so a new image would not address it.",
      },
    ],
  },
  {
    id: 2,
    title: "Stop paying to reach people who already bought",
    detail:
      "Adds your last-30-days buyers as an exclusion on all 3 prospecting ad sets, so new-customer budget stops reaching them.",
    role: "frees",
    weeklyDollars: 210,
    because:
      "This is the smaller half of the same problem: money aimed at finding new customers is landing on people you already have.",
    confidence: {
      label: "Strong",
      basis: "your own pixel and Conversions API events, Aug 9 to Sep 7",
      tone: "strong",
    },
    risk:
      "Low, with one catch. The buyer list is a snapshot, so for a few days it may also exclude a handful of genuine repeat shoppers until it refreshes.",
    doNothing:
      "About $210 a week keeps going to people who bought in the last 30 days, across all 3 prospecting ad sets.",
    undo: "Remove the exclusion. It takes effect on the next delivery cycle.",
    expect:
      "Frees about $210 a week. Your sales count should hold at 125 while spend drops, so cost per sale improves from $14.00 to about $12.32.",
    evidence: [
      { label: "Spend behind this call", value: "$1,750", note: "Sep 1 to 7, across 3 ad sets" },
      {
        label: "Reaching past buyers",
        value: "$210",
        note: "12% of that prospecting spend",
        tone: "bad",
      },
      { label: "Overlap measured", value: "12%", note: "bought between Aug 9 and Sep 7" },
    ],
    considered: [
      {
        option: "Exclude buyers from the last 7 days instead of 30",
        why: "A 7-day window leaves most of the overlap in place. It recovers roughly a quarter of the same money.",
      },
      {
        option: "Build a separate returning-customer campaign",
        why: "Worth doing later, but it is a new campaign to write and fund, not a fix for the leak that is running now.",
      },
    ],
  },
  {
    id: 3,
    title: "Raise the daily budget on your best ad",
    detail:
      "Takes the Acquisition, Prospecting ad set from $120 a day to $180 a day. That is $420 more a week.",
    role: "spends",
    weeklyDollars: 420,
    because:
      "This is where the freed money should go. This ad set is the only one returning more than it costs, and it stops early most days because it runs out of budget, not audience.",
    confidence: {
      label: "Early signal",
      basis: "only 3 past budget increases on this account, so this is a pattern, not a proof",
      tone: "early",
    },
    risk:
      "Medium. Spending more per day usually costs a little more per sale. Cost per sale could rise from $10.00 to around $10.30 to $10.70, and further if the audience starts to saturate.",
    doNothing:
      "It keeps hitting its daily cap and stops delivering early, so the one ad set earning $3.09 per $1 stays capped.",
    undo: "Set the budget back to $120 a day. Takes effect the same day.",
    expect:
      "Roughly 30 to 40 more sales a week at about $12 each. This is the only move in this batch that adds sales, and it rests on the thinnest sample here.",
    evidence: [
      { label: "Spend behind this call", value: "$1,680", note: "Aug 25 to Sep 7" },
      { label: "Purchases in that window", value: "168" },
      {
        label: "Money back per $1 spent",
        value: "$3.09",
        note: "steady since Aug 25",
        tone: "good",
      },
      {
        label: "Why it stops early",
        value: "Hits its daily limit",
        note: "not a shortage of people to reach",
      },
      { label: "Estimate based on", value: "3 similar increases", note: "small sample" },
    ],
    considered: [
      {
        option: "Double it to $240 a day",
        why: "Too big a jump on 3 examples. A large step also resets Meta's learning and can cost more per sale for several days.",
      },
      {
        option: "Leave the budget and widen the audience",
        why: "Delivery is capped by budget, not by audience size, so a wider audience would not change what is actually limiting it.",
      },
    ],
  },
  {
    id: 4,
    title: "Swap in fresh pictures on the winback ad",
    detail:
      "Adds new images to the Retention, Winback ad set. No budget change, no audience change.",
    role: "neutral",
    weeklyDollars: 0,
    because:
      "Not part of the money move. It is an early warning: this ad is drifting toward the same state as the one you are switching off, and it is cheaper to catch now.",
    confidence: {
      label: "Early signal",
      basis: "4 past refreshes on this account, and 4 weeks of this ad's decline",
      tone: "early",
    },
    risk:
      "Medium, and higher than it looks. Adding new images restarts Meta's learning for that ad set, so it can run unstable for 5 to 7 days and briefly get worse before it gets better. The offer may also be the problem rather than the picture, which new images would not fix.",
    doNothing:
      "Its click rate keeps sliding, currently 1.00% down to 0.62%, and cost per sale keeps climbing from the $20 it is at now.",
    undo:
      "Turn the new images off and restore the previous ones from version history. Note that this restarts learning again either way.",
    expect:
      "Possibly up to twice the clicks. Zavi will not put a sales number on this one, because the picture may not be the real problem.",
    evidence: [
      { label: "Spend behind this call", value: "$1,240", note: "Aug 9 to Sep 7" },
      { label: "Purchases in that window", value: "62" },
      {
        label: "Times each person has seen it",
        value: "4.2",
        note: "current 7-day figure, up from 2.1 on Aug 17",
        tone: "bad",
      },
      {
        label: "Share of people who clicked",
        value: "1.00% to 0.62%",
        note: "week of Aug 25 against week of Sep 1",
        tone: "bad",
      },
    ],
    considered: [
      {
        option: "Narrow the audience instead",
        why: "A smaller audience would push the same people to see it even more often, which is the thing already going wrong.",
      },
      {
        option: "Pause it like the cart-abandoner ad",
        why: "Its cost per sale is worse than it was but not yet past the point where switching off clearly beats fixing.",
      },
    ],
  },
  {
    id: 5,
    title: "Let Meta show the Q4 promo in more places",
    detail:
      "Turns on Advantage+ placements for the Launch, Q4 Promo ad set, so it can appear beyond Feed and Stories.",
    role: "neutral",
    weeklyDollars: 0,
    because:
      "Also not part of the money move. This ad cannot spend what you already gave it, so it is a separate problem from the leak.",
    confidence: {
      label: "Not enough data yet",
      basis: "this ad launched Sep 3, so there are only 5 days of history",
      tone: "thin",
    },
    risk:
      "Medium, and the least certain move here. New placements include Reels and Audience Network, where the same ad often performs differently. With 5 days of history there is no way to size this honestly.",
    doNothing:
      "It keeps pacing at about 60% and quietly under-spends the budget you already committed to it.",
    undo: "Switch back to manual placements. Takes effect on the next delivery cycle.",
    expect:
      "Fuller delivery of the budget you already set. Zavi is deliberately not forecasting sales for this one.",
    evidence: [
      { label: "Spend behind this call", value: "$600", note: "Sep 3 to 7, launched Sep 3" },
      { label: "Purchases in that window", value: "20" },
      {
        label: "Budget pacing",
        value: "60%",
        note: "manual placements are limiting delivery",
        tone: "bad",
      },
      { label: "Placements live", value: "2 of 6", note: "Feed and Stories only" },
    ],
    considered: [
      {
        option: "Wait another week for more data",
        why: "A real option, and the honest one if you would rather not act on 5 days. Nothing else in this plan depends on it.",
      },
      {
        option: "Raise its budget instead",
        why: "It cannot spend the budget it already has, so more budget would not change anything.",
      },
    ],
  },
];

/* ---------- Derived figures. Every one of these is shown on screen. ---------- */

export const freeingMoves = moves.filter((m) => m.role === "frees");
export const spendingMoves = moves.filter((m) => m.role === "spends");
export const neutralMoves = moves.filter((m) => m.role === "neutral");

/** $798. Two rows, same window, both directly evidenced. */
export const trappedWeekly = freeingMoves.reduce((n, m) => n + m.weeklyDollars, 0);
/** $420. */
export const needsFundingWeekly = spendingMoves.reduce((n, m) => n + m.weeklyDollars, 0);

/**
 * Deliberately absent: a "% of your Meta spend" figure.
 * Move 2 covers 3 prospecting ad sets and move 3 IS one of them, so the five
 * spend numbers overlap and cannot be summed into an account total. Rather than
 * divide by a number we cannot show, this option states the dollars and explains
 * the gap. This string is rendered to the founder verbatim.
 */
export const noPercentageNote =
  "Zavi is not showing this as a percentage of your Meta spend. Two of these ad sets overlap, so adding the five together would double count and the share would be wrong.";

export type Ledger = {
  freed: number;
  committed: number;
  banked: number;
  shortfall: number;
  state: "empty" | "balanced" | "unfunded" | "banking" | "partial";
};

export function computeLedger(statuses: Record<number, MoveStatus>): Ledger {
  const freed = freeingMoves
    .filter((m) => statuses[m.id] === "approved")
    .reduce((n, m) => n + m.weeklyDollars, 0);
  const committed = spendingMoves
    .filter((m) => statuses[m.id] === "approved")
    .reduce((n, m) => n + m.weeklyDollars, 0);

  const banked = Math.max(0, freed - committed);
  const shortfall = Math.max(0, committed - freed);

  let state: Ledger["state"] = "partial";
  if (freed === 0 && committed === 0) state = "empty";
  else if (committed > freed) state = "unfunded";
  else if (committed === 0 && freed > 0) state = "banking";
  else if (freed >= committed && committed > 0) state = "balanced";

  return { freed, committed, banked, shortfall, state };
}

/** Plain-English consequence of the exact mix chosen. Never a generic template. */
export function consequenceCopy(
  statuses: Record<number, MoveStatus>,
): { tone: "good" | "warn" | "neutral"; headline: string; body: string } {
  const l = computeLedger(statuses);
  const approvedCount = moves.filter((m) => statuses[m.id] === "approved").length;

  if (approvedCount === 0) {
    return {
      tone: "neutral",
      headline: "Nothing will change",
      body: "You have not approved anything, so Zavi will not touch the account. The $798 a week keeps going where it is going. That is a real choice and you can come back to this next week.",
    };
  }
  if (l.state === "unfunded") {
    return {
      tone: "warn",
      headline: "This adds spend, it does not move it",
      body: `You are funding the budget raise without freeing enough to pay for it. That is $${l.shortfall} a week of genuinely new Meta spend, not a reallocation. It may still be the right call, since that ad set returns $3.09 per $1, but go in knowing your total spend goes up rather than staying flat.`,
    };
  }
  if (l.state === "banking") {
    return {
      tone: "neutral",
      headline: "You are taking the savings, not reinvesting them",
      body: `You are freeing $${l.freed} a week and putting none of it back. Expect roughly 30 to 40 fewer sales a week than if you had funded the budget raise, and higher margin instead. Nothing wrong with that, it is just the trade you are making.`,
    };
  }
  if (l.state === "balanced") {
    return {
      tone: "good",
      headline: "This moves money, it does not add any",
      body: `You are freeing $${l.freed} a week and putting $${l.committed} of it back into the ad that earns $3.09 per $1. The remaining $${l.banked} a week stays unspent. Your total Meta spend goes down, not up.`,
    };
  }
  return {
    tone: "neutral",
    headline: "Partial plan",
    body: "You have approved some of this. Zavi will apply exactly what you picked and leave the rest alone. Nothing here depends on a move you declined.",
  };
}

/* ---------- Follow-up. One genuine miss, one genuine upside. ---------- */

export type DayKey = 0 | 3 | 7 | 14;
export const dayKeys: DayKey[] = [0, 3, 7, 14];
export const dayLabels: Record<DayKey, string> = {
  0: "Just applied",
  3: "3 days later",
  7: "7 days later",
  14: "14 days later",
};

export type Outcome = {
  status: "tracking" | "hit" | "miss" | "better";
  note: string;
  /** Rendered only when Zavi promised a number for this move. */
  against?: string;
};

export const outcomes: Record<number, Record<DayKey, Outcome>> = {
  1: {
    0: { status: "tracking", note: "Switched off. Spend on this ad set is now $0." },
    3: { status: "hit", note: "$252 not spent so far.", against: "On track for the $588 a week." },
    7: { status: "hit", note: "$588 freed, exactly as estimated.", against: "Met." },
    14: { status: "hit", note: "$1,176 freed over two weeks.", against: "Met, twice." },
  },
  2: {
    0: { status: "tracking", note: "Exclusion applied to all 3 prospecting ad sets." },
    3: {
      status: "tracking",
      note: "The buyer list is still refreshing, so savings look smaller than they will settle at.",
    },
    7: {
      status: "hit",
      note: "$198 saved against the $210 estimated. Cost per sale moved $14.00 to $12.41.",
      against: "Close enough to call met.",
    },
    14: {
      status: "hit",
      note: "$412 saved over two weeks, sales held at 126.",
      against: "Met.",
    },
  },
  3: {
    0: { status: "tracking", note: "Budget set to $180 a day." },
    3: {
      status: "tracking",
      note: "Meta is re-learning after the change, so the first days read worse than they will settle at. Cost per sale $11.40.",
    },
    7: {
      status: "hit",
      note: "34 extra sales at $11.10 each. Cost per sale rose from $10.00 as expected.",
      against: "Inside the 30 to 40 promised, at the higher end of the cost estimate.",
    },
    14: {
      status: "hit",
      note: "71 extra sales over two weeks at $11.35 each. Return holding at $2.88 per $1, down from $3.09.",
      against: "Met, though the return per $1 is lower than before the raise.",
    },
  },
  4: {
    0: { status: "tracking", note: "New images live. Learning has restarted." },
    3: {
      status: "tracking",
      note: "Unstable, as warned. Cost per sale $23, worse than the $20 it started at.",
    },
    7: {
      status: "miss",
      note: "Learning finished and it did not recover. Clicks barely moved and cost per sale is $21, worse than before the swap.",
      against:
        "Zavi did not forecast sales here, and was right not to. The picture was not the problem.",
    },
    14: {
      status: "miss",
      note: "Still $21 a sale. This ad set has the same problem as the one you switched off in move 1.",
      against: "Zavi's call now: pause it, the way you paused the cart-abandoner ad.",
    },
  },
  5: {
    0: { status: "tracking", note: "Advantage+ placements on. Pacing 71%." },
    3: { status: "tracking", note: "Pacing 94%. Too early to judge cost per sale." },
    7: {
      status: "better",
      note: "Pacing 97% and cost per sale fell to $26 from $30. Reels is carrying most of the new delivery.",
      against: "Better than expected. Zavi declined to forecast this one and was too pessimistic.",
    },
    14: {
      status: "better",
      note: "Cost per sale steady at $25. Confidence on this ad set moves from Not enough data yet to Early signal.",
      against: "The label was right to be cautious, and is now updated.",
    },
  },
};
