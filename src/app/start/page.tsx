"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiHubspot,
  SiMeta,
  SiGoogleads,
  SiShopify,
} from "react-icons/si";
import { FaSlack, FaLinkedin, FaSalesforce } from "react-icons/fa6";
import { ZaviLogo } from "../dashboard/_components/Brand";
import {
  CompetitorRow,
  IntegrationCard,
  PrimaryButton,
  ProgressIndicator,
  SelectableChip,
  StepShell,
  TeamEmailField,
  TextArea,
  TextButton,
  TextInput,
} from "./_components/OnboardingUI";
import {
  focusAreaOptions,
  integrations,
  mockCompetitors,
  reportSections,
  reportStats,
} from "./_components/data";
import {
  emptyOnboardingData,
  type Competitor,
  type FocusAreaId,
  type OnboardingData,
} from "./_components/types";

const TOTAL_STEPS = 8;
const DRAFT_KEY = "zavi:onboarding:draft";
const FINAL_KEY = "zavi:onboarding";

const integrationIcons: Record<string, ReactNode> = {
  "google-analytics": <SiGoogleanalytics className="h-4 w-4" />,
  "google-search-console": <SiGooglesearchconsole className="h-4 w-4" />,
  hubspot: <SiHubspot className="h-4 w-4" />,
  salesforce: <FaSalesforce className="h-4 w-4" />,
  slack: <FaSlack className="h-4 w-4" />,
  "meta-ads": <SiMeta className="h-4 w-4" />,
  "google-ads": <SiGoogleads className="h-4 w-4" />,
  linkedin: <FaLinkedin className="h-4 w-4" />,
  shopify: <SiShopify className="h-4 w-4" />,
};

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `c${Date.now()}${idCounter}`;
}

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);
  const [competitorInput, setCompetitorInput] = useState("");
  const [reportReady, setReportReady] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const restored = useRef(false);
  const seededCompetitors = useRef(false);

  // Restore an in-progress draft on mount so refreshing mid-flow doesn't lose data.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { step?: number; data?: OnboardingData };
      if (draft.data) setData({ ...emptyOnboardingData, ...draft.data });
      if (typeof draft.step === "number") setStep(draft.step);
      if (draft.data?.competitors?.length) seededCompetitors.current = true;
    } catch {
      // ignore malformed draft
    }
  }, []);

  // Persist the draft on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data }));
    } catch {
      // localStorage unavailable — proceed without persisting
    }
  }, [step, data]);

  // Simulate "auto-found" competitors once the user reaches that step.
  useEffect(() => {
    if (step !== 3 || seededCompetitors.current) return;
    seededCompetitors.current = true;
    if (data.competitors.length === 0) {
      setData((prev) => ({
        ...prev,
        competitors: mockCompetitors.map((c) => ({ id: nextId(), ...c })),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Simulate report generation once the user reaches that step.
  useEffect(() => {
    if (step !== 5) return;
    setReportReady(false);
    const timer = setTimeout(() => setReportReady(true), 1400);
    return () => clearTimeout(timer);
  }, [step]);

  function update<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFocusArea(id: FocusAreaId) {
    setData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(id)
        ? prev.focusAreas.filter((item) => item !== id)
        : [...prev.focusAreas, id],
    }));
  }

  function addCompetitor() {
    const name = competitorInput.trim();
    if (!name) return;
    const domain = name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "")
      .concat(".com");
    const competitor: Competitor = { id: nextId(), name, domain };
    setData((prev) => ({ ...prev, competitors: [...prev.competitors, competitor] }));
    setCompetitorInput("");
  }

  function removeCompetitor(id: string) {
    setData((prev) => ({
      ...prev,
      competitors: prev.competitors.filter((c) => c.id !== id),
    }));
  }

  function toggleIntegration(id: string) {
    setData((prev) => ({
      ...prev,
      connectedIntegrations: prev.connectedIntegrations.includes(id)
        ? prev.connectedIntegrations.filter((item) => item !== id)
        : [...prev.connectedIntegrations, id],
    }));
  }

  const canContinue =
    step === 0
      ? data.companyWebsite.trim().length > 0 && data.companyName.trim().length > 0
      : step === 1
        ? data.description.trim().length > 0
        : true;

  function goNext() {
    if (step === 0) {
      setFinishing(true);
      setTimeout(() => {
        setFinishing(false);
        setStep(1);
      }, 500);
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    if (step === 0) {
      update("mode", null);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function chooseMode(mode: "grow" | "build") {
    setStep(0);
    update("mode", mode);
  }

  function finish() {
    try {
      window.localStorage.setItem(FINAL_KEY, JSON.stringify(data));
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // localStorage unavailable — proceed without persisting
    }
    router.push("/dashboard");
  }

  const isLastContentStep = step === TOTAL_STEPS - 1;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8f4] px-5 py-10 sm:px-8">
      {/* Warm ivory background with soft blue glow bottom-right + subtle secondary glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 700px at 88% 96%, rgba(99,140,255,0.22), transparent 62%), radial-gradient(500px 420px at 8% 6%, rgba(255,205,160,0.14), transparent 60%)",
        }}
      />

      <a
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 sm:top-8 sm:left-8"
      >
        <ZaviLogo size={22} />
        <span className="text-[15px] font-extrabold tracking-tight text-foreground">
          zavi
        </span>
      </a>

      {data.mode === "grow" && step < TOTAL_STEPS - 1 && (
        <button
          type="button"
          onClick={finish}
          className="absolute top-6 right-6 z-10 cursor-pointer text-[13px] font-medium text-muted transition-colors duration-200 hover:text-foreground sm:top-8 sm:right-8"
        >
          Skip for now
        </button>
      )}

      <div className="relative z-[1] w-full max-w-[560px]">
        {data.mode === null && (
          <div>
            <h1 className="text-[34px] leading-[1.1] font-semibold tracking-tight text-foreground sm:text-[40px]">
              Let&apos;s get started
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-muted">
              Do 10x more. Zavi builds, grows, and runs your business for you.
            </p>

            <div className="mt-9 grid gap-3">
              <button
                type="button"
                onClick={() => chooseMode("grow")}
                className="group cursor-pointer rounded-2xl border border-black/[0.08] bg-white/70 p-5 text-left transition-colors duration-200 hover:border-black/20 hover:bg-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-white">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-4 block text-[17px] font-semibold text-foreground">
                  Grow my company
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">
                  Already have a business and a website
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => chooseMode("build")}
              className="mt-7 cursor-pointer text-sm font-medium text-muted underline underline-offset-4 transition-colors duration-200 hover:text-foreground"
            >
              Don&apos;t have a website yet? Create one from scratch
            </button>
          </div>
        )}

        {data.mode === "build" && (
          <div>
            <h1 className="text-[34px] leading-[1.1] font-semibold tracking-tight text-foreground sm:text-[40px]">
              What&apos;s your idea?
            </h1>
            <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-muted">
              Zavi thinks, builds, and markets your project autonomously. It
              plans, codes and deploys it, then gives you a live URL. Refine it
              by chat after.
            </p>

            <div className="mt-7">
              <TextArea
                autoFocus
                rows={5}
                value={data.idea}
                onChange={(e) => update("idea", e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    if (data.idea.trim()) finish();
                  }
                }}
                placeholder="Type your idea… (⌘ / Ctrl + Enter to send)"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                update(
                  "idea",
                  "A booking site for a small dog grooming salon, with prices, opening hours and online payments.",
                )
              }
              className="mt-4 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Not sure yet? Brainstorm it
            </button>

            <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-6">
              <TextButton
                onClick={() => update("mode", null)}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </TextButton>
              <PrimaryButton
                onClick={finish}
                disabled={data.idea.trim().length === 0}
              >
                Sign up to build
              </PrimaryButton>
            </div>
          </div>
        )}

        {data.mode === "grow" && (
          <>
        {step === 0 && (
          <StepShell
            step={1}
            total={TOTAL_STEPS}
            eyebrow="Get started"
            heading="Let's set up your workspace"
            subtext="Tell us a little about your company so Zavi can start learning your business."
          >
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Company website
                </span>
                <TextInput
                  type="text"
                  autoFocus
                  value={data.companyWebsite}
                  onChange={(e) => update("companyWebsite", e.target.value)}
                  placeholder="yourcompany.com"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Company name
                </span>
                <TextInput
                  type="text"
                  value={data.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  placeholder="Acme Inc."
                />
              </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryButton
                onClick={goNext}
                disabled={!canContinue}
                loading={finishing}
                className="w-full sm:w-auto"
              >
                Continue
              </PrimaryButton>
              <TextButton
                onClick={() => update("mode", null)}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </TextButton>
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            step={2}
            total={TOTAL_STEPS}
            eyebrow="Workspace"
            heading="Set up your workspace"
            subtext="This helps Zavi understand what your business does and who it's for."
          >
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Website URL
                </span>
                <TextInput
                  type="text"
                  value={data.companyWebsite}
                  onChange={(e) => update("companyWebsite", e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                  What does {data.companyName || "your company"} do?
                </span>
                <TextArea
                  rows={5}
                  autoFocus
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="We help small e-commerce brands run profitable ad campaigns without an in-house team…"
                />
              </label>
            </div>

            <StepFooter onBack={goBack}>
              <PrimaryButton onClick={goNext} disabled={!canContinue}>
                Continue
              </PrimaryButton>
            </StepFooter>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            step={3}
            total={TOTAL_STEPS}
            eyebrow="Personalize"
            heading="Personalize your workspace"
            subtext="Choose what matters most right now — Zavi will prioritize accordingly."
          >
            <div>
              <p className="mb-2.5 text-[13px] font-medium text-foreground">
                What are you focused on?
              </p>
              <div className="flex flex-wrap gap-2">
                {focusAreaOptions.map((option) => (
                  <SelectableChip
                    key={option.id}
                    label={option.label}
                    selected={data.focusAreas.includes(option.id)}
                    onClick={() => toggleFocusArea(option.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-2.5 text-[13px] font-medium text-foreground">
                What&apos;s your primary goal?
              </p>
              <div className="flex flex-wrap gap-2">
                {focusAreaOptions.map((option) => (
                  <SelectableChip
                    key={option.id}
                    label={option.label}
                    selected={data.primaryGoal === option.id}
                    onClick={() => update("primaryGoal", option.id)}
                  />
                ))}
              </div>
            </div>

            <StepFooter onBack={goBack}>
              <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
            </StepFooter>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            step={4}
            total={TOTAL_STEPS}
            eyebrow="Competitors"
            heading="Review your competitors"
            subtext="We found a few companies that look similar to you. Add or remove as needed."
          >
            <div className="space-y-2.5">
              {data.competitors.length === 0 && (
                <p className="text-[13px] text-muted">No competitors yet.</p>
              )}
              {data.competitors.map((c) => (
                <CompetitorRow
                  key={c.id}
                  name={c.name}
                  domain={c.domain}
                  onRemove={() => removeCompetitor(c.id)}
                />
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <TextInput
                type="text"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCompetitor();
                  }
                }}
                placeholder="Add a competitor"
              />
              <PrimaryButton onClick={addCompetitor} disabled={!competitorInput.trim()}>
                Add
              </PrimaryButton>
            </div>

            <StepFooter onBack={goBack}>
              <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
            </StepFooter>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            step={5}
            total={TOTAL_STEPS}
            eyebrow="Integrations"
            heading="Connect your integrations"
            subtext="Connect the tools you already use so Zavi has real data to work with. You can skip this and connect later."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  icon={integrationIcons[integration.id]}
                  name={integration.name}
                  description={integration.description}
                  connected={data.connectedIntegrations.includes(integration.id)}
                  onToggle={() => toggleIntegration(integration.id)}
                />
              ))}
            </div>

            <StepFooter onBack={goBack}>
              <TextButton onClick={goNext} className="mr-2">
                Skip
              </TextButton>
              <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
            </StepFooter>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell
            step={6}
            total={TOTAL_STEPS}
            eyebrow="AI report"
            heading={reportReady ? "Your AI Search Report is ready" : "Generating your AI search report"}
            subtext={
              reportReady
                ? "Here's an early look at how Zavi sees your visibility and opportunities."
                : "Zavi is analyzing your site, competitors, and search presence."
            }
          >
            {!reportReady ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-black/10 bg-white px-6 py-14">
                <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
                <p className="text-[13px] text-muted">This usually takes a few seconds…</p>
              </div>
            ) : (
              <div className="[animation:step-in_380ms_ease-out_both]">
                <div className="grid grid-cols-3 gap-3">
                  {reportStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-black/10 bg-white p-3.5 text-center"
                    >
                      <p
                        className={`text-[15px] font-semibold ${
                          stat.tone === "positive" ? "text-emerald-600" : "text-foreground"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-tight text-muted">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {reportSections.map((section) => (
                    <div
                      key={section.title}
                      className="flex gap-3 rounded-xl border border-black/10 bg-white p-4"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-foreground">
                        {section.title === "Search presence" ? (
                          <Search className="h-3.5 w-3.5" />
                        ) : section.title === "Competitor comparison" ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-foreground">
                          {section.title}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                          {section.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <StepFooter onBack={goBack}>
              <PrimaryButton onClick={goNext} disabled={!reportReady}>
                View report
              </PrimaryButton>
            </StepFooter>
          </StepShell>
        )}

        {step === 6 && (
          <StepShell
            step={7}
            total={TOTAL_STEPS}
            eyebrow="Team"
            heading="Invite your team"
            subtext="Bring teammates in so everyone can see what Zavi is working on. You can skip this and invite people later."
          >
            <TeamEmailField
              emails={data.teamEmails}
              onAdd={(email) => update("teamEmails", [...data.teamEmails, email])}
              onRemove={(email) =>
                update(
                  "teamEmails",
                  data.teamEmails.filter((e) => e !== email),
                )
              }
            />

            <StepFooter onBack={goBack}>
              <TextButton onClick={goNext} className="mr-2">
                Skip
              </TextButton>
              <PrimaryButton onClick={goNext}>Continue</PrimaryButton>
            </StepFooter>
          </StepShell>
        )}

        {isLastContentStep && (
          <div className="w-full text-center [animation:step-in_380ms_cubic-bezier(0.16,1,0.3,1)_both]">
            <ProgressIndicator step={TOTAL_STEPS} total={TOTAL_STEPS} />
            <div className="mt-8 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 [animation:pop-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]">
                <Check className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-6 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              You&apos;re all set
            </p>
            <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-foreground sm:text-[30px]">
              Onboarding complete
            </h1>
            <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-muted">
              Zavi has everything it needs to start working on {data.companyName || "your business"}.
            </p>
            <div className="mt-8 flex justify-center">
              <PrimaryButton onClick={finish}>Go to dashboard</PrimaryButton>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}

function StepFooter({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-6">
      <TextButton onClick={onBack} className="flex items-center gap-1.5">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </TextButton>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
