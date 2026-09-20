"use client";

import { type ReactNode } from "react";

/* Small layout pieces this flow needs that the shared kit does not carry.
   Everything borrows a v2.css class for its look and uses inline style only
   for the grid, so no second stylesheet competes with v2.css. */

/** One door on the fork. A whole panel that is a button. */
export function Door({
  ord,
  title,
  subtitle,
  framing,
  onClick,
}: {
  ord: string;
  title: string;
  subtitle: string;
  framing: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="panel"
      style={{
        display: "grid",
        gridTemplateColumns: "38px 1fr auto",
        gap: 18,
        alignItems: "start",
        width: "100%",
        textAlign: "left",
        font: "inherit",
        color: "inherit",
        borderRadius: 0,
        cursor: "pointer",
      }}
    >
      <span className="mono" style={{ paddingTop: 3 }}>
        {ord}
      </span>
      <span>
        <span
          style={{
            display: "block",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-.012em",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 4,
            fontSize: 13.5,
            color: "var(--ink-3)",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 6,
            fontSize: 13.5,
            color: "var(--ink-3)",
            lineHeight: 1.5,
          }}
        >
          {framing}
        </span>
      </span>
      <span aria-hidden="true" style={{ fontSize: 18, color: "var(--ink-3)", paddingTop: 2 }}>
        &rarr;
      </span>
    </button>
  );
}

/** A field on the company card: key, value, and whatever control sits right. */
export function FieldRow({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "150px minmax(0,1fr) auto",
        gap: 18,
        alignItems: "baseline",
        padding: "14px 0",
        borderBottom: "1px solid var(--rule-soft)",
      }}
    >
      <div className="mono">{label}</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, minWidth: 0 }}>{children}</div>
      <div style={{ whiteSpace: "nowrap" }}>{meta}</div>
    </div>
  );
}

/** Something Zavi did not conclude. Rust, because an empty here is a finding. */
export function NotConcluded({ children }: { children: ReactNode }) {
  return <span className="needs-source">{children}</span>;
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55, margin: "10px 0 0" }}>
      {children}
    </p>
  );
}

/** Buttons at the bottom of a step, with the back affordance always present. */
export function StepActions({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 30,
        paddingTop: 18,
        borderTop: "1px solid var(--rule)",
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

export function Toast({ text }: { text: string }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      <div className="toast">{text}</div>
    </div>
  );
}
