const steps = [
  {
    number: "01",
    label: "CHAT",
    title: "Tell Zavi what you need.",
    description: "Start with a task or a goal. Add the context that matters.",
    exampleLabel: "Example request",
    example: '"Check last week\'s signups and prepare a report."',
  },
  {
    number: "02",
    label: "WORK",
    title: "Follow the work.",
    description:
      "Zavi brings in the right specialists and works with your connected tools.",
    exampleLabel: "Example work",
    example:
      "Review signup data → compare the previous week → prepare the summary.",
  },
  {
    number: "03",
    label: "RESULT",
    title: "Review what comes back.",
    description:
      "Get the output with the context you need to choose the next step.",
    exampleLabel: "Matching result",
    example:
      "A signup report with the source data, weekly comparison, and questions to investigate.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[36px] bg-white px-8 py-14 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
              How it works
            </p>
            <h2 className="mt-3.5 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
              You ask. Zavi gets to work.
              <br />
              The result comes back.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              One conversation connects your request, the specialist work,
              and the result you can review.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="border-t border-[#ccd9e6] pt-6">
                <p className="text-[11px] font-extrabold text-[#3d6d9f]">
                  {step.number} / {step.label}
                </p>
                <h3 className="mt-3 text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                  {step.description}
                </p>
                <div className="mt-5 rounded-xl border border-border bg-white p-4">
                  <p className="text-[9px] font-semibold tracking-[0.08em] text-[#7a8794] uppercase">
                    {step.exampleLabel}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground">
                    {step.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
