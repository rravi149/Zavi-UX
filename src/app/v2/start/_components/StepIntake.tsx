"use client";

import { Section, Row, Btn } from "../../_components/kit";
import { Note, StepActions } from "./ui";
import { PREFILLS } from "./fixtures";

/* Step 2 of 4. One controlled URL field, plus prefills so a reviewer can click
   the whole flow without typing. */

export default function StepIntake({
  url,
  onUrlChange,
  onSubmit,
  onBack,
  onToIdea,
}: {
  url: string;
  onUrlChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onToIdea: () => void;
}) {
  return (
    <div style={{ maxWidth: 620 }}>
      <div className="kicker">/start?seg=growth</div>
      <h1 className="h1">Let&apos;s get started</h1>
      <p className="lede">Do 10x more. Zavi builds, grows, and runs your business for you.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label className="fld">
          <span className="lab">Website URL</span>
          <input
            type="text"
            inputMode="url"
            maxLength={200}
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="yourwebsite.com"
          />
        </label>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span className="mono">prefill</span>
          {PREFILLS.map((p) => (
            <Btn key={p} kind="quiet" sm onClick={() => onUrlChange(p)}>
              {p}
            </Btn>
          ))}
        </div>
        <Note>
          Both prefills are fictional domains with different failure shapes, so you can see the
          good case and the thin case without typing. Anything else you type gets the middle case.
        </Note>

        <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn kind="dark" type="submit">
            Continue
          </Btn>
          <Btn kind="quiet" onClick={onBack}>
            Back
          </Btn>
        </div>
      </form>

      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          Don&apos;t have a website yet?
        </span>
        <Btn kind="quiet" sm onClick={onToIdea}>
          Create one from scratch
        </Btn>
      </div>

      <div className="hr" />
      <Section
        num="01"
        label="What happens on Continue"
        framing="One POST, then a screen that shows the work instead of a spinner."
      >
        <Row
          title="POST /api/onboarding/enrich, mode full"
          sub="unauthed"
          meta="no session"
          open
          src="apps/backend/src/routes/onboarding/enrich.ts:18-24"
        >
          <p>
            The call needs no session. It is rate limited per user at 5 per 24h and globally at
            200 per 24h, cached for an hour, and every fetch inside it goes through an SSRF guard.
            A Tavily failure returns{" "}
            <span className="mono" style={{ textTransform: "none" }}>
              status: &quot;skipped&quot;
            </span>{" "}
            with a reason, never a 502, so a bad scan degrades into a thinner form rather than an
            error page.
          </p>
        </Row>
        <Row
          title="There is no dollar cap on this call, on purpose"
          sub="spend posture"
          meta="removed 2026-09-10"
          src="apps/backend/src/routes/onboarding/enrich.ts:26-35"
        >
          <p>
            The per-onboard ceiling was removed. What bounds it now is structure: 13 fixed paths
            plus at most 4 discovered pages, each sliced to an excerpt limit, plus a staff
            app-setting brake that can stop the spend with no deploy.
          </p>
        </Row>
      </Section>

      <StepActions>
        <Btn kind="quiet" onClick={onBack}>
          Back to the fork
        </Btn>
      </StepActions>
    </div>
  );
}
