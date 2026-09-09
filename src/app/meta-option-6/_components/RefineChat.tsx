"use client";

/**
 * Refine with Zavi.
 *
 * Without this, the founder's only vocabulary is yes and no. Zavi proposes,
 * they accept or decline, and if the batch is nearly right but not quite there
 * is nowhere to say so. This panel lets them push back in their own words and
 * get a revised batch, rather than rejecting five things and starting over.
 *
 * Revisions are grounded in the real moves: Zavi withdraws or re-scopes actual
 * cards, and the review grid updates to match.
 */

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { moves } from "../../meta-option-5/_data/moves";

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

export type Revision = {
  /** Cards Zavi pulls from the batch in response to the feedback. */
  withdraw: number[];
  /** One line shown on the review screen explaining what changed and why. */
  summary: string;
};

type Msg = { from: "you" | "zavi"; text: string; revision?: Revision };

/** Intent matching over the real batch. Each reply names actual cards. */
function respond(input: string): Msg {
  const t = input.toLowerCase();

  if (/(risk|conservative|careful|cautious|safe)/.test(t)) {
    return {
      from: "zavi",
      text: "Fair. The two weakest bets here are the picture swap on the winback ad and opening up placements on the Q4 promo. The placement one has 5 days of history and I could not size it honestly, and the picture swap restarts Meta's learning for up to a week. I have pulled both. What is left is the two that stop money going nowhere and the budget raise, which is the only one with a real return behind it.",
      revision: {
        withdraw: [4, 5],
        summary:
          "You asked for a more cautious batch. Zavi withdrew the 2 least certain moves and kept the 3 with money evidence behind them.",
      },
    };
  }
  if (/(save|saving|margin|don.?t spend|no new spend|cut)/.test(t)) {
    return {
      from: "zavi",
      text: "Understood, savings only. I have pulled the budget raise, so nothing gets reinvested and the full $798 a week stays in your pocket. Worth knowing the trade: that raise was the only move forecasting more sales, roughly 30 to 40 a week. You are choosing margin over volume this week, which is a real choice, just not a free one.",
      revision: {
        withdraw: [3],
        summary:
          "You asked to save rather than reinvest. Zavi withdrew the budget raise, so the $798 a week freed stays unspent.",
      },
    };
  }
  if (/(winback|picture|creative|image)/.test(t)) {
    return {
      from: "zavi",
      text: "Leaving the winback ad alone. I have pulled the picture swap. For what it is worth, my read is that it is heading the same way as the cart-abandoner ad you are switching off, so it is worth a look in a couple of weeks. But it is your ad and there is no money riding on this one either way.",
      revision: {
        withdraw: [4],
        summary: "You asked to leave the winback ad alone. Zavi withdrew the picture swap.",
      },
    };
  }
  if (/(budget|raise|180|120|slower|smaller|gradual)/.test(t)) {
    return {
      from: "zavi",
      text: "On the budget raise: I proposed $120 to $180 a day, and I should be straight that this rests on only 3 past increases on your account. That is a pattern, not proof. If you would rather step it up more slowly, the honest answer is I cannot promise the same 30 to 40 sales from a smaller step, so I would rather you approve it as proposed or leave it and we revisit next week with more history.",
    };
  }
  if (/(explain|why|how|understand|confus|what does)/.test(t)) {
    return {
      from: "zavi",
      text: "The short version: $588 a week is going into an ad that now costs $19.60 a sale when your other ads manage $8.21, and another $210 a week is being spent reaching people who already bought. That is the $798. Separately, your best ad hits its daily cap and stops early, so it cannot spend more even though it returns $3.09 per $1. The first three cards move money from the first problem to the second. The last two are unrelated early warnings.",
    };
  }
  return {
    from: "zavi",
    text: "Noted, and I have kept the batch as it is for now. If you tell me what specifically feels wrong, that it is too risky, that you would rather bank the savings than reinvest, or that a particular ad should be left alone, I can pull or re-scope the cards to match.",
  };
}

const CHIPS = [
  "This feels too risky",
  "I want to save, not reinvest",
  "Leave the winback ad alone",
  "Explain the budget raise again",
];

export default function RefineChat({
  onClose,
  onApplyRevision,
}: {
  onClose: () => void;
  onApplyRevision: (r: Revision) => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "zavi",
      text: `I put ${moves.length} changes in front of you this week. If any of it is wrong, tell me what and I will redo the batch. You do not have to accept what I picked.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || thinking) return;
    setMsgs((m) => [...m, { from: "you", text: clean }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, respond(clean)]);
      setThinking(false);
    }, 700);
  }

  return (
    <aside
      aria-label="Refine with Zavi"
      className="flex h-full min-h-0 flex-col overflow-hidden bg-white"
    >
        {/* Same chrome as the workspace chat column: h-14 header, bottom rule. */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <p className="truncate text-[15px] font-semibold text-zinc-900">Refine with Zavi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Zavi"
            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {msgs.map((m, i) => (
            <div key={i} className={cx("flex", m.from === "you" ? "justify-end" : "justify-start")}>
              <div
                className={cx(
                  "max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
                  m.from === "you"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-900",
                )}
              >
                {m.text}
                {m.revision && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyRevision(m.revision!);
                      onClose();
                    }}
                    className="mt-2.5 inline-flex h-9 cursor-pointer items-center rounded-lg bg-zinc-900 px-3.5 text-[13px] font-semibold text-white hover:bg-zinc-700"
                  >
                    Use this revised batch
                  </button>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-zinc-100 px-4 py-3 text-[15px] text-zinc-400">
                Zavi is rethinking the batch...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="shrink-0 p-3">
          <div className="flex flex-wrap gap-1.5 pb-2.5">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => send(c)}
                className="cursor-pointer rounded-full border border-zinc-200 px-3 py-1.5 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <label htmlFor="refine-input" className="sr-only">
              Tell Zavi what to change
            </label>
            <textarea
              id="refine-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Tell Zavi what to change"
              className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-[12px] text-zinc-400">Enter to send</p>
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send"
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
    </aside>
  );
}
