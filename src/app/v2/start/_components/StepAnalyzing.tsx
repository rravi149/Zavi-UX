"use client";

import { useState } from "react";
import { Section, Row, Btn, Chip, Blind, SpecTable } from "../../_components/kit";
import { FieldRow, NotConcluded, Note, StepActions } from "./ui";
import {
  ADDED_BY_YOU,
  SCAN_STEPS,
  SHAPES,
  stagesFor,
  type Fixture,
  type Found,
  type Outcome,
} from "./fixtures";

/* Step 3 of 4. The scan, then the company card.

   The card carries what Zavi concluded and what it could NOT see at the same
   weight, in the same type size, on the same page. That is the point of the
   screen: a card that shows only what it found reads as a system that looked
   everywhere. The live product makes the same call, and renders its blind
   spots as an OPEN disclosure, never collapsed
   (apps/web/src/components/workspace/GrowthInterview.tsx:119). */

type EditableKey = "company_name" | "description" | "icp";

const MARK: Record<Outcome, string> = { ok: "✓", warn: "!", skip: "-" };

function markColor(state: Outcome | "pending"): string {
  if (state === "warn") return "var(--rust)";
  if (state === "ok") return "var(--ok)";
  return "var(--ink-3)";
}

export default function StepAnalyzing({
  fixture,
  found,
  onPatch,
  stepAt,
  host,
  fromIdea,
  onContinue,
  onBack,
  onRescan,
  onToast,
}: {
  fixture: Fixture;
  found: Found | null;
  onPatch: (next: Found) => void;
  stepAt: number;
  host: string;
  fromIdea: boolean;
  onContinue: () => void;
  onBack: () => void;
  onRescan: () => void;
  onToast: (t: string) => void;
}) {
  const [editing, setEditing] = useState<EditableKey | null>(null);
  const [draft, setDraft] = useState("");
  const [competitorDraft, setCompetitorDraft] = useState("");

  const done = stepAt + 1;
  const pct = Math.round((done / SCAN_STEPS.length) * 100);
  const scanDone = stepAt >= SCAN_STEPS.length - 1;

  function beginEdit(key: EditableKey, current: string) {
    setEditing(key);
    setDraft(current);
  }

  function saveEdit(key: EditableKey) {
    if (!found) return;
    onPatch({ ...found, [key]: draft.trim(), edited: { ...found.edited, [key]: true } });
    setEditing(null);
    onToast(key + " is now your words, not the scan's");
  }

  const steps = (
    <>
      <div style={{ borderTop: "1px solid var(--rule-soft)" }}>
        {SCAN_STEPS.map((s, i) => {
          const settled = i <= stepAt;
          const pair = fixture.outcomes[s.key] ?? (["ok", ""] as [Outcome, string]);
          const state: Outcome | "pending" = settled ? pair[0] : "pending";
          return (
            <div
              key={s.key}
              style={{
                display: "grid",
                gridTemplateColumns: "16px minmax(0,1fr) auto",
                gap: 14,
                alignItems: "baseline",
                padding: "11px 0",
                borderBottom: "1px solid var(--rule-soft)",
                opacity: settled ? 1 : 0.32,
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 12, textTransform: "none", color: markColor(state) }}
              >
                {settled ? MARK[pair[0]] : "·"}
              </span>
              <span>
                <span style={{ fontSize: 14.5, fontWeight: 500 }}>{s.label}</span>
                <span
                  style={{
                    display: "block",
                    fontSize: 12.5,
                    color: "var(--ink-3)",
                    marginTop: 3,
                    lineHeight: 1.5,
                  }}
                >
                  {s.detail}
                </span>
                <span className="src mono" style={{ display: "block" }}>
                  {s.src}
                </span>
              </span>
              <span
                className="mono"
                style={{
                  textTransform: "none",
                  whiteSpace: "normal",
                  textAlign: "right",
                  maxWidth: 280,
                  color: state === "warn" ? "var(--rust)" : "var(--ink-2)",
                }}
              >
                {settled ? pair[1] : "waiting"}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ height: 2, background: "var(--rule-soft)", margin: "18px 0 0" }}>
        <i
          style={{
            display: "block",
            height: 2,
            background: "var(--ink)",
            width: pct + "%",
            transition: "width .28s linear",
          }}
        />
      </div>
      <Note>
        {done} of {SCAN_STEPS.length} done. Paced at 2.5 seconds in this prototype. The live
        screen paces over about 20 seconds and moves on when the request resolves, whichever
        comes first.
      </Note>
    </>
  );

  const scanBlock = (
    <Section
      num="01"
      label={scanDone ? "What Zavi read" : "Analyzing your website"}
      framing={
        scanDone
          ? "Eight reads, with what each one actually returned. The ones that failed are on the same line as the ones that worked."
          : "Zavi reads your site, your market and your competitors. No setup needed."
      }
      railExtra={
        <p className="sect-framing mono" style={{ marginTop: 10, textTransform: "none" }}>
          {fromIdea ? "no domain on file" : host}
        </p>
      }
    >
      {steps}
    </Section>
  );

  if (!scanDone || !found) {
    return (
      <div>
        <div className="kicker">{fromIdea ? "from scratch" : host + " / setting up"}</div>
        <h1 className="h1">Analyzing your website</h1>
        <p className="lede">
          Every read is named. When one fails you will see the failure here, not a spinner that
          finishes and a card that quietly leaves something out.
        </p>
        {scanBlock}
        <StepActions>
          <Btn kind="quiet" onClick={onBack}>
            Cancel and go back
          </Btn>
        </StepActions>
      </div>
    );
  }

  // A const binding, so the non-null narrowing survives into every closure below.
  const f: Found = found;

  const stages = stagesFor(f.inferredShape || "marketplace");
  const stageLabel =
    f.inferredShape && f.inferredStage >= 0 && f.inferredStage < stages.length
      ? stages[f.inferredStage]
      : "";

  function addCompetitor() {
    const name = competitorDraft.trim();
    if (!name) {
      onToast("Type a competitor first.");
      return;
    }
    const bare = name.replace(/^https?:\/\//, "");
    const looksLikeDomain = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(bare);
    const url = looksLikeDomain ? "https://" + bare : "manual:" + name.toLowerCase();
    if (f.competitors.some((c) => c.url === url)) {
      onToast("Already on the list.");
      return;
    }
    onPatch({
      ...f,
      competitors: [...f.competitors, { name, url, source_title: ADDED_BY_YOU }],
    });
    setCompetitorDraft("");
  }

  return (
    <div>
      <div className="kicker">{fromIdea ? "from scratch" : host}</div>
      <h1 className="h1">Here&apos;s what we found</h1>
      <p className="lede">
        Review this before continuing. Everything is editable so your agent team starts with the
        right context.
      </p>
      {scanBlock}

      <Section
        num="02"
        label="What Zavi concluded"
        framing="Correct anything wrong. Nothing is saved until you make an account, and the corrections are what gets saved, not the guesses."
      >
        <FieldRow
          label="company_name"
          meta={
            editing === "company_name" ? null : (
              <Btn kind="quiet" sm onClick={() => beginEdit("company_name", f.company_name)}>
                Correct
              </Btn>
            )
          }
        >
          {f.company_name ? (
            <>
              {f.company_name}{" "}
              {f.edited.company_name ? <Chip kind="on">you corrected this</Chip> : null}
            </>
          ) : (
            <NotConcluded>Not concluded. Name it.</NotConcluded>
          )}
          {editing === "company_name" ? (
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              <input
                type="text"
                maxLength={120}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Company name"
                style={{ flex: 1, minWidth: 200 }}
              />
              <Btn kind="dark" sm onClick={() => saveEdit("company_name")}>
                Save
              </Btn>
              <Btn kind="quiet" sm onClick={() => setEditing(null)}>
                Cancel
              </Btn>
            </div>
          ) : null}
        </FieldRow>

        <FieldRow
          label="description"
          meta={
            editing === "description" ? null : (
              <Btn kind="quiet" sm onClick={() => beginEdit("description", f.description)}>
                Correct
              </Btn>
            )
          }
        >
          {f.description}{" "}
          {f.edited.description ? <Chip kind="on">you corrected this</Chip> : null}
          {editing === "description" ? (
            <div style={{ marginTop: 8 }}>
              <textarea
                rows={5}
                maxLength={2000}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Btn kind="dark" sm onClick={() => saveEdit("description")}>
                  Save
                </Btn>
                <Btn kind="quiet" sm onClick={() => setEditing(null)}>
                  Cancel
                </Btn>
              </div>
            </div>
          ) : null}
        </FieldRow>

        <FieldRow
          label="inferredShape"
          meta={
            f.shapeConfidence === "high" ? (
              <Chip kind="on">high confidence</Chip>
            ) : (
              <Chip kind="warn">confirm this</Chip>
            )
          }
        >
          {f.inferredShape ? null : (
            <NotConcluded>Not concluded. shapeConfidence came back low.</NotConcluded>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {SHAPES.map((s) => (
              <Btn
                key={s.value}
                sm
                kind={f.inferredShape === s.value ? "dark" : "quiet"}
                onClick={() => {
                  const nextStage =
                    f.inferredStage >= stagesFor(s.value).length ? -1 : f.inferredStage;
                  onPatch({
                    ...f,
                    inferredShape: s.value,
                    inferredStage: nextStage,
                    edited: { ...f.edited, inferredShape: true },
                  });
                }}
              >
                {s.label}
              </Btn>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="inferredStage" meta={<span className="mono">{stageLabel || "unset"}</span>}>
          {f.inferredShape ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {stages.map((lab, i) => (
                <Btn
                  key={lab}
                  sm
                  kind={f.inferredStage === i ? "dark" : "quiet"}
                  onClick={() =>
                    onPatch({
                      ...f,
                      inferredStage: i,
                      edited: { ...f.edited, inferredStage: true },
                    })
                  }
                >
                  {lab}
                </Btn>
              ))}
            </div>
          ) : (
            <NotConcluded>Pick a company type first. The stage list depends on it.</NotConcluded>
          )}
        </FieldRow>

        <FieldRow
          label="who you sell to"
          meta={
            editing === "icp" ? null : (
              <Btn kind="quiet" sm onClick={() => beginEdit("icp", f.icp)}>
                Correct
              </Btn>
            )
          }
        >
          {f.icp ? (
            <>
              {f.icp} <Chip kind="on">you told Zavi this</Chip>
            </>
          ) : (
            <>
              <NotConcluded>Zavi did not conclude this, and will not guess it.</NotConcluded>
              <Note>
                The public site rarely says who the buyer is. On the live product this is the
                first slot the growth interview asks for after sign-up. Answer it here if you
                already know.
              </Note>
            </>
          )}
          {editing === "icp" ? (
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              <input
                type="text"
                maxLength={200}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Site foremen buying for a crew of 5 to 40"
                style={{ flex: 1, minWidth: 200 }}
              />
              <Btn kind="dark" sm onClick={() => saveEdit("icp")}>
                Save
              </Btn>
              <Btn kind="quiet" sm onClick={() => setEditing(null)}>
                Cancel
              </Btn>
            </div>
          ) : null}
        </FieldRow>

        <FieldRow
          label="competitors"
          meta={<span className="mono">{String(f.competitors.length)}</span>}
        >
          {f.competitors.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {f.competitors.map((c) => (
                <span
                  key={c.url}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1px solid var(--rule)",
                    padding: "4px 8px",
                    fontSize: 13,
                  }}
                >
                  {c.name}
                  <span
                    className="mono"
                    style={{ fontSize: 9.5, textTransform: "none", letterSpacing: ".04em" }}
                  >
                    {c.source_title === ADDED_BY_YOU
                      ? ADDED_BY_YOU
                      : "found on: " + c.source_title}
                  </span>
                  <button
                    type="button"
                    title={"Remove " + c.name}
                    aria-label={"Remove " + c.name}
                    onClick={() =>
                      onPatch({
                        ...f,
                        competitors: f.competitors.filter((x) => x.url !== c.url),
                      })
                    }
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      font: "inherit",
                      color: "var(--ink-3)",
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <NotConcluded>
              None found. That is a statement about the search, not about your market.
            </NotConcluded>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              maxLength={200}
              value={competitorDraft}
              onChange={(e) => setCompetitorDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCompetitor();
                }
              }}
              placeholder="Add one you actually watch"
              style={{ flex: 1, minWidth: 200 }}
            />
            <Btn kind="quiet" sm onClick={addCompetitor}>
              Add
            </Btn>
          </div>
          <Note>
            These are exactly what gets saved. Activate seeds the company record from them.
          </Note>
        </FieldRow>

        <div style={{ paddingTop: 18 }}>
          <Row
            title="What the envelope actually carried"
            sub="raw counts"
            meta="StartEnrichment"
            src="apps/web/src/app/start/page.tsx:59-77, the StartEnrichment type"
          >
            <SpecTable
              head={["field", "value", "what it means"]}
              rows={[
                ["domain_pages", String(f.domain_pages), "first-party pages that loaded"],
                ["research_pages", String(f.research_pages), "third-party pages about you"],
                ["app_listings", String(f.app_listings), "JSON-LD from Apple or Play"],
                ["competitors", String(f.competitors.length), "each with a source_url"],
                ["shapeConfidence", f.shapeConfidence, "low means you confirm it"],
              ]}
            />
          </Row>
        </div>
      </Section>

      <Section
        num="03"
        label="What Zavi could not see"
        framing="Same page, same weight, same type size. A card that shows only what it found reads as a system that looked everywhere."
      >
        {f.cannot_see.map((b) => (
          <Blind
            key={b.what}
            what={b.what}
            why={b.why}
            impact={b.impact}
            action={<div className="src mono">{b.src}</div>}
          />
        ))}
        <Note>
          The live product says this in one line under the evidence: I can&apos;t see{" "}
          {f.cannot_see
            .map((b) => b.what.replace(/\.$/, "").toLowerCase())
            .slice(0, 2)
            .join(", or ")}
          , so this is a guess until you tell me. It renders as an open disclosure, never
          collapsed, because a system that hides what it could not see reads as a bluff.
        </Note>
        <div className="src mono">
          apps/web/src/components/workspace/GrowthInterview.tsx:44 and :119
        </div>
      </Section>

      <StepActions>
        <Btn kind="dark" onClick={onContinue}>
          Continue
        </Btn>
        <Btn kind="quiet" onClick={onBack}>
          {fromIdea ? "Back to the idea" : "Edit the website"}
        </Btn>
        <Btn kind="quiet" onClick={onRescan}>
          Run the scan again
        </Btn>
      </StepActions>
    </div>
  );
}
