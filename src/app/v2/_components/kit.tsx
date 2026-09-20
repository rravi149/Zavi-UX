"use client";

import { type ReactNode } from "react";

/* The V2 design kit: a Swiss / technical spec-sheet language.
   Margin-label sections, disclosure rows where the claim is always visible and
   the proof opens on click, and a blind-spot block that carries the same weight
   as a win. Styling lives in ../v2.css, scoped under .v2 so it never fights the
   v1 globals. */

export function Section({
  num,
  label,
  framing,
  id,
  className,
  railExtra,
  children,
}: {
  num: string;
  label: string;
  framing?: string;
  id?: string;
  className?: string;
  railExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`sect ${className ?? ""}`} id={id}>
      <div className="sect-rail">
        <div className="sect-num mono">{num}</div>
        <h2 className="sect-label">{label}</h2>
        {framing ? <p className="sect-framing">{framing}</p> : null}
        {railExtra}
      </div>
      <div className="sect-body">{children}</div>
    </section>
  );
}

export function Row({
  title,
  sub,
  meta,
  open,
  src,
  children,
}: {
  title: string;
  sub?: string;
  meta?: string;
  open?: boolean;
  src?: string;
  children: ReactNode;
}) {
  return (
    <details className="row" open={open}>
      <summary className="row-sum">
        <span className="row-title">
          {title}
          {sub ? <span className="row-sub">{sub}</span> : null}
        </span>
        {meta ? <span className="row-meta mono">{meta}</span> : <span />}
        <span className="row-plus" aria-hidden="true" />
      </summary>
      <div className="row-proof">
        {children}
        {src ? <div className="src mono">{src}</div> : null}
      </div>
    </details>
  );
}

export function FlatRow({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <div className="row flat">
      <div className="row-sum">
        <span className="row-title">{title}</span>
        {meta ? <span className="row-meta mono">{meta}</span> : <span />}
        <span />
      </div>
      {children ? <div className="row-proof">{children}</div> : null}
    </div>
  );
}

/** A thing Zavi could not see. Same visual weight as a win, never a footnote. */
export function Blind({
  what,
  why,
  impact,
  action,
}: {
  what: string;
  why: string;
  impact?: string;
  action?: ReactNode;
}) {
  return (
    <div className="blind">
      <h4>{what}</h4>
      <p>{why}</p>
      {impact ? <p className="impact">{impact}</p> : null}
      {action ? <div style={{ marginTop: 9 }}>{action}</div> : null}
    </div>
  );
}

export function Btn({
  children,
  kind,
  sm,
  onClick,
  disabled,
  type,
}: {
  children: ReactNode;
  kind?: "dark" | "quiet";
  sm?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type ?? "button"}
      className={`btn ${kind ?? ""} ${sm ? "sm" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Chip({ children, kind }: { children: ReactNode; kind?: "on" | "warn" }) {
  return <span className={`chip ${kind ?? ""}`}>{children}</span>;
}

/** A link that is deliberately not wired in the prototype. Says so on click. */
export function Inert({ children }: { children: ReactNode }) {
  return (
    <a
      className="inert"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        const t = e.currentTarget;
        t.classList.add("inert-flash");
        window.setTimeout(() => t.classList.remove("inert-flash"), 700);
      }}
    >
      {children}
    </a>
  );
}

export function SpecTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <table className="sheet">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
