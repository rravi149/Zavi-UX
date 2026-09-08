"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const scenes = [
  {
    name: "Build",
    number: "01",
    title: "Make the next idea tangible.",
    description:
      "Move from a rough brief to a page you can review. Research, copy, and code come together around one goal.",
    tags: ["Research", "Writing", "Coding"],
    request: "Build a landing page for our new product.",
    work: [
      "Review the product and audience",
      "Prepare the page structure and copy",
      "Build a preview for review",
    ],
    result: "Your landing page preview is ready.",
    detail:
      "Review the page, refine the message, and choose what to change before launch.",
  },
  {
    name: "Run",
    number: "02",
    title: "Keep the day-to-day moving.",
    description:
      "Bring the work that needs your attention into one conversation. Turn scattered information into a clear next step.",
    tags: ["Company context", "Connected data", "Reporting"],
    request: "Check last week's signups and prepare a report.",
    work: [
      "Review the connected signup data",
      "Compare the previous week",
      "Summarize changes by source",
    ],
    result: "Your weekly signup report is ready.",
    detail:
      "Review the source data, weekly comparison, and the questions worth investigating next.",
  },
  {
    name: "Grow",
    number: "03",
    title: "Give the next campaign a direction.",
    description:
      "Turn a growth goal into a focused plan. Bring audience research, messaging, and channel work together.",
    tags: ["Audience research", "Content", "Campaigns"],
    request: "Prepare a launch campaign for our new product.",
    work: [
      "Review the audience and positioning",
      "Draft the launch message and channel plan",
      "Prepare campaign content for review",
    ],
    result: "Your launch plan is ready to review.",
    detail:
      "Explore the audience, channel plan, and draft content before approving the next step.",
  },
];

export default function StorySection() {
  const [index, setIndex] = useState(0);
  const scene = scenes[index];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
            Start with what you need
          </p>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
            Big idea. Daily task.
            <br />
            Next growth move.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          See how one request becomes useful work, with the right specialists
          behind it.
        </p>
      </div>

      <div className="mt-8 flex gap-2">
        {scenes.map((item, i) => (
          <button
            key={item.name}
            type="button"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              i === index
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground hover:bg-surface"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-10 rounded-[28px] border border-[#dbe5ee] bg-gradient-to-br from-[#fffcf8] via-[#edf6ff] to-[#edf1ff] p-8 md:grid-cols-[0.85fr_1.15fr] md:items-center md:p-10">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#446280]">
            {scene.number} / {scene.name.toUpperCase()}
          </p>
          <h3 className="mt-3 text-3xl leading-tight font-bold text-foreground">
            {scene.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {scene.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {scene.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#dce5ed] bg-white/70 px-3 py-1.5 text-[11px] font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e3e9ef] bg-white/95 shadow-[0_22px_50px_rgba(48,77,115,0.1)]">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <strong className="text-sm text-foreground">
              zavi / your workspace
            </strong>
            <span className="rounded-md border border-border px-1.5 py-1 text-[9px] tracking-wide text-muted uppercase">
              Example workflow
            </span>
          </div>

          <div key={scene.name} className="p-5 [animation:arrive_0.45s_ease_both]">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-muted">
                You
              </span>
              <p className="pt-1 text-[13px] leading-relaxed text-foreground">
                {scene.request}
              </p>
            </div>

            <div className="ml-4 space-y-2 border-l border-[#dce7f2] pl-4">
              {scene.work.map((line) => (
                <p key={line} className="text-[11px] text-muted">
                  <b className="text-[#3b8473]">→</b> {line}
                </p>
              ))}
            </div>

            <div className="mt-4 ml-4 rounded-xl border border-[#cddfec] bg-gradient-to-r from-[#f8fcff] to-[#edf5fd] p-4">
              <p className="text-[9px] font-extrabold tracking-[0.1em] text-[#46658a] uppercase">
                Result
              </p>
              <h4 className="mt-1.5 text-[13px] font-semibold text-foreground">
                {scene.result}
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                {scene.detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-border px-5 py-3 text-[11px] text-muted">
            <div className="flex flex-1 gap-1">
              {scenes.map((_, i) => (
                <span
                  key={i}
                  className={`h-[3px] flex-1 rounded-full ${i === index ? "bg-[#7eaede]" : "bg-[#e7ecf0]"}`}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => setIndex((i) => (i - 1 + scenes.length) % scenes.length)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-white"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => setIndex((i) => (i + 1) % scenes.length)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-white"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
