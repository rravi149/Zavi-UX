"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const phrases = ["run your business", "grow your business", "build your business"];
const lifecycle = ["Build", "Run", "Grow"] as const;

export default function ZaviHero() {
  const [active, setActive] = useState<(typeof lifecycle)[number]>("Build");
  const [typed, setTyped] = useState(phrases[0]);
  const phraseIndex = useRef(0);
  const mode = useRef<"hold" | "erase" | "pause" | "type">("hold");

  useEffect(() => {
    const tick = () => {
      const wait =
        mode.current === "hold"
          ? 2200
          : mode.current === "erase"
            ? 35
            : mode.current === "pause"
              ? 500
              : 65;
      timer = window.setTimeout(() => {
        setTyped((current) => {
          if (mode.current === "hold") {
            mode.current = "erase";
            return current;
          }
          if (mode.current === "erase") {
            const next = current.slice(0, -1);
            if (!next) mode.current = "pause";
            return next;
          }
          if (mode.current === "pause") {
            phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
            mode.current = "type";
            return current;
          }
          const target = phrases[phraseIndex.current];
          const next = target.slice(0, current.length + 1);
          if (next === target) mode.current = "hold";
          return next;
        });
        tick();
      }, wait);
    };
    let timer = window.setTimeout(tick, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 700px 400px at 70% 40%, rgba(200,226,255,0.55), transparent 60%), radial-gradient(ellipse 560px 340px at 26% 55%, rgba(255,236,213,0.55), transparent 55%)",
        }}
      />

      <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
        <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
          One AI agent. Your business, moving forward.
        </p>

        <h1 className="mt-6 min-h-[2.3em] text-5xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-6xl">
          Let&apos;s
          <br />
          <span className="text-[#306cb0]">
            {typed}
            <span className="ml-0.5 inline-block h-[0.85em] w-[0.09em] translate-y-[0.05em] animate-pulse bg-[#357dd3] align-baseline" />
          </span>
          .
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
          From your next idea to the work that keeps your business moving.
          Talk to Zavi. It brings the right agents together.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/start"
            className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-secondary"
          >
            Start free <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#how-it-works"
            className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-bold text-foreground transition-colors duration-200 hover:bg-surface"
          >
            Watch Zavi work <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-4 text-xs text-muted">
          Available on the web, in Slack, and in Microsoft Teams.
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="h-[3px] max-w-40 flex-1 rounded-full bg-gradient-to-r from-emerald-200 via-amber-200 to-sky-200" />
          <div className="flex gap-2 text-sm font-semibold text-muted">
            {lifecycle.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActive(item)}
                className={`cursor-pointer rounded-full px-3 py-1 transition-colors duration-200 ${
                  active === item ? "bg-primary text-white" : "hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="h-[3px] max-w-40 flex-1 rounded-full bg-gradient-to-r from-sky-200 via-rose-200 to-emerald-200" />
        </div>
      </div>
    </section>
  );
}
