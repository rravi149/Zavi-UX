"use client";

import { useState } from "react";
import {
  Calendar,
  ChartNoAxesColumn,
  Check,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
} from "lucide-react";
import { IconButton, Panel, PanelHeader } from "./Panel";
import { Dropdown, menuItemClass } from "./Dropdown";
import MetaAnalytics from "./MetaAnalytics";
import SeoAnalytics from "./SeoAnalytics";

export const tabs = ["Meta Ads", "Google Ads", "SEO", "GEO"] as const;

export type Tab = (typeof tabs)[number];

const channels: { name: Tab; description: string; off?: boolean }[] = [
  { name: "Meta Ads", description: "Paid social spend and bookings" },
  { name: "Google Ads", description: "Search and PMax performance", off: true },
  { name: "SEO", description: "Rankings and crawl health" },
  { name: "GEO", description: "Citations in AI answers" },
];

const ranges = [
  "Last 7 days",
  "Last 30 days",
  "Custom: Sep 27, 2026 – Sep 30, 2026",
];

export default function AnalyticsPanel({
  collapsed,
  onToggleCollapse,
  activeTab,
  onActiveTabChange,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  activeTab: Tab;
  onActiveTabChange: (tab: Tab) => void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState(ranges[2]);
  const [connected, setConnected] = useState<Tab[]>([]);

  function refresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 800);
  }

  const activeChannel = channels.find((channel) => channel.name === activeTab);
  const isOff = Boolean(activeChannel?.off) && !connected.includes(activeTab);

  if (collapsed) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 py-3">
          <IconButton label="Expand analytics" onClick={onToggleCollapse}>
            <PanelRightOpen className="h-5 w-5" />
          </IconButton>
          <ChartNoAxesColumn
            className="h-5 w-5 text-zinc-700"
            aria-hidden="true"
          />
        </div>
      </Panel>
    );
  }

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
        <Dropdown
          align="right"
          width="w-72"
          label="Date range"
          trigger={({ open, toggle, id }) => (
            <IconButton
              label={`Date range: ${range}`}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls={id}
              onClick={toggle}
            >
              <Calendar className="h-5 w-5" />
            </IconButton>
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
        {onToggleCollapse && (
          <IconButton label="Collapse analytics" onClick={onToggleCollapse}>
            <PanelRightClose className="h-5 w-5" />
          </IconButton>
        )}
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
              onClick={() => onActiveTabChange(tab)}
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
        {activeTab === "Meta Ads" ? (
          <MetaAnalytics range={range} />
        ) : activeTab === "SEO" ? (
          <SeoAnalytics range={range} />
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-zinc-900">
              {activeTab}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-zinc-600">
              {isOff
                ? `${activeTab} isn't connected yet. Connect it to start collecting data for ${range.toLowerCase()}.`
                : `No ${activeTab.toLowerCase()} data for ${range.toLowerCase()} yet.`}
            </p>
            {isOff ? (
              <button
                type="button"
                onClick={() =>
                  setConnected((prev) =>
                    prev.includes(activeTab) ? prev : [...prev, activeTab],
                  )
                }
                className="mt-5 cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
              >
                Connect {activeTab}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onActiveTabChange("Meta Ads")}
                className="mt-5 cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
              >
                Back to Meta Ads
              </button>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}
