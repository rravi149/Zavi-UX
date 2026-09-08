"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Copy,
  Loader2,
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

type IntakeQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

const intakeQuestions: IntakeQuestion[] = [
  {
    id: "improve",
    prompt: "If one thing got better over the next 3 months, what should it be?",
    options: [
      "More of them actually buying",
      "More of them coming back",
      "More of them signing up in the first place",
    ],
  },
  {
    id: "leak",
    prompt: "Where do you lose people?",
    options: [
      "They look, but don't buy",
      "They sign up, but don't stick around",
      "They never make it to the page",
    ],
  },
  {
    id: "source",
    prompt: "Think about the last handful of customers. How did they find you?",
    options: ["Saw us on social", "Someone referred them", "Found us searching"],
  },
];

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

export default function GrowthChatPanel({
  workspace = "your business",
  businessSummary,
}: {
  workspace?: string;
  businessSummary?: string;
} = {}) {
  const [phase, setPhase] = useState<"intake" | "generating" | "chat">("intake");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customAnswer, setCustomAnswer] = useState("");
  const intakeListRef = useRef<HTMLDivElement>(null);

  const [chat, setChat] = useState<ChatEntry[]>(seedChat);
  const [draft, setDraft] = useState("");
  const [creditsDismissed, setCreditsDismissed] = useState(false);
  const [reactions, setReactions] = useState<Record<number, "up" | "down">>({});
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(chat.length + 1);

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = intakeQuestions[answeredCount];
  const intakeComplete = answeredCount === intakeQuestions.length;

  const [sidebarInset, setSidebarInset] = useState(0);

  useEffect(() => {
    if (phase === "chat") return;
    const el = document.querySelector<HTMLElement>('[data-panel="sidebar"]');
    if (!el) return;
    const update = () => setSidebarInset(el.getBoundingClientRect().right + 4);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "intake") return;
    const el = intakeListRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [phase, answeredCount]);

  useEffect(() => {
    if (phase !== "generating") return;
    const timer = setTimeout(() => setPhase("chat"), 1600);
    return () => clearTimeout(timer);
  }, [phase]);

  function answerQuestion(id: string, value: string) {
    const text = value.trim();
    if (!text) return;
    setAnswers((prev) => ({ ...prev, [id]: text }));
    setCustomAnswer("");
  }

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

  if (phase === "intake" || phase === "generating") {
    const openingLine = businessSummary
      ? `Here's what I have: ${workspace} — ${businessSummary}`
      : `Here's what I have: ${workspace} is set up and ready to go.`;

    return (
      <div
        className="fixed inset-y-1 right-1 z-50 flex flex-col overflow-hidden rounded-2xl border border-[#F0F0F0] bg-[#f9f9f9]"
        style={{ left: sidebarInset || undefined }}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-6 sm:px-10">
          <ZaviLogo size={28} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-semibold text-zinc-900">
              Chief Growth Officer
            </h2>
            <p className="truncate text-sm text-zinc-500">
              {phase === "generating" ? "Reading your data…" : "Ready to look at your data"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            {intakeQuestions.map((q, index) => (
              <span
                key={q.id}
                className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                  index < answeredCount ? "bg-zinc-900" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div
          ref={intakeListRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-10 sm:px-10"
        >
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="[animation:step-in_320ms_ease-out_both] rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 text-[15px] leading-relaxed text-zinc-700">
              {openingLine}
            </div>

            {intakeQuestions.slice(0, answeredCount + 1).map((question, index) => {
              const answered = answers[question.id];
              return (
                <div key={question.id} className="space-y-3">
                  <div className="[animation:step-in_320ms_ease-out_both] rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 text-[15px] leading-relaxed text-zinc-700">
                    {question.prompt}
                  </div>

                  {answered ? (
                    <div className="flex justify-end [animation:step-in_250ms_ease-out_both]">
                      <div className="max-w-[80%] rounded-full bg-zinc-900 px-5 py-2.5 text-[14px] font-medium text-white">
                        {answered}
                      </div>
                    </div>
                  ) : (
                    index === answeredCount && (
                      <div className="flex flex-col items-end gap-2 [animation:step-in_250ms_ease-out_both]">
                        <div className="flex flex-wrap justify-end gap-2">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => answerQuestion(question.id, option)}
                              className="cursor-pointer rounded-full border border-zinc-300 bg-white px-4 py-2 text-[13.5px] font-medium text-zinc-800 transition-colors duration-150 hover:border-zinc-900 hover:bg-zinc-50"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <form
                          className="flex w-full max-w-[85%] items-center gap-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            answerQuestion(question.id, customAnswer);
                          }}
                        >
                          <input
                            type="text"
                            value={customAnswer}
                            onChange={(event) => setCustomAnswer(event.target.value)}
                            placeholder="Or type your own answer…"
                            className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13.5px] text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
                          />
                        </form>
                      </div>
                    )
                  )}
                </div>
              );
            })}

            {intakeComplete && phase === "intake" && (
              <div className="[animation:step-in_320ms_ease-out_both] rounded-2xl border-2 border-zinc-900 bg-white p-5">
                <p className="text-[15px] leading-relaxed text-zinc-900">
                  That&apos;s what I needed. Now let me read your funnel, your
                  connected data and your site.
                </p>
                <button
                  type="button"
                  onClick={() => setPhase("generating")}
                  className="mt-4 flex cursor-pointer items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-700"
                >
                  Build my growth strategy
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-3 text-sm text-zinc-500">
                  This one takes a couple of minutes — it&apos;s the part that
                  actually reads your data.
                </p>
              </div>
            )}

            {phase === "generating" && (
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 [animation:step-in_320ms_ease-out_both]">
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-zinc-500" aria-hidden="true" />
                <p className="text-[14px] text-zinc-600">
                  Reading your funnel, connected data, and site…
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
              className="shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-50"
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
