import type { Confidence, FollowUpStatus } from "../_data/data";

export function confidenceTone(confidence: Confidence): { badge: string; dot: string } {
  switch (confidence) {
    case "confirmed":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
    case "early-signal":
      return { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" };
    case "too-new":
      return { badge: "bg-zinc-100 text-zinc-600", dot: "bg-zinc-400" };
  }
}

export function followUpTone(status: FollowUpStatus): { badge: string; dot: string; label: string } {
  switch (status) {
    case "collecting":
      return { badge: "bg-zinc-100 text-zinc-600", dot: "bg-zinc-400", label: "Collecting data" };
    case "on-track":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", label: "On track" };
    case "mixed":
      return { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500", label: "Mixed result" };
    case "miss":
      return { badge: "bg-red-50 text-red-700", dot: "bg-red-500", label: "Didn't pay off" };
  }
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
      {children}
    </p>
  );
}
