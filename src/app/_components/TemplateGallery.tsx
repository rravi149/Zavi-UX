import { ArrowUpRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const templates = [
  { name: "Nimbus Analytics", category: "Analytics", accent: "#18181b" },
  { name: "Ledger Finance", category: "Fintech", accent: "#0f766e" },
  { name: "Pulse CRM", category: "Sales", accent: "#1d4ed8" },
  { name: "Atlas Admin", category: "Admin panel", accent: "#7c3aed" },
  { name: "Signal Ops", category: "DevOps", accent: "#b45309" },
  { name: "Compass Metrics", category: "Product", accent: "#be123c" },
];

export default function TemplateGallery() {
  return (
    <section id="gallery" className="bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Browse the gallery
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              A growing collection of dashboard templates across every
              category — preview any of them live before you commit.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-muted"
          >
            View all templates
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <a
              key={t.name}
              href="#"
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-accent transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] p-3">
                <DashboardPreview accent={t.accent} />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-200 group-hover:bg-primary/40 group-hover:opacity-100">
                  <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-foreground">
                    Preview template
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3.5">
                <span className="text-sm font-semibold text-foreground">
                  {t.name}
                </span>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-muted">
                  {t.category}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
