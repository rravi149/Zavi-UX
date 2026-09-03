"use client";

import {
  useState,
  type ComponentType,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  Check,
  ChevronDown,
  Clapperboard,
  Crown,
  Eye,
  GitPullRequest,
  Globe,
  GripVertical,
  Hammer,
  Lock,
  Megaphone,
  PanelRightClose,
  PanelRightOpen,
  PenLine,
  Radio,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { IconButton, Panel, PanelHeader } from "./Panel";
import { Dropdown } from "./Dropdown";
import PostDrawer from "./PostDrawer";
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
};

const channelConfigs: ChannelConfig[] = [
  {
    id: "engineering",
    name: "Engineering Agent",
    color: "bg-zinc-800",
    icon: Hammer,
    locked: false,
    noun: ["change", "changes"],
    verb: "ready to apply",
    emptyText: "No changes waiting for review",
    taskSource: "build",
    items: [],
  },
  {
    id: "zavi",
    name: "Zavi Agent",
    color: "bg-[#12203f]",
    icon: GitPullRequest,
    locked: false,
    noun: ["pull request", "pull requests"],
    verb: "ready to merge",
    emptyText: "No pull requests waiting",
    taskSource: "grow",
    items: [],
  },
  {
    id: "influencer",
    name: "X Influencer Agent",
    color: "bg-emerald-500",
    icon: Megaphone,
    locked: false,
    noun: ["campaign", "campaigns"],
    verb: "ready",
    emptyText: "Launch your first campaign (1000 influencers are waiting)",
    items: [],
  },
  {
    id: "reddit",
    name: "Reddit Agent",
    color: "bg-orange-500",
    glyph: "r/",
    locked: true,
    noun: ["opportunity", "opportunities"],
    verb: "ready",
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
    id: "geo",
    name: "GEO Agent",
    color: "bg-zinc-900",
    icon: Sparkles,
    locked: true,
    noun: ["citation gap", "citation gaps"],
    verb: "detected",
    emptyText: "No citation gaps right now",
    items: [
      {
        id: 1,
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
      {
        id: 2,
        title: "Perplexity lists competitors for “admin templates”",
        detail: "Add structured data to the gallery pages",
        review: {
          why: "This edits the code of every gallery page. A structured-data mistake can hide rich results, so Zavi waits for your sign-off before deploying.",
          plan: [
            "Add Product and ItemList JSON-LD to 40 gallery pages",
            "Validate every page with the Rich Results test",
            "Open a pull request and deploy once checks pass",
          ],
          preview: {
            label: "Schema snippet",
            body: '{ "@type": "Product", "name": "Nimbus Analytics", "brand": "Zavi", "offers": { "price": "0", "priceCurrency": "USD" } }',
          },
          impact: [
            { label: "Pages", value: "40" },
            { label: "Query volume", value: "1.6k / month" },
            { label: "Target", value: "Listed in Perplexity" },
          ],
          risk: "Low. The change adds markup only. Nothing visible changes.",
          undo: "Revert the pull request.",
          sources: [
            "Perplexity answer audit",
            "Gallery page templates",
            "schema.org Product spec",
          ],
        },
      },
    ],
  },
  {
    id: "ugc",
    name: "UGC Videos Agent",
    color: "bg-orange-500",
    icon: Clapperboard,
    locked: true,
    noun: ["draft", "drafts"],
    verb: "ready",
    emptyText: "No drafts waiting",
    items: [
      {
        id: 1,
        title: "30s walkthrough: build a dashboard in 5 minutes",
        detail: "Script and shot list ready for review",
        review: {
          why: "Approving books a creator and spends budget from your UGC plan. The deposit is non-refundable once filming starts, so this needs a human go-ahead.",
          plan: [
            "Send the brief to the matched creator (Maya R., 48k followers)",
            "Receive a first cut within 5 days",
            "Post the final cut here for a second approval before it goes live",
          ],
          preview: {
            label: "Script",
            body: "Hook (0–3s): “I built a full analytics dashboard in five minutes.”\nDemo (3–22s): pick the Nimbus template, drop in data, publish.\nCTA (22–30s): “Free templates at zavi.app.”",
          },
          impact: [
            { label: "Budget", value: "$350" },
            { label: "Expected views", value: "25k–40k" },
            { label: "Est. signups", value: "40–70" },
          ],
          risk: "Medium. This spends budget and creator quality varies. The brief includes two revision rounds.",
          undo: "Cancel before filming starts for a full refund.",
          sources: [
            "Creator marketplace match",
            "Top-performing gallery flows",
            "Brand voice skill",
          ],
        },
      },
    ],
  },
  {
    id: "seo",
    name: "SEO Agent",
    color: "bg-sky-500",
    icon: Globe,
    locked: true,
    noun: ["recommendation", "recommendations"],
    verb: "ready",
    emptyText: "Rankings look healthy",
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
        title: "Compress the hero images (1.2 MB → 300 KB)",
        detail: "Improves LCP on mobile",
        review: {
          why: "This replaces image files on your homepage. Compression can visibly reduce quality, so review the before-and-after numbers before it ships.",
          plan: [
            "Re-encode 4 hero images as AVIF with a WebP fallback",
            "Serve responsive sizes through next/image",
            "Open a pull request and deploy",
          ],
          preview: {
            label: "Before and after",
            body: "hero-dashboard.png: 1.2 MB → 290 KB (AVIF)\nhero-mobile.png: 640 KB → 140 KB\nMobile LCP: 3.8s → est. 2.1s",
          },
          impact: [
            { label: "Page weight", value: "−1.4 MB" },
            { label: "Mobile LCP", value: "3.8s → 2.1s" },
            { label: "Core Web Vitals", value: "Pass" },
          ],
          risk: "Low. Quality is set to 82, which is not visible at normal zoom.",
          undo: "Revert the pull request to restore the original files.",
          sources: [
            "PageSpeed Insights (mobile)",
            "Chrome UX Report",
            "public/ folder",
          ],
        },
      },
    ],
  },
  {
    id: "x",
    name: "X Agent",
    color: "bg-zinc-900",
    glyph: "X",
    locked: false,
    noun: ["idea", "ideas"],
    verb: "ready",
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
    id: "articles",
    name: "Articles Agent",
    color: "bg-violet-500",
    icon: PenLine,
    locked: true,
    noun: ["topic", "topics"],
    verb: "ready",
    emptyText: "No topics suggested yet",
    items: [
      {
        id: 1,
        title: "How to design an analytics dashboard people actually use",
        detail: "1,800 words, outline ready",
        review: {
          why: "Approving publishes a long-form article under your name on the Zavi blog. Articles are indexed within hours, so the outline and voice get a human check first.",
          plan: [
            "Write the full article from the outline below",
            "Add 3 gallery screenshots and internal links",
            "Publish to /blog and submit the URL for indexing",
          ],
          preview: {
            label: "Outline",
            body: "1. Why most dashboards get ignored\n2. Start with the decision, not the data\n3. Five layouts that work (with templates)\n4. Common mistakes: too many charts, no hierarchy\n5. A 30-minute dashboard audit checklist",
          },
          impact: [
            { label: "Target keyword", value: "analytics dashboard design" },
            { label: "Volume", value: "3.1k / month" },
            { label: "Est. traffic", value: "400–600 / month" },
          ],
          risk: "Low. You can edit the draft in the Build tab before it publishes.",
          undo: "Unpublish from the Build tab at any time.",
          sources: [
            "Keyword research export",
            "Top 10 ranking pages",
            "Brand voice skill",
          ],
        },
      },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Agent",
    color: "bg-blue-600",
    glyph: "in",
    locked: true,
    noun: ["post", "posts"],
    verb: "ready",
    emptyText: "Set up your brand voice to get started",
    items: [],
  },
];

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
            compact ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-sm"
          }`}
        >
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Upgrade
        </button>
      )}
    >
      {(close) => (
        <div className="p-1">
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
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
              className="mt-3 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
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
}: {
  tasks: Task[];
  onApply: (id: number) => void;
  onDismiss: (id: number) => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  plan: Plan;
  onUpgrade: () => void;
  onReview: (request: ApprovalRequest) => void;
}) {
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
    return staticItems[channel.id] ?? [];
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
      onApprove: () => resolve(onApply),
      onDismiss: () => resolve(onDismiss),
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
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
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
                <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
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
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">
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

      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {channels.map((channel) => {
          const items = itemsFor(channel);
          const isLocked = channel.locked && plan === "free";
          const isExpanded = expanded === channel.id;
          const Icon = channel.icon;
          const noun = items.length === 1 ? channel.noun[0] : channel.noun[1];
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
              className={`rounded-2xl border bg-white transition-[box-shadow,opacity] duration-200 ${
                overId === channel.id && dragId !== channel.id
                  ? "border-zinc-400 ring-2 ring-zinc-300"
                  : "border-zinc-200"
              } ${dragId === channel.id ? "opacity-50" : ""}`}
            >
              <div className="group flex items-center gap-2 px-2 py-3">
                <button
                  type="button"
                  draggable
                  aria-label={`Drag to reorder ${channel.name}. Use the arrow keys to move it.`}
                  title="Drag to reorder"
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
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      move(channel.id, -1);
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      move(channel.id, 1);
                    }
                  }}
                  className="flex h-8 w-5 shrink-0 cursor-grab items-center justify-center rounded text-zinc-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-zinc-600 focus-visible:opacity-100 active:cursor-grabbing"
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
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpanded((current) =>
                      current === channel.id ? null : channel.id,
                    )
                  }
                  className="min-w-0 flex-1 cursor-pointer text-left"
                >
                  <p className="text-sm font-bold tracking-wide text-zinc-900 uppercase">
                    {channel.name}
                  </p>
                  <p className="truncate text-sm text-zinc-600">
                    {subtitle(channel, items)}
                  </p>
                </button>
                {isLocked && (
                  <UpgradePill plan={plan} onUpgrade={onUpgrade} compact />
                )}
                <IconButton
                  label={isExpanded ? "Collapse" : "Expand"}
                  aria-expanded={isExpanded}
                  className="h-8 w-8"
                  onClick={() =>
                    setExpanded((current) =>
                      current === channel.id ? null : channel.id,
                    )
                  }
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </IconButton>
              </div>

              {isExpanded && (
                <div className="border-t border-zinc-100 px-4 py-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-zinc-600">
                      {channel.emptyText}. This agent posts here as soon as it
                      has something for you.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl bg-zinc-50 px-3 py-2.5"
                        >
                          <p className="text-sm font-medium text-zinc-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500">{item.detail}</p>
                          {isLocked ? (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                              <Lock className="h-3 w-3" aria-hidden="true" />
                              Upgrade to let this agent act on it
                            </p>
                          ) : (
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  item.post
                                    ? setPostDrawer({
                                        channelId: channel.id,
                                        itemId: item.id,
                                      })
                                    : onReview(requestFor(channel, item))
                                }
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                              >
                                <Eye
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                                {item.post ? "Review post" : "View and approve"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  item.taskId !== undefined
                                    ? onDismiss(item.taskId)
                                    : resolveStatic(channel.id, item.id)
                                }
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors duration-200 hover:bg-zinc-100"
                              >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                                Dismiss
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isLocked && items.length > 0 && (
                    <p className="mt-3 text-xs text-zinc-500">
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
          agentName={
            activeChannel
              ? activeChannel.name.replace(/ Agent$/, " Writer")
              : "Writer"
          }
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
    </Panel>
  );
}
