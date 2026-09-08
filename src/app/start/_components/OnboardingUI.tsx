"use client";

import {
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { Check, Loader2, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

export function ProgressIndicator({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <p className="text-xs font-medium tracking-wide text-muted tabular-nums">
      {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Step shell                                                          */
/* ------------------------------------------------------------------ */

export function StepShell({
  step,
  total,
  eyebrow,
  heading,
  subtext,
  children,
}: {
  step: number;
  total: number;
  eyebrow?: string;
  heading: string;
  subtext: string;
  children: ReactNode;
}) {
  return (
    <div
      key={step}
      className="w-full [animation:step-in_380ms_cubic-bezier(0.16,1,0.3,1)_both]"
    >
      <ProgressIndicator step={step} total={total} />
      {eyebrow && (
        <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-[26px] leading-tight font-semibold tracking-tight text-foreground sm:text-[30px]">
        {heading}
      </h1>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
        {subtext}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-[13px] font-medium text-foreground">
      {children}
    </span>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[14px] text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-foreground/25 focus:ring-4 focus:ring-foreground/[0.06] focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[14px] leading-relaxed text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-foreground/25 focus:ring-4 focus:ring-foreground/[0.06] focus:outline-none ${props.className ?? ""}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export function PrimaryButton({
  children,
  loading,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || loading}
      className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export function TextButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`cursor-pointer text-[13px] font-medium text-muted transition-colors duration-200 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Selectable chip                                                     */
/* ------------------------------------------------------------------ */

export function SelectableChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-150 active:scale-[0.97] ${
        selected
          ? "border-foreground bg-foreground text-white"
          : "border-black/10 bg-white text-foreground hover:border-black/20 hover:bg-black/[0.02]"
      }`}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Competitor row                                                      */
/* ------------------------------------------------------------------ */

export function CompetitorRow({
  name,
  domain,
  onRemove,
}: {
  name: string;
  domain: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-3.5 py-3 [animation:step-in_250ms_ease-out_both]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-xs font-semibold text-foreground">
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-foreground">
          {name}
        </p>
        <p className="truncate text-xs text-muted">{domain}</p>
      </div>
      <button
        type="button"
        aria-label={`Remove ${name}`}
        onClick={onRemove}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-black/[0.04] hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Integration card                                                    */
/* ------------------------------------------------------------------ */

export function IntegrationCard({
  icon,
  name,
  description,
  connected,
  onToggle,
}: {
  icon: ReactNode;
  name: string;
  description: string;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 transition-colors duration-150 hover:border-black/15">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-foreground">
          {icon}
        </span>
        <p className="truncate text-[13.5px] font-semibold text-foreground">
          {name}
        </p>
      </div>
      <p className="text-xs leading-relaxed text-muted">{description}</p>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={connected}
        className={`mt-auto flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 active:scale-[0.98] ${
          connected
            ? "bg-emerald-50 text-emerald-700"
            : "border border-black/10 bg-white text-foreground hover:bg-black/[0.02]"
        }`}
      >
        {connected ? (
          <>
            <Check className="h-3.5 w-3.5" /> Connected
          </>
        ) : (
          "Connect"
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Team email row                                                      */
/* ------------------------------------------------------------------ */

export function TeamEmailField({
  emails,
  onAdd,
  onRemove,
}: {
  emails: string[];
  onAdd: (email: string) => void;
  onRemove: (email: string) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const email = value.trim();
    if (!email) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError("Enter a valid email address");
      return;
    }
    if (emails.includes(email)) {
      setError("That email is already added");
      return;
    }
    onAdd(email);
    setValue("");
    setError(null);
  }

  return (
    <div>
      <div className="flex gap-2">
        <TextInput
          type="email"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="Enter email address"
        />
        <PrimaryButton onClick={submit} disabled={!value.trim()}>
          Add
        </PrimaryButton>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      {emails.length > 0 && (
        <ul className="mt-3 space-y-2">
          {emails.map((email) => (
            <li
              key={email}
              className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 [animation:step-in_250ms_ease-out_both]"
            >
              <span className="min-w-0 truncate text-[13.5px] text-foreground">
                {email}
              </span>
              <button
                type="button"
                aria-label={`Remove ${email}`}
                onClick={() => onRemove(email)}
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-black/[0.04] hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
