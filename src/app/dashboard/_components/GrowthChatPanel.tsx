"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Copy,
  Mic,
  Plus,
  Send,
  ThumbsDown,
  ThumbsUp,
  Wallet,
  X,
} from "lucide-react";
import { IconButton, Panel, PanelHeader } from "./Panel";
import { ZaviLogo } from "./Brand";

type ChatEntry = { id: number; role: "user" | "assistant"; text: string };

const reactionButtons = [
  { kind: "up", icon: ThumbsUp, label: "Helpful" },
  { kind: "down", icon: ThumbsDown, label: "Not helpful" },
] as const;

const seedChat: ChatEntry[] = [
  {
    id: 1,
    role: "user",
    text: "Draft my growth strategy. Read whatever data you can reach first, then tell me the North star metric you'd pick, the single constraint you think is holding growth back, and the 2–3 channels worth betting on. Ask me only what you genuinely can't infer.",
  },
  {
    id: 2,
    role: "assistant",
    text: 'Here is the draft. Correct me where I am wrong.\n\nThe constraint is Meta Ads is the only channel with clean, readable data — every other channel is either not connected or connected with nothing readable yet. Betting on channels I can\'t measure means guessing.\n\nNorth star: weekly active learners, driven by Meta Ads spend efficiency (currently 3.38x ROAS on $13,988). That is the one number that proves demand is real.\n\nTwo channel bets, in order of leverage:\nMeta Ads. Already spending and already measurable — raise budget on what is working before adding a new unmeasured channel.\nSEO. Already delivering ranked data with no marginal spend; compounding for free while Meta scales.',
  },
];

const suggestedPrompts = [
  "What's actually holding growth back?",
  "What do you need from me to be useful?",
  "Which channel should I connect next?",
];

export default function GrowthChatPanel() {
  const [chat, setChat] = useState<ChatEntry[]>(seedChat);
  const [draft, setDraft] = useState("");
  const [creditsDismissed, setCreditsDismissed] = useState(false);
  const [reactions, setReactions] = useState<Record<number, "up" | "down">>({});
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(chat.length + 1);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const userId = nextId.current++;
    const replyId = nextId.current++;
    setChat((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      {
        id: replyId,
        role: "assistant",
        text: "Noted. I'll factor that into the plan and restate it in full next time, with who moved what.",
      },
    ]);
    setDraft("");
  }

  function toggleReaction(id: number, value: "up" | "down") {
    setReactions((prev) => {
      const next = { ...prev };
      if (next[id] === value) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  function copyMessage(text: string) {
    void navigator.clipboard?.writeText(text.replace(/\*\*/g, ""));
  }

  return (
    <Panel>
      <PanelHeader className="border-b border-zinc-200">
        <ZaviLogo size={28} />
        <h2 className="text-[17px] font-semibold text-zinc-900">
          Chief Growth Officer
        </h2>
      </PanelHeader>

      <div className="flex min-h-0 flex-1 flex-col bg-[#f9f9f9]">
        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto px-10 py-4"
        >
          <div className="space-y-6">
            {chat.map((message) => {
              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    className="group/prompt flex flex-col items-end"
                  >
                    <div className="max-w-[85%] rounded-3xl bg-[#ececec] px-5 py-3 text-[17px] leading-relaxed font-medium whitespace-pre-line text-zinc-900">
                      {message.text}
                    </div>
                    <button
                      type="button"
                      aria-label="Copy prompt"
                      title="Copy prompt"
                      onClick={() => copyMessage(message.text)}
                      className="mt-1.5 cursor-pointer text-zinc-600 opacity-0 transition-opacity duration-200 group-hover/prompt:opacity-100 hover:text-zinc-900 focus-visible:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                );
              }
              return (
                <article key={message.id} className="group/message">
                  <div className="space-y-2 text-[17px] leading-relaxed font-medium whitespace-pre-line text-zinc-900">
                    {message.text}
                  </div>
                  <div className="mt-3 flex items-center gap-4 opacity-0 transition-opacity duration-200 group-hover/message:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      aria-label="Copy message"
                      title="Copy message"
                      onClick={() => copyMessage(message.text)}
                      className="cursor-pointer text-zinc-600 transition-colors duration-200 hover:text-zinc-900"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    {reactionButtons.map(({ kind, icon: Icon, label }) => {
                      const pressed = reactions[message.id] === kind;
                      return (
                        <button
                          key={kind}
                          type="button"
                          aria-label={label}
                          aria-pressed={pressed}
                          title={label}
                          onClick={() => toggleReaction(message.id, kind)}
                          className={`cursor-pointer transition-colors duration-200 ${
                            pressed
                              ? "text-zinc-900"
                              : "text-zinc-600 hover:text-zinc-900"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${pressed ? "fill-current" : ""}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {!creditsDismissed && (
          <div className="mx-4 mb-2 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <Wallet className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-zinc-900">
                You&apos;re running low on credits. Buy credits to avoid
                interruptions.
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">
                Your credits reset on Oct 1.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
            >
              Buy Credits
            </button>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setCreditsDismissed(true)}
              className="shrink-0 cursor-pointer text-zinc-400 hover:text-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mx-4 mt-2 mb-2 flex items-center gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setDraft(prompt);
                textareaRef.current?.focus();
              }}
              className="shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="m-4 mt-0">
          <form
            onSubmit={sendMessage}
            className="relative rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <label htmlFor="growth-chat-input" className="sr-only">
              Message Chief Growth Officer
            </label>
            <textarea
              ref={textareaRef}
              id="growth-chat-input"
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(event);
                }
              }}
              placeholder="Message Chief Growth Officer…"
              className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <IconButton label="Add to message">
                  <Plus className="h-5 w-5" />
                </IconButton>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <IconButton label="Voice input">
                  <Mic className="h-5 w-5" />
                </IconButton>
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim()}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 ${
                    draft.trim()
                      ? "cursor-pointer bg-zinc-900 hover:bg-zinc-700"
                      : "cursor-not-allowed bg-zinc-200"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Panel>
  );
}
