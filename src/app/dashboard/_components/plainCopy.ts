import type { ApprovalReview } from "./types";

export type CopyOptionId = "direct" | "conversational";

export type CopyOption = {
  id: CopyOptionId;
  label: string;
  hint: string;
  /** "full" shows the reasoning and the evidence table. "light" shows only the headline numbers. */
  density: "full" | "light";
};

/**
 * Two jargon-free wordings of the same five Meta recommendations, written for a
 * shop owner who has never heard of an ad set, ROAS, CPM or link CTR.
 * The recommendations themselves, and every number behind them, stay identical.
 */
export const copyOptions: CopyOption[] = [
  {
    id: "direct",
    label: "Option 1 · Straight talk",
    hint: "Says what the money is doing and what to change, with the workings shown.",
    density: "full",
  },
  {
    id: "conversational",
    label: "Option 2 · Ask me first",
    hint: "Just the question and the one number that matters. Tap through for the rest.",
    density: "light",
  },
];

type EvidenceCopy = { label?: string; value?: string; note?: string };

export type ItemCopy = {
  title: string;
  /** Short verb for the approve button. Keeps the CTA from repeating the title. */
  actionLabel: string;
  detail: string;
  why: string;
  plan: string[];
  outcome: string;
  risk: string;
  undo: string;
  trendLabel?: string;
  creativeCaption?: string;
  confidence?: string;
  resultNoun?: string;
  impactLabels?: string[];
  impactPeriod?: ApprovalReview["impactPeriod"];
  evidence?: EvidenceCopy[];
  sources?: string[];
};

export const channelHeadline: Record<CopyOptionId, string> = {
  direct:
    "5 changes ready. Together they take about $85 a day off an ad that stopped selling and should bring in 30 to 40 more sales a week.",
  conversational:
    "Zavi found 5 things worth changing this week. Approve them all and you free up about $85 a day and pick up roughly 30 to 40 extra sales a week.",
};

export const metaItemCopy: Record<CopyOptionId, Record<number, ItemCopy>> = {
  direct: {
    1: {
      title: "Turn off an ad that stopped paying for itself",
      actionLabel: "Turn it off",
      detail:
        "Each sale from this ad now costs $19.60, against $8.21 everywhere else",
      why: "This ad is live and spending your money right now. Zavi will not switch anything off until you say yes.",
      plan: [
        "Switch this ad off so it stops spending today",
        "Move its $85 a day to the ad bringing in the cheapest sales",
        "Check again in 3 days before removing it for good",
      ],
      outcome: "Frees up $85 a day for the ads that are working",
      risk: "Low. Switching it off only stops it showing. The ad, its audience and its history stay saved and you can turn it back on whenever you like.",
      undo: "Turn the ad back on from this panel or from your Facebook ads account.",
      trendLabel: "Cost per sale",
      creativeCaption: "Abandoned basket reminder, picture ad",
      confidence: "Strong evidence",
      resultNoun: "sales",
      impactLabels: ["Money spent", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Sep 1–7", note: "If you leave it running" },
        after: { range: "Sep 8–14", note: "If you switch it off" },
      },
      evidence: [
        { label: "Money this ad spent", note: "Sep 1–7" },
        { label: "Sales it brought in" },
        {
          label: "Cost per sale, before and now",
          note: "2.4 times higher than the week before",
        },
        { label: "What your other ads manage", note: "average cost per sale" },
        { label: "Worked out from", value: "4 weeks of this ad's results" },
      ],
      sources: ["Your Facebook ads account (Sep 1–7)", "Your average cost per sale"],
    },
    2: {
      title: "Put more money behind your best ad",
      actionLabel: "Raise the budget",
      detail:
        "Every $1 this ad spends comes back as $3.09, and it runs out of budget early each day",
      why: "This raises what you spend each day on Facebook and Instagram, so Zavi needs your OK before changing it.",
      plan: [
        "Raise this ad's daily spend from $120 to $180",
        "Watch the cost per sale for 3 days",
        "Drop it back to $120 on its own if a sale starts costing over $12",
      ],
      outcome: "Around 30 to 40 more sales a week, with each sale still under $12",
      risk: "Low. This ad has held a steady cost per sale since Aug 25, the rise is capped, and Zavi watches it daily.",
      undo: "Set the daily amount back to $120 from this panel or your Facebook ads account.",
      trendLabel: "Daily spend",
      creativeCaption: "New customer ad, picture ad",
      confidence: "Strong evidence",
      resultNoun: "sales",
      impactLabels: ["Money spent", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Aug 25 – Sep 7", note: "At $120 a day" },
        after: { range: "Sep 8–21", note: "At $180 a day" },
      },
      evidence: [
        { label: "Money this ad spent", note: "Aug 25 – Sep 7" },
        { label: "Sales it brought in" },
        {
          label: "Money back per $1 spent",
          value: "$3.09",
          note: "steady since Aug 25",
        },
        {
          label: "Why it stops early",
          value: "It hits its daily limit",
          note: "not a shortage of people to reach",
        },
        {
          label: "Worked out from",
          value: "3 times you raised a budget before",
          note: "on this account",
        },
      ],
      sources: [
        "Your Facebook ads account (Aug 25 – Sep 7)",
        "How this ad spent its daily budget",
      ],
    },
    3: {
      title: "Swap in fresh pictures for a tired ad",
      actionLabel: "Use new pictures",
      detail:
        "The same people have now seen this ad 4.2 times each and clicks are down 38%",
      why: "New pictures go live on Facebook and Instagram straight away, so Zavi prepares them and waits for your OK.",
      plan: [
        "Put 3 new versions of the picture into this ad",
        "Keep the same people, budget and placements",
        "Watch the clicks for 5 days",
      ],
      outcome: "Up to twice as many clicks",
      risk: "Low. Same people, same budget, same places. Only the picture changes.",
      undo: "Switch the new pictures off and bring the old one back from this panel.",
      trendLabel: "Click rate",
      creativeCaption: "\"Still thinking about it?\" video ad",
      confidence: "Early signal",
      resultNoun: "sales",
      impactLabels: ["Money spent", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Aug 9 – Sep 7", note: "Current pictures" },
        after: { range: "Sep 8 – Oct 7", note: "New pictures" },
      },
      evidence: [
        { label: "Money this ad spent", note: "Aug 9 – Sep 7" },
        { label: "Sales it brought in" },
        {
          label: "Times each person saw it",
          value: "4.2",
          note: "was 2.1 on Aug 17",
        },
        {
          label: "Share of people who clicked",
          value: "1.00% → 0.62%",
          note: "week of Aug 25 against week of Sep 1",
        },
        {
          label: "Worked out from",
          value: "4 times you refreshed pictures before",
          note: "on this account",
        },
      ],
      sources: [
        "Your Facebook ads account (Aug 9 – Sep 7)",
        "How often people see and click this ad",
      ],
    },
    4: {
      title: "Stop paying to reach people who already bought",
      actionLabel: "Leave them out",
      detail:
        "12% of the money aimed at new customers is reaching people who bought in the last 30 days",
      why: "This changes who sees your ads on Facebook and Instagram, so Zavi checks with you before saving it.",
      plan: [
        "Leave anyone who bought in the last 30 days out of your new customer ads",
        "Keep everything else exactly as it is",
        "Check the saving after a week",
      ],
      outcome: "Saves about $210 a week",
      risk: "Low. Your ads aimed at past buyers are untouched. Only the new customer ads change.",
      undo: "Remove the exclusion from this panel or your Facebook ads account.",
      trendLabel: "Wasted each week",
      creativeCaption: "New customer ads, audience change",
      confidence: "Early signal",
      resultNoun: "sales",
      impactLabels: ["Money spent", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Sep 1–7", note: "Everyone included" },
        after: { range: "Sep 8–14", note: "Recent buyers left out" },
      },
      evidence: [
        { label: "Money these ads spent", note: "Sep 1–7, across 3 ads" },
        {
          label: "Money reaching past buyers",
          note: "12% of your new customer budget",
        },
        {
          label: "People seeing ads twice",
          value: "12%",
          note: "already bought Aug 9 – Sep 7",
        },
        { label: "Ads affected", value: "3", note: "all your new customer ads" },
        {
          label: "Worked out from",
          value: "Purchases recorded on your website",
        },
      ],
      sources: [
        "Your Facebook ads account (Sep 1–7)",
        "Purchases recorded on your website",
      ],
    },
    5: {
      title: "Let Facebook show this ad in more places",
      actionLabel: "Open up the spots",
      detail:
        "It only runs in 2 of the 6 available places, so it spends 60% of the budget you set",
      why: "This changes where your ad can appear, such as Instagram Stories and Reels, so Zavi asks first.",
      plan: [
        "Let Facebook pick where to show this ad",
        "Keep the same budget and bidding",
        "Compare the results after 5 days",
      ],
      outcome: "Your whole budget gets used and more people see the ad",
      risk: "Medium. The ad has only been running since Sep 3, so there is not much history to judge it on yet.",
      undo: "Go back to choosing the places yourself from your Facebook ads account.",
      trendLabel: "Budget actually used",
      creativeCaption: "Q4 promotion, video ad",
      confidence: "Not enough data yet",
      resultNoun: "sales",
      impactLabels: ["Money spent", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Sep 3–7", note: "2 of 6 places" },
        after: { range: "Sep 8–12", note: "All 6 places" },
      },
      evidence: [
        { label: "Money this ad spent", note: "Sep 3–7, started Sep 3" },
        { label: "Sales it brought in" },
        {
          label: "Budget actually used",
          value: "60%",
          note: "the rest goes unspent each day",
        },
        {
          label: "Places it can appear",
          value: "2 of 6",
          note: "main feed and Stories only",
        },
        { label: "Worked out from", value: "Facebook's own suggestion" },
      ],
      sources: [
        "Your Facebook ads account (Sep 3–7)",
        "Facebook's placement suggestion",
      ],
    },
  },

  conversational: {
    1: {
      title: "One ad is eating $85 a day. Switch it off?",
      actionLabel: "Switch it off",
      detail:
        "Sales from this ad cost $19.60 each right now. The rest of your ads manage $8.21.",
      why: "It is running and spending as you read this. Nothing gets switched off until you press the button.",
      plan: [
        "Pause it, so it stops spending today",
        "Move that $85 a day behind your best-selling ad instead",
        "Take another look in 3 days before deleting it",
      ],
      outcome: "$85 a day back for ads that actually sell",
      risk: "Very little. Pausing just hides the ad. Everything about it is saved, and you can bring it back any time.",
      undo: "Bring it back with one click here, or from your Facebook ads account.",
      trendLabel: "What one sale costs you",
      creativeCaption: "Abandoned basket reminder, picture ad",
      confidence: "We are confident",
      resultNoun: "sales",
      impactLabels: ["What you spend", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Sep 1–7", note: "Leave it as it is" },
        after: { range: "Sep 8–14", note: "Switch it off" },
      },
      evidence: [
        { label: "What this ad cost you", note: "Sep 1–7" },
        { label: "What it sold" },
        {
          label: "Cost per sale then, and now",
          note: "that is 2.4 times worse than last week",
        },
        { label: "What you normally pay", note: "for one sale" },
        { label: "We looked at", value: "the last 4 weeks of this ad" },
      ],
      sources: ["Your Facebook ads account (Sep 1–7)", "Your usual cost per sale"],
    },
    2: {
      title: "Your best ad runs out of money early. Give it more?",
      actionLabel: "Give it more",
      detail:
        "Every $1 here comes back as $3.09, but the ad stops each day once it hits its limit.",
      why: "Saying yes means spending more per day on Facebook and Instagram, so Zavi will not do it on its own.",
      plan: [
        "Move the daily amount from $120 up to $180",
        "Keep an eye on what a sale costs for 3 days",
        "Slide it back to $120 automatically if a sale goes over $12",
      ],
      outcome: "Roughly 30 to 40 extra sales a week, still under $12 each",
      risk: "Small. The cost per sale has not moved since Aug 25, the increase is capped, and it rolls back on its own if things slip.",
      undo: "Put it back to $120 whenever you want, here or in your Facebook ads account.",
      trendLabel: "What you spend a day",
      creativeCaption: "New customer ad, picture ad",
      confidence: "We are confident",
      resultNoun: "sales",
      impactLabels: ["What you spend", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Aug 25 – Sep 7", note: "Sticking at $120 a day" },
        after: { range: "Sep 8–21", note: "Moving to $180 a day" },
      },
      evidence: [
        { label: "What this ad cost you", note: "Aug 25 – Sep 7" },
        { label: "What it sold" },
        {
          label: "You get back, per $1",
          value: "$3.09",
          note: "and it has held steady",
        },
        {
          label: "Why it keeps stopping",
          value: "It runs out of budget",
          note: "not out of people",
        },
        {
          label: "We looked at",
          value: "3 budget rises you have made before",
        },
      ],
      sources: [
        "Your Facebook ads account (Aug 25 – Sep 7)",
        "How the daily budget gets used",
      ],
    },
    3: {
      title: "People are tired of this ad. Try new pictures?",
      actionLabel: "Try new pictures",
      detail:
        "Your audience has seen it 4.2 times each, and clicks have fallen 38%.",
      why: "New pictures appear on Facebook and Instagram right away, so Zavi has drafted them for you to look at first.",
      plan: [
        "Drop in 3 fresh versions of the picture",
        "Leave the audience, budget and placements alone",
        "See how the clicks look after 5 days",
      ],
      outcome: "Clicks could roughly double",
      risk: "Very little. Nothing about who sees it or what you spend changes. Only the picture.",
      undo: "Switch the new pictures off and put the old one back, in one click.",
      trendLabel: "How many people click",
      creativeCaption: "\"Still thinking about it?\" video ad",
      confidence: "Worth a try",
      resultNoun: "sales",
      impactLabels: ["What you spend", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Aug 9 – Sep 7", note: "Picture you have now" },
        after: { range: "Sep 8 – Oct 7", note: "Fresh pictures" },
      },
      evidence: [
        { label: "What this ad cost you", note: "Aug 9 – Sep 7" },
        { label: "What it sold" },
        {
          label: "How often one person sees it",
          value: "4.2 times",
          note: "it was 2.1 back on Aug 17",
        },
        {
          label: "How many click it",
          value: "1.00% → 0.62%",
          note: "week of Aug 25, then week of Sep 1",
        },
        {
          label: "We looked at",
          value: "4 picture refreshes you have done before",
        },
      ],
      sources: [
        "Your Facebook ads account (Aug 9 – Sep 7)",
        "How often people see and click this ad",
      ],
    },
    4: {
      title: "You are paying to reach people who already bought. Stop that?",
      actionLabel: "Stop that",
      detail:
        "About 12% of your new customer budget is landing on people who bought in the last month.",
      why: "This changes who your ads reach, so Zavi wants a yes from you before saving it.",
      plan: [
        "Leave last month's buyers out of the ads meant for new customers",
        "Change nothing else",
        "See what you saved after a week",
      ],
      outcome: "About $210 a week back in your pocket",
      risk: "Small. The ads that go to past buyers carry on exactly as they are.",
      undo: "Take the exclusion off again whenever you like.",
      trendLabel: "Wasted each week",
      creativeCaption: "New customer ads, audience change",
      confidence: "Worth a try",
      resultNoun: "sales",
      impactLabels: ["What you spend", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Sep 1–7", note: "As things stand" },
        after: { range: "Sep 8–14", note: "Recent buyers left out" },
      },
      evidence: [
        { label: "What these ads cost you", note: "Sep 1–7, three ads" },
        { label: "Going to people who already bought", note: "of that budget" },
        {
          label: "Share seeing it twice",
          value: "12%",
          note: "they bought between Aug 9 and Sep 7",
        },
        { label: "Ads this touches", value: "3", note: "your new customer ads" },
        { label: "We looked at", value: "Sales recorded on your website" },
      ],
      sources: [
        "Your Facebook ads account (Sep 1–7)",
        "Sales recorded on your website",
      ],
    },
    5: {
      title: "This ad cannot spend its budget. Open up more spots?",
      actionLabel: "Open it up",
      detail:
        "It only runs in 2 of 6 possible places, so it uses 60% of what you set aside.",
      why: "This lets your ad turn up in more spots, like Instagram Stories and Reels, so Zavi is checking first.",
      plan: [
        "Let Facebook decide where to show it",
        "Leave the budget and bidding as they are",
        "Compare how it did after 5 days",
      ],
      outcome: "The full budget gets spent and more people see it",
      risk: "Worth watching. This ad only started on Sep 3, so there is not much to go on yet.",
      undo: "Go back to picking the spots yourself at any time.",
      trendLabel: "Budget you actually use",
      creativeCaption: "Q4 promotion, video ad",
      confidence: "Too early to tell",
      resultNoun: "sales",
      impactLabels: ["What you spend", "Cost per sale", "Sales"],
      impactPeriod: {
        before: { range: "Sep 3–7", note: "Only 2 spots" },
        after: { range: "Sep 8–12", note: "All 6 spots" },
      },
      evidence: [
        { label: "What this ad cost you", note: "Sep 3–7, it started Sep 3" },
        { label: "What it sold" },
        {
          label: "Budget it manages to spend",
          value: "60%",
          note: "the rest sits unused",
        },
        {
          label: "Where it can show up",
          value: "2 of 6 spots",
          note: "main feed and Stories",
        },
        { label: "We looked at", value: "What Facebook itself suggests" },
      ],
      sources: [
        "Your Facebook ads account (Sep 3–7)",
        "Facebook's own suggestion",
      ],
    },
  },
};

type Item = {
  id: number;
  title: string;
  detail: string;
  taskId?: number;
  review: ApprovalReview;
};

/** Returns the item reworded for the chosen option. Numbers are untouched. */
export function applyCopy<T extends Item>(item: T, copy?: ItemCopy): T {
  if (!copy) return item;
  const review = item.review;

  return {
    ...item,
    title: copy.title,
    detail: copy.detail,
    review: {
      ...review,
      why: copy.why,
      plan: copy.plan,
      outcome: copy.outcome,
      risk: copy.risk,
      undo: copy.undo,
      resultNoun: copy.resultNoun ?? review.resultNoun,
      actionLabel: copy.actionLabel,
      impactPeriod: copy.impactPeriod ?? review.impactPeriod,
      sources: copy.sources ?? review.sources,
      creative: review.creative && {
        ...review.creative,
        caption: copy.creativeCaption ?? review.creative.caption,
      },
      trend: review.trend && {
        ...review.trend,
        label: copy.trendLabel ?? review.trend.label,
      },
      impact: review.impact.map((stat, index) => ({
        ...stat,
        label: copy.impactLabels?.[index] ?? stat.label,
      })),
      evidence: review.evidence && {
        ...review.evidence,
        confidence: copy.confidence ?? review.evidence.confidence,
        rows: review.evidence.rows.map((row, index) => {
          const override = copy.evidence?.[index];
          if (!override) return row;
          return {
            ...row,
            label: override.label ?? row.label,
            value: override.value ?? row.value,
            note: override.note ?? row.note,
          };
        }),
      },
    },
  };
}
