"use client";

import { useState } from "react";
import { LayoutGrid, Menu, X } from "lucide-react";

const links = [
  { label: "Templates", href: "#gallery" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-6xl md:top-6">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface/80 px-4 py-3 shadow-sm backdrop-blur-md md:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <LayoutGrid className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Zavi
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/dashboard"
            className="cursor-pointer text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
          >
            Sign in
          </a>
          <a
            href="#gallery"
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary"
          >
            Browse templates
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4 shadow-sm md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <a
              href="/dashboard"
              className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-muted"
            >
              Sign in
            </a>
            <a
              href="#gallery"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Browse templates
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
