"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SidebarPanel from "./SidebarPanel";
import ChatPanel, {
  buildThreadSeeds,
  growThreadSeeds,
  type ChatPanelHandle,
  type ComposerSeed,
  type Mode,
} from "./ChatPanel";
import AnalyticsPanel, { type Tab as AnalyticsTab } from "./AnalyticsPanel";
import ChannelPanel from "./ChannelPanel";
import BuildPreview from "./BuildPreview";
import { ChannelBadge, Drawer } from "./Drawer";
import OnboardingDrawer from "./OnboardingDrawer";
import GoalsDrawer from "./GoalsDrawer";
import GrowthPlanPanel from "./GrowthPlanPanel";
import GrowthChatPanel from "./GrowthChatPanel";
import SettingsModal from "./SettingsModal";
import BrainModal from "./BrainModal";
import HelpDrawer from "./HelpDrawer";
import ApprovalDrawer from "./ApprovalDrawer";
import { PanelDndProvider, PanelSlot, type PanelDnd } from "./Panel";
import { initialOnboardingDone, onboardingSteps } from "./onboarding";
import { focusAreaOptions } from "../../start/_components/data";
import type {
  Competitor,
  FocusAreaId,
  OnboardingData,
} from "../../start/_components/types";
import type {
  ApprovalRequest,
  DrawerKind,
  SettingsSection,
  Goal,
  PanelId,
  Plan,
  Task,
  TaskSource,
} from "./types";

function lockColumnCursor() {
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
}

function releaseColumnCursor() {
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
}

const workspaces = ["Apna Tutor", "Zavi", "Design Forest"];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Add pricing section with three plans",
    source: "build",
    status: "review",
    when: "2 hours ago",
  },
  {
    id: 2,
    title: "Change the logo to Design Forest",
    source: "grow",
    status: "review",
    when: "40 minutes ago",
  },
];

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Increase customer retention rate to 95%",
    category: "retention",
    started: "2026-07-01",
    due: "2026-10-30",
    current: 82,
    target: 95,
    unit: "%",
    done: false,
    channels: ["facebook", "reddit"],
  },
  {
    id: 2,
    title: "Expand into 5 new enterprise accounts by Q4",
    category: "sales",
    started: "2026-06-01",
    due: "2026-12-16",
    current: 1,
    target: 5,
    unit: "",
    done: false,
    channels: ["facebook", "reddit"],
  },
  {
    id: 3,
    title: "Ship redesigned onboarding flow to all users",
    category: "product",
    started: "2026-07-15",
    due: "2026-09-15",
    current: 55,
    target: 100,
    unit: "%",
    done: false,
    channels: ["facebook", "reddit"],
  },
  {
    id: 4,
    title: "Reach 1,000 signups this quarter",
    category: "growth",
    started: "2026-07-01",
    due: "2026-09-30",
    current: 318,
    target: 1000,
    unit: "",
    done: false,
    channels: ["google", "x"],
  },
  {
    id: 5,
    title: "Grow the email list to 5,000",
    category: "marketing",
    started: "2026-01-01",
    due: "2026-12-31",
    current: 3860,
    target: 5000,
    unit: "",
    done: false,
    channels: ["facebook", "google"],
  },
  {
    id: 6,
    title: "Publish the pricing page",
    category: "product",
    started: "2026-08-01",
    due: "2026-08-20",
    current: 1,
    target: 1,
    unit: "",
    done: true,
    channels: ["x"],
  },
];

const initialOrder: Record<Mode, PanelId[]> = {
  grow: ["sidebar", "chat", "channel", "analytics"],
  build: ["chat", "preview"],
  growth: ["sidebar", "growthPlan", "growthChat"],
};

export default function Workspace() {
  const [mode, setMode] = useState<Mode>("grow");
  const [editing, setEditing] = useState(false);
  const [seed, setSeed] = useState<ComposerSeed | null>(null);
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [order, setOrder] = useState(initialOrder);
  const [collapsed, setCollapsed] = useState({
    sidebar: false,
    analytics: false,
    channel: false,
  });
  const [dragId, setDragId] = useState<PanelId | null>(null);
  const [overId, setOverId] = useState<PanelId | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>("Meta Ads");
  const [drawer, setDrawer] = useState<DrawerKind | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(initialOnboardingDone);
  const [onboardingNotes, setOnboardingNotes] = useState<
    Record<string, string>
  >({});
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [plan, setPlan] = useState<Plan>("free");
  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [approvalExpanded, setApprovalExpanded] = useState(true);
  const [brainOpen, setBrainOpen] = useState(false);
  const [settings, setSettings] = useState<{
    section?: SettingsSection;
  } | null>(null);
  const [panelWidths, setPanelWidths] = useState<
    Partial<Record<PanelId, number>>
  >({});
  const mainRef = useRef<HTMLElement>(null);
  const [growThreads, setGrowThreads] = useState(growThreadSeeds);
  const [buildThreads, setBuildThreads] = useState(buildThreadSeeds);
  const [activeGrowId, setActiveGrowId] = useState(growThreadSeeds[0].id);
  const [activeBuildId, setActiveBuildId] = useState(buildThreadSeeds[0].id);
  const nextTaskId = useRef(100);
  const nextGoalId = useRef(100);
  const chatRef = useRef<ChatPanelHandle>(null);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem("zavi:onboarding");
    } catch {
      return;
    }
    if (!raw) return;
    window.localStorage.removeItem("zavi:onboarding");

    let payload: Partial<OnboardingData>;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const completedSteps: string[] = [];
    const notes: Record<string, string> = {};

    if (payload.companyName) {
      setWorkspace(payload.companyName);
      completedSteps.push("company");
      const companyNote = [
        payload.companyWebsite ? `Website: ${payload.companyWebsite}` : null,
        payload.description || null,
      ]
        .filter(Boolean)
        .join(" — ");
      if (companyNote) notes.company = companyNote;
    }

    if (
      (payload.focusAreas && payload.focusAreas.length > 0) ||
      payload.primaryGoal ||
      (payload.competitors && payload.competitors.length > 0)
    ) {
      const focusLabel = (id: FocusAreaId) =>
        focusAreaOptions.find((option) => option.id === id)?.label ?? id;

      const focusNote =
        payload.focusAreas && payload.focusAreas.length > 0
          ? `Focus areas: ${payload.focusAreas.map(focusLabel).join(", ")}.`
          : null;
      const primaryGoalNote = payload.primaryGoal
        ? `Primary goal: ${focusLabel(payload.primaryGoal)}.`
        : null;
      const competitorNote =
        payload.competitors && payload.competitors.length > 0
          ? `Competitors: ${payload.competitors
              .map((competitor: Competitor) => competitor.name)
              .join(", ")}.`
          : null;

      const growthNote = [focusNote, primaryGoalNote, competitorNote]
        .filter(Boolean)
        .join(" ");

      completedSteps.push("gtm-growth");
      if (growthNote) notes["gtm-growth"] = growthNote;

      if (primaryGoalNote) {
        completedSteps.push("metrics");
        notes.metrics = primaryGoalNote;
      }
    }

    if (payload.connectedIntegrations && payload.connectedIntegrations.length > 0) {
      completedSteps.push("data-source");
      notes["data-source"] = `Connected: ${payload.connectedIntegrations.join(", ")}.`;
    }

    if (payload.teamEmails && payload.teamEmails.length > 0) {
      completedSteps.push("team-roles");
      notes["team-roles"] = `Invited: ${payload.teamEmails.join(", ")}.`;
    }

    if (completedSteps.length > 0) {
      setOnboardingDone((prev) => [
        ...prev,
        ...completedSteps.filter((id) => !prev.includes(id)),
      ]);
    }
    if (Object.keys(notes).length > 0) {
      setOnboardingNotes((prev) => ({ ...prev, ...notes }));
    }
    // Runs once on mount to absorb answers from the /start wizard, if any.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = useCallback((title: string, source: TaskSource) => {
    setTasks((prev) => [
      ...prev,
      {
        id: nextTaskId.current++,
        title,
        source,
        status: "review",
        when: "just now",
      },
    ]);
  }, []);

  const applyTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "applied" } : task,
      ),
    );
  }, []);

  const dismissTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "dismissed" } : task,
      ),
    );
  }, []);

  const handleSelectElement = useCallback((label: string) => {
    setSeed({ text: `Update the ${label} — `, nonce: Date.now() });
    setEditing(false);
  }, []);

  const requestSelect = useCallback(() => setEditing(true), []);
  const upgrade = useCallback(() => setPlan("pro"), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const openBrain = useCallback(() => setBrainOpen(true), []);
  const closeBrain = useCallback(() => setBrainOpen(false), []);
  const openSettings = useCallback(
    (section?: SettingsSection) => setSettings({ section }),
    [],
  );
  const closeSettings = useCallback(() => setSettings(null), []);
  const openApproval = useCallback(
    (request: ApprovalRequest) => setApproval(request),
    [],
  );
  const closeApproval = useCallback(() => {
    setApproval(null);
    setApprovalExpanded(true);
  }, []);
  const askZavi = useCallback((text: string) => {
    setSeed({ text, nonce: Date.now() });
  }, []);

  const reorder = useCallback(
    (from: PanelId, to: PanelId) => {
      setOrder((prev) => {
        const list = prev[mode];
        const fromIndex = list.indexOf(from);
        const toIndex = list.indexOf(to);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return prev;
        }
        const next = [...list];
        next.splice(fromIndex, 1);
        next.splice(toIndex, 0, from);
        return { ...prev, [mode]: next };
      });
    },
    [mode],
  );

  const dnd = useMemo<PanelDnd>(
    () => ({
      dragId,
      overId,
      startDrag: (id) => setDragId(id),
      dragOver: (id) => setOverId(id),
      drop: (id) => {
        if (dragId) reorder(dragId, id);
        setDragId(null);
        setOverId(null);
      },
      endDrag: () => {
        setDragId(null);
        setOverId(null);
      },
      move: (id, direction) => {
        setOrder((prev) => {
          const list = prev[mode];
          const index = list.indexOf(id);
          const target = index + direction;
          if (index === -1 || target < 0 || target >= list.length) return prev;
          const next = [...list];
          next.splice(index, 1);
          next.splice(target, 0, id);
          return { ...prev, [mode]: next };
        });
      },
    }),
    [dragId, overId, reorder, mode],
  );

  const baseWidths: Record<PanelId, string> = {
    sidebar: collapsed.sidebar ? "64px" : "320px",
    chat: mode === "build" ? "420px" : "minmax(0,1fr)",
    analytics: collapsed.analytics ? "56px" : "minmax(0,1fr)",
    channel: collapsed.channel ? "56px" : "340px",
    preview: "minmax(0,1fr)",
    growthPlan: "minmax(0,1fr)",
    growthChat: "minmax(0,1fr)",
  };
  const isRail = (id: PanelId) =>
    (id === "sidebar" && collapsed.sidebar) ||
    (id === "analytics" && collapsed.analytics) ||
    (id === "channel" && collapsed.channel);
  const columnFor = (id: PanelId) => {
    const custom = panelWidths[id];
    if (custom !== undefined && !isRail(id)) return `${Math.round(custom)}px`;
    return baseWidths[id];
  };
  const isFlexible = (id: PanelId) =>
    panelWidths[id] === undefined && baseWidths[id].startsWith("minmax");
  const template = order[mode]
    .map((id, index) => (index === 0 ? columnFor(id) : `0px ${columnFor(id)}`))
    .join(" ");
  const activeGoals = goals.filter((goal) => !goal.done).length;
  function panelElement(id: PanelId) {
    return mainRef.current?.querySelector<HTMLElement>(`[data-panel="${id}"]`);
  }

  function minWidth(id: PanelId) {
    return id === "sidebar" ? 220 : id === "channel" ? 260 : 280;
  }

  function applyResize(
    left: PanelId,
    right: PanelId,
    leftStart: number,
    rightStart: number,
    delta: number,
  ) {
    const pair = leftStart + rightStart;
    // Resize whichever side is fixed so a flexible column absorbs the rest.
    const target = isFlexible(right) ? left : right;
    const other = target === left ? right : left;
    const startWidth = target === left ? leftStart : rightStart;
    const raw = target === left ? startWidth + delta : startWidth - delta;
    const next = Math.round(
      Math.max(minWidth(target), Math.min(pair - minWidth(other), raw)),
    );
    setPanelWidths((prev) => {
      const updated = { ...prev, [target]: next };
      if (!isFlexible(left) && !isFlexible(right)) {
        updated[other] = Math.round(pair - next);
      }
      return updated;
    });
  }

  function resizeBy(left: PanelId, right: PanelId, delta: number) {
    const leftEl = panelElement(left);
    const rightEl = panelElement(right);
    if (!leftEl || !rightEl) return;
    applyResize(
      left,
      right,
      leftEl.getBoundingClientRect().width,
      rightEl.getBoundingClientRect().width,
      delta,
    );
  }

  function startResize(
    left: PanelId,
    right: PanelId,
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (isRail(left) || isRail(right)) return;
    event.preventDefault();
    const leftEl = panelElement(left);
    const rightEl = panelElement(right);
    if (!leftEl || !rightEl) return;
    const startX = event.clientX;
    const leftStart = leftEl.getBoundingClientRect().width;
    const rightStart = rightEl.getBoundingClientRect().width;
    const move = (moveEvent: PointerEvent) => {
      applyResize(
        left,
        right,
        leftStart,
        rightStart,
        moveEvent.clientX - startX,
      );
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      releaseColumnCursor();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    lockColumnCursor();
  }

  function resetPair(left: PanelId, right: PanelId) {
    setPanelWidths((prev) => {
      const next = { ...prev };
      delete next[left];
      delete next[right];
      return next;
    });
  }

  function toggleOnboarding(id: string) {
    setOnboardingDone((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function completeOnboarding(id: string, note: string) {
    setOnboardingNotes((prev) => ({ ...prev, [id]: note }));
    setOnboardingDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function renderPanel(id: PanelId) {
    switch (id) {
      case "sidebar":
        return (
          <SidebarPanel
            workspace={workspace}
            workspaces={workspaces}
            onWorkspaceChange={setWorkspace}
            collapsed={collapsed.sidebar}
            onToggleCollapse={() =>
              setCollapsed((value) => ({ ...value, sidebar: !value.sidebar }))
            }
            onNewChat={() => chatRef.current?.startNewChat()}
            onboarding={{
              done: onboardingDone.length,
              total: onboardingSteps.length,
            }}
            activeGoals={activeGoals}
            onOpenDrawer={setDrawer}
            onOpenGrowth={() => setMode("growth")}
            onExitGrowth={() => {
              if (mode === "growth") setMode("grow");
            }}
            onOpenBrain={openBrain}
            onOpenSettings={openSettings}
            threads={(mode === "build" ? buildThreads : growThreads).map(
              (thread) => ({ id: thread.id, title: thread.title }),
            )}
            activeThreadId={mode === "build" ? activeBuildId : activeGrowId}
            onSelectThread={
              mode === "build" ? setActiveBuildId : setActiveGrowId
            }
          />
        );
      case "chat":
        return (
          <ChatPanel
            ref={chatRef}
            mode={mode}
            onModeChange={setMode}
            seed={seed}
            onRequestSelect={requestSelect}
            workspace={workspace}
            tasks={tasks}
            onAddTask={addTask}
            onApplyTask={applyTask}
            onDismissTask={dismissTask}
            growThreads={growThreads}
            setGrowThreads={setGrowThreads}
            buildThreads={buildThreads}
            setBuildThreads={setBuildThreads}
            activeGrowId={activeGrowId}
            setActiveGrowId={setActiveGrowId}
            activeBuildId={activeBuildId}
            setActiveBuildId={setActiveBuildId}
          />
        );
      case "analytics":
        return (
          <AnalyticsPanel
            collapsed={collapsed.analytics}
            onToggleCollapse={() =>
              setCollapsed((value) => ({
                ...value,
                analytics: !value.analytics,
              }))
            }
            activeTab={analyticsTab}
            onActiveTabChange={setAnalyticsTab}
          />
        );
      case "channel":
        return (
          <ChannelPanel
            tasks={tasks}
            onApply={applyTask}
            onDismiss={dismissTask}
            collapsed={collapsed.channel}
            onToggleCollapse={() =>
              setCollapsed((value) => ({ ...value, channel: !value.channel }))
            }
            plan={plan}
            onUpgrade={upgrade}
            onReview={openApproval}
            onAskZavi={askZavi}
            onSelectChannel={(tab) => {
              setAnalyticsTab(tab);
              if (collapsed.analytics) {
                setCollapsed((value) => ({ ...value, analytics: false }));
              }
            }}
          />
        );
      case "preview":
        return (
          <BuildPreview
            editing={editing}
            onEditingChange={setEditing}
            onSelectElement={handleSelectElement}
            plan={plan}
            onUpgrade={upgrade}
          />
        );
      case "growthPlan":
        return (
          <GrowthPlanPanel onOpenGoals={() => setDrawer("goals")} />
        );
      case "growthChat":
        return (
          <GrowthChatPanel
            workspace={workspace}
            businessSummary={onboardingNotes.company}
          />
        );
      default:
        return null;
    }
  }

  return (
    <PanelDndProvider value={dnd}>
      <main
        ref={mainRef}
        className="flex h-dvh flex-col gap-1 overflow-y-auto bg-[#ededed] p-1 text-zinc-900 xl:grid xl:overflow-hidden"
        style={{ gridTemplateColumns: template, gridTemplateRows: "minmax(0, 1fr)" }}
      >
        {order[mode].map((id, index) => {
          const previous = order[mode][index - 1];
          return (
            <Fragment key={id}>
              {previous && (
                <div className="relative hidden xl:block">
                  {!isRail(previous) && !isRail(id) && (
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize the ${previous} and ${id} panels`}
                      tabIndex={0}
                      onPointerDown={(event) =>
                        startResize(previous, id, event)
                      }
                      onDoubleClick={() => resetPair(previous, id)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          resizeBy(previous, id, -32);
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          resizeBy(previous, id, 32);
                        }
                      }}
                      title="Drag to resize. Double-click to reset."
                      className="group/resize absolute inset-y-0 -left-2.5 z-10 flex w-5 cursor-col-resize items-center justify-center focus-visible:outline-none"
                    >
                      <span className="h-10 w-1 rounded-full bg-transparent transition-colors duration-200 group-hover/resize:bg-zinc-400 group-focus-visible/resize:bg-zinc-500" />
                    </div>
                  )}
                </div>
              )}
              <PanelSlot id={id}>{renderPanel(id)}</PanelSlot>
            </Fragment>
          );
        })}
      </main>

      <Drawer
        open={drawer === "onboarding"}
        title="Onboarding"
        onClose={closeDrawer}
      >
        <OnboardingDrawer
          workspace={workspace}
          done={onboardingDone}
          notes={onboardingNotes}
          onToggle={toggleOnboarding}
          onComplete={completeOnboarding}
        />
      </Drawer>

      <Drawer
        open={drawer === "goals"}
        title="Goals"
        onClose={closeDrawer}
        width="max-w-xl"
      >
        <GoalsDrawer
          goals={goals}
          onAdd={(draft) =>
            setGoals((prev) => [
              {
                ...draft,
                id: nextGoalId.current++,
                started: "2026-09-02",
                current: 0,
                done: false,
              },
              ...prev,
            ])
          }
          onUpdateCurrent={(id, current) =>
            setGoals((prev) =>
              prev.map((goal) =>
                goal.id === id
                  ? { ...goal, current: Math.max(0, current) }
                  : goal,
              ),
            )
          }
          onToggleDone={(id) =>
            setGoals((prev) =>
              prev.map((goal) =>
                goal.id === id ? { ...goal, done: !goal.done } : goal,
              ),
            )
          }
          onRemove={(id) =>
            setGoals((prev) => prev.filter((goal) => goal.id !== id))
          }
        />
      </Drawer>

      <SettingsModal
        key={`settings-${settings?.section ?? "company"}`}
        open={settings !== null}
        section={settings?.section}
        onClose={closeSettings}
        workspace={workspace}
        userEmail="ritesh@ritech.ai"
        plan={plan}
        onUpgrade={upgrade}
      />

      <BrainModal
        open={brainOpen}
        onClose={closeBrain}
        workspace={workspace}
        onboardingNotes={onboardingNotes}
      />

      <Drawer
        open={drawer === "help"}
        title="Help & support"
        onClose={closeDrawer}
      >
        <HelpDrawer />
      </Drawer>

      <Drawer
        open={approval !== null}
        title="Action details"
        badge={
          approval && (
            <ChannelBadge
              name={approval.agent.name}
              color={approval.agent.color}
              icon={approval.agent.icon}
              glyph={approval.agent.glyph}
            />
          )
        }
        onClose={closeApproval}
        width={approvalExpanded ? "max-w-[min(80vw,1280px)]" : "max-w-2xl"}
        expanded={approvalExpanded}
        onToggleExpand={() => setApprovalExpanded((value) => !value)}
      >
        {approval && (
          <ApprovalDrawer
            key={approval.key}
            request={approval}
            expanded={approvalExpanded}
            onClose={closeApproval}
            onAskZavi={askZavi}
          />
        )}
      </Drawer>
    </PanelDndProvider>
  );
}
