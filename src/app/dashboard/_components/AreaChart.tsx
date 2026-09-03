"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";

export type ChartSeries = {
  id: string;
  label: string;
  color: string;
  values: number[];
  format: (value: number) => string;
  tick: (value: number) => string;
};

type Point = { x: number; y: number };

const round = (value: number) => Math.round(value * 100) / 100;

function niceStep(raw: number) {
  if (raw <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  for (const candidate of [1, 2, 2.5, 5, 10]) {
    if (candidate * power >= raw) return candidate * power;
  }
  return 10 * power;
}

function scaleFor(values: number[]) {
  const max = Math.max(0, ...values);
  const step = niceStep(max / 4);
  return { step, top: step * 4 };
}

function monotonePath(points: Point[]) {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M ${points[0].x} ${points[0].y}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    slope[i] = dx[i] === 0 ? 0 : (points[i + 1].y - points[i].y) / dx[i];
  }
  const tangent: number[] = new Array(n).fill(0);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] =
      slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const size = a * a + b * b;
    if (size > 9) {
      const tau = 3 / Math.sqrt(size);
      tangent[i] = tau * a * slope[i];
      tangent[i + 1] = tau * b * slope[i];
    }
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = points[i].x + dx[i] / 3;
    const c1y = points[i].y + (tangent[i] * dx[i]) / 3;
    const c2x = points[i + 1].x - dx[i] / 3;
    const c2y = points[i + 1].y - (tangent[i + 1] * dx[i]) / 3;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${points[i + 1].x} ${points[i + 1].y}`;
  }
  return d;
}

export function AreaChart({
  series,
  labels,
  height = 200,
  title,
  dualAxis = false,
}: {
  series: ChartSeries[];
  labels: string[];
  height?: number;
  title?: string;
  dualAxis?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const next = Math.round(entries[0]?.contentRect.width ?? 0);
      setWidth((current) => (current === next ? current : next));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const w = width || 400;
  const padLeft = 44;
  const padRight = dualAxis && series.length > 1 ? 44 : 12;
  const padTop = 12;
  const padBottom = 28;
  const plotW = Math.max(1, w - padLeft - padRight);
  const plotH = height - padTop - padBottom;
  const count = labels.length;
  const xAt = (index: number) =>
    padLeft + (count > 1 ? (index / (count - 1)) * plotW : plotW / 2);

  const shared = scaleFor(series.flatMap((s) => s.values));
  const primaryScale = dualAxis ? scaleFor(series[0]?.values ?? []) : shared;
  const secondaryScale =
    dualAxis && series[1] ? scaleFor(series[1].values) : primaryScale;
  const scaleOf = (index: number) =>
    dualAxis && index === 1 ? secondaryScale : primaryScale;
  const yAt = (value: number, scale: { top: number }) =>
    padTop + plotH - (scale.top > 0 ? (value / scale.top) * plotH : 0);
  const ticks = [0, 1, 2, 3, 4];
  const labelEvery = Math.max(
    1,
    Math.ceil(count / Math.max(2, Math.floor(plotW / 64))),
  );

  const paths = series.map((s, index) => {
    const scale = scaleOf(index);
    const points = s.values.map((value, i) => ({
      x: round(xAt(i)),
      y: round(yAt(value, scale)),
    }));
    const line = monotonePath(points);
    const area =
      points.length > 0
        ? `${line} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`
        : "";
    return { line, area, points };
  });

  function handleMove(event: MouseEvent<SVGSVGElement>) {
    if (count === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * w;
    const index = Math.round(((x - padLeft) / plotW) * (count - 1));
    setHover(Math.min(count - 1, Math.max(0, index)));
  }

  const description = `${title ?? "Chart"}: ${series
    .map((s) => s.label)
    .join(" and ")} over ${count} days`;
  const hoverPercent = hover === null ? 0 : (xAt(hover) / w) * 100;
  const tooltipShift =
    hoverPercent < 18
      ? "translate-x-0"
      : hoverPercent > 82
        ? "-translate-x-full"
        : "-translate-x-1/2";

  return (
    <div>
      {series.length > 1 && (
        <ul className="mb-2 flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-zinc-600">
          {series.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <div ref={containerRef} className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${w} ${height}`}
          role="img"
          aria-label={description}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
          className="block overflow-visible"
        >
          <defs>
            {series.map((s, index) => (
              <linearGradient
                key={s.id}
                id={`${gradientId}-${index}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={index === 0 ? "#71717a" : "#a1a1aa"}
                  stopOpacity={index === 0 ? 0.45 : 0.22}
                />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((tick) => {
            const y = round(padTop + plotH - (tick / 4) * plotH);
            return (
              <line
                key={tick}
                x1={padLeft}
                x2={padLeft + plotW}
                y1={y}
                y2={y}
                stroke="#e4e4e7"
              />
            );
          })}
          {labels.map((_, i) =>
            i % labelEvery === 0 ? (
              <line
                key={i}
                x1={round(xAt(i))}
                x2={round(xAt(i))}
                y1={padTop}
                y2={padTop + plotH}
                stroke="#f4f4f5"
              />
            ) : null,
          )}
          {series[0] &&
            ticks.map((tick) => (
              <text
                key={`left-${tick}`}
                x={padLeft - 8}
                y={round(padTop + plotH - (tick / 4) * plotH)}
                dy="0.35em"
                textAnchor="end"
                fontSize={11}
                fill="#52525b"
              >
                {series[0].tick(tick * primaryScale.step)}
              </text>
            ))}
          {dualAxis &&
            series[1] &&
            ticks.map((tick) => (
              <text
                key={`right-${tick}`}
                x={padLeft + plotW + 8}
                y={round(padTop + plotH - (tick / 4) * plotH)}
                dy="0.35em"
                textAnchor="start"
                fontSize={11}
                fill="#52525b"
              >
                {series[1].tick(tick * secondaryScale.step)}
              </text>
            ))}
          {paths
            .map((path, index) => (
              <g key={series[index].id}>
                <path d={path.area} fill={`url(#${gradientId}-${index})`} />
                <path
                  d={path.line}
                  fill="none"
                  stroke={series[index].color}
                  strokeWidth={index === 0 ? 2 : 1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))
            .reverse()}
          {labels.map((label, i) =>
            i % labelEvery === 0 ? (
              <text
                key={`${label}-${i}`}
                x={round(xAt(i))}
                y={height - 8}
                textAnchor={
                  i === 0 ? "start" : i === count - 1 ? "end" : "middle"
                }
                fontSize={11}
                fill="#52525b"
              >
                {label}
              </text>
            ) : null,
          )}
          {hover !== null && (
            <g>
              <line
                x1={round(xAt(hover))}
                x2={round(xAt(hover))}
                y1={padTop}
                y2={padTop + plotH}
                stroke="#a1a1aa"
                strokeDasharray="3 3"
              />
              {paths.map((path, index) =>
                path.points[hover] ? (
                  <circle
                    key={series[index].id}
                    cx={path.points[hover].x}
                    cy={path.points[hover].y}
                    r={3.5}
                    fill="#ffffff"
                    stroke={series[index].color}
                    strokeWidth={2}
                  />
                ) : null,
              )}
            </g>
          )}
        </svg>
        {hover !== null && labels[hover] && (
          <div
            className={`pointer-events-none absolute top-0 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg ${tooltipShift}`}
            style={{ left: `${hoverPercent}%` }}
          >
            <p className="font-semibold">{labels[hover]}</p>
            {series.map((s) => (
              <p key={s.id}>
                {s.label}: {s.format(s.values[hover] ?? 0)}
              </p>
            ))}
          </div>
        )}
      </div>
      {title && (
        <p className="mt-2 text-center text-[15px] text-zinc-800">{title}</p>
      )}
    </div>
  );
}
