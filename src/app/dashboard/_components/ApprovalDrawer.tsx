"use client";

import { type ComponentType, type ReactNode } from "react";
import {
  BookOpen,
  BotMessageSquare,
  Check,
  Eye,
  ListChecks,
  ShieldCheck,
  TrendingUp,
  TriangleAlert,
  Undo2,
  X,
} from "lucide-react";
import type { ApprovalRequest } from "./types";

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </h4>
  );
}

export default function ApprovalDrawer({
  request,
  onClose,
  onAskZavi,
}: {
  request: ApprovalRequest;
  onClose: () => void;
  onAskZavi: (text: string) => void;
}) {
  function approve() {
    request.onApprove();
    onClose();
  }

  function reject() {
    request.onDismiss();
    onClose();
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="pb-8">
        <h3 className="text-xl leading-snug font-semibold text-zinc-900">
          {request.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{request.detail}</p>

        <section className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <SectionTitle icon={ShieldCheck}>
            Why this needs your approval
          </SectionTitle>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            {request.why}
          </p>
        </section>

        <section className="mt-6">
          <SectionTitle icon={ListChecks}>
            What happens when you approve
          </SectionTitle>
          <ol className="mt-3 space-y-2">
            {request.plan.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {request.preview && (
          <section className="mt-6">
            <SectionTitle icon={Eye}>{request.preview.label}</SectionTitle>
            <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed whitespace-pre-line text-zinc-800">
              {request.preview.body}
            </div>
          </section>
        )}

        {request.impact.length > 0 && (
          <section className="mt-6">
            <SectionTitle icon={TrendingUp}>Expected impact</SectionTitle>
            <dl className="mt-3 grid gap-2 sm:grid-cols-3">
              {request.impact.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-200 px-3 py-2.5"
                >
                  <dt className="text-xs text-zinc-500">{stat.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-zinc-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-4">
            <SectionTitle icon={TriangleAlert}>Risk</SectionTitle>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {request.risk}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-4">
            <SectionTitle icon={Undo2}>If you change your mind</SectionTitle>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {request.undo}
            </p>
          </div>
        </section>

        <section className="mt-6">
          <SectionTitle icon={BookOpen}>Based on</SectionTitle>
          <ul className="mt-3 flex flex-wrap gap-2">
            {request.sources.map((source) => (
              <li
                key={source}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
              >
                {source}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="sticky bottom-0 -mx-6 -mb-5 mt-auto flex items-center gap-2 border-t border-zinc-200 bg-white px-6 py-4">
        <button
          type="button"
          onClick={approve}
          className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Approve
        </button>
        <button
          type="button"
          onClick={reject}
          className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Reject
        </button>
        <button
          type="button"
          aria-label="Ask Zavi about this"
          title="Ask Zavi about this"
          onClick={() => {
            onAskZavi(`About "${request.title}" — `);
            onClose();
          }}
          className="ml-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <BotMessageSquare className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
