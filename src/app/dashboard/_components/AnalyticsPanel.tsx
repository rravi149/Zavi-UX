"use client";

import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  ChartNoAxesColumn,
  Check,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { IconButton, Panel, PanelHeader } from "./Panel";
import { Dropdown, menuItemClass } from "./Dropdown";
import MetaAnalytics from "./MetaAnalytics";
import SeoAnalytics from "./SeoAnalytics";
import SocialAnalytics from "./SocialAnalytics";

const tabs = [
  "Overview",
  "Meta Ads",
  "Google Ads",
  "Competitors",
  "SEO",
  "GEO",
  "Email",
  "Social",
  "Traffic",
  "Technical",
  "Goals",
] as const;

type Tab = (typeof tabs)[number];

const channels: { name: Tab; description: string; off?: boolean }[] = [
  { name: "Meta Ads", description: "Paid social spend and bookings" },
  { name: "Google Ads", description: "Search and PMax performance", off: true },
  { name: "Competitors", description: "Who is moving against you" },
  { name: "SEO", description: "Rankings and crawl health" },
  { name: "GEO", description: "Citations in AI answers" },
  { name: "Email", description: "Lifecycle and broadcast" },
  { name: "Social", description: "Organic reach and posts" },
  { name: "Traffic", description: "Sessions and funnel" },
  { name: "Technical", description: "Ship velocity and bugs" },
];

const ranges = [
  "Last 7 days",
  "Last 30 days",
  "Custom: Sep 27, 2026 – Sep 30, 2026",
];

export default function AnalyticsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState(ranges[2]);

  function refresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 800);
  }

  const activeChannel = channels.find((channel) => channel.name === activeTab);

  return (
    <Panel>
      <PanelHeader>
        <ChartNoAxesColumn
          className="h-5 w-5 shrink-0 text-zinc-800"
          aria-hidden="true"
        />
        <h2 className="min-w-0 flex-1 truncate text-[17px] font-semibold text-zinc-900">
          Analytics
        </h2>
        <IconButton label="Refresh data" onClick={refresh}>
          <RefreshCw
            className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
          />
        </IconButton>
        <div className="ml-auto max-w-[62%] min-w-0 shrink">
          <Dropdown
            align="right"
            width="w-72"
            label="Date range"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-left">
                  {range}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-zinc-500"
                  aria-hidden="true"
                />
              </button>
            )}
          >
            {(close) => (
              <ul>
                {ranges.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        setRange(option);
                        refresh();
                        close();
                      }}
                      className={menuItemClass}
                    >
                      <span className="flex-1 truncate">{option}</span>
                      {option === range && (
                        <Check
                          className="h-4 w-4 text-zinc-900"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Dropdown>
        </div>
      </PanelHeader>

      <div
        role="tablist"
        aria-label="Analytics sections"
        className="flex gap-x-5 overflow-x-auto border-b border-zinc-200 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setActiveTab(tab)}
              className={`-mb-px shrink-0 cursor-pointer border-b-2 py-2 text-[15px] whitespace-nowrap transition-colors duration-200 ${
                active
                  ? "border-zinc-900 font-medium text-zinc-900"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="min-h-0 flex-1 overflow-y-auto bg-[#f9f9f9] px-4 pt-4 pb-4"
      >
        {activeTab === "Overview" ? (
          <>
            <h3 className="text-xl font-semibold text-zinc-900">
              Every channel
            </h3>
            <ul className="mt-3 space-y-1.5">
              {channels.map((channel) => (
                <li key={channel.name}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(channel.name)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-left transition-colors duration-200 hover:bg-zinc-50"
                  >
                    <span>
                      <span className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-zinc-900">
                          {channel.name}
                        </span>
                        {channel.off && (
                          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600">
                            off
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-zinc-600">
                        {channel.description}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-zinc-400 transition-colors duration-200 group-hover:text-zinc-900"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : activeTab === "Meta Ads" ? (
          <MetaAnalytics range={range} />
        ) : activeTab === "SEO" ? (
          <SeoAnalytics range={range} />
        ) : activeTab === "Social" ? (
          <SocialAnalytics range={range} />
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-zinc-900">
              {activeTab}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-zinc-600">
              {activeChannel?.off
                ? `${activeTab} is off. Connect it to start collecting data for ${range.toLowerCase()}.`
                : `No ${activeTab.toLowerCase()} data for ${range.toLowerCase()} yet.`}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("Overview")}
              className="mt-5 cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              Back to overview
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}
