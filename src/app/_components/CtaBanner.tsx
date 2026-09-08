import { ArrowUpRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div
        className="rounded-[30px] px-8 py-16 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 70% 75%, rgba(204,228,255,0.9), transparent 65%), linear-gradient(110deg, #fff7ec, #f4f8ff)",
        }}
      >
        <p className="text-[11px] font-extrabold tracking-[0.13em] text-[#46658a] uppercase">
          Your next step starts here
        </p>
        <h2 className="mx-auto mt-3.5 max-w-2xl text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
          What would you like to move forward?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Bring your idea, your daily work, or your next growth goal.
        </p>
        <a
          href="/start"
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-secondary"
        >
          Start free <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
