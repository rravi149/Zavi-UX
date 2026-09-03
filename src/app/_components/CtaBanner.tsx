import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-16 text-center sm:px-16">
          <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Stop designing dashboards from zero.
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-zinc-300">
            Join thousands of builders who start every dashboard project in
            the Zavi gallery.
          </p>
          <a
            href="#gallery"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-zinc-100"
          >
            Browse the gallery
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
