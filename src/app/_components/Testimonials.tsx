const testimonials = [
  {
    quote:
      "We shipped our internal analytics dashboard in a week instead of a quarter. Zavi's templates gave our designer a real starting point instead of a blank Figma file.",
    name: "Priya Nair",
    role: "Head of Product, Vertex Labs",
  },
  {
    quote:
      "The code quality is what sold me. It's not a static mockup — it's a real, accessible component I could drop into our React app the same afternoon.",
    name: "Daniel Osei",
    role: "Frontend Lead, Northwind",
  },
  {
    quote:
      "Our whole team browses Zavi before starting any new admin screen now. It's become the default first step in our design process.",
    name: "Maria Lund",
    role: "Design Manager, Fenwick",
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Loved by teams who&apos;d rather ship than start from scratch.
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6"
            >
              <blockquote className="text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
