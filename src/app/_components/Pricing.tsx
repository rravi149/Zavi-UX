import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For exploring the gallery and personal projects.",
    features: [
      "Browse the full gallery",
      "10 template exports / month",
      "Community support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$24",
    period: "/month",
    description: "For designers and developers shipping real products.",
    features: [
      "Unlimited template exports",
      "React, Vue & Tailwind code",
      "Design tokens & Figma files",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    description: "For teams standardizing on one dashboard system.",
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Shared private collections",
      "Dedicated onboarding",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Simple pricing, no surprises
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Start free, upgrade when you&apos;re ready to ship. Cancel anytime.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-primary bg-primary text-white shadow-xl lg:-translate-y-4"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <h3 className="text-sm font-semibold">{plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-zinc-300" : "text-muted"
                  }`}
                >
                  {plan.period}
                </span>
              </p>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  plan.highlighted ? "text-zinc-300" : "text-muted"
                }`}
              >
                {plan.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.highlighted ? "text-white" : "text-primary"
                      }`}
                      strokeWidth={2.5}
                    />
                    <span
                      className={
                        plan.highlighted ? "text-zinc-100" : "text-foreground"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-8 inline-flex cursor-pointer items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-200 ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-zinc-100"
                    : "bg-primary text-white hover:bg-secondary"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
