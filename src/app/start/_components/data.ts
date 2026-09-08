import type { FocusAreaId, Integration } from "./types";

export const focusAreaOptions: { id: FocusAreaId; label: string }[] = [
  { id: "growth", label: "Growth" },
  { id: "leads", label: "Leads" },
  { id: "revenue", label: "Revenue" },
  { id: "acquisition", label: "Customer acquisition" },
  { id: "retention", label: "Retention" },
  { id: "brand", label: "Brand awareness" },
  { id: "expansion", label: "Market expansion" },
  { id: "other", label: "Other" },
];

export const mockCompetitors = [
  { name: "NorthPeak Analytics", domain: "northpeak.io" },
  { name: "Bright Reach", domain: "brightreach.com" },
  { name: "Fieldnote", domain: "fieldnote.co" },
];

export const integrations: Integration[] = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Traffic, conversions, and audience behavior.",
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    description: "Search performance and indexing health.",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Contacts, deals, and marketing activity.",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Pipeline, opportunities, and account data.",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Bring Zavi into your team's conversations.",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Campaign spend and performance across Meta.",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Search and display campaign performance.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Company page activity and ad performance.",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Orders, products, and storefront analytics.",
  },
];

export const reportStats = [
  { label: "Your AI visibility", value: "Good", tone: "positive" as const },
  { label: "Growth opportunities", value: "12 found", tone: "neutral" as const },
  { label: "Competitors analyzed", value: "6", tone: "neutral" as const },
];

export const reportSections = [
  {
    title: "Search presence",
    detail:
      "You rank for a handful of branded terms but have little coverage on the questions your buyers actually ask.",
  },
  {
    title: "Competitor comparison",
    detail:
      "Competitors publish 3x more comparison and how-to content, which is where most of the category's search volume sits.",
  },
  {
    title: "Recommended actions",
    detail:
      "Close the content gap on your top 5 missing keywords, then extend into AI-answer visibility once the base is covered.",
  },
];
