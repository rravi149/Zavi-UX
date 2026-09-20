/* The simulated enrichment result, lifted from the researched wireframe at
   docs/wireframes/typesafe-ux/parts/20-onboarding.js and re-verified against
   praxis origin/main @ 8b3489333.

   The step list is the eight reads the real enrichment actually performs.
   The field names are the real StartEnrichment envelope
   (apps/web/src/app/start/page.tsx:59-77): domain_pages, app_listings,
   research_pages, competitors, description, company_name, inferredShape,
   inferredStage, shapeConfidence.

   Every company below is fictional and every outcome is invented demo data.
   No real company is described, and no metric about Zavi is claimed. */

export type Outcome = "ok" | "warn" | "skip";

export type ScanStep = {
  key: string;
  label: string;
  detail: string;
  src: string;
};

export type Competitor = {
  name: string;
  url: string;
  source_title: string;
};

export type BlindSpot = {
  what: string;
  why: string;
  impact: string;
  src: string;
};

export type Found = {
  company_name: string;
  description: string;
  inferredShape: string;
  inferredStage: number;
  shapeConfidence: "high" | "low";
  icp: string;
  domain_pages: number;
  app_listings: number;
  research_pages: number;
  competitors: Competitor[];
  cannot_see: BlindSpot[];
  /** Which fields the visitor corrected by hand. */
  edited: Record<string, boolean>;
};

export type Fixture = {
  outcomes: Record<string, [Outcome, string]>;
  found: Found;
};

/** The eight reads, named from the code that runs them. */
export const SCAN_STEPS: ScanStep[] = [
  {
    key: "resolve",
    label: "Resolve the domain",
    detail:
      "Tavily search plus a domain-match guard. A failed match returns status skipped, with a reason, never a 502.",
    src: "apps/backend/src/routes/onboarding/enrich.ts:22, services/onboarding/enrichment/domain-match.ts",
  },
  {
    key: "fixed",
    label: "Fetch the 13 fixed paths",
    detail:
      "/ /about /about-us /pricing /faq /help /help-center /support /contact /terms /privacy /refunds /policies/refund-policy",
    src: "apps/backend/src/services/onboarding/enrichment/discover.ts:349",
  },
  {
    key: "discover",
    label: "Discover up to 4 more pages",
    detail:
      "robots.txt, then sitemap.xml and any sitemap robots lists. Hard cap MAX_DISCOVERED_PAGES = 4.",
    src: "apps/backend/src/services/onboarding/enrichment/discover.ts:40",
  },
  {
    key: "apps",
    label: "Look for App Store and Play listings",
    detail:
      "JSON-LD only, no scraped review text. Both stores are JavaScript heavy, so 0 to 1 listings is the expected result.",
    src: "apps/backend/src/services/onboarding/enrichment/fetch-app-store.ts",
  },
  {
    key: "research",
    label: "Run 4 research queries",
    detail:
      "Third-party pages about you. Skipped when your own site already returned more than 2,000 characters.",
    src: "apps/backend/src/services/onboarding/enrichment/web-research.ts:39, routes/onboarding/enrich.ts:65",
  },
  {
    key: "competitors",
    label: "Find competitors",
    detail: "Each candidate carries the source page it came from, so you can check it.",
    src: "apps/backend/src/services/onboarding/enrichment/competitors.ts",
  },
  {
    key: "describe",
    label: "Write the description",
    detail: "One grounded paragraph, built only from pages that actually loaded.",
    src: "apps/backend/src/services/onboarding/enrichment/describe.ts",
  },
  {
    key: "classify",
    label: "Classify shape and stage",
    detail:
      "Returns inferredShape, inferredStage and shapeConfidence. Low confidence means you confirm it.",
    src: "apps/backend/src/services/onboarding/enrichment/classify-shape-stage.ts",
  },
];

/** 8 steps at 310ms is about 2.5 seconds. Live it paces over about 20. */
export const STEP_MS = 310;

/** COMPANY_SHAPES, apps/web/src/app/start/page.tsx:91-98. */
export const SHAPES: Array<{ value: string; label: string }> = [
  { value: "marketplace", label: "Marketplace" },
  { value: "saas", label: "SaaS / software" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "services", label: "Services" },
  { value: "fintech", label: "Fintech / payments" },
  { value: "other", label: "Something else" },
];

/** STAGE_LABELS_BY_SHAPE, apps/web/src/app/start/page.tsx:100-107. */
const STAGES_BY_SHAPE: Record<string, string[]> = {
  marketplace: [
    "Pre-launch",
    "Soft-launch",
    "Live (1-3 cities)",
    "Live (statewide)",
    "Multi-state",
    "National",
    "International",
  ],
  saas: ["Pre-launch", "Private beta", "Public beta", "GA", "Scaling"],
  ecommerce: ["Pre-launch", "Launched", "Multi-state", "National"],
  services: ["Pre-launch", "First clients", "Local", "Regional", "National"],
  fintech: ["Pre-launch", "Sandbox", "Production pilot", "GA"],
  other: ["Pre-launch", "Launched"],
};

export function stagesFor(shape: string): string[] {
  return STAGES_BY_SHAPE[shape] ?? STAGES_BY_SHAPE.marketplace;
}

export const ADDED_BY_YOU = "Added by you";

/** inferCompanyName, apps/web/src/app/start/enrichment-rank.ts:73-80. */
export function inferCompanyName(host: string): string {
  const base = host.split(".")[0] || host;
  return base
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeHost(raw: string): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

const NORTHFIELD: Fixture = {
  outcomes: {
    resolve: ["ok", "northfield.supply, confidence 0.91, via tavily"],
    fixed: [
      "warn",
      "9 of 13 read. /pricing answered 403. /refunds, /policies/refund-policy, /help-center were 404.",
    ],
    discover: ["ok", "4 kept from sitemap.xml"],
    apps: ["skip", "0 listings. Nothing in JSON-LD on either store."],
    research: ["skip", "Not run. First-party text was 6,240 chars, over the 2,000 threshold."],
    competitors: ["ok", "3 candidates, each with a source page"],
    describe: ["ok", "Written from 13 pages"],
    classify: ["warn", "ecommerce, stage 2, shapeConfidence low"],
  },
  found: {
    company_name: "Northfield Supply",
    description:
      "Northfield Supply sells hard-wearing workwear direct to trades and field crews, shipping from one warehouse. The site leads on durability and repair rather than on price, and the stockists page lists independent retailers carrying the line.",
    inferredShape: "ecommerce",
    inferredStage: 2,
    shapeConfidence: "low",
    icp: "",
    domain_pages: 13,
    app_listings: 0,
    research_pages: 0,
    competitors: [
      {
        name: "Bracken Workwear",
        url: "https://brackenworkwear.example",
        source_title: "Best workwear brands for trades, 2026",
      },
      {
        name: "Hallows Field Co",
        url: "https://hallowsfield.example",
        source_title: "Best workwear brands for trades, 2026",
      },
      {
        name: "Sterne Outfitters",
        url: "https://sterne.example",
        source_title: "Workwear that lasts: a buyer's guide",
      },
    ],
    cannot_see: [
      {
        what: "Your /pricing page refused the fetch. It answered 403.",
        why: "That tells Zavi it could not read the page. It says nothing about what is on it. So nothing below states a price, a discount or a margin, and Zavi will not infer one from the category.",
        impact: "Read as: prices unknown, not prices absent.",
        src: "apps/backend/src/channels/_base/recipe-base.md, the blocked-fetch rule",
      },
      {
        what: "No App Store or Play listing came back.",
        why: "Both stores render through JavaScript, so the extractor expects 0 to 1 listings even for companies that have an app. This is a failed read, not a finding.",
        impact: "Zavi will not claim you have no app.",
        src: "apps/backend/src/services/onboarding/enrichment/fetch-app-store.ts",
      },
      {
        what: "Nothing you have not published.",
        why: "Revenue, margin, repeat rate, what your best channel actually is, why the last thing you tried did not work. The public site carries none of it.",
        impact: "Every conclusion above is from public copy only.",
        src: "apps/web/src/components/workspace/GrowthInterview.tsx:44",
      },
    ],
    edited: {},
  },
};

const PAPERKITE: Fixture = {
  outcomes: {
    resolve: ["ok", "paperkite.studio, confidence 0.62, via tavily"],
    fixed: ["warn", "1 of 13 read. / loaded. The other 12 were 404."],
    discover: ["warn", "0 kept. No robots.txt and no sitemap.xml."],
    apps: ["skip", "0 listings."],
    research: ["ok", "4 queries, 3 third-party pages kept"],
    competitors: ["warn", "0 candidates. Nothing in the results named a peer."],
    describe: ["warn", "Written from 1 first-party page and 3 third-party pages"],
    classify: ["warn", "services, stage 0, shapeConfidence low"],
  },
  found: {
    company_name: "Paperkite Studio",
    description:
      "A small design studio. The one page Zavi could read is a single-screen site with a name, a contact form and four project thumbnails, so this description leans on three outside pages rather than on the studio's own words.",
    inferredShape: "services",
    inferredStage: 0,
    shapeConfidence: "low",
    icp: "",
    domain_pages: 1,
    app_listings: 0,
    research_pages: 3,
    competitors: [],
    cannot_see: [
      {
        what: "Twelve of thirteen pages were not there.",
        why: "This site is one page. There is no /about, no /pricing, no /contact route to read, so most of what the scan normally learns simply does not exist yet.",
        impact: "The description above is mostly other people's words about you.",
        src: "apps/backend/src/services/onboarding/enrichment/discover.ts:349",
      },
      {
        what: "Zero competitors found is not zero competitors.",
        why: "The search did not surface a peer. That is a statement about the search, not about your market.",
        impact: "Add the ones you actually watch, below.",
        src: "apps/backend/src/channels/_base/recipe-base.md, the absence rule",
      },
      {
        what: "Who you sell to, what you charge, and what has worked.",
        why: "None of it is on the site, so Zavi is guessing at the shape and at the stage. shapeConfidence came back low, which is why it is asking rather than asserting.",
        impact: "Correct the two rows below before you continue.",
        src: "apps/web/src/components/workspace/GrowthInterview.tsx:44",
      },
    ],
    edited: {},
  },
};

export const PREFILLS = ["northfield.supply", "paperkite.studio"];

/** Anything typed that has no fixture: an honest middle case. */
function defaultFixture(host: string): Fixture {
  return {
    outcomes: {
      resolve: ["ok", host + ", confidence 0.74, via tavily"],
      fixed: ["warn", "6 of 13 read. /pricing answered 403. Six paths were 404."],
      discover: ["ok", "2 kept from sitemap.xml"],
      apps: ["skip", "0 listings."],
      research: ["ok", "4 queries, 2 third-party pages kept"],
      competitors: ["ok", "2 candidates"],
      describe: ["ok", "Written from 8 pages"],
      classify: ["warn", "shapeConfidence low"],
    },
    found: {
      company_name: inferCompanyName(host),
      description:
        "Zavi read " +
        host +
        " and got a partial picture. Rewrite this paragraph in your own words. It is the single input your whole agent team starts from, so it is worth two minutes.",
      inferredShape: "",
      inferredStage: -1,
      shapeConfidence: "low",
      icp: "",
      domain_pages: 8,
      app_listings: 0,
      research_pages: 2,
      competitors: [],
      cannot_see: [
        {
          what: "Your /pricing page refused the fetch. It answered 403.",
          why: "A refusal tells Zavi it could not read the page, and nothing about what the page says. No price, tier or discount is stated below, and none is inferred from the category.",
          impact: "Read as: prices unknown, not prices absent.",
          src: "apps/backend/src/channels/_base/recipe-base.md, the blocked-fetch rule",
        },
        {
          what: "Company type and stage came back low confidence.",
          why: "classify-shape-stage did not find enough to commit. The rows below are empty on purpose rather than filled with a guess you would have to notice and undo.",
          impact: "Pick both before you continue.",
          src: "apps/backend/src/services/onboarding/enrichment/classify-shape-stage.ts",
        },
        {
          what: "Everything private to the business.",
          why: "Revenue, CAC, churn, what your best channel is today, what you already tried. The public site has none of it and no connector is attached yet.",
          impact: "Every line above came from public copy.",
          src: "apps/web/src/components/workspace/GrowthInterview.tsx:44",
        },
      ],
      edited: {},
    },
  };
}

/** The from-scratch branch: there is no site, so almost nothing runs. */
function ideaFixture(idea: string): Fixture {
  return {
    outcomes: {
      resolve: ["skip", "Not run. No domain on file."],
      fixed: ["skip", "Not run. No domain on file."],
      discover: ["skip", "Not run. No domain on file."],
      apps: ["skip", "Not run. No domain on file."],
      research: ["skip", "Not run. Nothing to search for yet."],
      competitors: ["skip", "Not run. No category settled."],
      describe: ["ok", "Your words, kept as written"],
      classify: ["warn", "shapeConfidence low. Nothing to classify from."],
    },
    found: {
      company_name: "",
      description: idea,
      inferredShape: "",
      inferredStage: -1,
      shapeConfidence: "low",
      icp: "",
      domain_pages: 0,
      app_listings: 0,
      research_pages: 0,
      competitors: [],
      cannot_see: [
        {
          what: "There is no site, so seven of the eight reads did not run.",
          why: "This is not a degraded scan. It is the correct result for a company that does not exist yet: nothing was fetched, so nothing is claimed.",
          impact: "Everything on this card is your own sentence, echoed back.",
          src: "apps/web/src/app/start/page.tsx, the build-start commit",
        },
        {
          what: "No company name yet.",
          why: "Zavi will not invent one for you. Name it below.",
          impact: "Required before you continue.",
          src: "apps/web/src/app/start/page.tsx, orgName feeds the tenant display name",
        },
        {
          what: "No customers, no traffic, no channel history.",
          why: "Which means no attribution is possible on day one. Zavi builds and deploys first, then starts measuring from zero.",
          impact: "The first number will be a baseline, not a result.",
          src: "apps/web/src/app/start/page.tsx, the from-scratch promise",
        },
      ],
      edited: {},
    },
  };
}

export function pickFixture(source: "website" | "idea", host: string, idea: string): Fixture {
  if (source === "idea") return ideaFixture(idea);
  if (host === "northfield.supply") return NORTHFIELD;
  if (host === "paperkite.studio") return PAPERKITE;
  return defaultFixture(host || "your-site.com");
}

export function cloneFound(f: Found): Found {
  return {
    ...f,
    competitors: f.competitors.map((c) => ({ ...c })),
    cannot_see: f.cannot_see.map((b) => ({ ...b })),
    edited: {},
  };
}
