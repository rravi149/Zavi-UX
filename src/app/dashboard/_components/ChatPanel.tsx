"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Dispatch,
  type Ref,
  type SetStateAction,
} from "react";
import {
  AtSign,
  Brain,
  BrainCog,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CirclePlus,
  Copy,
  Database,
  EllipsisVertical,
  FileCode,
  FileSearch,
  History,
  ImagePlus,
  Lightbulb,
  LoaderCircle,
  Megaphone,
  Mic,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  SquareDashedMousePointer,
  Plug,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import {
  SiGoogleads,
  SiInstagram,
  SiMeta,
  SiReddit,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { IconButton, Panel, PanelHeader } from "./Panel";
import { BrandMark, ZaviLogo } from "./Brand";
import { Dropdown } from "./Dropdown";
import type { Task, TaskSource } from "./types";

const mentionChannels = [
  { id: "meta-ads", name: "Meta Ads", color: "bg-indigo-600", icon: SiMeta },
  { id: "google-ads", name: "Google Ads", color: "bg-amber-500", icon: SiGoogleads },
  { id: "tiktok-ads", name: "TikTok Ads", color: "bg-zinc-900", icon: SiTiktok },
  { id: "reddit-ads", name: "Reddit Ads", color: "bg-orange-600", icon: SiReddit },
  {
    id: "influencer-ads",
    name: "Influencer Ads (TBD)",
    color: "bg-emerald-500",
    icon: Megaphone,
  },
  {
    id: "seo-geo",
    name: "SEO + GEO (AI search)",
    color: "bg-sky-500",
    icon: Sparkles,
  },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-600", icon: FaLinkedin },
  { id: "reddit", name: "Reddit", color: "bg-orange-500", icon: SiReddit },
  { id: "x", name: "X", color: "bg-zinc-900", icon: SiX },
  { id: "instagram", name: "Instagram", color: "bg-pink-500", icon: SiInstagram },
  { id: "tiktok", name: "TikTok", color: "bg-zinc-800", icon: SiTiktok },
  { id: "youtube", name: "YouTube", color: "bg-red-600", icon: SiYoutube },
];

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Mode = "grow" | "build" | "growth";
export type ComposerSeed = { text: string; nonce: number };
export type ChatPanelHandle = { startNewChat: () => void };

const modes: { id: Mode; label: string; placeholder: string }[] = [
  { id: "grow", label: "Grow", placeholder: "Message Zavi…" },
  { id: "build", label: "Build", placeholder: "What would you like to build?" },
];

type GrowMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  time?: string;
  attachments?: string[];
};

type BuildBlock =
  | { type: "status"; text: string }
  | { type: "step"; text: string }
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "actions"; items: string[] };

type BuildMessage =
  | {
      id: number;
      role: "user";
      text: string;
      meta: string;
      attachments?: string[];
    }
  | { id: number; role: "agent"; blocks: BuildBlock[] }
  | { id: number; role: "working" };

type Thread<T> = { id: number; title: string; messages: T[] };

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

export type GrowThread = Thread<GrowMessage>;
export type BuildThread = Thread<BuildMessage>;

export const growThreadSeeds: GrowThread[] = [
  {
    id: 1,
    title: "Design Forest logo",
    messages: [
      {
        id: 1,
        role: "assistant",
        time: "11:41",
        text: "**White sticky nav** with a bottom border\nI'll post the pull request link here in a few minutes — just watch this thread.",
      },
      { id: 2, role: "user", text: "How long does it take?" },
      {
        id: 3,
        role: "assistant",
        time: "11:44",
        text: "Usually a few minutes — watch this thread for the pull request link.",
      },
      { id: 4, role: "user", text: "Change the logo to Design Forest." },
      {
        id: 5,
        role: "assistant",
        time: "12:53",
        text: "### What changes\n- **Header:** the wordmark becomes Design Forest\n- **Footer:** brand line and copyright updated\n- **Meta tags:** page titles and social previews\n---\nThe pull request is waiting in your **Channel** for approval — nothing ships until you say so.",
      },
    ],
  },
  {
    id: 2,
    title: "Sticky nav header",
    messages: [
      {
        id: 1,
        role: "user",
        text: "Make the top nav sticky with a bottom border.",
      },
      {
        id: 2,
        role: "assistant",
        time: "09:12",
        text: "Done — the nav now sticks to the top with a 1px bottom border, and the pull request is merged and live.",
      },
    ],
  },
];

export const buildThreadSeeds: BuildThread[] = [
  {
    id: 1,
    title: "Pricing section",
    messages: [
      {
        id: 1,
        role: "user",
        text: "Add a pricing section with three plans to the landing page.",
        meta: "Auto · 2 hours ago",
      },
      {
        id: 2,
        role: "agent",
        blocks: [
          { type: "status", text: "Worked for 15 seconds" },
          { type: "step", text: "Exploring the landing page" },
          {
            type: "text",
            text: "I'll check how the existing sections are built so the new pricing section matches the design system, then wire it in below the testimonials.",
          },
          {
            type: "actions",
            items: [
              "Read src/app/page.tsx",
              "Read src/app/_components/Testimonials.tsx",
              "Searched globals.css for design tokens",
            ],
          },
          {
            type: "text",
            text: "The site uses a shared card style and Plus Jakarta Sans throughout, so I'll reuse those for the plan cards and highlight the middle plan.",
          },
          {
            type: "actions",
            items: [
              "Created src/app/_components/Pricing.tsx",
              "Edited src/app/page.tsx",
              "Ran npm run lint",
              "Ran npm run build",
            ],
          },
          { type: "text", text: "I added the pricing section." },
          { type: "heading", text: "What changed" },
          {
            type: "list",
            items: [
              "**New component:** Pricing.tsx with Free, Pro, and Team plans",
              "**Page:** wired in below the testimonials section",
              "**Checks:** lint and the production build both pass",
            ],
          },
          {
            type: "text",
            text: "The middle plan is highlighted as the recommended option. Review it in **Task updates** below and apply it when you're happy.",
          },
          { type: "status", text: "Worked for 1 minute" },
        ],
      },
    ],
  },
];

const reactionButtons = [
  { kind: "up", icon: ThumbsUp, label: "Helpful" },
  { kind: "down", icon: ThumbsDown, label: "Not helpful" },
] as const;

type Connector = { id: string; name: string; connected: boolean };

const initialConnectors: Connector[] = [
  { id: "slack", name: "Slack", connected: true },
  { id: "github", name: "GitHub", connected: true },
  { id: "meta", name: "Meta Ads", connected: false },
  { id: "ga", name: "Google Analytics", connected: false },
];

const initialSkills = ["Brand voice", "SEO audit"];

const models = ["Auto", "Fast", "Max"];

const suggestions = [
  "Add a testimonials carousel",
  "Improve the mobile navigation",
  "Add a newsletter signup to the footer",
  "Tighten the hero spacing",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function planResponse(id: number, request: string): BuildMessage {
  return {
    id,
    role: "agent",
    blocks: [
      { type: "status", text: "Worked for 8 seconds" },
      { type: "step", text: "Drafting a plan" },
      { type: "text", text: `Here's how I'd approach "${request}":` },
      {
        type: "list",
        items: [
          "**Audit** the current page structure and design tokens",
          "**Implement** the change as a focused component",
          "**Wire it up** and run lint and build",
          "**Hand off** the result in Task updates for your review",
        ],
      },
      {
        type: "text",
        text: "Switch the agent back to **Build** and send again when you want me to build it.",
      },
    ],
  };
}

function buildResponse(id: number, request: string): BuildMessage {
  return {
    id,
    role: "agent",
    blocks: [
      { type: "status", text: "Worked for 14 seconds" },
      { type: "step", text: "Working on your request" },
      {
        type: "text",
        text: `I'll implement "${request}" with the existing design tokens so it matches the rest of the site.`,
      },
      {
        type: "actions",
        items: [
          "Read src/app/page.tsx",
          "Edited src/app/_components",
          "Ran npm run lint",
          "Ran npm run build",
        ],
      },
      {
        type: "text",
        text: "Done — lint and build pass. Review the change in **Task updates** below or in your **Channel**.",
      },
      { type: "status", text: "Worked for 1 minute" },
    ],
  };
}

function toTaskTitle(request: string) {
  const trimmed = request.replace(/[.!?]+$/, "").trim();
  const capitalised = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return capitalised.length > 64 ? `${capitalised.slice(0, 61)}…` : capitalised;
}

function actionIcon(action: string) {
  if (/^ran\b/i.test(action)) return Terminal;
  if (/^(edited|created)\b/i.test(action)) return FileCode;
  if (/database|query/i.test(action)) return Database;
  return FileSearch;
}

function formatTime(date: Date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <p key={index}>
          <InlineText text={line} />
        </p>
      ))}
    </>
  );
}

function MessageText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="list-disc space-y-1 pl-5">
        {list.map((item, index) => (
          <li key={index}>
            <InlineText text={item} />
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  text.split("\n").forEach((line, index) => {
    const trimmed = line.trim();
    if (/^[-*] /.test(trimmed)) {
      list.push(trimmed.slice(2));
      return;
    }
    flush();
    if (trimmed === "---") {
      blocks.push(<hr key={index} className="my-1 border-zinc-200" />);
      return;
    }
    const heading = trimmed.match(/^#{1,3} (.*)$/);
    if (heading) {
      blocks.push(
        <h3 key={index} className="text-xl font-semibold text-zinc-900">
          {heading[1]}
        </h3>,
      );
      return;
    }
    if (trimmed) {
      blocks.push(
        <p key={index}>
          <InlineText text={line} />
        </p>,
      );
    }
  });
  flush();
  return <>{blocks}</>;
}

function ComposerMenuContent({
  close,
  onAddImage,
  onAddFile,
  connectors,
  onToggleConnector,
  skills,
  onAddSkill,
  onRemoveSkill,
}: {
  close: () => void;
  onAddImage: () => void;
  onAddFile: () => void;
  connectors: Connector[];
  onToggleConnector: (id: string) => void;
  skills: string[];
  onAddSkill: (name: string) => void;
  onRemoveSkill: (name: string) => void;
}) {
  const [view, setView] = useState<
    "root" | "connectors" | "skills" | "add-skill" | "manage"
  >("root");
  const [skillName, setSkillName] = useState("");
  const itemClass =
    "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-zinc-900 transition-colors duration-200 hover:bg-zinc-100";

  return (
    <div className="relative">
      <ul>
        <li>
          <button
            type="button"
            onClick={() => {
              onAddImage();
              close();
            }}
            className={itemClass}
          >
            <ImagePlus className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            Add Image
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => {
              onAddFile();
              close();
            }}
            className={itemClass}
          >
            <Paperclip className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            Add File
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-expanded={view === "connectors"}
            onClick={() =>
              setView((current) =>
                current === "connectors" ? "root" : "connectors",
              )
            }
            className={`${itemClass} ${view === "connectors" ? "bg-zinc-100" : ""}`}
          >
            <Plug className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            Connectors
            <ChevronRight
              className="ml-auto h-4 w-4 text-zinc-500"
              aria-hidden="true"
            />
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-expanded={view !== "root" && view !== "connectors"}
            onClick={() =>
              setView((current) =>
                current === "root" || current === "connectors"
                  ? "skills"
                  : "root",
              )
            }
            className={`${itemClass} ${
              view !== "root" && view !== "connectors" ? "bg-zinc-100" : ""
            }`}
          >
            <Brain className="h-5 w-5 text-zinc-700" aria-hidden="true" />
            Skills
            <ChevronRight
              className="ml-auto h-4 w-4 text-zinc-500"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>

      {view !== "root" && (
        <div
          role="group"
          aria-label={view === "connectors" ? "Connectors" : "Skills"}
          className="absolute bottom-0 left-full ml-2 w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg"
        >
          {view === "connectors" &&
            connectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                aria-pressed={connector.connected}
                onClick={() => onToggleConnector(connector.id)}
                className={itemClass}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    connector.connected ? "bg-emerald-500" : "bg-zinc-300"
                  }`}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">{connector.name}</span>
                <span className="text-xs text-zinc-500">
                  {connector.connected ? "On" : "Connect"}
                </span>
              </button>
            ))}

          {view === "skills" && (
            <>
              <button
                type="button"
                onClick={() => setView("add-skill")}
                className={itemClass}
              >
                <CirclePlus
                  className="h-5 w-5 text-zinc-700"
                  aria-hidden="true"
                />
                Add Skill
              </button>
              <button
                type="button"
                onClick={() => setView("manage")}
                className={itemClass}
              >
                <BrainCog
                  className="h-5 w-5 text-zinc-700"
                  aria-hidden="true"
                />
                Manage Skills
              </button>
            </>
          )}

          {view === "add-skill" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const name = skillName.trim();
                if (!name) return;
                onAddSkill(name);
                setSkillName("");
                setView("manage");
              }}
              className="p-1"
            >
              <label htmlFor="skill-name" className="sr-only">
                Skill name
              </label>
              <input
                id="skill-name"
                type="text"
                value={skillName}
                onChange={(event) => setSkillName(event.target.value)}
                placeholder="e.g. Pricing page copy"
                className="h-9 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!skillName.trim()}
                className="mt-2 w-full cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                Add skill
              </button>
            </form>
          )}

          {view === "manage" && (
            <div className="p-1">
              <p className="px-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Skills
              </p>
              <ul className="mt-1">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-800"
                  >
                    <span className="min-w-0 flex-1 truncate">{skill}</span>
                    <button
                      type="button"
                      aria-label={`Remove skill ${skill}`}
                      onClick={() => onRemoveSkill(skill)}
                      className="cursor-pointer text-zinc-400 transition-colors duration-200 hover:text-zinc-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
                {skills.length === 0 && (
                  <li className="px-2 py-1.5 text-sm text-zinc-500">
                    No skills yet.
                  </li>
                )}
              </ul>
              <button
                type="button"
                onClick={() => setView("add-skill")}
                className={itemClass}
              >
                <CirclePlus
                  className="h-5 w-5 text-zinc-700"
                  aria-hidden="true"
                />
                Add Skill
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AttachmentChips({
  items,
  align = "start",
}: {
  items?: string[];
  align?: "start" | "end";
}) {
  if (!items || items.length === 0) return null;
  return (
    <div
      className={`mt-1 flex flex-wrap gap-1 ${
        align === "end" ? "justify-end" : ""
      }`}
    >
      {items.map((name) => (
        <span
          key={name}
          className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-600"
        >
          <Paperclip className="h-3 w-3" aria-hidden="true" />
          {name}
        </span>
      ))}
    </div>
  );
}

function ActionsRow({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-2 rounded-lg py-1 text-sm text-zinc-600 transition-colors duration-200 hover:text-zinc-900"
      >
        <span className="flex items-center gap-1">
          {items.slice(0, 4).map((item, index) => {
            const Icon = actionIcon(item);
            return (
              <span
                key={index}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-white"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            );
          })}
        </span>
        <span>
          {items.length} {items.length === 1 ? "action" : "actions"}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-1.5 border-l-2 border-zinc-200 pl-3">
          {items.map((item) => {
            const Icon = actionIcon(item);
            return (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-zinc-600"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AgentBlocks({ blocks }: { blocks: BuildBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "status":
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-zinc-500"
              >
                <LoaderCircle className="h-4 w-4" aria-hidden="true" />
                {block.text}
              </div>
            );
          case "step":
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-sm font-medium text-zinc-600"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {block.text}
              </div>
            );
          case "heading":
            return (
              <h3 key={index} className="text-lg font-semibold text-zinc-900">
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul
                key={index}
                className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-zinc-900"
              >
                {block.items.map((item) => (
                  <li key={item}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "actions":
            return <ActionsRow key={index} items={block.items} />;
          default:
            return (
              <div
                key={index}
                className="space-y-1 text-[15px] leading-relaxed text-zinc-900"
              >
                <RichText text={block.text} />
              </div>
            );
        }
      })}
    </div>
  );
}

function TaskUpdates({
  tasks,
  onApply,
  onDismiss,
}: {
  tasks: Task[];
  onApply: (id: number) => void;
  onDismiss: (id: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const [menuFor, setMenuFor] = useState<number | null>(null);

  useEffect(() => {
    if (menuFor === null) return;
    const close = () => setMenuFor(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuFor]);

  const pending = tasks.filter((task) => task.status === "review").length;

  function toggleMenu(event: MouseEvent<HTMLButtonElement>, id: number) {
    event.stopPropagation();
    setMenuFor((current) => (current === id ? null : id));
  }

  return (
    <section
      aria-label="Task updates"
      className="mx-4 mb-2 rounded-2xl border border-zinc-200 bg-white"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-2 rounded-t-2xl px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "" : "-rotate-90"
          }`}
          aria-hidden="true"
        />
        Task updates
        {pending > 0 && (
          <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {pending} ready for review
          </span>
        )}
      </button>

      {open && (
        <ul className="max-h-48 overflow-y-auto border-t border-zinc-200">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 ${
                task.status === "review" ? "bg-emerald-50/60" : ""
              }`}
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-sm ${
                  task.status === "review" ? "bg-emerald-500" : "bg-zinc-300"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-[140px] flex-1">
                <p className="text-xs font-medium whitespace-nowrap text-zinc-500">
                  {task.status === "review" ? "Ready for review" : "Applied"}
                </p>
                <p className="text-sm leading-snug text-zinc-900">
                  {task.title}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {task.status === "review" ? (
                  <button
                    type="button"
                    onClick={() => onApply(task.id)}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
                  >
                    Apply changes
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Applied
                  </span>
                )}
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Task options"
                    aria-haspopup="menu"
                    aria-expanded={menuFor === task.id}
                    onClick={(event) => toggleMenu(event, task.id)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </button>
                  {menuFor === task.id && (
                    <div
                      role="menu"
                      className="absolute top-9 right-0 z-10 w-36 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
                    >
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          onDismiss(task.id);
                          setMenuFor(null);
                        }}
                        className="w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm text-zinc-700 transition-colors duration-200 hover:bg-zinc-100"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

export default function ChatPanel({
  ref,
  mode,
  onModeChange,
  seed = null,
  onRequestSelect,
  workspace,
  tasks,
  onAddTask,
  onApplyTask,
  onDismissTask,
  growThreads,
  setGrowThreads,
  buildThreads,
  setBuildThreads,
  activeGrowId,
  setActiveGrowId,
  activeBuildId,
  setActiveBuildId,
}: {
  ref?: Ref<ChatPanelHandle>;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  seed?: ComposerSeed | null;
  onRequestSelect?: () => void;
  workspace: string;
  tasks: Task[];
  onAddTask: (title: string, source: TaskSource) => void;
  onApplyTask: (id: number) => void;
  onDismissTask: (id: number) => void;
  growThreads: GrowThread[];
  setGrowThreads: Dispatch<SetStateAction<GrowThread[]>>;
  buildThreads: BuildThread[];
  setBuildThreads: Dispatch<SetStateAction<BuildThread[]>>;
  activeGrowId: number;
  setActiveGrowId: (id: number) => void;
  activeBuildId: number;
  setActiveBuildId: (id: number) => void;
}) {
  const [draft, setDraft] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);
  const mentionStartRef = useRef<number | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [model, setModel] = useState(models[0]);
  const [planMode, setPlanMode] = useState(false);
  const [reactions, setReactions] = useState<Record<string, "up" | "down">>({});
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [doneToast, setDoneToast] = useState(false);
  const [connectors, setConnectors] = useState<Connector[]>(initialConnectors);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const nextId = useRef(100);
  const nextThreadId = useRef(10);

  const growThread =
    growThreads.find((thread) => thread.id === activeGrowId) ?? growThreads[0];
  const buildThread =
    buildThreads.find((thread) => thread.id === activeBuildId) ??
    buildThreads[0];
  const growMessages = growThread.messages;
  const buildMessages = buildThread.messages;
  const threads = (mode === "grow" ? growThreads : buildThreads).map(
    (thread) => ({
      id: thread.id,
      title: thread.title,
      count: thread.messages.length,
    }),
  );
  const activeThreadId = mode === "grow" ? growThread.id : buildThread.id;
  const buildTasks = tasks.filter(
    (task) => task.source === "build" && task.status !== "dismissed",
  );
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];
  const canSend = draft.trim().length > 0 || attachments.length > 0;

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [growMessages, buildMessages, mode]);

  const [appliedSeed, setAppliedSeed] = useState<number | null>(null);
  if (seed && seed.nonce !== appliedSeed) {
    setAppliedSeed(seed.nonce);
    setDraft(seed.text);
  }

  useEffect(() => {
    if (seed) textareaRef.current?.focus();
  }, [seed]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  }

  function announceWorkDone() {
    setDoneToast(true);
    window.setTimeout(() => setDoneToast(false), 4000);
  }

  function updateGrow(
    threadId: number,
    updater: (messages: GrowMessage[]) => GrowMessage[],
  ) {
    setGrowThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? { ...thread, messages: updater(thread.messages) }
          : thread,
      ),
    );
  }

  function updateBuild(
    threadId: number,
    updater: (messages: BuildMessage[]) => BuildMessage[],
  ) {
    setBuildThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? { ...thread, messages: updater(thread.messages) }
          : thread,
      ),
    );
  }

  function retitleIfNew(target: Mode, threadId: number, text: string) {
    const title = toTaskTitle(text);
    const retitle = <T,>(threads: Thread<T>[]) =>
      threads.map((thread) =>
        thread.id === threadId && thread.title === "New thread"
          ? { ...thread, title }
          : thread,
      );
    if (target === "grow") setGrowThreads(retitle);
    else setBuildThreads(retitle);
  }

  const startNewChat = useCallback(() => {
    const id = nextThreadId.current++;
    const thread = { id, title: "New thread", messages: [] };
    if (mode === "grow") {
      setGrowThreads((prev) => [thread, ...prev]);
      setActiveGrowId(id);
    } else {
      setBuildThreads((prev) => [thread, ...prev]);
      setActiveBuildId(id);
    }
    setDraft("");
    setAttachments([]);
    textareaRef.current?.focus();
  }, [
    mode,
    setGrowThreads,
    setActiveGrowId,
    setBuildThreads,
    setActiveBuildId,
    setDraft,
    setAttachments,
  ]);

  useImperativeHandle(ref, () => ({ startNewChat }), [startNewChat]);

  function selectThread(id: number) {
    if (mode === "grow") setActiveGrowId(id);
    else setActiveBuildId(id);
  }

  function sendGrow(text: string, files: string[]) {
    const threadId = growThread.id;
    updateGrow(threadId, (messages) => [
      ...messages,
      { id: nextId.current++, role: "user", text, attachments: files },
    ]);
    retitleIfNew("grow", threadId, text);
    window.setTimeout(() => {
      updateGrow(threadId, (messages) => [
        ...messages,
        {
          id: nextId.current++,
          role: "assistant",
          time: formatTime(new Date()),
          text: "On it. I've briefed the engineer — a pull request for this is now waiting in your **Channel** for approval.",
        },
      ]);
      onAddTask(toTaskTitle(text), "grow");
      announceWorkDone();
    }, 700);
  }

  function sendBuild(text: string, files: string[]) {
    const threadId = buildThread.id;
    const workingId = nextId.current++;
    const usePlan = planMode;
    updateBuild(threadId, (messages) => [
      ...messages,
      {
        id: nextId.current++,
        role: "user",
        text,
        meta: `${model} · just now`,
        attachments: files,
      },
      { id: workingId, role: "working" },
    ]);
    retitleIfNew("build", threadId, text);
    window.setTimeout(() => {
      updateBuild(threadId, (messages) =>
        messages.map((message) =>
          message.id === workingId
            ? usePlan
              ? planResponse(workingId, text)
              : buildResponse(workingId, text)
            : message,
        ),
      );
      if (!usePlan) {
        onAddTask(toTaskTitle(text), "build");
        announceWorkDone();
      }
    }, 1500);
  }

  function send() {
    const text = draft.trim();
    if (!text && attachments.length === 0) return;
    const files = attachments;
    const finalText =
      text ||
      (files.length === 1
        ? `Attached ${files[0]}`
        : `Attached ${files.length} files`);
    setDraft("");
    setAttachments([]);
    setMentionOpen(false);
    if (mode === "grow") sendGrow(finalText, files);
    else sendBuild(finalText, files);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send();
  }

  const filteredMentions = mentionChannels.filter((channel) =>
    channel.name.toLowerCase().includes(mentionQuery.toLowerCase()),
  );

  function handleDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setDraft(value);
    const cursor = event.target.selectionStart ?? value.length;
    const upToCursor = value.slice(0, cursor);
    const match = upToCursor.match(/(?:^|\s)@([^\s@]*)$/);
    if (match) {
      mentionStartRef.current = cursor - match[1].length - 1;
      setMentionQuery(match[1]);
      setMentionOpen(true);
      setMentionIndex(0);
    } else {
      setMentionOpen(false);
    }
  }

  function selectMention(channel: (typeof mentionChannels)[number]) {
    const start = mentionStartRef.current;
    const el = textareaRef.current;
    if (start === null || !el) return;
    const cursor = el.selectionStart ?? draft.length;
    const before = draft.slice(0, start);
    const after = draft.slice(cursor);
    const insertion = `@${channel.name} `;
    setDraft(`${before}${insertion}${after}`);
    setMentionOpen(false);
    setMentionQuery("");
    requestAnimationFrame(() => {
      el.focus();
      const pos = before.length + insertion.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function insertMentionTrigger() {
    const el = textareaRef.current;
    const cursor = el?.selectionStart ?? draft.length;
    const before = draft.slice(0, cursor);
    const after = draft.slice(cursor);
    const needsSpace = before.length > 0 && !/\s$/.test(before);
    const insertion = `${needsSpace ? " " : ""}@`;
    const next = `${before}${insertion}${after}`;
    setDraft(next);
    mentionStartRef.current = before.length + insertion.length - 1;
    setMentionQuery("");
    setMentionOpen(true);
    setMentionIndex(0);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = before.length + insertion.length;
      el?.setSelectionRange(pos, pos);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (mentionOpen && filteredMentions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setMentionIndex((index) => (index + 1) % filteredMentions.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setMentionIndex(
          (index) =>
            (index - 1 + filteredMentions.length) % filteredMentions.length,
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        selectMention(filteredMentions[mentionIndex]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setMentionOpen(false);
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    if (names.length > 0) setAttachments((prev) => [...prev, ...names]);
    event.target.value = "";
  }

  function toggleConnector(id: string) {
    const connector = connectors.find((item) => item.id === id);
    if (!connector) return;
    setConnectors((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item,
      ),
    );
    showNotice(
      `${connector.name} ${connector.connected ? "disconnected" : "connected"}.`,
    );
  }

  function addSkill(name: string) {
    setSkills((prev) => (prev.includes(name) ? prev : [...prev, name]));
    showNotice(`Skill "${name}" added.`);
  }

  function removeSkill(name: string) {
    setSkills((prev) => prev.filter((skill) => skill !== name));
  }

  function toggleReaction(key: string, value: "up" | "down") {
    setReactions((prev) => {
      const next = { ...prev };
      if (next[key] === value) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  function copyMessage(text: string) {
    void navigator.clipboard?.writeText(text.replace(/\*\*/g, ""));
    showNotice("Copied to clipboard.");
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Recognition = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!Recognition) {
      showNotice("Voice input isn't available in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (transcript) {
        setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      showNotice("Couldn't capture audio. Check your microphone permission.");
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      showNotice("Couldn't start voice input.");
    }
  }

  const isEmpty =
    mode === "grow" ? growMessages.length === 0 : buildMessages.length === 0;

  const composerForm = (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      {mentionOpen && filteredMentions.length > 0 && (
        <div className="absolute bottom-full left-0 z-20 mb-2 max-h-72 w-72 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-lg">
          <ul>
            {filteredMentions.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <li key={channel.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectMention(channel);
                    }}
                    onMouseEnter={() => setMentionIndex(index)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-[15px] text-zinc-900 transition-colors duration-150 ${
                      index === mentionIndex ? "bg-zinc-100" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${channel.color}`}
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {channel.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {attachments.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((name) => (
            <li
              key={name}
              className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700"
            >
              <Paperclip className="h-3 w-3" aria-hidden="true" />
              <span className="max-w-[10rem] truncate">{name}</span>
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() =>
                  setAttachments((prev) => prev.filter((item) => item !== name))
                }
                className="cursor-pointer text-zinc-500 hover:text-zinc-900"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label htmlFor="chat-input" className="sr-only">
        {activeMode.placeholder}
      </label>
      <textarea
        ref={textareaRef}
        id="chat-input"
        rows={1}
        value={draft}
        onChange={handleDraftChange}
        onKeyDown={handleKeyDown}
        placeholder={activeMode.placeholder}
        className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFiles}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFiles}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Dropdown
            placement="top"
            width="w-48"
            label="Add to message"
            trigger={({ open, toggle, id }) => (
              <button
                type="button"
                aria-label="Add to message"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-700 transition-colors duration-200 hover:bg-zinc-100"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          >
            {(close) => (
              <ComposerMenuContent
                close={close}
                onAddImage={() => imageInputRef.current?.click()}
                onAddFile={() => fileInputRef.current?.click()}
                connectors={connectors}
                onToggleConnector={toggleConnector}
                skills={skills}
                onAddSkill={addSkill}
                onRemoveSkill={removeSkill}
              />
            )}
          </Dropdown>
          <IconButton label="Mention a channel" onClick={insertMentionTrigger}>
            <AtSign className="h-5 w-5" />
          </IconButton>
          {mode === "build" && (
            <>
              <IconButton
                label="Select an element on the page"
                onClick={onRequestSelect}
              >
                <SquareDashedMousePointer className="h-5 w-5" />
              </IconButton>
              <label htmlFor="model-select" className="sr-only">
                Model
              </label>
              <div className="relative">
                <CircleDot
                  className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600"
                  aria-hidden="true"
                />
                <select
                  id="model-select"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  className="h-8 cursor-pointer appearance-none rounded-lg bg-transparent pr-6 pl-8 text-xs font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
                >
                  {models.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-1.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
              </div>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {mode === "build" && (
            <button
              type="button"
              role="switch"
              aria-checked={planMode}
              aria-label={`Agent mode: ${planMode ? "Plan" : "Build"}. Toggle`}
              onClick={() => setPlanMode((value) => !value)}
              className={`h-8 cursor-pointer rounded-lg px-2.5 text-xs font-medium transition-colors duration-200 ${
                planMode
                  ? "bg-zinc-900 text-white hover:bg-zinc-700"
                  : "text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              {planMode ? "Plan" : "Build"}
            </button>
          )}
          <IconButton
            label={listening ? "Stop listening" : "Voice input"}
            aria-pressed={listening}
            onClick={toggleListening}
            className={listening ? "animate-pulse bg-red-50" : ""}
          >
            <Mic className={`h-5 w-5 ${listening ? "text-red-600" : ""}`} />
          </IconButton>
          <button
            type="submit"
            aria-label="Send message"
            disabled={!canSend}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 ${
              canSend
                ? "cursor-pointer bg-zinc-900 hover:bg-zinc-700"
                : "cursor-not-allowed bg-zinc-200"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <Panel>
      {doneToast && (
        <div className="fixed top-4 right-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] [animation:fade-in_200ms_ease-out]">
          <div className="relative flex items-start gap-5 rounded-[28px] bg-white p-7 shadow-2xl">
            <span
              className="absolute -top-2.5 -bottom-2.5 left-0 w-2 rounded-full bg-emerald-700"
              aria-hidden="true"
            />
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[2.5px] border-emerald-700">
              <Check
                className="h-6 w-6 text-emerald-700"
                strokeWidth={3}
                aria-hidden="true"
              />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xl font-bold text-zinc-900">
                Zavi&apos;s work is done
              </p>
              <p className="mt-1.5 text-base leading-relaxed text-zinc-500">
                Your changes are ready for review in Task updates
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setDoneToast(false)}
              className="shrink-0 cursor-pointer text-zinc-900 transition-opacity duration-200 hover:opacity-70"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
      <PanelHeader className="border-b border-zinc-200">
        {mode === "build" ? (
          <span className="flex min-w-0 items-center gap-1.5 text-[15px] font-semibold text-zinc-900">
            <BrandMark className="h-5 w-5" />
            <span className="truncate">{workspace}</span>
          </span>
        ) : (
          <>
            <ZaviLogo size={28} />
            <h2 className="text-[17px] font-semibold text-zinc-900">Zavi</h2>
          </>
        )}
        <div
          role="tablist"
          aria-label="Chat mode"
          className="ml-1 flex shrink-0 rounded-lg bg-zinc-100 p-0.5"
        >
          {modes.map((item) => {
            const active = item.id === mode;
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="chat-thread"
                onClick={() => onModeChange(item.id)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${
                  active
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Dropdown
            align="right"
            width="w-64"
            label="Chat history"
            trigger={({ open, toggle, id }) => (
              <IconButton
                label="Chat history"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                onClick={toggle}
              >
                <History className="h-5 w-5" />
              </IconButton>
            )}
          >
            {(close) => (
              <div>
                <p className="px-2 py-1 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                  Recent threads
                </p>
                <ul>
                  {threads.map((thread) => {
                    const active = thread.id === activeThreadId;
                    return (
                      <li key={thread.id}>
                        <button
                          type="button"
                          aria-current={active ? "true" : undefined}
                          onClick={() => {
                            selectThread(thread.id);
                            close();
                          }}
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors duration-200 ${
                            active
                              ? "bg-zinc-100 font-medium text-zinc-900"
                              : "text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {thread.title}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {thread.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Dropdown>
          <IconButton label="New chat" onClick={startNewChat}>
            <Plus className="h-5 w-5" />
          </IconButton>
        </div>
      </PanelHeader>

      <div
        className={`flex min-h-0 flex-1 flex-col bg-[#f9f9f9] ${
          mode === "grow" && isEmpty ? "items-center justify-center px-4" : ""
        }`}
      >
        {mode === "grow" && isEmpty ? (
          <div className="flex w-full max-w-2xl flex-col items-center text-center">
            <ZaviLogo size={40} />
            <p className="mt-4 text-2xl font-semibold text-zinc-900">
              New thread
            </p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-zinc-600">
              Tell Zavi what to change and it will brief the engineer.
            </p>
            <div className="mt-6 w-full">{composerForm}</div>
          </div>
        ) : (
          <>
            <div
              id="chat-thread"
              role="tabpanel"
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto px-10 py-4"
            >
              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-[17px] font-semibold text-zinc-900">
                    What would you like to build?
                  </p>
                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-zinc-600">
                    Describe what to build and the agent will make the change,
                    run the checks, and hand it back for review.
                  </p>
                </div>
              ) : mode === "grow" ? (
            <div className="space-y-6">
              {growMessages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div
                      key={message.id}
                      className="group/prompt flex flex-col items-end"
                    >
                      <div className="max-w-[85%] rounded-3xl bg-[#ececec] px-5 py-3 text-[17px] leading-relaxed font-medium whitespace-pre-line text-zinc-900">
                        {message.text}
                      </div>
                      <AttachmentChips
                        items={message.attachments}
                        align="end"
                      />
                      <button
                        type="button"
                        aria-label="Copy prompt"
                        title="Copy prompt"
                        onClick={() => copyMessage(message.text)}
                        className="mt-1.5 cursor-pointer text-zinc-600 opacity-0 transition-opacity duration-200 group-hover/prompt:opacity-100 hover:text-zinc-900 focus-visible:opacity-100"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  );
                }
                const key = `grow:${growThread.id}:${message.id}`;
                return (
                  <article key={message.id} className="group/message">
                    <div className="space-y-2 text-[17px] leading-relaxed font-medium text-zinc-900">
                      <MessageText text={message.text} />
                    </div>
                    <div className="mt-3 flex items-center gap-4 opacity-0 transition-opacity duration-200 group-hover/message:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        aria-label="Copy message"
                        title="Copy message"
                        onClick={() => copyMessage(message.text)}
                        className="cursor-pointer text-zinc-600 transition-colors duration-200 hover:text-zinc-900"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      {reactionButtons.map(({ kind, icon: Icon, label }) => {
                        const pressed = reactions[key] === kind;
                        return (
                          <button
                            key={kind}
                            type="button"
                            aria-label={label}
                            aria-pressed={pressed}
                            title={label}
                            onClick={() => toggleReaction(key, kind)}
                            className={`cursor-pointer transition-colors duration-200 ${
                              pressed
                                ? "text-zinc-900"
                                : "text-zinc-600 hover:text-zinc-900"
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${pressed ? "fill-current" : ""}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="space-y-5">
              {buildMessages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div
                      key={message.id}
                      className="group/prompt flex flex-col items-end"
                    >
                      <div className="max-w-[85%] rounded-3xl bg-[#ececec] px-5 py-3 text-[15px] leading-relaxed font-medium whitespace-pre-line text-zinc-900">
                        {message.text}
                      </div>
                      <AttachmentChips
                        items={message.attachments}
                        align="end"
                      />
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Copy prompt"
                          title="Copy prompt"
                          onClick={() => copyMessage(message.text)}
                          className="cursor-pointer text-zinc-600 opacity-0 transition-opacity duration-200 group-hover/prompt:opacity-100 hover:text-zinc-900 focus-visible:opacity-100"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <p className="text-xs text-zinc-500">{message.meta}</p>
                      </div>
                    </div>
                  );
                }
                if (message.role === "working") {
                  return (
                    <div
                      key={message.id}
                      role="status"
                      className="flex items-center gap-2 text-sm text-zinc-500"
                    >
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Working…
                    </div>
                  );
                }
                return (
                  <article key={message.id}>
                    <AgentBlocks blocks={message.blocks} />
                  </article>
                );
              })}
            </div>
              )}
            </div>

            {mode === "build" && buildTasks.length > 0 && (
              <TaskUpdates
                tasks={buildTasks}
                onApply={onApplyTask}
                onDismiss={onDismissTask}
              />
            )}

            {notice && (
              <p role="status" className="mx-4 mt-2 text-xs text-zinc-600">
                {notice}
              </p>
            )}

            {mode === "build" && (
              <div className="mx-4 mt-2">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                  Suggestions
                </div>
                <div className="flex items-center gap-2">
                  <div
                    ref={chipsRef}
                    className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none]"
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setDraft(suggestion);
                          textareaRef.current?.focus();
                        }}
                        className="shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <IconButton
                    label="More suggestions"
                    className="h-7 w-7"
                    onClick={() =>
                      chipsRef.current?.scrollBy({
                        left: 180,
                        behavior: "smooth",
                      })
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            )}

            <div className="m-4 mt-2">{composerForm}</div>
          </>
        )}
      </div>
    </Panel>
  );
}
