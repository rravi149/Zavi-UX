const useCases = [
  { name: "B2B SaaS", desc: "Build demand with search and content." },
  { name: "Startups", desc: "Plan the work to reach your first users." },
  { name: "Ecommerce", desc: "Connect product content, creators, and ads." },
  { name: "Digital Agencies", desc: "Organize growth work for each client." },
  {
    name: "Professional Services",
    desc: "Turn your expertise into useful content.",
  },
  { name: "Small Business", desc: "Build a focused marketing plan." },
  {
    name: "Real Estate",
    desc: "Prepare listing content and local campaigns.",
  },
  {
    name: "Financial Advisors",
    desc: "Draft educational content for expert review.",
  },
  {
    name: "Healthcare",
    desc: "Prepare service content for expert review.",
  },
  {
    name: "Recruiters",
    desc: "Build a brand candidates can understand.",
  },
  { name: "Restaurants", desc: "Plan local search and social content." },
  {
    name: "Law Firms",
    desc: "Draft practice-area content for legal review.",
  },
];

export default function UseCasesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
        Built around your business
      </p>
      <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
        Different businesses.
        <br />A shared need to move forward.
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Start with the work that matters to your team. Shape the plan around
        your customers, goals, and tools.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
        {useCases.map((item) => (
          <article key={item.name} className="border-b border-border py-5">
            <h3 className="text-[15px] font-bold tracking-tight text-foreground">
              {item.name}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
