import type { ComponentType } from "react";
import type { DailyMetric } from "./metrics";

export type PanelId =
  | "sidebar"
  | "chat"
  | "analytics"
  | "channel"
  | "preview"
  | "growthPlan"
  | "growthChat";

export type TaskSource = "build" | "grow";
export type TaskStatus = "review" | "applied" | "dismissed";

export type Task = {
  id: number;
  title: string;
  source: TaskSource;
  status: TaskStatus;
  when: string;
};

export type Plan = "free" | "pro";

export type GoalChannel = "facebook" | "reddit" | "google" | "x";

export type Goal = {
  id: number;
  title: string;
  category: string;
  started: string;
  due: string;
  current: number;
  target: number;
  unit: "" | "%";
  done: boolean;
  channels: GoalChannel[];
};

export type DrawerKind = "onboarding" | "goals" | "help";

export type SettingsSection =
  | "company"
  | "integrations"
  | "notetaker"
  | "notifications"
  | "email"
  | "team"
  | "billing";

export type Theme = "system" | "light" | "dark";

export type ApprovalKind = "approve" | "apply" | "merge";

export type ApprovalReview = {
  why: string;
  plan: string[];
  preview?: { label: string; body: string };
  creative?: { image: string; caption: string; kind: "image" | "video" };
  impact: { label: string; value: string; before?: string }[];
  impactPeriod?: {
    before: { range: string; note: string };
    after: { range: string; note: string };
  };
  trend?: { label: string; before: string; after: string; good: "up" | "down" };
  outcome?: string;
  evidence?: {
    confidence: string;
    rows: {
      label: string;
      value: string;
      note?: string;
      tone?: "good" | "bad";
    }[];
  };
  scenario?: { positive: string; negative: string };
  reversible?: { label: string; body: string };
  daily?: DailyMetric[];
  resultNoun?: string;
  /** Short label for the approve button, e.g. "Turn it off". */
  actionLabel?: string;
  risk: string;
  undo: string;
  sources: string[];
};

export type ApprovalAgent = {
  name: string;
  color: string;
  icon?: ComponentType<{ className?: string }>;
  glyph?: string;
};

export type ApprovalRequest = ApprovalReview & {
  key: string;
  kind: ApprovalKind;
  agent: ApprovalAgent;
  title: string;
  detail: string;
  onApprove: () => void;
  onDismiss: () => void;
};

export type SocialPostStats = {
  replies: number;
  reposts: number;
  likes: string;
  views: string;
};

export type SocialPost = {
  authorName: string;
  authorHandle: string;
  avatarColor: string;
  verified: boolean;
  text: string;
  whyThisWorks: string;
  stats: SocialPostStats;
};
