const BAR_HEIGHTS = [40, 65, 35, 80, 55, 70, 45];

export default function DashboardPreview({
  accent = "#18181b",
  compact = false,
}: {
  accent?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex h-full w-full flex-col gap-3 rounded-xl bg-white p-3 ${
        compact ? "" : "sm:p-4"
      }`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="h-2 w-16 rounded-full bg-zinc-100" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-border p-2">
            <div className="h-1.5 w-8 rounded-full bg-zinc-200" />
            <div className="mt-2 h-3 w-12 rounded-full bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-border p-2">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              backgroundColor: i === 3 ? accent : "#e4e4e7",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border p-2">
        <div className="h-6 w-6 shrink-0 rounded-full bg-zinc-200" />
        <div className="flex-1 space-y-1">
          <div className="h-1.5 w-3/4 rounded-full bg-zinc-200" />
          <div className="h-1.5 w-1/2 rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
