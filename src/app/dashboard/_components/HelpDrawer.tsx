"use client";

import { useState, type FormEvent } from "react";
import {
  BookOpen,
  Check,
  ExternalLink,
  LifeBuoy,
  Keyboard,
} from "lucide-react";

const links = [
  {
    label: "Documentation",
    detail: "Guides for every panel and agent",
    href: "/",
  },
  {
    label: "Template gallery",
    detail: "Browse what you can ship today",
    href: "/#gallery",
  },
  { label: "Pricing and plans", detail: "What Pro unlocks", href: "/#pricing" },
  { label: "FAQ", detail: "Common questions", href: "/#faq" },
];

const shortcuts: [string, string][] = [
  ["Escape", "Close any drawer, modal, or menu"],
  ["Arrow keys", "Reorder a panel while its grip is focused"],
  ["Enter", "Send a chat message"],
  ["Shift + Enter", "New line in the composer"],
];

export default function HelpDrawer() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    window.setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="space-y-7">
      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          Read the docs
        </h3>
        <ul className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 px-4">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="flex items-center gap-3 py-3 transition-colors duration-200 hover:text-zinc-900"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-zinc-900">
                    {link.label}
                  </span>
                  <span className="block text-sm text-zinc-600">
                    {link.detail}
                  </span>
                </span>
                <ExternalLink
                  className="h-4 w-4 shrink-0 text-zinc-400"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <Keyboard className="h-5 w-5" aria-hidden="true" />
          Keyboard shortcuts
        </h3>
        <ul className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 px-4">
          {shortcuts.map(([keys, what]) => (
            <li key={keys} className="flex items-center gap-4 py-3">
              <kbd className="shrink-0 rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800">
                {keys}
              </kbd>
              <span className="text-sm text-zinc-700">{what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <LifeBuoy className="h-5 w-5" aria-hidden="true" />
          Contact support
        </h3>
        <p className="mt-1 text-sm text-zinc-600">
          We reply to every message within one business day.
        </p>
        <form onSubmit={submit} className="mt-3">
          <label htmlFor="support-message" className="sr-only">
            Message
          </label>
          <textarea
            id="support-message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What can we help with?"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={!message.trim()}
              className="h-10 cursor-pointer rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              Send message
            </button>
            {sent && (
              <p
                role="status"
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-700"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Sent — we&apos;ll reply by email.
              </p>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
