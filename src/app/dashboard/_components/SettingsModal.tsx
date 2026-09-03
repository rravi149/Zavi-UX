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
  Bell,
  Building2,
  Check,
  Mail,
  Mic,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  Unplug,
  Users,
  X,
} from "lucide-react";

type SectionId =
  | "company"
  | "integrations"
  | "notetaker"
  | "notifications"
  | "email"
  | "team"
  | "billing";

const sections: {
  id: SectionId;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "integrations", label: "Integrations", icon: Unplug },
  { id: "notetaker", label: "Notetaker", icon: Mic },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "email", label: "Email", icon: Mail },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Billing & Credits", icon: ReceiptText },
];

const fieldClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none";
const primaryButtonClass =
  "flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300";
const secondaryButtonClass =
  "h-9 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-100";

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-800">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-zinc-600">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          checked ? "bg-zinc-900" : "bg-zinc-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

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

function SavedNotice({ shown }: { shown: boolean }) {
  if (!shown) return null;
  return (
    <p
      role="status"
      className="flex items-center gap-1.5 text-sm font-medium text-emerald-700"
    >
      <Check className="h-4 w-4" aria-hidden="true" />
      Saved
    </p>
  );
}

export default function SettingsModal({
  open,
  section,
  onClose,
  workspace,
  userEmail,
  plan,
  onUpgrade,
}: {
  open: boolean;
  section?: SectionId;
  onClose: () => void;
  workspace: string;
  userEmail: string;
  plan: "free" | "pro";
  onUpgrade: () => void;
}) {
  const [active, setActive] = useState<SectionId>(section ?? "company");
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
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-zinc-900/40 [animation:fade-in_200ms_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="relative flex h-[min(90vh,760px)] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl [animation:fade-in_200ms_ease-out]"
      >
        <nav
          aria-label="Settings sections"
          className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 p-4 sm:flex"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <label htmlFor="settings-search" className="sr-only">
              Search settings
            </label>
            <input
              id="settings-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-full border border-zinc-200 bg-white pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
            />
          </div>
          <p className="mt-5 px-2 text-sm text-zinc-500">Settings</p>
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
            {active === "company" && <CompanySection workspace={workspace} />}
            {active === "integrations" && <IntegrationsSection />}
            {active === "notetaker" && <NotetakerSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "email" && <EmailSection userEmail={userEmail} />}
            {active === "team" && <TeamSection userEmail={userEmail} />}
            {active === "billing" && (
              <BillingSection plan={plan} onUpgrade={onUpgrade} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanySection({ workspace }: { workspace: string }) {
  const [name, setName] = useState(workspace);
  const [website, setWebsite] = useState("https://zavi.app");
  const [industry, setIndustry] = useState("Software");
  const [size, setSize] = useState("2–10");
  const [about, setAbout] = useState(
    "Zavi is a gallery of dashboard templates and UI kits teams can copy as React and Tailwind code.",
  );
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SectionShell
      title="Company"
      description="What Zavi tells agents about your business. Every agent uses this when it drafts work."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name" htmlFor="company-name">
            <input
              id="company-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Website" htmlFor="company-website">
            <input
              id="company-website"
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Industry" htmlFor="company-industry">
            <select
              id="company-industry"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className={fieldClass}
            >
              {["Software", "E-commerce", "Education", "Agency", "Other"].map(
                (option) => (
                  <option key={option}>{option}</option>
                ),
              )}
            </select>
          </Field>
          <Field label="Team size" htmlFor="company-size">
            <select
              id="company-size"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className={fieldClass}
            >
              {["Just me", "2–10", "11–50", "51–200", "200+"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label="What the company does"
          htmlFor="company-about"
          hint="Agents quote this when they write copy, so keep it in your own voice."
        >
          <textarea
            id="company-about"
            rows={4}
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
          />
        </Field>
        <div className="flex items-center gap-3">
          <button type="submit" className={primaryButtonClass}>
            Save changes
          </button>
          <SavedNotice shown={saved} />
        </div>
      </form>
    </SectionShell>
  );
}

const initialIntegrations = [
  { id: "slack", name: "Slack", detail: "Post approvals to #growth", on: true },
  {
    id: "github",
    name: "GitHub",
    detail: "Open pull requests on zavi/site",
    on: true,
  },
  {
    id: "meta",
    name: "Meta Ads",
    detail: "Spend, ROAS and campaign data",
    on: false,
  },
  {
    id: "ga",
    name: "Google Analytics",
    detail: "Sessions and funnel data",
    on: false,
  },
  {
    id: "gsc",
    name: "Google Search Console",
    detail: "Queries, clicks and average position",
    on: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    detail: "Revenue and subscriptions",
    on: false,
  },
];

function IntegrationsSection() {
  const [items, setItems] = useState(initialIntegrations);
  const connected = items.filter((item) => item.on).length;

  return (
    <SectionShell
      title="Integrations"
      description={`Connect the tools your agents read from and write to. ${connected} of ${items.length} connected.`}
    >
      <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white px-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-bold text-zinc-700"
              aria-hidden="true"
            >
              {item.name.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900">{item.name}</p>
              <p className="truncate text-sm text-zinc-600">{item.detail}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setItems((prev) =>
                  prev.map((entry) =>
                    entry.id === item.id ? { ...entry, on: !entry.on } : entry,
                  ),
                )
              }
              className={
                item.on
                  ? secondaryButtonClass
                  : "h-9 cursor-pointer rounded-lg bg-zinc-900 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
              }
            >
              {item.on ? "Disconnect" : "Connect"}
            </button>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function NotetakerSection() {
  const [enabled, setEnabled] = useState(true);
  const [joinAll, setJoinAll] = useState(false);
  const [transcribe, setTranscribe] = useState(true);
  const [language, setLanguage] = useState("English (US)");

  return (
    <SectionShell
      title="Notetaker"
      description="Let Zavi join calls, take notes, and turn decisions into tasks in your Channel."
    >
      <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white px-4">
        <Toggle
          checked={enabled}
          onChange={() => setEnabled((value) => !value)}
          label="Enable the notetaker"
          description="Zavi joins as a participant and posts a summary afterwards."
        />
        <Toggle
          checked={joinAll}
          onChange={() => setJoinAll((value) => !value)}
          label="Join every meeting on my calendar"
          description="Otherwise it only joins meetings you invite it to."
        />
        <Toggle
          checked={transcribe}
          onChange={() => setTranscribe((value) => !value)}
          label="Keep full transcripts"
          description="Transcripts are deleted after 30 days when this is off."
        />
        <div className="py-3">
          <Field label="Transcription language" htmlFor="notetaker-language">
            <select
              id="notetaker-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className={`${fieldClass} max-w-xs`}
            >
              {[
                "English (US)",
                "English (UK)",
                "Hindi",
                "Spanish",
                "German",
              ].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </SectionShell>
  );
}

function NotificationsSection() {
  const [rows, setRows] = useState([
    { id: "approvals", label: "Approval requests", email: true, push: true },
    { id: "published", label: "Published changes", email: true, push: false },
    { id: "goals", label: "Goal milestones", email: false, push: true },
    { id: "weekly", label: "Weekly summary", email: true, push: false },
    { id: "agent", label: "Agent errors", email: true, push: true },
  ]);

  function toggle(id: string, key: "email" | "push") {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: !row[key] } : row)),
    );
  }

  return (
    <SectionShell
      title="Notifications"
      description="Choose what reaches you, and where."
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left font-medium">
                Notify me about
              </th>
              <th scope="col" className="w-20 px-3 py-2.5 font-medium">
                Email
              </th>
              <th scope="col" className="w-20 px-3 py-2.5 font-medium">
                Push
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-zinc-900"
                >
                  {row.label}
                </th>
                {(["email", "push"] as const).map((key) => (
                  <td key={key} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={row[key]}
                      onChange={() => toggle(row.id, key)}
                      aria-label={`${row.label} by ${key}`}
                      className="h-4 w-4 cursor-pointer accent-zinc-900"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

function EmailSection({ userEmail }: { userEmail: string }) {
  const [sender, setSender] = useState("Zavi");
  const [replyTo, setReplyTo] = useState(userEmail);
  const [signature, setSignature] = useState("— The Zavi team");
  const [digest, setDigest] = useState("Weekly");
  const [verified, setVerified] = useState(false);
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SectionShell
      title="Email"
      description="How email from your agents is addressed and signed."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sender name" htmlFor="email-sender">
            <input
              id="email-sender"
              value={sender}
              onChange={(event) => setSender(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Reply-to address" htmlFor="email-reply">
            <input
              id="email-reply"
              type="email"
              value={replyTo}
              onChange={(event) => {
                setReplyTo(event.target.value);
                setVerified(false);
              }}
              className={fieldClass}
            />
          </Field>
        </div>
        <Field label="Signature" htmlFor="email-signature">
          <textarea
            id="email-signature"
            rows={3}
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
          />
        </Field>
        <Field label="Digest frequency" htmlFor="email-digest">
          <select
            id="email-digest"
            value={digest}
            onChange={(event) => setDigest(event.target.value)}
            className={`${fieldClass} max-w-xs`}
          >
            {["Daily", "Weekly", "Monthly", "Off"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={primaryButtonClass}>
            Save changes
          </button>
          <button
            type="button"
            onClick={() => setVerified(true)}
            className={secondaryButtonClass}
          >
            {verified ? "Address verified" : "Send verification email"}
          </button>
          <SavedNotice shown={saved} />
        </div>
      </form>
    </SectionShell>
  );
}

const roles = ["Owner", "Admin", "Editor", "Viewer"];

function TeamSection({ userEmail }: { userEmail: string }) {
  const [members, setMembers] = useState([
    { id: 1, name: "Ritesh", email: userEmail, role: "Owner", pending: false },
    {
      id: 2,
      name: "Aisha Khan",
      email: "aisha@ritech.ai",
      role: "Admin",
      pending: false,
    },
    {
      id: 3,
      name: "Tom Weber",
      email: "tom@ritech.ai",
      role: "Editor",
      pending: true,
    },
  ]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const nextId = members.length + 100;

  function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value.includes("@")) return;
    setMembers((prev) => [
      ...prev,
      {
        id: nextId,
        name: value.split("@")[0],
        email: value,
        role,
        pending: true,
      },
    ]);
    setEmail("");
  }

  return (
    <SectionShell
      title="Team"
      description="Who can see this workspace and approve agent work."
    >
      <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white px-4">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 py-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700"
              aria-hidden="true"
            >
              {member.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                {member.name}
                {member.pending && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Pending
                  </span>
                )}
              </p>
              <p className="truncate text-sm text-zinc-600">{member.email}</p>
            </div>
            <label className="sr-only" htmlFor={`role-${member.id}`}>
              Role for {member.name}
            </label>
            <select
              id={`role-${member.id}`}
              value={member.role}
              disabled={member.role === "Owner"}
              onChange={(event) =>
                setMembers((prev) =>
                  prev.map((entry) =>
                    entry.id === member.id
                      ? { ...entry, role: event.target.value }
                      : entry,
                  ),
                )
              }
              className="h-9 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-400"
            >
              {roles.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={member.role === "Owner"}
              aria-label={`Remove ${member.name}`}
              onClick={() =>
                setMembers((prev) =>
                  prev.filter((entry) => entry.id !== member.id),
                )
              }
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-200 disabled:hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={invite} className="mt-4 flex flex-wrap gap-2">
        <label htmlFor="invite-email" className="sr-only">
          Invite by email
        </label>
        <input
          id="invite-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@company.com"
          className={`${fieldClass} min-w-[12rem] flex-1`}
        />
        <label htmlFor="invite-role" className="sr-only">
          Invite role
        </label>
        <select
          id="invite-role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className={`${fieldClass} w-32`}
        >
          {roles
            .filter((option) => option !== "Owner")
            .map((option) => (
              <option key={option}>{option}</option>
            ))}
        </select>
        <button
          type="submit"
          disabled={!email.trim()}
          className={primaryButtonClass}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Invite
        </button>
      </form>
    </SectionShell>
  );
}

function BillingSection({
  plan,
  onUpgrade,
}: {
  plan: "free" | "pro";
  onUpgrade: () => void;
}) {
  const [credits, setCredits] = useState(plan === "pro" ? 4800 : 720);
  const [autoTopUp, setAutoTopUp] = useState(false);
  const total = plan === "pro" ? 10000 : 1000;
  const percent = Math.min(100, Math.round((credits / total) * 100));

  return (
    <SectionShell
      title="Billing & Credits"
      description="Your plan, the credits your agents spend, and where invoices go."
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-sm text-zinc-600">Current plan</p>
            <p className="text-lg font-semibold text-zinc-900">
              {plan === "pro" ? "Pro · $24/month" : "Free"}
            </p>
          </div>
          {plan === "free" ? (
            <button
              type="button"
              onClick={onUpgrade}
              className={`${primaryButtonClass} ml-auto`}
            >
              Upgrade to Pro
            </button>
          ) : (
            <p className="ml-auto flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" aria-hidden="true" />
              Active
            </p>
          )}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600">Credits remaining</span>
            <span className="font-medium text-zinc-900 tabular-nums">
              {credits.toLocaleString("en-US")} /{" "}
              {total.toLocaleString("en-US")}
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Credits remaining"
          >
            <div
              className="h-full rounded-full bg-zinc-900 transition-[width] duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setCredits((value) => value + 1000)}
            className={`${secondaryButtonClass} mt-3`}
          >
            Buy 1,000 credits
          </button>
        </div>

        <div className="mt-2 border-t border-zinc-100">
          <Toggle
            checked={autoTopUp}
            onChange={() => setAutoTopUp((value) => !value)}
            label="Auto top-up"
            description="Buy 1,000 more credits whenever the balance drops below 100."
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left font-medium">
                Invoice
              </th>
              <th scope="col" className="px-4 py-2.5 text-left font-medium">
                Date
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {[
              ["INV-1043", "Aug 1, 2026", "$24.00"],
              ["INV-1021", "Jul 1, 2026", "$24.00"],
              ["INV-0998", "Jun 1, 2026", "$24.00"],
            ].map(([id, date, amount]) => (
              <tr key={id}>
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-zinc-900"
                >
                  {id}
                </th>
                <td className="px-4 py-3 text-zinc-700">{date}</td>
                <td className="px-4 py-3 text-right text-zinc-900 tabular-nums">
                  {amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}
