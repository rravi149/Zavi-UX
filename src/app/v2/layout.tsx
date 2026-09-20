import type { Metadata } from "next";
import "./v2.css";

export const metadata: Metadata = {
  title: "Zavi V2",
  description:
    "V2 of the Zavi surfaces: a spec-sheet language where the claim is always visible, the proof opens on click, and what Zavi cannot see carries the same weight as what it found.",
};

/* Everything under /v2 renders inside .v2, which scopes the whole Swiss
   stylesheet. The v1 routes are untouched and keep the existing look. */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2">
      <div className="stamp">
        <b>V2 PROTOTYPE</b> &middot; simulated data, no real actions
      </div>
      {children}
    </div>
  );
}
