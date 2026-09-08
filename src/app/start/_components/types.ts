export type Competitor = {
  id: string;
  name: string;
  domain: string;
};

export type Integration = {
  id: string;
  name: string;
  description: string;
};

export type FocusAreaId =
  | "growth"
  | "leads"
  | "revenue"
  | "acquisition"
  | "retention"
  | "brand"
  | "expansion"
  | "other";

export type OnboardingData = {
  companyWebsite: string;
  companyName: string;
  description: string;
  focusAreas: FocusAreaId[];
  primaryGoal: FocusAreaId | null;
  competitors: Competitor[];
  connectedIntegrations: string[];
  teamEmails: string[];
};

export const emptyOnboardingData: OnboardingData = {
  companyWebsite: "",
  companyName: "",
  description: "",
  focusAreas: [],
  primaryGoal: null,
  competitors: [],
  connectedIntegrations: [],
  teamEmails: [],
};
