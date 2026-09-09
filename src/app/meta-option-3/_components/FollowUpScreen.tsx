"use client";

import { goal, moves, actualWeeklyAddByDay, timeSteps } from "../_data/data";
import GoalHeader from "./GoalHeader";
import { FollowUpMoveCard, type DecisionStatus } from "./MoveCard";

export default function FollowUpScreen({
  decisions,
  day,
  onSetDay,
  onRevert,
  onBack,
}: {
  decisions: Record<number, DecisionStatus>;
  day: number;
  onSetDay: (day: number) => void;
  onRevert: (id: number) => void;
  onBack: () => void;
}) {
  const add = actualWeeklyAddByDay[day] ?? 0;
  const current = goal.current + add;
  const gapRemaining = goal.target - current;

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-5 px-5 py-10 sm:px-0">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer self-start text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-900"
      >
        &larr; Back to what changed
      </button>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
        <span className="px-2 text-sm font-medium text-zinc-500">Jump ahead</span>
        {timeSteps.map((step) => (
          <button
            key={step.day}
            type="button"
            onClick={() => onSetDay(step.day)}
            aria-pressed={day === step.day}
            className={`h-9 cursor-pointer rounded-lg px-3.5 text-sm font-semibold transition-colors duration-200 ${
              day === step.day
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <GoalHeader current={current} gapLabel={`${gapRemaining} ${goal.unit} to go`}>
        {day === 0 && (
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Just approved. Nothing to report yet, each move checks back on its own schedule
            starting at day 3.
          </p>
        )}
        {day === 3 && (
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Too early for most of these. Move 1 and move 2 have early reads and look on track,
            the rest are still collecting data.
          </p>
        )}
        {day === 7 && (
          <p className="text-[15px] leading-relaxed text-zinc-700">
            The confirmed win landed: <span className="font-semibold text-zinc-900">+34 sales
            a week</span> from move 2, close to the 30-40 Zavi promised. Move 3&apos;s bet came in
            mixed, +4 rather than the hoped-for double. Move 5, the riskiest one, didn&apos;t pay
            off, see below. That&apos;s{" "}
            <span className="font-semibold text-zinc-900">38 of the {goal.gap}-sale gap closed</span>,
            about a quarter of it. Even now, more than half the gap remains and nothing here
            closes it alone.
          </p>
        )}
        {day === 14 && (
          <p className="text-[15px] leading-relaxed text-zinc-700">
            Two weeks in, the win held steady and the mixed bet stayed mixed.{" "}
            <span className="font-semibold text-zinc-900">
              +{add} sales a week, {gapRemaining} to go
            </span>
            . Move 5 got rolled back after it made cost per sale worse instead of better. The
            $385 a week Zavi reclaimed is sitting there for the next round, still no new
            channel, landing page, or offer proposed to close the rest.
          </p>
        )}
      </GoalHeader>

      <ul className="flex flex-col gap-3">
        {moves.map((move) => (
          <FollowUpMoveCard
            key={move.id}
            move={move}
            status={decisions[move.id]}
            day={day}
            onRevert={onRevert}
          />
        ))}
      </ul>
    </div>
  );
}
