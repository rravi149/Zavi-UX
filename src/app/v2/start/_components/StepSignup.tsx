"use client";

import { useState } from "react";
import { Section, Row, Btn, Inert, SpecTable } from "../../_components/kit";
import { NotConcluded, Note, StepActions } from "./ui";
import type { Found } from "./fixtures";

/* Step 4 of 4. The account comes LAST, on purpose: everything corrected on the
   card is still in this browser, and it is attached to the workspace the moment
   the visitor signs in. */

export default function StepSignup({
  found,
  onCreated,
  onBack,
  onToast,
}: {
  found: Found | null;
  onCreated: () => void;
  onBack: () => void;
  onToast: (t: string) => void;
}) {
  const [mode, setMode] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const emailLooksReal = email.includes("@") && email.trim().length > 3;

  function submitPassword() {
    if (!emailLooksReal) {
      onToast("Enter an email first.");
      return;
    }
    if (password.length < 8) {
      onToast("Password needs at least 8 characters.");
      return;
    }
    onCreated();
  }

  function sendCode() {
    if (!emailLooksReal) {
      onToast("Enter an email first.");
      return;
    }
    setCodeSent(true);
    onToast("Code sent to " + email.trim() + ". Any six digits pass here.");
  }

  function verifyCode() {
    if (code.trim().length !== 6) {
      onToast("Six digits.");
      return;
    }
    onCreated();
  }

  return (
    <div className="rail-layout">
      <div>
        <div className="kicker">/login?signup=1&amp;next=/start</div>
        <h1 className="h1">Save this before you lose it</h1>
        <p className="lede">
          The account comes last on purpose. Everything you just corrected is sitting in this
          browser, not on a server, and it is attached to your workspace the moment you sign in.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <Btn
            sm
            kind={mode === "password" ? "dark" : "quiet"}
            onClick={() => {
              setMode("password");
              setCodeSent(false);
            }}
          >
            Email and password
          </Btn>
          <Btn
            sm
            kind={mode === "code" ? "dark" : "quiet"}
            onClick={() => {
              setMode("code");
              setCodeSent(false);
            }}
          >
            Email me a code instead
          </Btn>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mode === "password") submitPassword();
            else if (codeSent) verifyCode();
            else sendCode();
          }}
        >
          <label className="fld">
            <span className="lab">Email</span>
            <input
              type="email"
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </label>

          {mode === "password" ? (
            <>
              <label className="fld">
                <span className="lab">Password</span>
                <input
                  type="password"
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn kind="dark" type="submit">
                  Create account
                </Btn>
                <Btn kind="quiet" onClick={onBack}>
                  Back to the card
                </Btn>
              </div>
            </>
          ) : codeSent ? (
            <>
              <label className="fld">
                <span className="lab">Six-digit code</span>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
              </label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn kind="dark" type="submit">
                  Verify and continue
                </Btn>
                <Btn kind="quiet" onClick={sendCode}>
                  Send it again
                </Btn>
                <Btn kind="quiet" onClick={onBack}>
                  Back to the card
                </Btn>
              </div>
              <Note>
                In this prototype any six digits pass. The live route is POST
                /api/auth/email/send-otp, a code typed back into the page rather than a link
                clicked in a mail client, so you stay in this tab.
              </Note>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn kind="dark" type="submit">
                Send me a code
              </Btn>
              <Btn kind="quiet" onClick={onBack}>
                Back to the card
              </Btn>
            </div>
          )}
        </form>

        <Note>
          GitHub and Google are the other two doors on the live page. <Inert>Continue with GitHub</Inert>{" "}
          <Inert>Continue with Google</Inert>
        </Note>

        <div className="hr" />
        <Section
          num="01"
          label="What happens on submit"
          framing="Three calls, in this order, and the first one that can create anything needs the session."
        >
          <Row
            title="generate-memory, then activate"
            sub="the tenant-creating call"
            meta="authed"
            open
            src="apps/web/src/app/start/page.tsx, the authed commit path"
          >
            <p>
              generate-memory turns the corrected card into the company brain. activate creates
              the tenant with your display name, your shape and stage, and the competitors
              exactly as you left them. A 401 on either one bounces you to login instead of
              half-creating a workspace.
            </p>
          </Row>
          <Row
            title="A fresh token, before you land"
            sub="the stale-claim bug"
            meta="re-mint"
            src="apps/web/src/app/start/page.tsx, the token re-mint before navigate"
          >
            <p>
              activate flips your active tenant server-side, but the token in your browser was
              minted before that, so its claim still points at nothing. Row-level security scopes
              the workspace tables to that claim, so landing on a stale token shows an empty
              workspace for a company that was created correctly. The page re-mints the token
              first, then navigates.
            </p>
          </Row>
          <Row
            title="Where you land"
            sub="two destinations"
            meta="tab param"
            src="apps/web/src/app/start/page.tsx, the post-activate redirect"
          >
            <p>
              Grow lands on the growth tab. From-scratch lands on the website tab, where the
              running build shows.
            </p>
            <p>
              <span className="mono" style={{ textTransform: "none" }}>
                /workspace?tab=autopilot
              </span>{" "}
              and{" "}
              <span className="mono" style={{ textTransform: "none" }}>
                /workspace?tab=website
              </span>
            </p>
          </Row>
        </Section>

        <StepActions>
          <Btn kind="quiet" onClick={onBack}>
            Back to the card
          </Btn>
        </StepActions>
      </div>

      <aside className="panel">
        <div className="mono">carried into the account</div>
        <div style={{ marginTop: 12 }}>
          {found ? (
            <SpecTable
              head={["field", "value"]}
              rows={[
                ["company", found.company_name || <NotConcluded>unnamed</NotConcluded>],
                ["what you do", found.description],
                [
                  "who you sell to",
                  found.icp ? found.icp : <NotConcluded>still unanswered</NotConcluded>,
                ],
                [
                  "competitors",
                  found.competitors.length ? (
                    found.competitors.map((c) => c.name).join(", ")
                  ) : (
                    <NotConcluded>none on file</NotConcluded>
                  ),
                ],
              ]}
            />
          ) : (
            <p>Nothing carried over. Go back and describe the company first.</p>
          )}
        </div>

        <div className="hr" style={{ margin: "18px 0" }} />
        <div className="mono">what you get on day one</div>
        <div style={{ marginTop: 10 }}>
          <SpecTable
            head={["field", "value"]}
            rows={[
              ["tier", "Free"],
              ["credits", "1,000 a day"],
              ["card", "not required"],
              ["connectors", "none yet"],
            ]}
          />
        </div>
        <Note>
          Free credits reset daily and do not roll over. Zero connectors is the honest starting
          state: the console opens on what Zavi cannot see, not on a dashboard of numbers.
        </Note>
        <div className="src mono">
          apps/backend/src/routes/public/pricing.ts:33, PUBLIC_FREE_DAILY_FALLBACK
        </div>
      </aside>
    </div>
  );
}
