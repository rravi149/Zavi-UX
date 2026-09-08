"use client";

import { useState } from "react";
import { ArrowUpRight, Hash } from "lucide-react";
import { ZaviLogo } from "../dashboard/_components/Brand";

const channels = ["general", "growth", "product", "updates"];

const platforms = [
  {
    name: "Slack",
    channelLabel: "# growth",
    connectStep: "Choose Slack and review the requested permissions.",
    respondsCopy:
      "Mention @Zavi in a channel it has joined, or send it a direct message. Ask a follow-up to keep working together.",
    headerBg: "bg-white",
    headerText: "text-foreground",
  },
  {
    name: "Microsoft Teams",
    channelLabel: "Zavi · Microsoft Teams",
    connectStep: "Choose Microsoft Teams and review the requested permissions.",
    respondsCopy:
      "Bring Zavi into your team's conversation. Ask a question or hand off a task, then review the response together.",
    headerBg: "bg-[#6664a7]",
    headerText: "text-white",
  },
];

export default function ChatPlatformSection() {
  const [tab, setTab] = useState(0);
  const platform = platforms[tab];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
            Where your team already works
          </p>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
            Keep the conversation.
            <br />
            Bring in Zavi.
          </h2>
        </div>

        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {platforms.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`cursor-pointer rounded-full px-4 py-2.5 text-xs font-semibold transition-colors duration-200 ${
                i === tab ? "bg-white text-foreground shadow-sm" : "text-muted"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-[0.68fr_1.32fr] md:items-center">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Available in {platform.name}
          </p>
          <h3 className="mt-3 text-2xl leading-snug font-bold text-foreground">
            Your AI teammate, right in {platform.name}.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Ask a question, bring in company context, and hand off a task.
            Keep the work close to the conversation.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-foreground"
          >
            Connect {platform.name} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid min-w-0 grid-cols-[140px_minmax(0,1fr)] overflow-hidden rounded-3xl border border-border shadow-[0_20px_45px_rgba(23,35,52,0.05)] max-md:grid-cols-1">
          <div className="hidden bg-[#f6f4f8] p-4 text-xs leading-loose text-[#76717c] md:block">
            <strong className="mb-5 block text-[13px] text-foreground">
              Your team
            </strong>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-muted uppercase">
              Channels
            </p>
            {channels.map((channel) => (
              <span
                key={channel}
                className={`mb-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 ${
                  channel === "growth"
                    ? "bg-[#e3dfeb] font-bold text-[#393241]"
                    : ""
                }`}
              >
                <Hash className="h-3 w-3" /> {channel}
              </span>
            ))}
          </div>

          <div>
            <div
              className={`flex items-center justify-between border-b border-border px-5 py-4 text-sm font-bold ${platform.headerBg} ${platform.headerText}`}
            >
              {platform.channelLabel}
              <span className="rounded-md border border-current/20 px-1.5 py-1 text-[9px] tracking-wide uppercase opacity-80">
                Example conversation
              </span>
            </div>

            <div className="p-5">
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0ede7] text-xs font-bold text-[#7e6445]">
                  Y
                </span>
                <div>
                  <strong className="mb-1 block text-xs text-foreground">
                    You
                  </strong>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    @Zavi, check last week&apos;s signups and prepare a
                    report.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f3ff] text-xs font-bold text-[#286ab4]">
                  <ZaviLogo size={16} />
                </span>
                <div className="min-w-0 flex-1 border-l-2 border-[#cde3fb] pl-3">
                  <strong className="mb-1 block text-xs text-foreground">
                    Zavi
                  </strong>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    Your signup report is ready for review. It includes the
                    weekly comparison and a breakdown by source.
                  </p>
                  <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-xs">
                    <p className="flex items-center gap-1 font-semibold text-foreground">
                      <ArrowUpRight className="h-3 w-3" /> Weekly signup
                      report
                    </p>
                    <p className="mt-1 text-muted">
                      Source data · Comparison · Next questions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-5 mb-5 flex items-center justify-between rounded-lg border border-border px-4 py-3 text-xs text-muted">
              Ask Zavi a follow-up…
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            What Zavi does
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Answers questions using company context and connected tools.
            Brings in specialist agents for work that needs them.
          </p>
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            Connect your workspace
          </h3>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs leading-relaxed text-muted">
            <li>Sign in and open integration settings.</li>
            <li>{platform.connectStep}</li>
            <li>Bring Zavi into the conversations where you need it.</li>
          </ol>
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            Start a conversation
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {platform.respondsCopy}
          </p>
        </div>
      </div>
    </section>
  );
}
