"use client";

import { BotMessageSquare, Check, Sparkles, X } from "lucide-react";
import type { ComponentType } from "react";

type SummaryItem = {
  id: number;
  title: string;
  detail: string;
};

export type ChannelSummary = {
  headline: string;
  points: string[];
};

export default function ChannelSummaryDrawer({
  channelName,
  channelColor,
  icon: Icon,
  glyph,
  summary,
  items,
  onApprove,
  onReject,
  onViewDetails,
  onApproveAll,
  onRejectAll,
  onAskZavi,
}: {
  channelName: string;
  channelColor: string;
  icon?: ComponentType<{ className?: string }>;
  glyph?: string;
  summary?: ChannelSummary;
  items: SummaryItem[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onAskZavi: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-col gap-5 pb-8">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${channelColor}`}
            aria-hidden="true"
          >
            {Icon ? (
              <Icon className="h-5 w-5" />
            ) : (
              <span className="text-sm font-bold">{glyph}</span>
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-wide text-zinc-900 uppercase">
              {channelName}
            </p>
            <p className="text-sm text-zinc-600">
              {items.length} action{items.length === 1 ? "" : "s"} waiting
            </p>
          </div>
        </div>

        {summary && (
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Summary
            </h4>
            <p className="mt-2 text-sm leading-snug font-semibold text-zinc-900">
              {summary.headline}
            </p>
            <ul className="mt-3 space-y-1.5">
              {summary.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm leading-snug text-zinc-700"
                >
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            All caught up — no actions waiting.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <p className="text-[15px] leading-snug font-semibold text-zinc-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm text-zinc-500">{item.detail}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  Approve to have Zavi apply this change now. Reject to
                  dismiss it — nothing changes.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    aria-label="Approve — Zavi applies this change now"
                    title="Approve — Zavi applies this change now"
                    onClick={() => onApprove(item.id)}
                    className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Approve
                  </button>
                  <button
                    type="button"
                    aria-label="Reject — dismiss this, no changes made"
                    title="Reject — dismiss this, no changes made"
                    onClick={() => onReject(item.id)}
                    className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewDetails(item.id)}
                    className="ml-auto cursor-pointer text-sm font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-900"
                  >
                    View details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="sticky bottom-0 -mx-6 -mb-5 mt-auto flex items-center gap-2 border-t border-zinc-200 bg-white px-6 py-4">
          <button
            type="button"
            aria-label="Approve all — Zavi applies every action above now"
            title="Approve all — Zavi applies every action above now"
            onClick={onApproveAll}
            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Approve all
          </button>
          <button
            type="button"
            aria-label="Reject all — dismiss every action above, no changes made"
            title="Reject all — dismiss every action above, no changes made"
            onClick={onRejectAll}
            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Reject all
          </button>
          <button
            type="button"
            aria-label="Ask Zavi about this channel"
            title="Ask Zavi about this channel"
            onClick={onAskZavi}
            className="ml-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <BotMessageSquare className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
