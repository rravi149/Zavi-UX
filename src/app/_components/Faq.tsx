const faqs = [
  {
    question: "What frameworks are the templates built with?",
    answer:
      "Every template is available in React and Tailwind CSS, with most also offered in Vue and plain HTML. You can copy the markup directly or import the component into your codebase.",
  },
  {
    question: "Can I customize the colors and typography?",
    answer:
      "Yes. Each template ships with a design token file for color, spacing, radius, and type — change the tokens once and the whole layout restyles to match your brand.",
  },
  {
    question: "Do you offer Figma files?",
    answer:
      "Pro and Team plans include the matching Figma file for every template, kept in sync with the coded version.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, subscriptions are month-to-month with no lock-in. Downgrading keeps access to anything you've already exported.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-background">
          {faqs.map((f) => (
            <details key={f.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground marker:content-none">
                {f.question}
                <span className="ml-4 shrink-0 text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
