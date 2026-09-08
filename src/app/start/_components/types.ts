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

/** Which path the person picked on the very first screen. */
export type StartMode = "grow" | "build";

export type OnboardingData = {
  mode: StartMode | null;
  idea: string;
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
  mode: null,
  idea: "",
  companyWebsite: "",
  companyName: "",
  description: "",
  focusAreas: [],
  primaryGoal: null,
  competitors: [],
  connectedIntegrations: [],
  teamEmails: [],
};
