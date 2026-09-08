"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  Pencil,
  Plus,
  Sparkles,
  Target,
  UserRound,
  UserRoundCog,
  Users,
} from "lucide-react";
import {
  SiGoogleads,
  SiMeta,
  SiReddit,
  SiYoutube,
} from "react-icons/si";
import { Panel, PanelHeader } from "./Panel";

const runReview = [
  {
    name: "Reddit Ads",
    when: "Ran Sep 7, 2026, still running.",
    status: "No numbers attached to it yet.",
    readable: false,
    icon: SiReddit,
    iconColor: "bg-orange-600",
  },
  {
    name: "Meta Ads",
    when: "Ran Sep 7, 2026, delivered.",
    status: "Numbers readable.",
    readable: true,
    icon: SiMeta,
    iconColor: "bg-indigo-600",
  },
  {
    name: "Reddit Organic",
    when: "Ran Sep 6, 2026, delivered.",
    status: "No numbers attached to it yet.",
    readable: false,
    icon: SiReddit,
    iconColor: "bg-orange-500",
  },
  {
    name: "Influencer",
    when: "Ran Sep 5, 2026, delivered.",
    status: "No numbers attached to it yet.",
    readable: false,
    icon: Sparkles,
    iconColor: "bg-emerald-500",
  },
  {
    name: "Youtube Organic",
    when: "Ran Sep 5, 2026, delivered.",
    status: "No numbers attached to it yet.",
    readable: false,
    icon: SiYoutube,
    iconColor: "bg-red-600",
  },
  {
    name: "Google Ads",
    when: "Ran Sep 5, 2026, delivered.",
    status: "Numbers not readable yet.",
    readable: false,
    icon: SiGoogleads,
    iconColor: "bg-amber-500",
  },
  {
    name: "SEO",
    when: "Ran Sep 5, 2026, delivered.",
    status: "No numbers attached to it yet.",
    readable: false,
    icon: Sparkles,
    iconColor: "bg-sky-500",
  },
  {
    name: "Youtube Ads",
    when: "Ran Sep 4, 2026, delivered.",
    status: "No numbers attached to it yet.",
    readable: false,
    icon: SiYoutube,
    iconColor: "bg-red-700",
  },
];

const goalsTracked = [
  {
    title: "Grow verified hosts to 800 by September",
    detail: "Suppliers to 800 by Sep 30, 2026. Nothing has put a number against this yet.",
    status: "active",
  },
  {
    title: "Grow my MRR to 100k",
    detail: "MRR to 100,000 by Sep 30, 2026. Now at 1,492.",
    status: "active",
  },
  {
    title: "Grow ARR to $10,000 by Nov 23",
    detail: "ARR to 10,000 by Nov 23, 2026. Now at 20,280.",
    status: "met",
  },
  {
    title: "Grow Upcar weekly guest signups to 500",
    detail: "Weekly Signups to 500. Now at 3,640.",
    status: "met",
  },
];

const numbersBehindThem = [
  {
    label: "Signups",
    source: "Operator Db had nothing for this, through Sep 7, 2026.",
    value: "Not readable yet",
  },
  {
    label: "Bookings",
    source: "Operator Db had nothing for this, through Sep 7, 2026.",
    value: "Not readable yet",
  },
  {
    label: "Ad spend",
    source: "Read from Meta Ads, through Sep 7, 2026.",
    value: "$1,077.23",
  },
  {
    label: "Ad CPA",
    source: "$1,077.23 of spend over 265 conversions.\nRead from Meta Ads, through Sep 7, 2026.",
    value: "$4.07",
  },
  {
    label: "Google Ads spend",
    source: "Google Ads had nothing for this, through Sep 7, 2026.",
    value: "Not readable yet",
  },
  {
    label: "Google Ads CPA",
    source: "Google Ads had nothing for this, through Sep 7, 2026.",
    value: "Not readable yet",
  },
  {
    label: "MRR",
    source: "Read from Stripe, through Sep 7, 2026.",
    value: "$1,492",
  },
];

function Section({
  number,
  title,
  meta,
  collapsed,
  onToggle,
  children,
}: {
  number: string;
  title: string;
  meta?: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-[#F0F0F0] pt-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className="flex cursor-pointer items-baseline gap-2 text-left"
        >
          <span className="text-2xl font-semibold text-zinc-500">
            {number}
          </span>
          <h3 className="text-2xl font-bold text-zinc-900">{title}</h3>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {typeof meta === "string" ? (
            <span className="text-sm text-zinc-400">{meta}</span>
          ) : (
            meta
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand section" : "Collapse section"}
            className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center text-zinc-400 transition-colors duration-200 hover:text-zinc-700"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                collapsed ? "" : "rotate-180"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      {!collapsed && <div className="pt-3">{children}</div>}
    </section>
  );
}

export default function GrowthPlanPanel({
  onOpenGoals,
}: {
  onOpenGoals: () => void;
}) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  function toggleSection(id: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Panel>
      <PanelHeader>
        <Target className="h-5 w-5 shrink-0 text-zinc-800" aria-hidden="true" />
        <h2 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-zinc-900">
          The Plan
        </h2>
      </PanelHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <h3 className="text-2xl font-bold text-zinc-900">
          Your growth plan
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">
          Restated in full every time, in the same order. A plan you can
          recite is a plan you can argue with.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200">
                <Target className="h-4 w-4" aria-hidden="true" />
              </span>
              Goals tracked
            </div>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">2 of 3</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200">
                <UserRound className="h-4 w-4" aria-hidden="true" />
              </span>
              On you
            </div>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">0</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200">
                <UserRoundCog className="h-4 w-4" aria-hidden="true" />
              </span>
              On me
            </div>
            <p className="mt-3 text-2xl font-semibold text-amber-700">4</p>
          </div>
        </div>

        <Section
          number="01"
          title="The plan, restated"
          meta="Restated in full, unchanged"
          collapsed={collapsedSections.has("plan")}
          onToggle={() => toggleSection("plan")}
        >
          <p className="text-sm leading-relaxed text-zinc-700">
            The plan is not written down here yet. When it is, this is
            where the number I own and the one thing holding it back will
            sit, restated the same way every time.
          </p>
          <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
            <p className="text-sm leading-relaxed text-zinc-600">
              I restate this in full every time, even when you already
              know it. If it changes, this section says so and names who
              changed it.
            </p>
          </div>
        </Section>

        <Section
          number="02"
          title="Who it's on"
          meta="Sorted by who has to move, not by priority"
          collapsed={collapsedSections.has("who")}
          onToggle={() => toggleSection("who")}
        >
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between bg-zinc-50 px-4 py-2.5">
                <p className="flex items-center gap-2 text-sm">
                  <UserRoundCog
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <span className="font-bold text-zinc-900">ON ME</span>{" "}
                  <span className="text-zinc-500">the coach</span>
                </p>
                <span className="text-sm text-zinc-500">4 items</span>
              </div>
              <div className="divide-y divide-zinc-100">
                <div className="px-4 py-4">
                  <p className="text-[15px] font-bold text-zinc-900">
                    18 of your 26 channels have not run yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Affiliate, ASO, Community, Content, Email Marketing, In
                    Product, Lifecycle, Linkedin Ads, Marketplaces,
                    Partnerships, PR, Push, Referral, Reviews, SMS, Social
                    Organic, Tiktok Ads and Winback. Not your backlog. Mine.
                  </p>
                </div>
                <div className="px-4 py-4">
                  <p className="text-[15px] font-bold text-zinc-900">
                    1 channel ran but I cannot read the numbers yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Google Ads. They ran. The reading is what is missing, and
                    that is mine to fix.
                  </p>
                </div>
                <div className="px-4 py-4">
                  <p className="text-[15px] font-bold text-zinc-900">
                    6 channels have no number attached at all
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Reddit Ads, Reddit Organic, Influencer, Youtube Organic,
                    SEO and Youtube Ads. Nothing was ever set up to measure
                    them, so I cannot tell you what they did. Also mine.
                  </p>
                </div>
                <div className="px-4 py-4">
                  <p className="text-[15px] font-bold text-zinc-900">
                    1 goal has no number against it yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Grow verified hosts to 800 by September. Until something
                    reads them, they are not being tracked. They are being
                    hoped about.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between bg-zinc-50 px-4 py-2.5">
                <p className="flex items-center gap-2 text-sm">
                  <UserRound
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <span className="font-bold text-zinc-900">ON YOU</span>{" "}
                  <span className="text-zinc-500">a few minutes, total</span>
                </p>
                <span className="text-sm text-zinc-500">clear</span>
              </div>
              <div className="px-4 py-4">
                <p className="text-[15px] font-bold text-zinc-900">
                  Your side is clear
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Nothing is waiting on you right now. Everything open on
                  this page is mine.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between bg-zinc-50 px-4 py-2.5">
                <p className="flex items-center gap-2 text-sm">
                  <Users
                    className="h-4 w-4 shrink-0 text-zinc-500"
                    aria-hidden="true"
                  />
                  <span className="font-bold text-zinc-900">
                    NEITHER OF US
                  </span>{" "}
                  <span className="text-zinc-500">
                    answer it, do not chase it
                  </span>
                </p>
                <span className="text-sm text-zinc-500">none recorded</span>
              </div>
              <div className="px-4 py-4">
                <p className="text-[15px] font-bold text-zinc-900">
                  Nothing recorded here yet
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Some things are blocked on someone neither of us controls.
                  I am not tracking those yet, so read this as silence, not
                  as an all clear.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          number="03"
          title="The review"
          meta="What ran, and what I can read"
          collapsed={collapsedSections.has("review")}
          onToggle={() => toggleSection("review")}
        >
          <p className="text-lg font-bold text-zinc-900">
            8 channels ran. I can read the numbers on 1 of them.
          </p>
          <div className="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200">
            {runReview.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.name}
                  className="flex items-start gap-3 px-4 py-3.5"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${row.iconColor}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-zinc-900">
                      {row.name}
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-600">{row.when}</p>
                    <p
                      className={`text-sm ${row.readable ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      {row.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Not run yet: Affiliate, ASO, Community, Content, Email
            Marketing, In Product, Lifecycle, Linkedin Ads, Marketplaces,
            Partnerships, PR, Push, Referral, Reviews, SMS, Social Organic,
            Tiktok Ads and Winback.
          </p>
        </Section>

        <Section
          number="04"
          title="Open decisions"
          meta="Nothing open"
          collapsed={collapsedSections.has("decisions")}
          onToggle={() => toggleSection("decisions")}
        >
          <p className="text-sm leading-relaxed text-zinc-700">
            Nothing is waiting on your decision right now. When I want to
            try something, it is written here as a question with what I
            expect and what would prove me wrong.
          </p>
        </Section>

        <Section
          number="05"
          title="What we track"
          meta={
            <>
              <span className="text-sm text-zinc-400">Cap is 3</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenGoals();
                }}
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-zinc-900 hover:text-zinc-600"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add a goal
              </button>
            </>
          }
          collapsed={collapsedSections.has("track")}
          onToggle={() => toggleSection("track")}
        >
          <ul className="divide-y divide-zinc-100">
            {goalsTracked.map((goal, index) => (
              <li key={goal.title} className="flex items-start gap-3 py-4">
                <span className="pt-0.5 text-sm text-zinc-400">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] font-bold text-zinc-900">
                      {goal.title}
                    </p>
                    <button
                      type="button"
                      onClick={onOpenGoals}
                      className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-600">
                    {goal.detail}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${
                        goal.status === "met"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {goal.status}
                    </span>
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-sm font-medium text-zinc-600">
                      you added this
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            The numbers behind them
          </p>
          <div className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200">
            {numbersBehindThem.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 px-4 py-3.5"
              >
                <div>
                  <p className="text-[15px] font-bold text-zinc-900">
                    {row.label}
                  </p>
                  <p className="mt-0.5 text-sm whitespace-pre-line text-zinc-500">
                    {row.source}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-lg font-semibold ${
                    row.value === "Not readable yet"
                      ? "text-zinc-400"
                      : "text-zinc-900"
                  }`}
                >
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          number="06"
          title="What changed"
          meta="Nothing here changes silently"
          collapsed={collapsedSections.has("changed")}
          onToggle={() => toggleSection("changed")}
        >
          <p className="text-sm leading-relaxed text-zinc-700">
            Nothing yet. Every change you or I make lands here, with who
            made it.
          </p>
        </Section>
      </div>
    </Panel>
  );
}
