import { Blocks, Code2, Palette, SearchCheck } from "lucide-react";

const features = [
  {
    icon: SearchCheck,
    title: "Search, don't guess",
    description:
      "Filter by industry, layout, or chart type to find the dashboard pattern that fits your product in seconds.",
  },
  {
    icon: Palette,
    title: "Fully themeable",
    description:
      "Every template ships with design tokens for color, spacing, and type — restyle to match your brand in minutes.",
  },
  {
    icon: Code2,
    title: "Production-ready code",
    description:
      "Clean React, Vue, or Tailwind markup you can drop straight into your codebase. No throwaway prototypes.",
  },
  {
    icon: Blocks,
    title: "Composable sections",
    description:
      "Mix and match cards, tables, and charts across templates to assemble the exact layout your data needs.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to design a dashboard, twice as fast.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Zavi replaces the blank canvas with a curated library of proven
            layouts — so your team spends time on your product, not on
            reinventing charts and tables.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-zinc-300"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
