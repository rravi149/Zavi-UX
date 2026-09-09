"use client";

import {
  ArrowRight,
  MessageSquare,
  Check,
  Play,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import type { ApprovalReview } from "./types";
import { confidenceTone } from "./metrics";
import { copyOptions, type CopyOptionId } from "./plainCopy";
import Option3Flow from "../../meta-option-3/Flow";
import Option4Flow from "../../meta-option-4/Flow";
import Option5Flow from "../../meta-option-5/Flow";
import Option6Flow from "../../meta-option-6/Flow";

type SummaryItem = {
  id: number;
  title: string;
  detail: string;
  review: ApprovalReview;
};

export type ChannelSummary = {
  headline: string;
};

const riskTone: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

function actionVerb(title: string): string {
  const beforeQuote = title.split(/["“”]/)[0].trim();
  const phrase = beforeQuote.replace(/\s+(on|in|for|from|to)$/i, "").trim();
  return phrase || title;
}

function ActionCard({
  item,
  onApprove,
  onReject,
  onViewDetails,
}: {
  item: SummaryItem;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const [riskLevel, ...riskRest] = item.review.risk.split(". ");
  const riskDetail = riskRest.join(". ").split(". ")[0];
  const verb = item.review.actionLabel ?? actionVerb(item.title);

  return (
    <li className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {item.review.creative && (
          <div className="shrink-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-100">
              <img
                src={item.review.creative.image}
                alt={item.review.creative.caption}
                className="h-full w-full object-cover"
              />
              {item.review.creative.kind === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <Play className="h-5 w-5 fill-white text-white" aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="mt-1 text-center text-sm text-zinc-500">
              Ad preview
            </p>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-base leading-snug font-semibold text-zinc-900">
            {item.title}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-zinc-200" />

      <button
        type="button"
        aria-expanded={whyOpen}
        title={whyOpen ? "Show less" : "Show the full reason"}
        onClick={() => setWhyOpen((value) => !value)}
        className="mt-3 w-full cursor-pointer text-left text-sm leading-relaxed text-zinc-600"
      >
        <span className={whyOpen ? "block" : "line-clamp-2"}>
          <span className="font-semibold text-zinc-800">Why: </span>
          {item.review.why}
        </span>
      </button>

      {item.review.evidence && (
        <div className="mt-3 rounded-xl border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2">
            <p className="text-sm font-semibold text-zinc-800">Evidence</p>
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold ${confidenceTone(item.review.evidence.confidence).badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${confidenceTone(item.review.evidence.confidence).dot}`}
                aria-hidden="true"
              />
              {item.review.evidence.confidence}
            </span>
          </div>
          <dl className="divide-y divide-zinc-100">
            {item.review.evidence.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 px-3 py-2"
              >
                <dt className="text-sm font-medium text-zinc-600">{row.label}</dt>
                <dd className="text-right text-sm">
                  <span
                    className={`font-bold ${
                      row.tone === "bad"
                        ? "text-red-700"
                        : row.tone === "good"
                          ? "text-emerald-700"
                          : "text-zinc-900"
                    }`}
                  >
                    {row.value}
                  </span>
                  {row.note && (
                    <span
                      className={`ml-1 font-medium ${
                        row.tone === "bad"
                          ? "text-red-600"
                          : row.tone === "good"
                            ? "text-emerald-600"
                            : "text-zinc-600"
                      }`}
                    >
                      {row.note}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {item.review.trend && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5">
          <span className="text-sm font-medium text-zinc-600">
            {item.review.trend.label}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-sm font-bold text-zinc-900">
            <span className="text-zinc-500 line-through decoration-zinc-400">
              {item.review.trend.before}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
            {item.review.trend.after}
          </span>
        </div>
      )}

      {item.review.outcome && (
        <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
          {item.review.outcome}
        </div>
      )}

      {!item.review.trend && !item.review.evidence && item.review.impact.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {item.review.impact.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-zinc-100 px-3 py-2.5">
              <p className="text-xl leading-tight font-extrabold tracking-tight text-zinc-900">
                {stat.value}
              </p>
              <p className="mt-0.5 text-sm text-zinc-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {(item.review.risk || item.review.reversible) && (
        <div className="mt-3 flex items-start gap-2 text-sm text-zinc-600">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${riskTone[riskLevel] ?? "bg-zinc-100 text-zinc-700"}`}
          >
            {riskLevel} risk
          </span>
          <span className="leading-snug">{riskDetail}</span>
        </div>
      )}

      {confirming ? (
        <div className="mt-3 rounded-xl border border-zinc-300 bg-zinc-50 p-3">
          <p className="text-sm font-semibold text-zinc-900">
            {verb} now?
          </p>
          <ol className="mt-2 space-y-1">
            {item.review.plan.map((step, index) => (
              <li
                key={step}
                className="flex gap-2 text-sm leading-snug text-zinc-600"
              >
                <span className="shrink-0 font-semibold text-zinc-400">
                  {index + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onApprove(item.id);
              }}
              className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Yes, {verb.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label={`${verb} — review before Zavi applies this change`}
            title={`${verb} — review before Zavi applies this change`}
            onClick={() => setConfirming(true)}
            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {verb}
          </button>
          <button
            type="button"
            aria-label="Reject — dismiss this, no changes made"
            title="Reject — dismiss this, no changes made"
            onClick={() => onReject(item.id)}
            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
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
      )}
    </li>
  );
}

function SimpleActionRow({
  item,
  onApprove,
  onReject,
  onViewDetails,
}: {
  item: SummaryItem;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const verb = item.review.actionLabel ?? actionVerb(item.title);
  const tone = item.review.evidence
    ? confidenceTone(item.review.evidence.confidence)
    : null;

  return (
    <li className="rounded-2xl border border-zinc-200 bg-white px-4 py-3.5">
      <div className="flex items-center gap-4">
        {item.review.creative && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
            <img
              src={item.review.creative.image}
              alt={item.review.creative.caption}
              className="h-full w-full object-cover"
            />
            {item.review.creative.kind === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <Play className="h-5 w-5 fill-white text-white" aria-hidden="true" />
              </div>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-base leading-snug font-semibold text-zinc-900">
            {item.title}
          </p>
          {item.review.trend && (
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-medium text-zinc-600">
              {item.review.trend.label}
              <span className="text-zinc-400 line-through decoration-zinc-300">
                {item.review.trend.before}
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span className="font-bold text-zinc-900">
                {item.review.trend.after}
              </span>
            </p>
          )}
        </div>

        {tone && item.review.evidence && (
          <span
            className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-sm font-semibold sm:flex ${tone.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
            {item.review.evidence.confidence}
          </span>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {confirming ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  onApprove(item.id);
                }}
                className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Yes, {verb.toLowerCase()}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                {verb}
              </button>
              <button
                type="button"
                onClick={() => onReject(item.id)}
                className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => onViewDetails(item.id)}
                className="shrink-0 cursor-pointer text-sm font-medium text-zinc-600 underline underline-offset-4 transition-colors duration-200 hover:text-zinc-900"
              >
                Details
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default function ChannelSummaryDrawer({
  channelName,
  channelColor,
  icon: Icon,
  glyph,
  summary,
  items,
  expanded,
  copyOption,
  onCopyOptionChange,
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
  expanded?: boolean;
  copyOption?: CopyOptionId;
  onCopyOptionChange?: (option: CopyOptionId) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onAskZavi: () => void;
}) {
  const [confirmingAll, setConfirmingAll] = useState(false);
  const layout =
    copyOptions.find((option) => option.id === copyOption)?.layout ?? "grid";

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

        {copyOption && onCopyOptionChange && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
            <p className="mr-1 text-sm font-medium text-zinc-600">Style</p>
            {copyOptions.map((option) => {
              const active = option.id === copyOption;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  title={option.hint}
                  onClick={() => onCopyOptionChange(option.id)}
                  className={`h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {summary && layout !== "flow" && (
          <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-snug font-medium text-zinc-800">
            {summary.headline}
          </p>
        )}

        {layout === "flow" ? (
          <div className="-mx-5 -mb-8 border-t border-zinc-200">
            {copyOption === "goal" ? (
              <Option3Flow embedded startAt="review" />
            ) : copyOption === "constraint" ? (
              <Option4Flow embedded startAt="review" />
            ) : copyOption === "merged" ? (
              <Option5Flow embedded startAt="review" />
            ) : (
              <Option6Flow embedded startAt="review" />
            )}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            All caught up — no actions waiting.
          </p>
        ) : layout === "focus" ? (
          <ul className="space-y-2.5">
            {items.map((item) => (
              <SimpleActionRow
                key={item.id}
                item={item}
                onApprove={onApprove}
                onReject={onReject}
                onViewDetails={onViewDetails}
              />
            ))}
          </ul>
        ) : (
          <ul
            className={
              expanded
                ? "grid grid-cols-2 items-start gap-3 xl:grid-cols-3"
                : "space-y-3"
            }
          >
            {items.map((item) => (
              <ActionCard
                key={item.id}
                item={item}
                onApprove={onApprove}
                onReject={onReject}
                onViewDetails={onViewDetails}
              />
            ))}
          </ul>
        )}
      </div>

      {/*
        Flow options (3 to 6) render their own approve and reject controls over
        their own state. The drawer's footer acts on the channel item list, so
        showing it alongside them duplicated the buttons AND offered a control
        that resolved different state than the cards on screen.
      */}
      {items.length > 0 && layout !== "flow" && (
        <div className="sticky bottom-0 -mx-6 -mb-5 mt-auto flex flex-col gap-3 border-t border-zinc-200 bg-white px-6 py-4">
          {confirmingAll && (
            <p className="text-sm font-medium text-zinc-700">
              Apply all {items.length} action{items.length === 1 ? "" : "s"}{" "}
              above? This can&apos;t be grouped-undone — review each one&apos;s
              &quot;if it doesn&apos;t work&quot; note if you&apos;re unsure.
            </p>
          )}
          <div className="flex items-center gap-2">
            {confirmingAll ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingAll(false);
                    onApproveAll();
                  }}
                  className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Yes, apply all
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingAll(false)}
                  className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  aria-label="Approve all — review before Zavi applies every action above"
                  title="Approve all — review before Zavi applies every action above"
                  onClick={() => setConfirmingAll(true)}
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
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
