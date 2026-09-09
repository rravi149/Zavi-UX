/**
 * Option 3, "goal-linked, top-down".
 *
 * Same five Meta recommendations and the same underlying numbers as Option 1
 * and Option 2 (see ../dashboard/_components/plainCopy.ts and ChannelPanel.tsx,
 * the "meta-ads" block). Nothing here changes what Zavi found or what it is
 * proposing. What changes is the frame: instead of five disconnected cards,
 * everything ladders up to the one number the founder actually set.
 *
 * The goal itself (340 -> 500 sales a week) and the gap math around it are
 * derived framing, not underlying ad data: it is the account-wide sales rate,
 * of which the five flagged ad sets below are only a part. That is deliberate,
 * it is what lets Zavi be honest that these five moves do not close the whole
 * gap, without needing to force five different reporting windows into one
 * fake precise total.
 */

export type Confidence = "confirmed" | "early-signal" | "too-new";

export type EvidenceRow = {
  label: string;
  value: string;
  note?: string;
  tone?: "good" | "bad";
};

export type Alternative = {
  option: string;
  reason: string;
};

export type FollowUpStatus = "collecting" | "on-track" | "mixed" | "miss";

export type FollowUpPoint = {
  day: number;
  label: string;
  status: FollowUpStatus;
  note: string;
  metrics?: { label: string; value: string }[];
};

export type Move = {
  id: number;
  actionVerb: string;
  title: string;
  oneLiner: string;
  ladder: string;
  goalContribution: string;
  confidence: Confidence;
  confidenceLabel: string;
  risk: string;
  doNothing: string;
  alternatives: Alternative[];
  plan: string[];
  evidence: EvidenceRow[];
  trend?: { label: string; before: string; after: string };
  impactPeriod: { before: { range: string; note: string }; after: { range: string; note: string } };
  creative: { image: string; caption: string; kind: "image" | "video" };
  undo: string;
  checkInDays: number;
  followUp: FollowUpPoint[];
};

export const goal = {
  eyebrow: "Your goal",
  title: "Grow weekly online sales",
  current: 340,
  target: 500,
  unit: "sales a week",
  gap: 160,
  setNote: "Set Aug 1, for the end of this quarter. This is the account-wide rate across every Meta ad, not just the five below.",
};

export const alert = {
  time: "2 minutes ago",
  title: "5 changes ready for your review",
  body: "Zavi went looking for what's holding back your 500-sales goal on Meta. One confirmed win, one budget swap that pays for it, two efficiency fixes, and two bets it's still not sure about.",
};

export const moves: Move[] = [
  {
    id: 1,
    actionVerb: "Turn it off",
    title: "Turn off the ad that stopped paying for itself",
    oneLiner:
      "This ad now costs $19.60 a sale, against $8.21 everywhere else in your account.",
    ladder:
      "This ad's cost per sale has more than doubled. Leaving it on doesn't just waste money, it holds back the budget that funds move 2, the one confirmed win this week.",
    goalContribution: "Frees $85 a day, funds move 2",
    confidence: "confirmed",
    confidenceLabel: "Strong evidence",
    risk:
      "Low. Turning it off only stops it showing. The ad, its audience, and its history stay saved, and you can turn it back on any time.",
    doNothing:
      "It keeps spending about $85 a day at 2.4 times your normal cost per sale.",
    alternatives: [
      {
        option: "Lower its budget instead of turning it off",
        reason:
          "That keeps the same bad rate, just slower. At $19.60 a sale it's already worse than doing nothing with that money.",
      },
      {
        option: "Leave it running since it's \"only\" $85 a day",
        reason:
          "$85 a day sounds small until you see it's buying sales at more than double what the rest of the account pays.",
      },
    ],
    plan: [
      "Turn this ad off so it stops spending today",
      "Move its $85 a day to move 2, the ad bringing in the cheapest sales",
      "Check again in 3 days before removing it for good",
    ],
    evidence: [
      { label: "Money this ad spent", value: "$588", note: "Sep 1–7" },
      { label: "Sales it brought in", value: "30" },
      { label: "Cost per sale, before and now", value: "$8.21 → $19.60", note: "2.4x higher than the week before", tone: "bad" },
      { label: "What your other ads manage", value: "$8.21", note: "average cost per sale" },
      { label: "Worked out from", value: "4 weeks of this ad's results" },
    ],
    trend: { label: "Cost per sale", before: "$8.21", after: "$19.60" },
    impactPeriod: {
      before: { range: "Sep 1–7", note: "If you leave it running" },
      after: { range: "Sep 8–14", note: "If you turn it off" },
    },
    creative: {
      image: "https://picsum.photos/seed/zavi-cart-abandoners/200/200",
      caption: "Abandoned basket reminder, picture ad",
      kind: "image",
    },
    undo: "Turn the ad back on from this screen or from your Facebook ads account.",
    checkInDays: 3,
    followUp: [
      {
        day: 3,
        label: "3 days later",
        status: "on-track",
        note: "Staying off. Its $85 a day is now funding move 2 below.",
      },
      {
        day: 7,
        label: "7 days later",
        status: "on-track",
        note: "Still off. No sales lost that weren't already costing you money to make.",
      },
      {
        day: 14,
        label: "14 days later",
        status: "on-track",
        note: "Archived for good, as planned. Nothing changed since day 7.",
      },
    ],
  },
  {
    id: 2,
    actionVerb: "Raise the budget",
    title: "Put more money behind your best ad",
    oneLiner:
      "Every $1 this ad spends comes back as $3.09, and it runs out of budget early every day.",
    ladder:
      "This is the ad already proving itself. Give it the $60 a day it's short (funded by move 1, with $25 a day left over) and it's the single biggest lever toward your goal this week.",
    goalContribution: "+30 to 40 sales a week, confirmed",
    confidence: "confirmed",
    confidenceLabel: "Strong evidence",
    risk:
      "Low. This ad has held a steady cost per sale since Aug 25, the rise is capped, and Zavi watches it daily.",
    doNothing:
      "It keeps hitting its daily cap and turning away buyers it could otherwise reach.",
    alternatives: [
      {
        option: "Split the extra $60 a day across several ads",
        reason:
          "This is the one ad with proven headroom, it hits its cap daily. Spreading the money thin would dilute the only lever that's clearly working.",
      },
      {
        option: "Raise it further, to $240 a day",
        reason:
          "Zavi wants 3 clean days of data at $180 first, so it can catch a problem before pushing further.",
      },
    ],
    plan: [
      "Raise this ad's daily budget from $120 to $180",
      "Watch the cost per sale for 3 days",
      "Drop it back to $120 on its own if a sale starts costing over $12",
    ],
    evidence: [
      { label: "Money this ad spent", value: "$1,680", note: "Aug 25 – Sep 7" },
      { label: "Sales it brought in", value: "168" },
      { label: "Money back per $1 spent", value: "$3.09", note: "steady since Aug 25", tone: "good" },
      { label: "Why it stops early", value: "It hits its daily limit", note: "not a shortage of people to reach" },
      { label: "Worked out from", value: "3 times you raised a budget before", note: "on this account" },
    ],
    trend: { label: "Daily budget", before: "$120", after: "$180" },
    impactPeriod: {
      before: { range: "Aug 25 – Sep 7", note: "At $120 a day" },
      after: { range: "Sep 8–21", note: "At $180 a day" },
    },
    creative: {
      image: "https://picsum.photos/seed/zavi-acquisition-prospecting/200/200",
      caption: "New customer ad, picture ad",
      kind: "image",
    },
    undo: "Set the daily amount back to $120 from this screen or your Facebook ads account.",
    checkInDays: 3,
    followUp: [
      {
        day: 3,
        label: "3 days later",
        status: "on-track",
        note: "Early read looks right: cost per sale is $10.80, still well under the $12 cap.",
      },
      {
        day: 7,
        label: "7 days later",
        status: "on-track",
        note: "On track. 34 more sales this week at $11.20 each.",
        metrics: [
          { label: "Extra sales this week", value: "+34" },
          { label: "Cost per sale", value: "$11.20" },
        ],
      },
      {
        day: 14,
        label: "14 days later",
        status: "on-track",
        note: "Held steady into the second week, same range.",
      },
    ],
  },
  {
    id: 3,
    actionVerb: "Use new pictures",
    title: "Swap in fresh pictures for a tired ad",
    oneLiner:
      "The same people have now seen this ad 4.2 times each, and clicks are down 38%.",
    ladder:
      "This ad's audience is worn out on the picture, not the offer. New pictures could double its clicks, which would meaningfully close more of the gap, but that's not proven yet, this is a bet, not a confirmed number.",
    goalContribution: "Up to +15 sales a week, if it works",
    confidence: "early-signal",
    confidenceLabel: "Early signal",
    risk:
      "Low. Same people, same budget, same places. Only the picture changes, though new creative does restart the ad's learning phase for a few days.",
    doNothing:
      "Clicks keep falling as the same audience keeps seeing the same picture.",
    alternatives: [
      {
        option: "Turn the ad off since clicks fell 38%",
        reason:
          "The audience and price point still convert, it's the picture that's stale, not the offer. Cutting it would waste a working audience.",
      },
      {
        option: "Test only 1 new picture",
        reason:
          "Testing 3 gives Zavi a real read on which style works, not just whether change helps at all.",
      },
    ],
    plan: [
      "Put 3 new versions of the picture into this ad",
      "Keep the same people, budget and placements",
      "Watch the clicks for 5 days",
    ],
    evidence: [
      { label: "Money this ad spent", value: "$1,240", note: "Aug 9 – Sep 7" },
      { label: "Sales it brought in", value: "62" },
      { label: "Times each person saw it", value: "4.2", note: "was 2.1 on Aug 17", tone: "bad" },
      { label: "Share of people who clicked", value: "1.00% → 0.62%", note: "week of Aug 25 against week of Sep 1", tone: "bad" },
      { label: "Worked out from", value: "4 times you refreshed pictures before", note: "on this account" },
    ],
    trend: { label: "Click rate", before: "1.00%", after: "0.62%" },
    impactPeriod: {
      before: { range: "Aug 9 – Sep 7", note: "Current pictures" },
      after: { range: "Sep 8 – Oct 7", note: "New pictures" },
    },
    creative: {
      image: "https://picsum.photos/seed/zavi-winback-carousel/200/200",
      caption: "\"Still thinking about it?\" video ad",
      kind: "video",
    },
    undo: "Switch the new pictures off and bring the old one back from this screen.",
    checkInDays: 5,
    followUp: [
      {
        day: 3,
        label: "3 days later",
        status: "collecting",
        note: "Too early. New pictures are still in their learning phase.",
      },
      {
        day: 7,
        label: "7 days later",
        status: "mixed",
        note: "Mixed. Clicks improved to 0.85% (was 0.62%), short of the 2x Zavi hoped for. Sales ticked up too, about 4 more a week, still better than the tired picture it replaced, just a smaller win than the bet.",
        metrics: [
          { label: "Click rate now", value: "0.85%" },
          { label: "Extra sales this week", value: "+4" },
        ],
      },
      {
        day: 14,
        label: "14 days later",
        status: "mixed",
        note: "Held at the same modest lift. Zavi wants to try a different angle next round rather than call this one a win.",
      },
    ],
  },
  {
    id: 4,
    actionVerb: "Leave them out",
    title: "Stop paying to reach people who already bought",
    oneLiner:
      "12% of the money aimed at new customers is reaching people who bought in the last 30 days.",
    ladder:
      "This doesn't add sales by itself, it recovers money that was buying nothing. That money banks as fuel for whichever bet above is working, once this round proves out.",
    goalContribution: "Recovers ~$210 a week, no sales added",
    confidence: "confirmed",
    confidenceLabel: "Strong evidence",
    risk:
      "Low. Your ads aimed at past buyers are untouched. Only the new customer ads change, and the buyer list is a snapshot so it may miss a handful of genuine repeat shoppers for a few days until it refreshes.",
    doNothing:
      "About $210 a week keeps going to people who already bought.",
    alternatives: [
      {
        option: "Exclude past buyers account-wide, not just new-customer ads",
        reason:
          "Past buyers still deserve to see your winback and retention ads. Only the new-customer ads need the exclusion.",
      },
      {
        option: "Lower those ads' budget instead of excluding this audience",
        reason:
          "That would cut reach to genuine new customers too, not just the wasted 12%.",
      },
    ],
    plan: [
      "Leave anyone who bought in the last 30 days out of your new customer ads",
      "Keep everything else exactly as it is",
      "Check the saving after a week",
    ],
    evidence: [
      { label: "Money these ads spent", value: "$1,750", note: "Sep 1–7, across 3 ads" },
      { label: "Money reaching past buyers", value: "12%", note: "of your new customer budget" },
      { label: "People seeing ads twice", value: "12%", note: "already bought Aug 9 – Sep 7" },
      { label: "Ads affected", value: "3", note: "all your new customer ads" },
      { label: "Worked out from", value: "Purchases recorded on your website" },
    ],
    trend: { label: "Wasted each week", before: "$210", after: "$0" },
    impactPeriod: {
      before: { range: "Sep 1–7", note: "Everyone included" },
      after: { range: "Sep 8–14", note: "Recent buyers left out" },
    },
    creative: {
      image: "https://picsum.photos/seed/zavi-prospecting-exclusion/200/200",
      caption: "New customer ads, audience change",
      kind: "image",
    },
    undo: "Remove the exclusion from this screen or your Facebook ads account.",
    checkInDays: 7,
    followUp: [
      {
        day: 3,
        label: "3 days later",
        status: "collecting",
        note: "Too early to call, waiting for the full week.",
      },
      {
        day: 7,
        label: "7 days later",
        status: "on-track",
        note: "Confirmed: $205 a week recovered, within a few dollars of the $210 estimate.",
        metrics: [{ label: "Weekly savings", value: "$205" }],
      },
      {
        day: 14,
        label: "14 days later",
        status: "on-track",
        note: "Same saving held into week two.",
      },
    ],
  },
  {
    id: 5,
    actionVerb: "Open up the spots",
    title: "Let Facebook show this ad in more places",
    oneLiner:
      "It only runs in 2 of 6 available places, so it spends 60% of the budget you set.",
    ladder:
      "This one is the riskiest of the five. It could add reach and sales, but the ad only started Sep 3, so Zavi genuinely can't size the upside yet. Treat any number here as a guess, not a plan.",
    goalContribution: "Not sized, too new to call",
    confidence: "too-new",
    confidenceLabel: "Not enough data yet",
    risk:
      "Medium. The ad has only been running since Sep 3, so there isn't much history to judge it on yet, and cost per sale could rise once it competes for space in Stories and Reels.",
    doNothing:
      "This new ad keeps sitting at 60% delivery, so you won't know if the concept works at all before the promo window closes.",
    alternatives: [
      {
        option: "Wait another week for more data before touching it",
        reason:
          "Seriously considered, this is the one recommendation Zavi is least sure about. But waiting means the promo ad barely gets tested before its window closes.",
      },
      {
        option: "Open just 1 or 2 more placements instead of all 6",
        reason:
          "Facebook's own delivery estimate says full placements is the fastest way to actually learn whether this ad works, a half-step just delays the answer.",
      },
    ],
    plan: [
      "Let Facebook pick where to show this ad",
      "Keep the same budget and bidding",
      "Compare the results after 5 days",
    ],
    evidence: [
      { label: "Money this ad spent", value: "$600", note: "Sep 3–7, started Sep 3" },
      { label: "Sales it brought in", value: "20" },
      { label: "Budget actually used", value: "60%", note: "the rest goes unspent each day", tone: "bad" },
      { label: "Places it can appear", value: "2 of 6", note: "main feed and Stories only" },
      { label: "Worked out from", value: "Facebook's own suggestion" },
    ],
    trend: { label: "Budget actually used", before: "60%", after: "95–100%" },
    impactPeriod: {
      before: { range: "Sep 3–7", note: "2 of 6 places" },
      after: { range: "Sep 8–12", note: "All 6 places" },
    },
    creative: {
      image: "https://picsum.photos/seed/zavi-launch-q4-promo/200/200",
      caption: "Q4 promotion, video ad",
      kind: "video",
    },
    undo: "Go back to choosing the places yourself from your Facebook ads account.",
    checkInDays: 5,
    followUp: [
      {
        day: 3,
        label: "3 days later",
        status: "collecting",
        note: "Too early, still filling out delivery across the new places.",
      },
      {
        day: 7,
        label: "7 days later",
        status: "miss",
        note: "Didn't pay off. Delivery is fixed, using 98% of budget now, but cost per sale rose to $34, worse than the $30 it was already running. Zavi's recommending a rollback to the 2 places that were converting, and a fresh creative test instead of more placements.",
        metrics: [
          { label: "Budget used now", value: "98%" },
          { label: "Cost per sale", value: "$34" },
        ],
      },
      {
        day: 14,
        label: "14 days later",
        status: "miss",
        note: "Rolled back per Zavi's recommendation. Cost per sale returned to $30 in the original 2 places.",
      },
    ],
  },
];

/** Sum of what's already quantified as an upside, kept separate from move 5's unsized bet. */
export const bestCaseWeeklyAdd = { low: 45, high: 55 };
export const confirmedWeeklyAdd = { low: 30, high: 40 };
export const reclaimedWeeklyBudget = 385; // $175 left from move 1's $85/day, plus move 4's $210/week

/**
 * Actual extra sales a week, once real data lands (move 2's +34 at day 7, plus move 3's
 * mixed +4). Move 5 nets to zero once it's rolled back on day 14. Used by the follow-up
 * screen to move the goal header's "now" number with real results, not the plan's estimate.
 */
export const actualWeeklyAddByDay: Record<number, number> = {
  0: 0,
  3: 0,
  7: 38,
  14: 38,
};

export const timeSteps = [
  { day: 0, label: "Just now" },
  { day: 3, label: "+3 days" },
  { day: 7, label: "+7 days" },
  { day: 14, label: "+14 days" },
] as const;
