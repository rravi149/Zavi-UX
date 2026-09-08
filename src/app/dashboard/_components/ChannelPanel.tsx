"use client";

import {
  useState,
  type ComponentType,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowRight,
  MessageSquare,
  Check,
  ChevronDown,
  Crown,
  GripVertical,
  Lock,
  Megaphone,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Radio,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import {
  SiGoogleads,
  SiInstagram,
  SiReddit,
  SiTiktok,
  SiX,
  SiYoutube,
  SiMeta,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { IconButton, Panel, PanelHeader } from "./Panel";
import { Dropdown } from "./Dropdown";
import { ChannelBadge, Drawer } from "./Drawer";
import PostDrawer from "./PostDrawer";
import ChannelSummaryDrawer, {
  type ChannelSummary,
} from "./ChannelSummaryDrawer";
import type { Tab as AnalyticsTab } from "./AnalyticsPanel";
import { confidenceTone, dailySeries } from "./metrics";
import {
  applyCopy,
  channelHeadline,
  copyOptions,
  metaItemCopy,
  type CopyOptionId,
} from "./plainCopy";
import type {
  ApprovalKind,
  ApprovalRequest,
  ApprovalReview,
  Plan,
  SocialPost,
  Task,
  TaskSource,
} from "./types";

type ChannelItem = {
  id: number;
  title: string;
  detail: string;
  taskId?: number;
  review: ApprovalReview;
  post?: SocialPost;
};


type ChannelConfig = {
  id: string;
  name: string;
  color: string;
  icon?: ComponentType<{ className?: string }>;
  glyph?: string;
  locked: boolean;
  noun: [string, string];
  verb: string;
  emptyText: string;
  taskSource?: TaskSource;
  items: ChannelItem[];
  summary?: ChannelSummary;
};

const channelConfigs: ChannelConfig[] = [
  {
    id: "meta-ads",
    name: "Meta Ads",
    color: "bg-indigo-600",
    icon: SiMeta,
    locked: false,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Connect Meta Ads to get campaign ideas",
    summary: {
      headline:
        "5 changes ready. Approving all frees ~$85/day from a stalled ad set and should add 30–40 purchases a week.",
    },
    items: [
      {
        id: 1,
        title: "Pause “Retargeting – Cart Abandoners” ad set",
        detail:
          "Sales campaign · Cost per purchase is 2.4x the campaign average over Sep 1–7",
        review: {
          why: "Pausing a live ad set stops delivery and spend immediately and can reset pixel/Conversions API learning, so Zavi asks before touching anything live in Ads Manager.",
          plan: [
            "Pause the ad set in Ads Manager (Sales campaign → Retargeting – Cart Abandoners)",
            "Shift its $85/day budget to the higher-performing “Acquisition – Prospecting” ad set",
            "Re-check cost per purchase after 3 days before permanently archiving it",
          ],
          impactPeriod: {
            before: { range: "Sep 1–7", note: "As-is" },
            after: { range: "Sep 8–14", note: "$85/day moved to Prospecting" },
          },
          resultNoun: "purchases",
          daily: dailySeries("2026-08-09", [
            { days: 23, spend: 84, costPerResult: 8.21, cpm: 12, ctr: 0.012 },
            { days: 7, spend: 84, costPerResult: 19.6, cpm: 12.5, ctr: 0.009 },
          ]),
          impact: [
            { label: "Amount spent", value: "$588", before: "$588" },
            { label: "Cost per result", value: "$10.00", before: "$19.60" },
            { label: "Purchases", value: "≈59", before: "30" },
          ],
          creative: {
            image: "https://picsum.photos/seed/zavi-cart-abandoners/200/200",
            caption: "Cart Abandoners · carousel ad",
            kind: "image",
          },
          trend: { label: "Cost per purchase", before: "$19.60", after: "$10.00", good: "down" },
          outcome: "Frees $85/day to fund better-performing ads",
          evidence: {
            confidence: "High confidence",
            rows: [
              { label: "Spend behind this call", value: "$588", note: "Sep 1–7" },
              { label: "Purchases in that window", value: "30" },
              { label: "Cost per purchase trend", value: "$8.21 → $19.60", note: "2.4x higher vs Aug 25–31", tone: "bad" },
              { label: "Campaign benchmark", value: "$8.21", note: "avg. cost per purchase" },
              { label: "Estimate based on", value: "Aug 25 – Sep 7 ad set history" },
            ],
          },
          scenario: {
            positive: "Frees $85/day for the higher-performing Prospecting ad set",
            negative: "If paused too early, the ad set loses its learning phase and audience data",
          },
          reversible: {
            label: "Reversible anytime",
            body: "Turn the ad set back on from Ads Manager or the Channel history. Pausing stops delivery only; audience and learning data stay intact.",
          },
          risk: "Low. Pausing stops delivery only; the ad set, its audience, and learning data stay intact in Ads Manager and can be resumed anytime.",
          undo: "Turn the ad set back on from Ads Manager or the Channel history.",
          sources: [
            "Ads Manager · Ad Set breakdown (Sep 1–7)",
            "Campaign cost-per-purchase benchmark",
          ],
        },
      },
      {
        id: 2,
        title: "Raise budget on “Acquisition – Prospecting” ad set",
        detail:
          "Sales campaign · Purchase ROAS is 3.09x and delivery is capped by ad set budget, not audience size",
        review: {
          why: "Raising an ad set's daily budget changes live spend on your connected Meta ad account immediately, so every budget change waits for your approval.",
          plan: [
            "Raise the ad set's daily budget from $120 to $180 in Ads Manager",
            "Monitor cost per purchase and frequency for 3 days",
            "Auto-revert to $120 if cost per purchase rises above $12",
          ],
          impactPeriod: {
            before: { range: "Aug 25 – Sep 7", note: "$120/day budget" },
            after: { range: "Sep 8–21", note: "$180/day budget" },
          },
          resultNoun: "purchases",
          daily: dailySeries("2026-08-09", [
            { days: 30, spend: 120, costPerResult: 10, cpm: 11.5, ctr: 0.017 },
          ]),
          impact: [
            { label: "Amount spent", value: "$2,520", before: "$1,680" },
            { label: "Cost per result", value: "$10.30–10.70", before: "$10.00" },
            { label: "Purchases", value: "235–245", before: "168" },
          ],
          creative: {
            image: "https://picsum.photos/seed/zavi-acquisition-prospecting/200/200",
            caption: "Acquisition – Prospecting · image ad",
            kind: "image",
          },
          trend: { label: "Daily budget", before: "$120", after: "$180", good: "up" },
          outcome: "Est. 30–40 more purchases per week, cost per purchase stays under $12",
          evidence: {
            confidence: "High confidence",
            rows: [
              { label: "Spend behind this call", value: "$1,680", note: "Aug 25 – Sep 7" },
              { label: "Purchases in that window", value: "168" },
              { label: "Purchase ROAS", value: "3.09x", note: "stable Aug 25 – Sep 7", tone: "good" },
              { label: "Delivery cap", value: "Capped by budget", note: "not audience size" },
              { label: "Estimate based on", value: "3 similar budget increases", note: "this account" },
            ],
          },
          scenario: {
            positive: "≈235–245 purchases at $180/day, cost per purchase under $12",
            negative: "Cost per purchase could rise if the audience starts to saturate",
          },
          reversible: {
            label: "Reversible anytime",
            body: "Lower the daily budget back to $120 from Ads Manager. Zavi auto-reverts if cost per purchase rises above $12.",
          },
          risk: "Low. The ad set has held a stable cost per purchase since Aug 25; the increase is capped and auto-monitored.",
          undo: "Lower the ad set's daily budget back to $120 from Ads Manager.",
          sources: [
            "Ads Manager · Ad Set breakdown (Aug 25 – Sep 7)",
            "Delivery & budget pacing insights",
          ],
        },
      },
      {
        id: 3,
        title: "Refresh creative in “Retention – Winback” ad set",
        detail:
          "Sales campaign · Frequency has crossed 4.2 and link CTR dropped 38% from Aug 25–31 to Sep 1–7",
        review: {
          why: "Publishing new ad creative changes what your audience sees on Facebook and Instagram immediately, so Zavi drafts it for your review before it goes live in Ads Manager.",
          plan: [
            "Swap in the 3 new creative variants from the Build tab as new ads in this ad set",
            "Keep the existing audience, placements, and budget unchanged",
            "Watch link CTR and frequency for 5 days",
          ],
          creative: {
            image: "https://picsum.photos/seed/zavi-winback-carousel/200/200",
            caption: "\"Still thinking about it?\" carousel ad",
            kind: "video",
          },
          impactPeriod: {
            before: { range: "Aug 9 – Sep 7", note: "Old creative" },
            after: { range: "Sep 8 – Oct 7", note: "New creative" },
          },
          resultNoun: "purchases",
          daily: dailySeries("2026-08-09", [
            { days: 16, spend: 41.33, costPerResult: 17, cpm: 10, ctr: 0.012 },
            { days: 7, spend: 41.33, costPerResult: 22, cpm: 10.5, ctr: 0.01 },
            { days: 7, spend: 41.33, costPerResult: 30, cpm: 11, ctr: 0.0062 },
          ]),
          impact: [
            { label: "Amount spent", value: "$1,240", before: "$1,240" },
            { label: "Cost per result", value: "$10–12", before: "$20.00" },
            { label: "Purchases", value: "100–120", before: "62" },
          ],
          trend: { label: "Link CTR", before: "0.62%", after: "1.1–1.4%", good: "up" },
          outcome: "Up to 2x higher click-through expected",
          evidence: {
            confidence: "Directional",
            rows: [
              { label: "Spend behind this call", value: "$1,240", note: "Aug 9 – Sep 7" },
              { label: "Purchases in that window", value: "62" },
              { label: "7-day frequency", value: "4.2", note: "was 2.1 on Aug 17", tone: "bad" },
              { label: "Link CTR trend", value: "1.00% → 0.62%", note: "Aug 25–31 → Sep 1–7", tone: "bad" },
              { label: "Estimate based on", value: "4 past refreshes", note: "this account" },
            ],
          },
          scenario: {
            positive: "≈100–120 purchases at the same $1,240",
            negative: "New ads enter learning; 5–7 noisy days",
          },
          reversible: {
            label: "Reversible with a cost",
            body: "Turn the new ads off and re-enable the previous ad from version history. Adding ads to a live ad set can restart the learning phase, so the ad set may run unstable for 5–7 days either way.",
          },
          risk: "Low. Same audience, placements, and budget; only the ad creative changes.",
          undo: "Turn off the new ads and re-enable the previous ad from the ad set's version history.",
          sources: [
            "Ads Manager · Ad breakdown (Aug 9 – Sep 7)",
            "Frequency & link CTR fatigue signals",
          ],
        },
      },
      {
        id: 4,
        title: "Exclude “Purchasers – Last 30 Days” from prospecting ad sets",
        detail:
          "Sales campaign · 12% of prospecting spend is reaching a custom audience that already converted",
        review: {
          why: "Editing audience targeting changes who your live ad sets reach on Meta, so Zavi confirms the exclusion with you before saving it in Ads Manager.",
          plan: [
            "Add the “Purchasers – Last 30 Days” custom audience (built from Pixel/Conversions API Purchase events) as an exclusion",
            "Apply it to all 3 active prospecting ad sets in the Sales campaign",
            "Re-check wasted spend after 7 days",
          ],
          impactPeriod: {
            before: { range: "Sep 1–7", note: "No exclusion" },
            after: { range: "Sep 8–14", note: "Purchasers excluded" },
          },
          resultNoun: "purchases",
          daily: dailySeries("2026-08-09", [
            { days: 30, spend: 250, costPerResult: 14, cpm: 12, ctr: 0.015 },
          ]),
          impact: [
            { label: "Amount spent", value: "$1,540", before: "$1,750" },
            { label: "Cost per result", value: "$12.32", before: "$14.00" },
            { label: "Purchases", value: "125", before: "125" },
          ],
          creative: {
            image: "https://picsum.photos/seed/zavi-prospecting-exclusion/200/200",
            caption: "Prospecting ad sets · audience exclusion",
            kind: "image",
          },
          trend: { label: "Wasted spend / week", before: "$210", after: "$0", good: "down" },
          outcome: "Recovers ~$210/week in wasted spend",
          evidence: {
            confidence: "Directional",
            rows: [
              { label: "Spend behind this call", value: "$1,750", note: "Sep 1–7, 3 ad sets" },
              { label: "Wasted spend detected", value: "$210", note: "12% of prospecting spend", tone: "bad" },
              { label: "Audience overlap", value: "12%", note: "already converted Aug 9 – Sep 7" },
              { label: "Ad sets affected", value: "3", note: "all active prospecting ad sets" },
              { label: "Estimate based on", value: "Pixel / Conversions API events" },
            ],
          },
          scenario: {
            positive: "Recovers ~$210/week without losing purchases",
            negative: "If the audience list is stale, some in-market buyers could be excluded",
          },
          reversible: {
            label: "Reversible anytime",
            body: "Remove the custom audience exclusion from each ad set's Audience settings. Existing ad sets and performance history are unaffected.",
          },
          risk: "Low. Exclusions only narrow reach; existing ad sets, creative, and performance history are unaffected.",
          undo: "Remove the custom audience exclusion from each ad set's Audience settings.",
          sources: [
            "Ads Manager · Audience overlap report",
            "Purchase events (Meta Pixel / Conversions API)",
          ],
        },
      },
      {
        id: 5,
        title: "Turn on Advantage+ placements for “Launch – Q4 Promo” ad set",
        detail:
          "Launch – Q4 Promo campaign · Manual placements are limiting delivery to 60% of daily budget pacing",
        review: {
          why: "Switching placements changes where your ads can show (Facebook Feed, Instagram Feed/Reels/Stories, Audience Network, etc.), so Zavi checks with you before changing it in Ads Manager.",
          plan: [
            "Switch the ad set from manual placements to Advantage+ placements",
            "Keep budget and bid strategy unchanged",
            "Compare delivery and cost per purchase after 5 days",
          ],
          impactPeriod: {
            before: { range: "Sep 3–7", note: "60% pacing" },
            after: { range: "Sep 8–12", note: "Full pacing" },
          },
          resultNoun: "purchases",
          daily: dailySeries("2026-09-03", [
            { days: 5, spend: 120, costPerResult: 30, cpm: 14, ctr: 0.011 },
          ]),
          impact: [
            { label: "Amount spent", value: "$950–1,000", before: "$600" },
            { label: "Cost per result", value: "$30.00", before: "$30.00" },
            { label: "Purchases", value: "32–33", before: "20" },
          ],
          creative: {
            image: "https://picsum.photos/seed/zavi-launch-q4-promo/200/200",
            caption: "Launch – Q4 Promo · placement expansion",
            kind: "video",
          },
          trend: { label: "Budget pacing", before: "60%", after: "95–100%", good: "up" },
          outcome: "Full budget delivery, more reach for the same spend",
          evidence: {
            confidence: "At risk",
            rows: [
              { label: "Spend behind this call", value: "$600", note: "Sep 3–7 (launched Sep 3)" },
              { label: "Purchases in that window", value: "20" },
              { label: "Budget pacing", value: "60%", note: "manual placements limit delivery", tone: "bad" },
              { label: "Placements live", value: "2 of 6", note: "Feed, Stories only" },
              { label: "Estimate based on", value: "Meta's Advantage+ recommendation" },
            ],
          },
          scenario: {
            positive: "≈32–33 purchases at full pacing, same cost per result",
            negative: "New placements may need 3–5 days to stabilize cost per purchase",
          },
          reversible: {
            label: "Reversible anytime",
            body: "Switch back to manual placements from the ad set's Placements settings. Budget and bid strategy stay unchanged either way.",
          },
          risk: "Low. Advantage+ placements are reversible and are Meta's own delivery recommendation for this ad set.",
          undo: "Switch back to manual placements from the ad set's Placements settings.",
          sources: ["Ads Manager · Delivery insights"],
        },
      },
    ],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    color: "bg-amber-500",
    icon: SiGoogleads,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Connect Google Ads to get campaign ideas",
    items: [],
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    color: "bg-zinc-900",
    icon: SiTiktok,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Connect TikTok Ads to get campaign ideas",
    items: [],
  },
  {
    id: "reddit-ads",
    name: "Reddit Ads",
    color: "bg-orange-600",
    icon: SiReddit,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Connect Reddit Ads to get campaign ideas",
    items: [],
  },
  {
    id: "influencer-ads",
    name: "Influencer Ads (TBD)",
    color: "bg-emerald-500",
    icon: Megaphone,
    locked: false,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Launch your first campaign (1000 influencers are waiting)",
    items: [],
  },
  {
    id: "seo-geo",
    name: "SEO + GEO (AI search)",
    color: "bg-sky-500",
    icon: Sparkles,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Rankings and citations look healthy",
    items: [
      {
        id: 1,
        title: "Add FAQ schema to the pricing page",
        detail: "+2 positions expected for “dashboard template pricing”",
        review: {
          why: "This changes the pricing page code. Schema errors can drop rich results in search, so the change deploys only after you approve it.",
          plan: [
            "Add FAQPage JSON-LD with the six pricing questions",
            "Validate with the Rich Results test",
            "Open a pull request and deploy",
          ],
          preview: {
            label: "Questions included",
            body: "Is there a free plan?\nCan I use templates in client work?\nDo you offer refunds?\nWhat counts as a workspace?\nCan I cancel anytime?\nDo you offer team pricing?",
          },
          impact: [
            { label: "Current rank", value: "#7" },
            { label: "Expected rank", value: "#5" },
            { label: "Extra clicks", value: "+120 / month" },
          ],
          risk: "Low. Markup only. Nothing visible changes on the page.",
          undo: "Revert the pull request.",
          sources: [
            "Search Console (last 28 days)",
            "Pricing page FAQ section",
            "Google FAQ rich result guidelines",
          ],
        },
      },
      {
        id: 2,
        title: "ChatGPT doesn't cite Zavi for “dashboard UI kit”",
        detail: "Publish a comparison page to earn the citation",
        review: {
          why: "Approving publishes a new public page on your site. New pages change your sitemap and how AI engines describe Zavi, so they always get a human review first.",
          plan: [
            "Create /compare/dashboard-ui-kits from the outline below",
            "Add it to the sitemap and link it from the gallery",
            "Re-check ChatGPT and Perplexity answers in 14 days",
          ],
          preview: {
            label: "Page outline",
            body: "Title: Dashboard UI kits compared (2026)\n1. What to look for in a dashboard UI kit\n2. Zavi vs. Tremor vs. Untitled UI vs. Tailwind UI\n3. Pricing and licensing table\n4. Which kit fits which team",
          },
          impact: [
            { label: "Query volume", value: "2.9k / month" },
            { label: "Cited today", value: "0 of 4 engines" },
            { label: "Target", value: "Cited in 2 engines" },
          ],
          risk: "Medium. Comparison pages name competitors. The draft sticks to public facts and links every claim to its source.",
          undo: "Unpublish the page from the Build tab. Cached AI answers can take a few weeks to update.",
          sources: [
            "ChatGPT and Perplexity answer audit (yesterday)",
            "Competitor pricing pages",
            "Search Console",
          ],
        },
      },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "bg-blue-600",
    icon: FaLinkedin,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Set up your brand voice to get started",
    items: [],
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "bg-orange-500",
    icon: SiReddit,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "No new threads to join yet",
    items: [
      {
        id: 1,
        title: "r/startups: founders asking for dashboard templates",
        detail: "Reply with the gallery link and mention the free plan",
        review: {
          why: "Reddit Agent replies from your account in a public community. r/startups removes promotional accounts and edits show a visible “edited” mark, so every reply waits for you.",
          plan: [
            "Post the reply below from your Reddit account in the thread",
            "Watch the thread for 48 hours and draft follow-ups",
            "Report clicks and signups from the link in Analytics → Social",
          ],
          preview: {
            label: "Reply draft",
            body: "We hit the same problem building internal tools, which is why we made Zavi. The free plan has 40+ dashboard templates you can copy as React + Tailwind: zavi.app/gallery. Happy to answer questions about which pattern fits an early-stage product.",
          },
          impact: [
            { label: "Thread views", value: "4.2k / week" },
            { label: "Expected clicks", value: "60–90" },
            { label: "Est. signups", value: "8–12" },
          ],
          risk: "Low. The subreddit allows product mentions when they answer a direct request, and the draft avoids marketing language.",
          undo: "Delete the reply from the Channel history at any time.",
          sources: [
            "r/startups thread (posted 3h ago)",
            "Brand voice skill",
            "Gallery analytics",
          ],
        },
      },
      {
        id: 2,
        title: "r/webdev: “best analytics dashboard UI kits?”",
        detail: "Suggest the Nimbus Analytics template",
        review: {
          why: "This reply recommends a specific template under your name in a public thread, so Zavi asks you to confirm the wording before it posts.",
          plan: [
            "Post the reply below in the r/webdev thread",
            "Track clicks on the template link",
            "Draft follow-ups if the thread asks questions",
          ],
          preview: {
            label: "Reply draft",
            body: "Nimbus Analytics is a solid starting point if you want charts and a data table in one layout. It's free in the Zavi gallery: zavi.app/t/nimbus-analytics. It uses Recharts and shadcn-style components, so it's easy to restyle.",
          },
          impact: [
            { label: "Thread views", value: "1.8k / week" },
            { label: "Expected clicks", value: "30–45" },
            { label: "Est. signups", value: "4–6" },
          ],
          risk: "Low. r/webdev allows tool recommendations that answer the question directly.",
          undo: "Delete the reply from the Channel history.",
          sources: [
            "r/webdev thread",
            "Template performance data",
            "Brand voice skill",
          ],
        },
      },
    ],
  },
  {
    id: "x",
    name: "X",
    color: "bg-zinc-900",
    icon: SiX,
    locked: false,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "Nothing queued for X",
    items: [
      {
        id: 1,
        title: "Post: our SEO was quietly broken",
        detail: "Drafted from this week's AI audit findings",
        post: {
          authorName: "Apna Tutor",
          authorHandle: "apnatutor",
          avatarColor: "#f97066",
          verified: true,
          text: "our seo was quietly broken and we had no idea\n\nan ai audit flagged geo issues we'd been ignoring for months\n\nturns out we were basically invisible in markets where couples actually search for this stuff\n\nfixing it now. will report back on whether it moves the needle",
          whyThisWorks:
            "The previous post introduced the AI CMO angle broadly; this post zooms into one specific, relatable founder pain point (broken SEO you didn't know about) discovered through that same process, giving it a fresh angle grounded in a real, concrete detail.",
          stats: { replies: 24, reposts: 112, likes: "1.2K", views: "48K" },
        },
        review: {
          why: "X Agent posts publicly from your account. A thread can't be edited after it goes out, so every draft waits for your approval.",
          plan: [
            "Post the 6-tweet thread at 9:00 AM PT tomorrow",
            "Reply to comments for 24 hours in your brand voice",
            "Report impressions and clicks in Analytics → Social",
          ],
          preview: {
            label: "Thread draft",
            body: "1/ Most dashboards fail for one reason: they show everything and explain nothing. Here are 5 patterns from the most-copied templates on Zavi 🧵\n\n2/ Lead with one number. The Nimbus template puts revenue front and centre; everything else supports it.\n\n3/ Group by decision, not by data source. People open a dashboard to answer a question, not to browse tables.\n\n…\n\n6/ All 5 templates are free: zavi.app/gallery",
          },
          impact: [
            { label: "Expected impressions", value: "12k–18k" },
            { label: "Expected clicks", value: "150–250" },
            { label: "Best time", value: "9:00 AM PT" },
          ],
          risk: "Low. No claims about customers, and every link points to your own gallery.",
          undo: "Delete the thread from the Channel history. Impressions already served can't be recalled.",
          sources: [
            "Gallery analytics (30 days)",
            "Your last 20 posts on X",
            "Brand voice skill",
          ],
        },
      },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "bg-pink-500",
    icon: SiInstagram,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "No content queued for Instagram",
    items: [],
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "bg-zinc-800",
    icon: SiTiktok,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "No content queued for TikTok",
    items: [],
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "bg-red-600",
    icon: SiYoutube,
    locked: true,
    noun: ["action", "actions"],
    verb: "waiting",
    emptyText: "No videos queued for YouTube",
    items: [],
  },
];

const analyticsTabForChannel: Partial<Record<string, AnalyticsTab>> = {
  "meta-ads": "Meta Ads",
  "google-ads": "Google Ads",
  "seo-geo": "SEO",
};

function UpgradePill({
  plan,
  onUpgrade,
  compact = false,
}: {
  plan: Plan;
  onUpgrade: () => void;
  compact?: boolean;
}) {
  return (
    <Dropdown
      align="right"
      width="w-64"
      label="Upgrade to Pro"
      trigger={({ open, toggle, id }) => (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={id}
          onClick={toggle}
          className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-zinc-100 font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-200 ${
            compact ? "h-7 px-2.5 text-sm" : "h-8 px-3 text-sm"
          }`}
        >
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Upgrade
        </button>
      )}
    >
      {(close) => (
        <div className="p-1">
          <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            Unlock this agent
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            Pro · $24/month
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600">
            <li>All specialist agents, no limits</li>
            <li>Custom domains with SSL</li>
            <li>10 parallel agents</li>
          </ul>
          {plan === "pro" ? (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" aria-hidden="true" />
              You&apos;re on Pro
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                onUpgrade();
                close();
              }}
              className="mt-3 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                Upgrade to Pro
              </span>
            </button>
          )}
        </div>
      )}
    </Dropdown>
  );
}

export default function ChannelPanel({
  tasks,
  onApply,
  onDismiss,
  collapsed,
  onToggleCollapse,
  plan,
  onUpgrade,
  onReview,
  onAskZavi,
  onSelectChannel,
  copyOption,
  onCopyOptionChange,
}: {
  tasks: Task[];
  onApply: (id: number) => void;
  onDismiss: (id: number) => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  plan: Plan;
  onUpgrade: () => void;
  onReview: (request: ApprovalRequest) => void;
  onAskZavi: (text: string) => void;
  onSelectChannel?: (tab: AnalyticsTab) => void;
  copyOption: CopyOptionId;
  onCopyOptionChange: (option: CopyOptionId) => void;
}) {
  const layout =
    copyOptions.find((option) => option.id === copyOption)?.layout ?? "grid";

  const [order, setOrder] = useState(() =>
    channelConfigs.map((channel) => channel.id),
  );
  const [staticItems, setStaticItems] = useState<Record<string, ChannelItem[]>>(
    () =>
      Object.fromEntries(
        channelConfigs.map((channel) => [channel.id, channel.items]),
      ),
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showLocked, setShowLocked] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [postDrawer, setPostDrawer] = useState<{
    channelId: string;
    itemId: number;
  } | null>(null);
  const [viewAllId, setViewAllId] = useState<string | null>(null);
  const [viewAllExpanded, setViewAllExpanded] = useState(true);
  const [connectedChannels, setConnectedChannels] = useState<string[]>(() =>
    channelConfigs.map((channel) => channel.id).filter((id) => id !== "linkedin"),
  );
  const [toast, setToast] = useState<{
    kind: "approve" | "reject";
    title: string;
  } | null>(null);

  function notify(kind: "approve" | "reject", title: string) {
    setToast({ kind, title });
    window.setTimeout(() => setToast(null), 4000);
  }

  function isConnected(channel: ChannelConfig): boolean {
    return connectedChannels.includes(channel.id);
  }

  function connectChannel(channelId: string) {
    setConnectedChannels((prev) =>
      prev.includes(channelId) ? prev : [...prev, channelId],
    );
  }

  function itemsFor(channel: ChannelConfig): ChannelItem[] {
    if (channel.taskSource) {
      return tasks
        .filter(
          (task) =>
            task.source === channel.taskSource && task.status === "review",
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          detail: task.when,
          taskId: task.id,
          review: taskReview(task.source, task.title),
        }));
    }
    const items = staticItems[channel.id] ?? [];
    if (channel.id === "meta-ads") {
      return items.map((item) =>
        applyCopy(item, metaItemCopy[copyOption][item.id]),
      );
    }
    return items;
  }

  const channels = order
    .map((id) => channelConfigs.find((channel) => channel.id === id))
    .filter((channel): channel is ChannelConfig => Boolean(channel))
    .filter((channel) => showLocked || !channel.locked || plan === "pro");

  const pendingCount = channelConfigs.reduce(
    (sum, channel) =>
      channel.locked && plan === "free" ? sum : sum + itemsFor(channel).length,
    0,
  );

  function subtitle(channel: ChannelConfig, items: ChannelItem[]) {
    if (items.length === 0) return channel.emptyText;
    const noun = items.length === 1 ? channel.noun[0] : channel.noun[1];
    return `${items.length} ${noun} ${channel.verb}`;
  }

  function resolveStatic(channelId: string, itemId: number) {
    setStaticItems((prev) => ({
      ...prev,
      [channelId]: (prev[channelId] ?? []).filter((item) => item.id !== itemId),
    }));
  }

  function updatePost(
    channelId: string,
    itemId: number,
    patch: Partial<SocialPost>,
  ) {
    setStaticItems((prev) => ({
      ...prev,
      [channelId]: (prev[channelId] ?? []).map((item) =>
        item.id === itemId && item.post
          ? { ...item, post: { ...item.post, ...patch } }
          : item,
      ),
    }));
  }

  function duplicatePostItem(channelId: string, item: ChannelItem) {
    setStaticItems((prev) => {
      const list = prev[channelId] ?? [];
      const nextId = list.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
      return {
        ...prev,
        [channelId]: [
          ...list,
          { ...item, id: nextId, title: `${item.title} (copy)` },
        ],
      };
    });
  }

  function requestFor(
    channel: ChannelConfig,
    item: ChannelItem,
  ): ApprovalRequest {
    const kind: ApprovalKind =
      channel.taskSource === "build"
        ? "apply"
        : channel.taskSource === "grow"
          ? "merge"
          : "approve";
    const resolve = (action: (id: number) => void) =>
      item.taskId !== undefined
        ? action(item.taskId)
        : resolveStatic(channel.id, item.id);
    return {
      ...item.review,
      key: `${channel.id}:${item.id}`,
      kind,
      agent: {
        name: channel.name,
        color: channel.color,
        icon: channel.icon,
        glyph: channel.glyph,
      },
      title: item.title,
      detail:
        item.taskId !== undefined ? `Requested ${item.detail}` : item.detail,
      onApprove: () => {
        resolve(onApply);
        notify("approve", item.title);
      },
      onDismiss: () => {
        resolve(onDismiss);
        notify("reject", item.title);
      },
    };
  }

  function move(id: string, direction: -1 | 1) {
    setOrder((prev) => {
      const index = prev.indexOf(id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      next.splice(index, 1);
      next.splice(target, 0, id);
      return next;
    });
  }

  function reorder(from: string, to: string) {
    setOrder((prev) => {
      const fromIndex = prev.indexOf(from);
      const toIndex = prev.indexOf(to);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
        return prev;
      const next = [...prev];
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, from);
      return next;
    });
  }

  if (collapsed) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 py-3">
          <IconButton label="Expand channels" onClick={onToggleCollapse}>
            <PanelRightOpen className="h-5 w-5" />
          </IconButton>
          <span className="relative">
            <Radio className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-sm font-semibold text-white">
                {pendingCount}
              </span>
            )}
            <span className="sr-only">{pendingCount} items need your call</span>
          </span>
        </div>
      </Panel>
    );
  }

  const activeItem = postDrawer
    ? (staticItems[postDrawer.channelId] ?? []).find(
        (item) => item.id === postDrawer.itemId,
      )
    : undefined;
  const activeChannel = postDrawer
    ? channelConfigs.find((channel) => channel.id === postDrawer.channelId)
    : undefined;

  const viewAllChannel = viewAllId
    ? channelConfigs.find((channel) => channel.id === viewAllId)
    : undefined;
  const viewAllItems = viewAllChannel ? itemsFor(viewAllChannel) : [];

  return (
    <Panel>
      <PanelHeader>
        <Radio className="h-5 w-5 text-zinc-800" aria-hidden="true" />
        <h2 className="text-[17px] font-semibold text-zinc-900">Channel</h2>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            pendingCount > 0 ? "bg-emerald-500" : "bg-zinc-400"
          }`}
          role="img"
          aria-label={
            pendingCount > 0
              ? `${pendingCount} items need your call`
              : "No pending actions"
          }
        />
        <div className="ml-auto flex items-center gap-1">
          <Dropdown
            align="right"
            width="w-64"
            label="Channel settings"
            trigger={({ open, toggle, id }) => (
              <IconButton
                label="Channel settings"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </IconButton>
            )}
          >
            {() => (
              <div className="p-1">
                <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                  Channel settings
                </p>
                <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 text-sm text-zinc-800">
                  <span>Show locked agents</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showLocked}
                    onClick={() => setShowLocked((value) => !value)}
                    className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                      showLocked ? "bg-zinc-900" : "bg-zinc-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                        showLocked ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Drag the grip on any row to reorder your agents.
                </p>
              </div>
            )}
          </Dropdown>
          {onToggleCollapse && (
            <IconButton label="Collapse channels" onClick={onToggleCollapse}>
              <PanelRightClose className="h-5 w-5" />
            </IconButton>
          )}
        </div>
      </PanelHeader>

      <ul className="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        {channels.map((channel) => {
          const items = itemsFor(channel);
          const connected = isConnected(channel);
          const isLocked = connected && channel.locked && plan === "free";
          const isExpanded = expanded === channel.id;
          const Icon = channel.icon;
          const noun = items.length === 1 ? channel.noun[0] : channel.noun[1];
          const toggle = () => {
            setExpanded((current) =>
              current === channel.id ? null : channel.id,
            );
            const tab = analyticsTabForChannel[channel.id];
            if (tab) onSelectChannel?.(tab);
          };
          return (
            <li
              key={channel.id}
              onDragOver={(event: DragEvent<HTMLLIElement>) => {
                if (!dragId) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (overId !== channel.id) setOverId(channel.id);
              }}
              onDrop={(event: DragEvent<HTMLLIElement>) => {
                event.preventDefault();
                if (dragId) reorder(dragId, channel.id);
                setDragId(null);
                setOverId(null);
              }}
              className={`bg-white transition-[box-shadow,opacity] duration-200 ${
                overId === channel.id && dragId !== channel.id
                  ? "ring-2 ring-inset ring-zinc-300"
                  : ""
              } ${dragId === channel.id ? "opacity-50" : ""}`}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={toggle}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggle();
                  }
                }}
                className="group relative flex cursor-pointer items-center gap-3 py-3 pr-4 pl-4 transition-colors duration-200 hover:bg-zinc-50"
              >
                <button
                  type="button"
                  draggable
                  aria-label={`Drag to reorder ${channel.name}. Use the arrow keys to move it.`}
                  title="Drag to reorder"
                  onClick={(event) => event.stopPropagation()}
                  onDragStart={(event: DragEvent<HTMLButtonElement>) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", channel.id);
                    const row = event.currentTarget.closest("li");
                    if (row) {
                      const rect = row.getBoundingClientRect();
                      event.dataTransfer.setDragImage(
                        row,
                        event.clientX - rect.left,
                        event.clientY - rect.top,
                      );
                    }
                    window.setTimeout(() => setDragId(channel.id), 0);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverId(null);
                  }}
                  onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      move(channel.id, -1);
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      move(channel.id, 1);
                    }
                  }}
                  className="absolute top-1/2 left-0.5 flex h-6 w-5 -translate-y-1/2 cursor-grab items-center justify-center rounded-md text-zinc-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-zinc-600 focus-visible:opacity-100 active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${channel.color}`}
                  aria-hidden="true"
                >
                  {Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{channel.glyph}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-zinc-900">
                  {channel.name}
                </span>
                {!connected && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      connectChannel(channel.id);
                    }}
                    className="shrink-0 cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                  >
                    Connect
                  </button>
                )}
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setViewAllId(channel.id);
                    }}
                    className="shrink-0 cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-100"
                  >
                    View all
                  </button>
                )}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>

              {isExpanded && (
                <div className="bg-zinc-50/60 px-4 py-3">
                  <p className="mb-2 text-sm font-medium text-zinc-500">
                    {subtitle(channel, items)}
                  </p>
                  {!connected ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-5 text-center">
                      <p className="text-sm text-zinc-600">
                        {channel.name} isn&apos;t connected yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => connectChannel(channel.id)}
                        className="mt-3 cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                      >
                        Connect {channel.name}
                      </button>
                    </div>
                  ) : items.length === 0 ? (
                    isLocked ? (
                      <UpgradePill plan={plan} onUpgrade={onUpgrade} />
                    ) : null
                  ) : (
                    <>
                      {channel.id === "meta-ads" && (
                        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                          {copyOptions.map((option) => {
                            const active = option.id === copyOption;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                aria-pressed={active}
                                title={option.hint}
                                onClick={() => onCopyOptionChange(option.id)}
                                className={`h-10 cursor-pointer rounded-lg px-3 text-sm font-semibold transition-colors duration-200 ${
                                  active
                                    ? "bg-zinc-900 text-white"
                                    : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                                }`}
                              >
                                {option.short}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    <ul className="space-y-2">
                      {items.map((item) =>
                        channel.id === "meta-ads" && layout === "focus" ? (
                          <li
                            key={item.id}
                            className="rounded-2xl border border-zinc-200 bg-white p-3"
                          >
                            <div className="flex items-center gap-3">
                              {item.review.creative && (
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                  <img
                                    src={item.review.creative.image}
                                    alt={item.review.creative.caption}
                                    className="h-full w-full object-cover"
                                  />
                                  {item.review.creative.kind === "video" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                      <Play className="h-3.5 w-3.5 fill-white text-white" aria-hidden="true" />
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm leading-snug font-semibold text-zinc-900">
                                  {item.title}
                                </p>
                                {item.review.trend && (
                                  <p className="mt-0.5 flex flex-wrap items-center gap-1 text-sm font-medium text-zinc-600">
                                    <span className="text-zinc-400 line-through decoration-zinc-300">
                                      {item.review.trend.before}
                                    </span>
                                    <ArrowRight className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                                    <span className="font-bold text-zinc-900">
                                      {item.review.trend.after}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                            {!isLocked && (
                              <div className="mt-2.5 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.taskId !== undefined) {
                                      onApply(item.taskId);
                                    } else {
                                      resolveStatic(channel.id, item.id);
                                    }
                                    notify("approve", item.title);
                                  }}
                                  className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                                >
                                  <Check className="h-4 w-4" aria-hidden="true" />
                                  {item.review.actionLabel ?? "Approve"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onReview(requestFor(channel, item))}
                                  className="shrink-0 cursor-pointer px-1 text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors duration-200 hover:text-zinc-900"
                                >
                                  Details
                                </button>
                              </div>
                            )}
                          </li>
                        ) : (
                        <li
                          key={item.id}
                          className="rounded-2xl border border-zinc-200 bg-white p-3.5"
                        >
                          <div className="flex items-start gap-3">
                            {item.review.creative && (
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                <img
                                  src={item.review.creative.image}
                                  alt={item.review.creative.caption}
                                  className="h-full w-full object-cover"
                                />
                                {item.review.creative.kind === "video" && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                    <Play className="h-4 w-4 fill-white text-white" aria-hidden="true" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[15px] leading-snug font-semibold text-zinc-900">
                                {item.title}
                              </p>
                            </div>
                          </div>
                          {item.review.trend && (
                            <div className="mt-3 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm">
                              <span className="font-medium text-zinc-600">
                                {item.review.trend.label}
                              </span>
                              <span className="ml-auto flex items-center gap-1.5 font-bold text-zinc-900">
                                <span className="text-zinc-500 line-through decoration-zinc-400">
                                  {item.review.trend.before}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                                {item.review.trend.after}
                              </span>
                            </div>
                          )}
                          {item.review.outcome && (
                            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                              <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
                              {item.review.outcome}
                            </p>
                          )}
                          {isLocked ? (
                            <p className="mt-3 flex items-center gap-1.5 text-sm text-zinc-500">
                              <Lock className="h-3 w-3" aria-hidden="true" />
                              Upgrade to let this agent act on it
                            </p>
                          ) : (
                            <>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {item.review.evidence && (
                                  <span
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-sm font-semibold ${confidenceTone(item.review.evidence.confidence).badge}`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${confidenceTone(item.review.evidence.confidence).dot}`}
                                      aria-hidden="true"
                                    />
                                    {item.review.evidence.confidence}
                                  </span>
                                )}
                                <div className="ml-auto flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label={item.post ? "Review post" : "Mark as done"}
                                  title={item.post ? "Review post" : "Mark as done"}
                                  onClick={() => {
                                    if (item.post) {
                                      setPostDrawer({
                                        channelId: channel.id,
                                        itemId: item.id,
                                      });
                                      return;
                                    }
                                    if (item.taskId !== undefined) {
                                      onApply(item.taskId);
                                    } else {
                                      resolveStatic(channel.id, item.id);
                                    }
                                    notify("approve", item.title);
                                  }}
                                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors duration-200 hover:bg-zinc-100"
                                >
                                  <Check className="h-4 w-4" aria-hidden="true" />
                                </button>
                                {!item.post && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onReview(requestFor(channel, item))
                                    }
                                    className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                                  >
                                    View/Fix
                                  </button>
                                )}
                                {!item.post && (
                                  <IconButton
                                    label="Ask Zavi about this"
                                    onClick={() =>
                                      onAskZavi(
                                        `About "${item.title}" — `,
                                      )
                                    }
                                  >
                                    <MessageSquare className="h-5 w-5" />
                                  </IconButton>
                                )}
                                </div>
                              </div>
                            </>
                          )}
                        </li>
                        ),
                      )}
                    </ul>
                    </>
                  )}
                  {isLocked && items.length > 0 && (
                    <p className="mt-3 text-sm text-zinc-500">
                      {items.length} {noun} waiting behind the Pro plan.
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {postDrawer && activeItem?.post && (
        <PostDrawer
          agentName={activeChannel ? `${activeChannel.name} Writer` : "Writer"}
          post={activeItem.post}
          onClose={() => setPostDrawer(null)}
          onChange={(patch) =>
            updatePost(postDrawer.channelId, postDrawer.itemId, patch)
          }
          onDuplicate={() => duplicatePostItem(postDrawer.channelId, activeItem)}
          onMarkComplete={() => {
            resolveStatic(postDrawer.channelId, postDrawer.itemId);
            setPostDrawer(null);
          }}
          onPost={() => {
            resolveStatic(postDrawer.channelId, postDrawer.itemId);
            setPostDrawer(null);
          }}
        />
      )}

      <Drawer
        open={viewAllChannel !== undefined}
        title="All actions"
        badge={
          viewAllChannel && (
            <ChannelBadge
              name={viewAllChannel.name}
              color={viewAllChannel.color}
              icon={viewAllChannel.icon}
              glyph={viewAllChannel.glyph}
            />
          )
        }
        onClose={() => {
          setViewAllId(null);
          setViewAllExpanded(true);
        }}
        width={viewAllExpanded ? "max-w-[1600px]" : "max-w-2xl"}
        expanded={viewAllExpanded}
        onToggleExpand={() => setViewAllExpanded((value) => !value)}
      >
        {viewAllChannel && (
          <ChannelSummaryDrawer
            channelName={viewAllChannel.name}
            channelColor={viewAllChannel.color}
            icon={viewAllChannel.icon}
            glyph={viewAllChannel.glyph}
            summary={
              viewAllChannel.id === "meta-ads" && viewAllChannel.summary
                ? {
                    ...viewAllChannel.summary,
                    headline: channelHeadline[copyOption],
                  }
                : viewAllChannel.summary
            }
            copyOption={
              viewAllChannel.id === "meta-ads" ? copyOption : undefined
            }
            onCopyOptionChange={
              viewAllChannel.id === "meta-ads" ? onCopyOptionChange : undefined
            }
            expanded={viewAllExpanded}
            items={viewAllItems.map((item) => ({
              id: item.id,
              title: item.title,
              detail: item.detail,
              review: item.review,
            }))}
            onApprove={(id) => {
              const item = viewAllItems.find((entry) => entry.id === id);
              if (!item) return;
              if (item.taskId !== undefined) onApply(item.taskId);
              else resolveStatic(viewAllChannel.id, item.id);
              notify("approve", item.title);
            }}
            onReject={(id) => {
              const item = viewAllItems.find((entry) => entry.id === id);
              if (!item) return;
              if (item.taskId !== undefined) onDismiss(item.taskId);
              else resolveStatic(viewAllChannel.id, item.id);
              notify("reject", item.title);
            }}
            onViewDetails={(id) => {
              const item = viewAllItems.find((entry) => entry.id === id);
              if (!item) return;
              onReview(requestFor(viewAllChannel, item));
            }}
            onApproveAll={() => {
              const count = viewAllItems.length;
              viewAllItems.forEach((item) => {
                if (item.taskId !== undefined) onApply(item.taskId);
                else resolveStatic(viewAllChannel.id, item.id);
              });
              notify(
                "approve",
                `${count} ${viewAllChannel.name} action${count === 1 ? "" : "s"}`,
              );
              setViewAllId(null);
            }}
            onRejectAll={() => {
              const count = viewAllItems.length;
              viewAllItems.forEach((item) => {
                if (item.taskId !== undefined) onDismiss(item.taskId);
                else resolveStatic(viewAllChannel.id, item.id);
              });
              notify(
                "reject",
                `${count} ${viewAllChannel.name} action${count === 1 ? "" : "s"}`,
              );
              setViewAllId(null);
            }}
            onAskZavi={() => {
              onAskZavi(`About ${viewAllChannel.name} — `);
              setViewAllId(null);
            }}
          />
        )}
      </Drawer>

      {toast && (
        <div className="pointer-events-none fixed right-6 bottom-6 z-50 [animation:fade-in_200ms_ease-out]">
          <div
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${
              toast.kind === "approve" ? "border-emerald-200" : "border-zinc-200"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                toast.kind === "approve"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {toast.kind === "approve" ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 max-w-xs">
              <p className="text-sm font-semibold text-zinc-900">
                {toast.kind === "approve" ? "Approved" : "Rejected"}
              </p>
              <p className="mt-0.5 text-sm text-zinc-600">
                {toast.kind === "approve"
                  ? `"${toast.title}" will be applied. You can undo it from the Channel history.`
                  : `"${toast.title}" was dismissed. No changes were made.`}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToast(null)}
              className="pointer-events-auto shrink-0 cursor-pointer text-zinc-400 transition-colors duration-200 hover:text-zinc-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

function taskReview(source: TaskSource, title: string): ApprovalReview {
  if (source === "build") {
    return {
      why: "Applying changes edits the code of your live site. Zavi keeps every code change behind a human approval so nothing ships that you haven't reviewed.",
      plan: [
        "Apply the generated changes to the site",
        "Rebuild the preview and run the lint, type, and build checks",
        "Include the change in your next publish",
      ],
      preview: {
        label: "Change summary",
        body: `${title}\n\nFiles: src/app/page.tsx and 2 components\nChecks: lint, types, build — passing`,
      },
      impact: [
        { label: "Files changed", value: "3" },
        { label: "Lines", value: "+142 −18" },
        { label: "Checks", value: "Passing" },
      ],
      risk: "Low. The change is limited to the sections named in the Build thread.",
      undo: "Revert from the Build thread. The previous version is kept.",
      sources: ["Build thread", "Current site code", "Your design tokens"],
    };
  }
  return {
    why: "Merging deploys this pull request to production. Zavi opens a pull request instead of pushing straight to main so you can review every change before it goes live.",
    plan: [
      "Merge the pull request into main",
      "Trigger a production deploy (about two minutes)",
      "Post the live link back in the Grow thread",
    ],
    preview: {
      label: "Pull request",
      body: `${title}\n\n3 files changed · +64 −12\nChecks: lint, types, build — passing`,
    },
    impact: [
      { label: "Files changed", value: "3" },
      { label: "Deploy time", value: "~2 min" },
      { label: "Checks", value: "Passing" },
    ],
    risk: "Low. The pull request contains only the change described in the thread.",
    undo: "Revert the merge commit from the Grow thread.",
    sources: ["Grow thread", "Pull request diff", "Deploy checks"],
  };
}
