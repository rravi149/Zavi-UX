"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import V2Nav from "../_components/V2Nav";
import StepFork from "./_components/StepFork";
import StepIntake from "./_components/StepIntake";
import StepAnalyzing from "./_components/StepAnalyzing";
import StepSignup from "./_components/StepSignup";
import { Toast } from "./_components/ui";
import {
  SCAN_STEPS,
  STEP_MS,
  cloneFound,
  normalizeHost,
  pickFixture,
  type Fixture,
  type Found,
} from "./_components/fixtures";

/* /v2/start: the whole pre-auth funnel as ONE client component with a step
   state machine. Four screens, one route, one piece of state, because the
   visitor is filling in one company and a route change would drop it.

   fork -> intake -> analyzing -> signup -> /v2/dashboard

   Ported from the researched wireframe at
   docs/wireframes/typesafe-ux/parts/20-onboarding.js in the praxis repo. Its
   copy, its step names and its blind-spot block were already checked against
   the shipped code and are moved here rather than re-derived. */

type Step = "fork" | "intake" | "analyzing" | "signup";

export default function V2StartPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("fork");
  const [forkStage, setForkStage] = useState<"fork" | "idea">("fork");
  const [idea, setIdea] = useState("");
  const [url, setUrl] = useState("");
  const [host, setHost] = useState("");
  const [source, setSource] = useState<"website" | "idea">("website");

  // The scan. scanToken is what a run is keyed on, so a cancelled run's timers
  // can never land on the next one, and so re-entering this step from signup
  // does not replay the animation.
  const [scanToken, setScanToken] = useState(0);
  const [stepAt, setStepAt] = useState(-1);
  const [found, setFound] = useState<Found | null>(null);

  // The fixture is picked ONCE, when a scan is submitted, and held in state.
  // Deriving it on every render would make it a moving dependency of the scan
  // effect, so typing in the idea box would restart a scan already running.
  const [fixture, setFixture] = useState<Fixture>(() => pickFixture("website", "", ""));

  const [toast, setToast] = useState("");

  const showToast = useCallback((t: string) => setToast(t), []);

  // One timer per read, and the card materialises when the last one settles.
  // Cleared on unmount and on a re-scan, so a cancelled run's timers can never
  // land on the next one.
  useEffect(() => {
    if (scanToken === 0) return;
    const last = SCAN_STEPS.length - 1;
    const ids = SCAN_STEPS.map((_, i) =>
      window.setTimeout(
        () => {
          setStepAt(i);
          if (i === last) setFound(cloneFound(fixture.found));
        },
        (i + 1) * STEP_MS,
      ),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [scanToken, fixture]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const startScan = useCallback(() => {
    setStepAt(-1);
    setFound(null);
    setScanToken((n) => n + 1);
  }, []);

  function submitUrl() {
    const h = normalizeHost(url);
    if (!h || !h.includes(".")) {
      showToast("Enter a valid website, like acme.com.");
      return;
    }
    setHost(h);
    setSource("website");
    setFixture(pickFixture("website", h, ""));
    setStep("analyzing");
    startScan();
  }

  function submitIdea() {
    const v = idea.trim();
    if (v.length < 8) {
      showToast("Eight characters minimum. That is the real gate.");
      return;
    }
    setIdea(v);
    setHost("");
    setSource("idea");
    setFixture(pickFixture("idea", "", v));
    setStep("analyzing");
    startScan();
  }

  function continueToSignup() {
    if (!found) return;
    if (!found.company_name) {
      showToast("Give the company a name first. Zavi will not invent one.");
      return;
    }
    if (!found.inferredShape) {
      showToast("Pick a company type. shapeConfidence came back low.");
      return;
    }
    setStep("signup");
  }

  const fromIdea = source === "idea";

  return (
    <>
      <V2Nav />
      <main className="screen">
        {step === "fork" ? (
          <StepFork
            stage={forkStage}
            idea={idea}
            onIdeaChange={setIdea}
            onPickGrow={() => {
              setSource("website");
              setStep("intake");
            }}
            onPickCreate={() => setForkStage("idea")}
            onSubmitIdea={submitIdea}
            onBackToFork={() => setForkStage("fork")}
            onLeave={() => router.push("/v2")}
          />
        ) : null}

        {step === "intake" ? (
          <StepIntake
            url={url}
            onUrlChange={setUrl}
            onSubmit={submitUrl}
            onBack={() => {
              setForkStage("fork");
              setStep("fork");
            }}
            onToIdea={() => {
              setForkStage("idea");
              setStep("fork");
            }}
          />
        ) : null}

        {step === "analyzing" ? (
          <StepAnalyzing
            fixture={fixture}
            found={found}
            onPatch={setFound}
            stepAt={stepAt}
            host={host}
            fromIdea={fromIdea}
            onContinue={continueToSignup}
            onRescan={startScan}
            onToast={showToast}
            onBack={() => {
              if (fromIdea) {
                setForkStage("idea");
                setStep("fork");
              } else {
                setStep("intake");
              }
            }}
          />
        ) : null}

        {step === "signup" ? (
          <StepSignup
            found={found}
            onCreated={() => router.push("/v2/dashboard")}
            onBack={() => setStep("analyzing")}
            onToast={showToast}
          />
        ) : null}
      </main>
      {toast ? <Toast text={toast} /> : null}
    </>
  );
}
