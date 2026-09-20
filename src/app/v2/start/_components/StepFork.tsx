"use client";

import { Section, Row, Btn, Inert } from "../../_components/kit";
import { Door, Note, StepActions } from "./ui";

/* Step 1 of 4. The fork, plus its from-scratch sub-step.

   GROW IS FIRST HERE AND SECOND IN THE SHIPPED CODE. On praxis main today,
   apps/web/src/app/start/page.tsx:918 renders "Create a new company" above
   :925 "Grow my Company". The positioning is Lovable for growth, so the
   growth door reading second is a contradiction between the page and the
   pitch. V2 flips it deliberately and keeps both subtitles unchanged. */

export default function StepFork({
  stage,
  idea,
  onIdeaChange,
  onPickGrow,
  onPickCreate,
  onSubmitIdea,
  onBackToFork,
  onLeave,
}: {
  stage: "fork" | "idea";
  idea: string;
  onIdeaChange: (v: string) => void;
  onPickGrow: () => void;
  onPickCreate: () => void;
  onSubmitIdea: () => void;
  onBackToFork: () => void;
  onLeave: () => void;
}) {
  if (stage === "idea") {
    return (
      <div style={{ maxWidth: 640 }}>
        <div className="kicker">/start &middot; from scratch</div>
        <h1 className="h1">What&apos;s your idea?</h1>
        <p className="lede">
          Zavi thinks, builds, and markets your project autonomously. It plans, codes, deploys
          it, and gives you a live URL. Refine it by chat after.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitIdea();
          }}
        >
          <label className="fld">
            <span className="lab">Your idea</span>
            <textarea
              rows={4}
              maxLength={2000}
              value={idea}
              onChange={(e) => onIdeaChange(e.target.value)}
              placeholder="A booking tool for mobile dog groomers who take payment at the door."
            />
          </label>
          <Note>
            Eight characters minimum before the button will take it. That is the real gate on the
            shipped screen.
          </Note>
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn kind="dark" type="submit" disabled={idea.trim().length < 8}>
              Continue
            </Btn>
            <Btn kind="quiet" onClick={onBackToFork}>
              Back to the fork
            </Btn>
          </div>
        </form>

        <div className="hr" />
        <Section
          num="01"
          label="What this branch skips"
          framing="There is no site to read, so the scan you are about to watch will mostly report that it did not run."
        >
          <Row
            title="Seven of eight reads are skipped, and the screen says so"
            sub="honest empty state"
            meta="by design"
            open
            src="apps/web/src/app/start/page.tsx, the build-start path"
          >
            <p>
              The from-scratch path commits through{" "}
              <span className="mono" style={{ textTransform: "none" }}>
                /api/onboarding/build-start
              </span>
              , not through the enrichment scan. The next step still lists every read, marked NOT
              RUN with a reason, because a scan that silently shows three steps instead of eight
              reads as a faster scan rather than an emptier one.
            </p>
          </Row>
          <Row
            title="Brainstorm exists on the real screen"
            sub="not rebuilt here"
            meta="prototype gap"
            src="apps/web/src/app/start/BrainstormPanel.tsx"
          >
            <p>
              The live idea step has a slide-in panel that sharpens a fuzzy idea over a short
              chat, then writes a one-paragraph brief back into this box. It is a real component
              and it is unauthed. This prototype does not rebuild it.{" "}
              <Inert>Brainstorm it</Inert>
            </p>
          </Row>
        </Section>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="kicker">/start &middot; public, no account yet</div>
      <h1 className="h1">Let&apos;s get started</h1>
      <p className="lede">
        Two doors. Zavi is for growing a company you already have, so that one is first.
      </p>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
        <Door
          ord="01"
          title="Grow my Company"
          subtitle="Already have a business"
          framing="Zavi reads your public site, shows you what it concluded and what it could not see, and you correct it before anything is saved."
          onClick={onPickGrow}
        />
        <div className="mono" style={{ padding: "12px 0 12px 56px" }}>
          or
        </div>
        <Door
          ord="02"
          title="Create a new company"
          subtitle="Start from scratch"
          framing="No business yet. Describe the idea and Zavi plans, codes and deploys it, then starts growing it."
          onClick={onPickCreate}
        />
      </div>

      <div className="hr" />
      <Section
        num="01"
        label="Two things this screen changes"
        framing="Both are deliberate. Read them before you judge the order."
      >
        <Row
          title="Grow is first here. In the shipped code it is second."
          sub="deliberate change"
          meta="v2 flip"
          open
          src="apps/web/src/app/start/page.tsx:918 (create) renders above :925 (grow)"
        >
          <p>
            On{" "}
            <span className="mono" style={{ textTransform: "none" }}>
              main
            </span>{" "}
            today the fork renders Create a new company above Grow my Company. The positioning is
            Lovable for growth, so the growth door being the second thing a visitor reads is a
            contradiction between the page and the pitch.
          </p>
          <p>
            This prototype puts Grow first and keeps Create as a clearly-second door, with the
            real subtitles unchanged. It is a one-block reorder in the shipped file, not a
            redesign.
          </p>
        </Row>
        <Row
          title="Nothing here creates an account or a tenant"
          sub="login-late"
          meta="invariant"
          src="apps/web/src/app/start/page.tsx:53, PENDING_BUILD_KEY"
        >
          <p>
            This page is public and stays public. The invariant in the file header is that /start
            never creates a tenant while logged out: the work is stashed in localStorage under{" "}
            <span className="mono" style={{ textTransform: "none" }}>
              praxis_pending_build
            </span>
            , the visitor is bounced to login, and the tenant-creating call runs on the way back
            with a session attached. It fails closed, because the backend 401s the call anyway.
          </p>
        </Row>
      </Section>

      <StepActions>
        <Btn kind="quiet" onClick={onLeave}>
          Back to the V2 index
        </Btn>
      </StepActions>
    </div>
  );
}
