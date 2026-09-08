"use client";

import { useState } from "react";
import { CornerDownRight } from "lucide-react";

const contexts: {
  name: string;
  title: string;
  description: string;
  rows: [string, string][];
}[] = [
  {
    name: "Product information",
    title: "Know what you are building.",
    description: "The product facts that keep the work grounded.",
    rows: [
      ["Product", "What it does and the problem it solves."],
      ["Customers", "Who it is for and what they need."],
      [
        "Business model",
        "How customers get value and how the business earns revenue.",
      ],
    ],
  },
  {
    name: "Marketing strategy",
    title: "Choose a clear direction.",
    description: "A shared goal gives each channel a purpose.",
    rows: [
      ["Goal", "The business outcome to work toward."],
      ["Focus", "The audience and channels to prioritize."],
      ["Measurement", "The signals that show progress toward the goal."],
    ],
  },
  {
    name: "Competitor analysis",
    title: "Understand your customers' choices.",
    description: "Give your team context for a more useful offer.",
    rows: [
      ["Alternatives", "The products customers compare with yours."],
      ["Positioning", "The promises and messages used in the category."],
      ["Opportunities", "Gaps worth investigating with evidence."],
    ],
  },
  {
    name: "Brand voice",
    title: "Sound like your business.",
    description: "A consistent voice from the first draft to the final page.",
    rows: [
      ["Tone", "How your business speaks to its audience."],
      ["Language", "Words to use, explain, or avoid."],
      ["Examples", "Approved writing that guides future work."],
    ],
  },
  {
    name: "Content strategy",
    title: "Give the next piece a purpose.",
    description: "Connect topics and formats to the same business goal.",
    rows: [
      ["Topics", "Questions your audience wants answered."],
      ["Formats", "The best way to explain each idea."],
      ["Distribution", "Where the content should reach its audience."],
    ],
  },
];

export default function ResearchSection() {
  const [index, setIndex] = useState(0);
  const context = contexts[index];

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
              Shared context. Coordinated work.
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
              One understanding
              <br />
              of your business.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Your agents work from the same product facts, goals, and brand
              voice. Each specialist adds its skills to that shared context.
            </p>

            <div className="mt-8">
              {contexts.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-5 border-b border-border py-4 text-left text-[13px] transition-colors duration-150 ${
                    i === index
                      ? "font-bold text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.name}
                  <span className={i === index ? "text-primary" : ""}>↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-8">
            <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
              {context.name} / example brief
            </p>
            <h3 className="mt-3.5 text-2xl font-bold text-foreground">
              {context.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {context.description}
            </p>
            <ul className="mt-5 space-y-0 divide-y divide-border">
              {context.rows.map(([name, desc]) => (
                <li key={name} className="py-3.5 text-xs leading-relaxed">
                  <strong className="mb-1 block text-foreground">{name}</strong>
                  <span className="text-muted">{desc}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-[10px] font-medium text-[#486f99]">
              <CornerDownRight className="h-3.5 w-3.5" />
              Shared with the specialists working on your task
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
