"use client";

import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  Check,
  Copy,
  Heart,
  Info,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Pencil,
  Repeat2,
  Wand2,
  X,
} from "lucide-react";
import type { SocialPost } from "./types";

const variants: { text: string; whyThisWorks: string }[] = [
  {
    text: "our seo was quietly broken and we had no idea\n\nan ai audit flagged geo issues we'd been ignoring for months\n\nturns out we were basically invisible in markets where couples actually search for this stuff\n\nfixing it now. will report back on whether it moves the needle",
    whyThisWorks:
      "The previous post introduced the AI CMO angle broadly; this post zooms into one specific, relatable founder pain point (broken SEO you didn't know about) discovered through that same process, giving it a fresh angle grounded in a real, concrete detail.",
  },
  {
    text: "spent 6 months guessing what to post next\n\nturns out an ai audit could've told us in 6 minutes\n\nwe were invisible in half the markets that actually search for this\n\nrerunning our whole content calendar around what it found",
    whyThisWorks:
      "Leads with a concrete time cost (6 months vs 6 minutes) instead of a vague pain point, which tends to perform better as a hook. Keeps the same founder-voice and real-detail grounding as the original.",
  },
  {
    text: "we almost shipped a feature nobody in our biggest market could find\n\nan ai audit caught it before launch\n\nturns out our geo targeting was quietly excluding the exact couples we built this for\n\nglad we checked before, not after",
    whyThisWorks:
      "Reframes the same underlying audit finding as a near-miss story, which creates more tension than a status update. Still anchored in the same real, specific detail (geo targeting) so it doesn't read as generic.",
  },
];

function StatIcon({
  icon: Icon,
  value,
}: {
  icon: typeof MessageCircle;
  value: string | number;
}) {
  return (
    <span className="flex items-center gap-1.5 text-zinc-500">
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="text-sm">{value}</span>
    </span>
  );
}

export default function PostDrawer({
  agentName,
  post,
  onClose,
  onChange,
  onDuplicate,
  onMarkComplete,
  onPost,
}: {
  agentName: string;
  post: SocialPost;
  onClose: () => void;
  onChange: (patch: Partial<SocialPost>) => void;
  onDuplicate: () => void;
  onMarkComplete: () => void;
  onPost: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [duplicated, setDuplicated] = useState(false);
  const variantIndex = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function regenerate() {
    setRegenerating(true);
    window.setTimeout(() => {
      const next = variants[variantIndex.current % variants.length];
      variantIndex.current += 1;
      onChange({ text: next.text, whyThisWorks: next.whyThisWorks });
      setRegenerating(false);
    }, 900);
  }

  function duplicate() {
    onDuplicate();
    setDuplicated(true);
    window.setTimeout(() => setDuplicated(false), 1500);
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-zinc-900/30 [animation:fade-in_200ms_ease-out]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={agentName}
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white text-zinc-900 shadow-2xl [animation:drawer-in_220ms_ease-out]"
      >
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-zinc-200 px-6 py-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
            X
          </span>
          <h2 className="text-[17px] font-semibold text-zinc-900">
            {agentName}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkComplete}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-100"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Mark Complete
            </button>
            <button
              type="button"
              onClick={onPost}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              <span className="text-[13px] font-bold">X</span>
              Post
            </button>
            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 p-0.5">
              <button
                type="button"
                aria-label="Duplicate post"
                title="Duplicate"
                onClick={duplicate}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {duplicated ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                aria-label={editing ? "Done editing" : "Edit post"}
                aria-pressed={editing}
                title={editing ? "Done editing" : "Edit"}
                onClick={() => setEditing((value) => !value)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 ${
                  editing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Regenerate with AI"
                title="Regenerate with AI"
                disabled={regenerating}
                onClick={regenerate}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {regenerating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </button>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div
            className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-opacity duration-200 ${
              regenerating ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className="h-12 w-12 shrink-0 rounded-xl"
                style={{ backgroundColor: post.avatarColor }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[15px] font-bold text-zinc-900">
                    {post.authorName}
                  </span>
                  {post.verified && (
                    <BadgeCheck
                      className="h-4 w-4 shrink-0 fill-sky-500 text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="truncate text-sm text-zinc-500">
                  @{post.authorHandle}
                </p>
              </div>
              <Info
                className="h-4 w-4 shrink-0 text-zinc-400"
                aria-hidden="true"
              />
            </div>

            <div className="mt-3">
              {editing ? (
                <label className="sr-only" htmlFor="post-text">
                  Post text
                </label>
              ) : null}
              {editing ? (
                <textarea
                  id="post-text"
                  rows={6}
                  value={post.text}
                  onChange={(event) => onChange({ text: event.target.value })}
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
                />
              ) : (
                <div className="space-y-2.5 text-[15px] leading-relaxed text-zinc-900">
                  {post.text.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <StatIcon icon={MessageCircle} value={post.stats.replies} />
              <StatIcon icon={Repeat2} value={post.stats.reposts} />
              <StatIcon icon={Heart} value={post.stats.likes} />
              <StatIcon icon={BarChart3} value={post.stats.views} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb
                className="h-4 w-4 shrink-0 text-amber-500"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Why this works
              </p>
            </div>
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <p className="text-sm leading-relaxed text-zinc-600">
                {post.whyThisWorks}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
