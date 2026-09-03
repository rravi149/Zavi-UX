export type OnboardingStep = { id: string; title: string; detail: string };
export type OnboardingGroup = {
  id: string;
  title: string;
  steps: OnboardingStep[];
};

const teachDetail = "Every agent reads this before it proposes work";

export const onboardingGroups: OnboardingGroup[] = [
  {
    id: "data",
    title: "Connect your data",
    steps: [
      {
        id: "data-source",
        title: "Connect a data source",
        detail:
          "Slack, GitHub, Meta Ads, your database — agents read from these",
      },
    ],
  },
  {
    id: "teach",
    title: "Teach Zavi your business",
    steps: [
      { id: "company", title: "Company", detail: teachDetail },
      { id: "ops", title: "Ops", detail: teachDetail },
      { id: "policies", title: "Policies", detail: teachDetail },
      { id: "disputes", title: "Disputes", detail: teachDetail },
      { id: "support", title: "Support", detail: teachDetail },
      { id: "product", title: "Product", detail: teachDetail },
      { id: "gtm-growth", title: "Gtm growth", detail: teachDetail },
      { id: "engineering", title: "Engineering", detail: teachDetail },
      { id: "team-roles", title: "Team roles", detail: teachDetail },
      { id: "metrics", title: "Metrics north star", detail: teachDetail },
    ],
  },
  {
    id: "work",
    title: "Put the team to work",
    steps: [
      {
        id: "first-agent",
        title: "Run your first agent",
        detail: "Ask Zavi for anything — it routes to the right specialist",
      },
      {
        id: "first-action",
        title: "Approve your first action",
        detail: "Agents propose; nothing ships until you say so",
      },
    ],
  },
];

export const onboardingSteps = onboardingGroups.flatMap((group) => group.steps);

export const initialOnboardingDone = [
  "data-source",
  "company",
  "ops",
  "policies",
  "disputes",
  "support",
  "first-agent",
  "first-action",
];
