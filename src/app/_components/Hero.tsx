import { ArrowRight, Sparkles } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(24,24,27,0.08),transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
              300+ dashboard templates, updated weekly
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Dashboard design ideas, ready to ship.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Zavi is a gallery of hand-picked dashboard templates and UI
              kits for SaaS, analytics, and admin panels. Preview live,
              copy production-ready code, and stop starting from a blank
              canvas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#gallery"
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-secondary"
              >
                Browse the gallery
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#pricing"
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
              >
                See pricing
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["#18181b", "#52525b", "#a1a1aa", "#d4d4d8"].map((c, i) => (
                  <span
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">4,200+</span>{" "}
                builders shipping faster with Zavi
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(24,24,27,0.06),transparent_60%)]" />
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md rotate-2 rounded-2xl border border-border bg-accent p-4 shadow-xl transition-transform duration-300 hover:rotate-0">
              <DashboardPreview accent="#18181b" />
            </div>
            <div className="absolute -bottom-8 -left-6 aspect-[4/3] w-48 -rotate-6 rounded-2xl border border-border bg-accent p-3 shadow-lg sm:w-56">
              <DashboardPreview accent="#71717a" compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
