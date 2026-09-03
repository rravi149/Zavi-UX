const names = ["Northwind", "Vertex Labs", "Lumen", "Orbit", "Fenwick", "Haven"];

export default function LogoCloud() {
  return (
    <section className="border-y border-border bg-surface px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold tracking-widest text-muted uppercase">
          Trusted by product teams building dashboards at
        </p>
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
          {names.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center text-center text-lg font-bold tracking-tight text-zinc-400 select-none"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
