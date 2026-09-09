"use client";

/**
 * Option 6. Option 1's grid of always-open evidence tables, with the seven
 * review fixes, plus confirmation modals, captured reject reasons, and a
 * Refine conversation so the founder can push back instead of only saying no.
 */

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import {
  ATTRIBUTION_NOTE,
  freeingMoves,
  moves,
  needsFundingWeekly,
  spendingMoves,
  trappedWeekly,
  type DayKey,
  type MoveStatus,
} from "../meta-option-5/_data/moves";
import Card from "./_components/Card";
import Results from "./_components/Results";
import RefineChat, { type Revision } from "./_components/RefineChat";
import { ApproveModal, BulkModal, RejectModal } from "./_components/Modal";

function cx(...p: (string | false | null | undefined)[]) {
  return p.filter(Boolean).join(" ");
}

/** Same interaction as the workspace column dividers. */
const CHAT_DEFAULT_WIDTH = 440;
const CHAT_MIN_WIDTH = 320;
const CHAT_MAX_WIDTH = 820;

function clampChatWidth(px: number) {
  return Math.min(CHAT_MAX_WIDTH, Math.max(CHAT_MIN_WIDTH, px));
}

function lockColumnCursor() {
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
}

function releaseColumnCursor() {
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
}

type Rejection = { reason: string; note: string };
type Ask =
  | { kind: "approve"; id: number }
  | { kind: "reject"; id: number }
  | { kind: "bulkApprove" }
  | { kind: "bulkReject" }
  | null;

export default function Option6Flow({
  embedded = false,
  startAt = "review",
}: {
  embedded?: boolean;
  startAt?: "review" | "results";
}) {
  const [view, setView] = useState<"review" | "results">(startAt);
  const [statuses, setStatuses] = useState<Record<number, MoveStatus>>(() =>
    Object.fromEntries(moves.map((m) => [m.id, "pending" as MoveStatus])),
  );
  const [rejections, setRejections] = useState<Record<number, Rejection>>({});
  const [ask, setAsk] = useState<Ask>(null);
  const [refining, setRefining] = useState(false);
  /** Cards Zavi pulled from the batch after a Refine conversation. */
  const [withdrawn, setWithdrawn] = useState<Set<number>>(new Set());
  const [revisionNote, setRevisionNote] = useState<string | null>(null);
  const [day, setDay] = useState<DayKey>(0);
  const [reverted, setReverted] = useState<Set<number>>(new Set());
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH);

  // Drag the divider. Moving left widens the chat, which is why the delta is inverted.
  function startChatResize(event: React.PointerEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = chatWidth;
    const move = (moveEvent: PointerEvent) => {
      setChatWidth(clampChatWidth(startWidth + (startX - moveEvent.clientX)));
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      releaseColumnCursor();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    lockColumnCursor();
  }

  const live = moves.filter((m) => !withdrawn.has(m.id));
  const decided = live.filter((m) => statuses[m.id] !== "pending").length;
  const approvedCount = live.filter((m) => statuses[m.id] === "approved").length;
  const banked = trappedWeekly - needsFundingWeekly;
  const askedMove = ask && "id" in ask ? moves.find((m) => m.id === ask.id) : undefined;

  function set(id: number, s: MoveStatus) {
    setStatuses((p) => ({ ...p, [id]: s }));
  }

  function applyRevision(r: Revision) {
    setWithdrawn((prev) => {
      const next = new Set(prev);
      r.withdraw.forEach((id) => next.add(id));
      return next;
    });
    setRevisionNote(r.summary);
  }

  const reviewColumn = (
    <div className={cx("w-full px-5 py-8 sm:px-7", !refining && !embedded && "mx-auto max-w-[1400px]")}>
        {view === "review" ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-[0.09em] text-zinc-500 uppercase">
                  This week
                </p>
                <h1 className="mt-1.5 text-[28px] leading-tight font-bold text-zinc-900">
                  {live.length} changes ready for your review
                </h1>
              </div>
              {/* Refine. Without it the only vocabulary is yes and no. */}
              <button
                type="button"
                onClick={() => setRefining((v) => !v)}
                aria-pressed={refining}
                className={cx(
                  "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-4 text-sm font-semibold transition-colors",
                  refining
                    ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700"
                    : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
                )}
              >
                <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                {refining ? "Hide Zavi" : "Refine with Zavi"}
              </button>
            </div>

            <p className="mt-2.5 max-w-3xl text-[14.5px] leading-relaxed text-zinc-700">
              The first {freeingMoves.length} cards free{" "}
              <span className="font-bold">${trappedWeekly} a week</span>. Card{" "}
              {spendingMoves[0]?.id} spends <span className="font-bold">${needsFundingWeekly}</span>{" "}
              of it on the one ad that earns $3.09 per $1. The remaining{" "}
              <span className="font-bold">${banked}</span> stays unspent. The last 2 cards move no
              money at all, so you can decide those on their own.
            </p>

            {revisionNote && (
              <p className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2.5 text-[13px] leading-snug text-sky-950">
                <span className="font-bold">Zavi revised this batch. </span>
                {revisionNote}
              </p>
            )}

            <div
              className={cx(
                "mt-6 grid gap-4",
                // One less column while the chat pane is open, so cards stay readable.
                refining ? "lg:grid-cols-2" : "lg:grid-cols-2 2xl:grid-cols-3",
              )}
            >
              {live.map((move) => (
                <Card
                  key={move.id}
                  move={move}
                  status={statuses[move.id]}
                  rejection={rejections[move.id]}
                  onAskApprove={() => setAsk({ kind: "approve", id: move.id })}
                  onAskReject={() => setAsk({ kind: "reject", id: move.id })}
                  onReset={() => {
                    set(move.id, "pending");
                    setRejections(({ [move.id]: _drop, ...rest }) => rest);
                  }}
                />
              ))}
            </div>

            <p className="mt-5 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-[12px] leading-snug text-zinc-500">
              {ATTRIBUTION_NOTE}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAsk({ kind: "bulkApprove" })}
                className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Approve all
              </button>
              <button
                type="button"
                onClick={() => setAsk({ kind: "bulkReject" })}
                className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Reject all
              </button>
              <span className="text-[13px] text-zinc-500">
                {decided} of {live.length} decided
              </span>
              <button
                type="button"
                onClick={() => {
                  setDay(0);
                  setView("results");
                }}
                className="ml-auto inline-flex h-10 cursor-pointer items-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                {approvedCount > 0 ? "See how it went" : "See the results view"}
              </button>
            </div>
          </>
        ) : (
          <Results
            statuses={statuses}
            day={day}
            onSetDay={setDay}
            reverted={reverted}
            onRevert={(id) => setReverted((p) => new Set(p).add(id))}
            onBack={() => setView("review")}
          />
        )}
    </div>
  );

  return (
    <div className={cx("relative", !embedded && "bg-[#faf8f4]")}>
      {refining ? (
        // Two panes, each scrolling on its own, the way the workspace columns do.
        <div className="flex h-[calc(100vh-1rem)] min-h-[560px] overflow-hidden">
          <div className="min-w-0 flex-1 overflow-y-auto">{reviewColumn}</div>
          <aside
            style={{ width: chatWidth }}
            className="relative hidden shrink-0 border-l border-zinc-200 bg-white xl:block"
          >
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize the Zavi chat column"
              aria-valuenow={chatWidth}
              aria-valuemin={CHAT_MIN_WIDTH}
              aria-valuemax={CHAT_MAX_WIDTH}
              tabIndex={0}
              title="Drag to resize. Double-click to reset."
              onPointerDown={startChatResize}
              onDoubleClick={() => setChatWidth(CHAT_DEFAULT_WIDTH)}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setChatWidth((w) => clampChatWidth(w + 32));
                }
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  setChatWidth((w) => clampChatWidth(w - 32));
                }
              }}
              className="group/resize absolute inset-y-0 -left-2.5 z-10 flex w-5 cursor-col-resize items-center justify-center focus-visible:outline-none"
            >
              <span className="h-10 w-1 rounded-full bg-transparent transition-colors duration-200 group-hover/resize:bg-zinc-400 group-focus-visible/resize:bg-zinc-500" />
            </div>
            <RefineChat
              onClose={() => setRefining(false)}
              onApplyRevision={applyRevision}
            />
          </aside>
        </div>
      ) : (
        <div className={cx(!embedded && "min-h-screen")}>{reviewColumn}</div>
      )}

      {/* Below xl there is no room for two panes, so the chat stacks under the cards. */}
      {refining && (
        <div className="h-[70vh] border-t border-zinc-200 bg-white xl:hidden">
          <RefineChat onClose={() => setRefining(false)} onApplyRevision={applyRevision} />
        </div>
      )}

      {ask?.kind === "approve" && askedMove && (
        <ApproveModal
          move={askedMove}
          onCancel={() => setAsk(null)}
          onConfirm={() => {
            set(askedMove.id, "approved");
            setAsk(null);
          }}
        />
      )}

      {ask?.kind === "reject" && askedMove && (
        <RejectModal
          move={askedMove}
          onCancel={() => setAsk(null)}
          onConfirm={(reason, note) => {
            set(askedMove.id, "rejected");
            setRejections((p) => ({ ...p, [askedMove.id]: { reason, note } }));
            setAsk(null);
          }}
        />
      )}

      {(ask?.kind === "bulkApprove" || ask?.kind === "bulkReject") && (
        <BulkModal
          kind={ask.kind === "bulkApprove" ? "approve" : "reject"}
          count={live.length}
          onCancel={() => setAsk(null)}
          onConfirm={(reason, note) => {
            const next = ask.kind === "bulkApprove" ? "approved" : "rejected";
            setStatuses((p) => {
              const out = { ...p };
              live.forEach((m) => (out[m.id] = next as MoveStatus));
              return out;
            });
            if (next === "rejected") {
              setRejections(
                Object.fromEntries(live.map((m) => [m.id, { reason, note }])),
              );
            }
            setAsk(null);
          }}
        />
      )}

    </div>
  );
}
