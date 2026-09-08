const faqs = [
  {
    q: "What does Zavi do for my business?",
    a: "Zavi connects research, planning, content, and measurement in one growth workflow. You set the goal and review the work.",
  },
  {
    q: "How does Zavi research my website?",
    a: "The research flow brings together product information, audience context, competitors, brand voice, and content priorities.",
  },
  {
    q: "What is the difference between the plans?",
    a: "See the pricing page for plan details and usage limits. Choose a plan based on the work you need.",
  },
  {
    q: "How does Reddit growth work?",
    a: "The workflow finds relevant discussions and prepares helpful reply drafts. You review the context and wording before posting.",
  },
  {
    q: "What SEO work can I plan?",
    a: "Plan keyword research, content briefs, landing page updates, and technical improvements. Review recommendations against your site data.",
  },
  {
    q: "What is GEO?",
    a: "GEO means generative engine optimization. It focuses on how your business appears in AI-generated answers and their cited sources.",
  },
  {
    q: "How long does it take to see results?",
    a: "Timing depends on your channel, starting point, and execution. Measure progress against a clear baseline; results are not guaranteed.",
  },
  {
    q: "Does Zavi publish content automatically?",
    a: "Publishing depends on the connected tool, its permissions, and your approval settings. Review the destination and content before approving an action.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Check the current pricing and billing terms for plan changes, cancellation, and when changes take effect.",
  },
  {
    q: "Can I use Zavi in Slack and Microsoft Teams?",
    a: "Yes. Connect your workspace from Zavi's integration settings, then bring Zavi into the conversations where you need it.",
  },
];

export default function Faq() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
              A few useful answers
            </p>
            <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
              Before you
              <br />
              get started.
            </h2>
          </div>

          <div>
            {faqs.map((item) => (
              <details key={item.q} className="group border-b border-border">
                <summary className="relative cursor-pointer list-none py-5 pr-8 text-sm leading-relaxed font-medium text-foreground">
                  {item.q}
                  <span className="absolute top-5 right-0 text-lg text-muted group-open:hidden">
                    +
                  </span>
                  <span className="absolute top-5 right-0 hidden text-lg text-muted group-open:inline">
                    −
                  </span>
                </summary>
                <p className="pr-5 pb-6 text-xs leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
