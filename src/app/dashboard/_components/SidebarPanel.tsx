"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Check,
  ChevronDown,
  ChartNoAxesColumn,
  EllipsisVertical,
  Goal,
  House,
  Inbox,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Plug,
  PanelLeftOpen,
  PanelRight,
  Plus,
  ListChecks,
  SquarePen,
  Settings,
  Target,
  Wallet,
} from "lucide-react";
import { DragHandle, IconButton, Panel } from "./Panel";
import { BrandMark, ZaviLogo } from "./Brand";
import { Dropdown, menuItemClass } from "./Dropdown";
import type { DrawerKind, PanelId, SettingsSection } from "./types";

function OnboardingRing({ progress }: { progress: number }) {
  return (
    <span
      className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#18181b ${progress}%, #e4e4e7 ${progress}% 100%)`,
      }}
      aria-hidden="true"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-white" />
    </span>
  );
}

function scrollToPanel(id: PanelId) {
  document
    .querySelector<HTMLElement>(`[data-panel="${id}"]`)
    ?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
}

const previews = [
  { text: "Hey, are you free tonight?" },
  { text: "Just sent the files over!", highlighted: true },
  { text: "Lol that's hilarious 😂" },
  { text: "Can you review the PR before 5?" },
  { text: "Sure — I'll ping you when it's done." },
];

const VISIBLE_PREVIEWS = 3;
const accountItemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-zinc-800 transition-colors duration-200 hover:bg-zinc-100";
const userEmail = "ritesh@ritech.ai";

export default function SidebarPanel({
  workspace,
  workspaces,
  onWorkspaceChange,
  collapsed,
  onToggleCollapse,
  onNewChat,
  onboarding,
  activeGoals,
  onOpenDrawer,
  onOpenBrain,
  onOpenSettings,
}: {
  workspace: string;
  workspaces: string[];
  onWorkspaceChange: (workspace: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  onboarding: { done: number; total: number };
  activeGoals: number;
  onOpenDrawer: (kind: DrawerKind) => void;
  onOpenBrain: () => void;
  onOpenSettings: (section?: SettingsSection) => void;
}) {
  const [activeNav, setActiveNav] = useState<"home" | "analytics" | "feed">(
    "home",
  );
  const [chatOpen, setChatOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const visiblePreviews = showAll
    ? previews
    : previews.slice(0, VISIBLE_PREVIEWS);

  const progress = Math.round((onboarding.done / onboarding.total) * 100);

  if (collapsed) {
    return (
      <Panel>
        <div className="flex h-full flex-col items-center py-3">
          <IconButton label="Expand sidebar" onClick={onToggleCollapse}>
            <PanelLeftOpen className="h-5 w-5" />
          </IconButton>
          <BrandMark className="mt-3 h-6 w-6" />
          <ul className="mt-4 flex flex-col items-center gap-1">
            <li>
              <IconButton
                label={`Onboarding, ${progress}% complete`}
                onClick={() => onOpenDrawer("onboarding")}
              >
                <ListChecks className="h-5 w-5" />
              </IconButton>
            </li>
            <li>
              <IconButton
                label={`Goals, ${activeGoals} active`}
                onClick={() => onOpenDrawer("goals")}
              >
                <Goal className="h-5 w-5" />
              </IconButton>
            </li>
          </ul>
          <button
            type="button"
            aria-label="Open the Zavi chat"
            onClick={onToggleCollapse}
            className="mt-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl"
          >
            <ZaviLogo size={36} className="rounded-xl" />
          </button>
          <span
            className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 text-sm font-semibold text-zinc-700"
            title="Ritesh"
          >
            R
          </span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-4">
        <DragHandle className="absolute top-0.5 left-1/2 -translate-x-1/2" />
        <Dropdown
          label="Switch workspace"
          width="w-56"
          trigger={({ open, toggle, id }) => (
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls={id}
              onClick={toggle}
              className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg text-[17px] font-semibold text-zinc-900"
            >
              <BrandMark />
              <span className="truncate">{workspace}</span>
              <ChevronDown
                className={`ml-1 h-4 w-4 shrink-0 text-zinc-700 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
                strokeWidth={2.25}
                aria-hidden="true"
              />
            </button>
          )}
        >
          {(close) => (
            <ul>
              {workspaces.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => {
                      onWorkspaceChange(name);
                      close();
                    }}
                    className={menuItemClass}
                  >
                    <BrandMark className="h-4 w-4" />
                    <span className="flex-1 truncate">{name}</span>
                    {name === workspace && (
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
        <div className="flex items-center gap-1">
          <IconButton label="New chat" onClick={onNewChat}>
            <SquarePen className="h-5 w-5" />
          </IconButton>
          <IconButton label="Collapse sidebar" onClick={onToggleCollapse}>
            <PanelRight className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav aria-label="Workspace">
          <ul className="py-2">
            <li>
              <button
                type="button"
                onClick={() => onOpenDrawer("onboarding")}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-zinc-50"
              >
                <OnboardingRing progress={progress} />
                <span className="flex-1 text-[15px] font-medium text-zinc-900">
                  Onboarding
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700">
                  {progress}%
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                aria-current={activeNav === "home" ? "page" : undefined}
                onClick={() => {
                  setActiveNav("home");
                  document
                    .querySelector("main")
                    ?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <House className="h-5 w-5 shrink-0 text-zinc-800" />
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onNewChat}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <SquarePen className="h-5 w-5 shrink-0 text-zinc-800" />
                New chat
              </button>
            </li>
            <li>
              <button
                type="button"
                aria-current={activeNav === "analytics" ? "page" : undefined}
                onClick={() => {
                  setActiveNav("analytics");
                  scrollToPanel("analytics");
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <ChartNoAxesColumn className="h-5 w-5 shrink-0 text-zinc-800" />
                Analytics
              </button>
            </li>
            <li>
              <button
                type="button"
                aria-current={activeNav === "feed" ? "page" : undefined}
                onClick={() => {
                  setActiveNav("feed");
                  scrollToPanel("channel");
                }}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <Inbox className="h-5 w-5 shrink-0 text-zinc-800" />
                Feed
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenDrawer("goals")}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <Target className="h-5 w-5 shrink-0 text-zinc-800" />
                <span className="flex-1">Goal</span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-sm font-medium text-zinc-700">
                  {activeGoals} active
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenSettings("integrations")}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
              >
                <LayoutGrid className="h-5 w-5 shrink-0 text-zinc-800" />
                Toolkit
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t border-zinc-200" />

        <section aria-label="Chat">
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              type="button"
              aria-expanded={chatOpen}
              aria-controls="sidebar-chat-list"
              onClick={() => setChatOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1 text-xs font-semibold tracking-[0.12em] text-zinc-600 uppercase transition-colors duration-200 hover:text-zinc-900"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  chatOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
              Chat
            </button>
            <IconButton
              label="Start a new chat"
              className="ml-auto"
              onClick={onNewChat}
            >
              <Plus className="h-5 w-5" />
            </IconButton>
          </div>

          {chatOpen && (
            <ul id="sidebar-chat-list" className="pb-3">
              <li className="relative">
                <span
                  className="absolute top-0 left-0 h-full w-1.5 rounded-r-full bg-zinc-900"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  aria-current="true"
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors duration-200 hover:bg-zinc-50"
                >
                  <ZaviLogo size={44} className="rounded-xl" />
                  <span className="text-[17px] text-zinc-900">Zavi</span>
                </button>
                <div className="pr-4 pl-[4.75rem]">
                  <ul className="space-y-1">
                    {visiblePreviews.map((preview) => (
                      <li
                        key={preview.text}
                        className={`-mx-3 rounded-2xl px-3 py-1.5 text-[15px] leading-snug text-zinc-900 ${
                          preview.highlighted ? "bg-zinc-100" : ""
                        }`}
                      >
                        {preview.text}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className="mt-2 cursor-pointer text-[15px] text-zinc-400 transition-colors duration-200 hover:text-zinc-700"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                </div>
              </li>
            </ul>
          )}
        </section>
      </div>

      <footer className="flex shrink-0 items-center gap-3 border-t border-zinc-200 px-4 py-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 text-base font-semibold text-zinc-700">
          R
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-zinc-900">
            Ritesh
          </p>
          <p className="truncate text-sm text-zinc-500">{userEmail}</p>
        </div>
        <Dropdown
          align="right"
          width="w-72"
          placement="top"
          label="Account menu"
          trigger={({ open, toggle, id }) => (
            <IconButton
              label="Account menu"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls={id}
              onClick={toggle}
            >
              <EllipsisVertical className="h-5 w-5" />
            </IconButton>
          )}
        >
          {(close) => (
            <div className="p-0.5">
              <div className="flex items-center gap-3 px-2 py-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 text-sm font-semibold text-zinc-700">
                  R
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    Ritesh
                  </p>
                  <p className="truncate text-xs text-zinc-500">{userEmail}</p>
                </div>
              </div>

              <div className="my-1 h-px bg-zinc-100" />

              <p className="px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Workspace
              </p>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onOpenBrain();
                    }}
                    className={accountItemClass}
                  >
                    <Brain
                      className="h-4 w-4 text-zinc-500"
                      aria-hidden="true"
                    />
                    Brain
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onOpenSettings("integrations");
                    }}
                    className={accountItemClass}
                  >
                    <Plug
                      className="h-4 w-4 text-zinc-500"
                      aria-hidden="true"
                    />
                    Integrations
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onOpenSettings("billing");
                    }}
                    className={accountItemClass}
                  >
                    <Wallet
                      className="h-4 w-4 text-zinc-500"
                      aria-hidden="true"
                    />
                    <span className="flex-1">Billing &amp; Credits</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                      Free
                    </span>
                  </button>
                </li>
              </ul>

              <div className="my-1 h-px bg-zinc-100" />

              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onOpenSettings();
                    }}
                    className={accountItemClass}
                  >
                    <Settings
                      className="h-4 w-4 text-zinc-500"
                      aria-hidden="true"
                    />
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onOpenDrawer("help");
                    }}
                    className={accountItemClass}
                  >
                    <LifeBuoy
                      className="h-4 w-4 text-zinc-500"
                      aria-hidden="true"
                    />
                    Help &amp; support
                  </button>
                </li>
              </ul>

              <div className="my-1 h-px bg-zinc-100" />

              <Link
                href="/"
                onClick={close}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Link>
            </div>
          )}
        </Dropdown>
      </footer>
    </Panel>
  );
}
