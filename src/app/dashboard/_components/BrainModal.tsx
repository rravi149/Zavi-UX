"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  BookOpen,
  Brain,
  Check,
  Database,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type SectionId = "facts" | "documents" | "voice" | "memory" | "sources";

const sections: {
  id: SectionId;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "facts", label: "Company facts", icon: Brain },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "voice", label: "Brand voice", icon: Sparkles },
  { id: "memory", label: "Memory", icon: BookOpen },
  { id: "sources", label: "Connected sources", icon: Database },
];

const fieldClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none";
const primaryButtonClass =
  "flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300";
const cardClass = "rounded-2xl border border-zinc-200 bg-white";

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function BrainModal({
  open,
  onClose,
  workspace,
  onboardingNotes,
}: {
  open: boolean;
  onClose: () => void;
  workspace: string;
  onboardingNotes: Record<string, string>;
}) {
  const [active, setActive] = useState<SectionId>("facts");
  const [query, setQuery] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const term = query.trim().toLowerCase();
  const matches = sections.filter((section) =>
    section.label.toLowerCase().includes(term),
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close brain"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-zinc-900/40 [animation:fade-in_200ms_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Brain"
        className="relative flex h-[min(90vh,760px)] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl [animation:fade-in_200ms_ease-out]"
      >
        <nav
          aria-label="Brain sections"
          className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 p-4 sm:flex"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <label htmlFor="brain-search" className="sr-only">
              Search the brain
            </label>
            <input
              id="brain-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-full border border-zinc-200 bg-white pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
            />
          </div>
          <p className="mt-5 px-2 text-sm text-zinc-500">Brain</p>
          <ul className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {matches.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === active;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(section.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors duration-200 ${
                      isActive
                        ? "bg-zinc-200/70 font-medium text-zinc-900"
                        : "text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {section.label}
                  </button>
                </li>
              );
            })}
            {matches.length === 0 && (
              <li className="px-3 py-2 text-sm text-zinc-500">No matches.</li>
            )}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-end px-4 pt-4">
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-8 sm:px-10">
            <div className="mb-5 flex gap-1 overflow-x-auto sm:hidden [&::-webkit-scrollbar]:hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActive(section.id)}
                  className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm whitespace-nowrap ${
                    section.id === active
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
            {active === "facts" && <FactsSection workspace={workspace} />}
            {active === "documents" && <DocumentsSection />}
            {active === "voice" && <VoiceSection />}
            {active === "memory" && (
              <MemorySection onboardingNotes={onboardingNotes} />
            )}
            {active === "sources" && <SourcesSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactsSection({ workspace }: { workspace: string }) {
  const [facts, setFacts] = useState([
    {
      id: 1,
      label: "What we sell",
      value: "Dashboard templates and UI kits as React and Tailwind code.",
    },
    {
      id: 2,
      label: "Who buys",
      value: "Product teams and agencies shipping internal tools.",
    },
    {
      id: 3,
      label: "Pricing",
      value: "Free tier with 40+ templates, Pro at $24/month.",
    },
    {
      id: 4,
      label: "Positioning",
      value: "Faster than a blank Figma file, more real than a mockup.",
    },
  ]);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!label.trim() || !value.trim()) return;
    setFacts((prev) => [
      ...prev,
      { id: Date.now(), label: label.trim(), value: value.trim() },
    ]);
    setLabel("");
    setValue("");
  }

  return (
    <SectionShell
      title="Company facts"
      description={`What every agent knows about ${workspace} before it drafts anything.`}
    >
      <ul className={`${cardClass} divide-y divide-zinc-100 px-4`}>
        {facts.map((fact) => (
          <li key={fact.id} className="flex items-start gap-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900">{fact.label}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">
                {fact.value}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Remove fact: ${fact.label}`}
              onClick={() =>
                setFacts((prev) => prev.filter((entry) => entry.id !== fact.id))
              }
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="mt-4 space-y-2">
        <label htmlFor="fact-label" className="sr-only">
          Fact label
        </label>
        <input
          id="fact-label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Label, e.g. Refund policy"
          className={fieldClass}
        />
        <label htmlFor="fact-value" className="sr-only">
          Fact
        </label>
        <textarea
          id="fact-value"
          rows={2}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="What agents should know"
          className={fieldClass}
        />
        <button
          type="submit"
          disabled={!label.trim() || !value.trim()}
          className={primaryButtonClass}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add fact
        </button>
      </form>
    </SectionShell>
  );
}

function DocumentsSection() {
  const [docs, setDocs] = useState([
    { id: 1, name: "Brand guidelines.pdf", size: "2.4 MB", indexed: true },
    { id: 2, name: "Pricing FAQ.md", size: "18 KB", indexed: true },
    { id: 3, name: "Support macros.csv", size: "64 KB", indexed: false },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <SectionShell
      title="Documents"
      description="Files your agents read before they answer or write. Indexed files are searchable."
    >
      <ul className={`${cardClass} divide-y divide-zinc-100 px-4`}>
        {docs.map((doc) => (
          <li key={doc.id} className="flex items-center gap-3 py-3">
            <FileText
              className="h-5 w-5 shrink-0 text-zinc-500"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">
                {doc.name}
              </p>
              <p className="text-sm text-zinc-600">{doc.size}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-sm font-medium ${
                doc.indexed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {doc.indexed ? "Indexed" : "Pending"}
            </span>
            <button
              type="button"
              aria-label={`Remove ${doc.name}`}
              onClick={() =>
                setDocs((prev) => prev.filter((d) => d.id !== doc.id))
              }
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {docs.length === 0 && (
          <li className="py-6 text-center text-sm text-zinc-600">
            No documents yet.
          </li>
        )}
      </ul>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          setDocs((prev) => [
            ...prev,
            ...files.map((file, index) => ({
              id: Date.now() + index,
              name: file.name,
              size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
              indexed: false,
            })),
          ]);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`${primaryButtonClass} mt-4`}
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        Upload documents
      </button>
    </SectionShell>
  );
}

const tones = ["Direct", "Friendly", "Playful", "Formal"];

function VoiceSection() {
  const [tone, setTone] = useState("Direct");
  const [rules, setRules] = useState(
    "Write in plain English. No hype words. Lead with the outcome, then the detail.",
  );
  const [avoid, setAvoid] = useState("revolutionary, game-changing, seamless");
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SectionShell
      title="Brand voice"
      description="How agents should sound when they write posts, replies, and pages."
    >
      <form onSubmit={submit} className="space-y-4">
        <fieldset>
          <legend className="text-sm font-medium text-zinc-800">Tone</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {tones.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={tone === option}
                onClick={() => setTone(option)}
                className={`h-9 cursor-pointer rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 ${
                  tone === option
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label
            htmlFor="voice-rules"
            className="text-sm font-medium text-zinc-800"
          >
            Writing rules
          </label>
          <textarea
            id="voice-rules"
            rows={3}
            value={rules}
            onChange={(event) => setRules(event.target.value)}
            className={`${fieldClass} mt-1.5`}
          />
        </div>
        <div>
          <label
            htmlFor="voice-avoid"
            className="text-sm font-medium text-zinc-800"
          >
            Words to avoid
          </label>
          <input
            id="voice-avoid"
            value={avoid}
            onChange={(event) => setAvoid(event.target.value)}
            className={`${fieldClass} mt-1.5`}
          />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className={primaryButtonClass}>
            Save voice
          </button>
          {saved && (
            <p
              role="status"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Saved
            </p>
          )}
        </div>
      </form>
    </SectionShell>
  );
}

const seedMemories = [
  {
    id: 1,
    text: "Approvals are required before anything is published publicly.",
    when: "3 days ago",
  },
  {
    id: 2,
    text: "The team ships on Tuesdays and avoids Friday deploys.",
    when: "last week",
  },
];

function MemorySection({
  onboardingNotes,
}: {
  onboardingNotes: Record<string, string>;
}) {
  const noteEntries = Object.entries(onboardingNotes);
  const [memories, setMemories] = useState(seedMemories);
  const [draft, setDraft] = useState("");

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setMemories((prev) => [
      { id: Date.now(), text: draft.trim(), when: "just now" },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <SectionShell
      title="Memory"
      description="Things Zavi has learned and remembers between chats."
    >
      {noteEntries.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            From onboarding
          </p>
          <ul className={`${cardClass} mt-2 divide-y divide-zinc-100 px-4`}>
            {noteEntries.map(([id, note]) => (
              <li key={id} className="py-3 text-sm text-zinc-800">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className={`${cardClass} divide-y divide-zinc-100 px-4`}>
        {memories.map((memory) => (
          <li key={memory.id} className="flex items-start gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-800">{memory.text}</p>
              <p className="mt-0.5 text-sm text-zinc-500">
                Learned {memory.when}
              </p>
            </div>
            <button
              type="button"
              aria-label="Forget this"
              onClick={() =>
                setMemories((prev) => prev.filter((m) => m.id !== memory.id))
              }
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {memories.length === 0 && (
          <li className="py-6 text-center text-sm text-zinc-600">
            Nothing remembered yet.
          </li>
        )}
      </ul>

      <form onSubmit={add} className="mt-4 flex flex-wrap gap-2">
        <label htmlFor="memory-draft" className="sr-only">
          Teach Zavi something
        </label>
        <input
          id="memory-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Teach Zavi something it should remember"
          className={`${fieldClass} min-w-[14rem] flex-1`}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className={primaryButtonClass}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Remember
        </button>
      </form>
    </SectionShell>
  );
}

function SourcesSection() {
  const [sources, setSources] = useState([
    { id: "site", name: "zavi.app", detail: "42 pages crawled", on: true },
    {
      id: "gsc",
      name: "Google Search Console",
      detail: "Queries and positions",
      on: false,
    },
    {
      id: "notion",
      name: "Notion workspace",
      detail: "Product and support docs",
      on: false,
    },
    {
      id: "slack",
      name: "Slack #growth",
      detail: "Decisions and context",
      on: true,
    },
  ]);

  return (
    <SectionShell
      title="Connected sources"
      description="Where the brain pulls knowledge from, on top of what you write here."
    >
      <ul className={`${cardClass} divide-y divide-zinc-100 px-4`}>
        {sources.map((source) => (
          <li key={source.id} className="flex items-center gap-4 py-3">
            <Database
              className="h-5 w-5 shrink-0 text-zinc-500"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900">{source.name}</p>
              <p className="truncate text-sm text-zinc-600">{source.detail}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={source.on}
              aria-label={source.name}
              onClick={() =>
                setSources((prev) =>
                  prev.map((entry) =>
                    entry.id === source.id
                      ? { ...entry, on: !entry.on }
                      : entry,
                  ),
                )
              }
              className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                source.on ? "bg-zinc-900" : "bg-zinc-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  source.on ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
