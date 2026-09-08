"use client";

import { useEffect, useRef, useState } from "react";

const round = (value: number) => Math.round(value * 100) / 100;

function niceStep(raw: number) {
  if (raw <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  for (const candidate of [1, 2, 2.5, 5, 10]) {
    if (candidate * power >= raw) return candidate * power;
  }
  return 10 * power;
}

export function BarChart({
  labels,
  values,
  height = 220,
  color = "#18181b",
  yLabel,
  xLabel,
  format = (value: number) => String(Math.round(value)),
}: {
  labels: string[];
  values: number[];
  height?: number;
  color?: string;
  yLabel?: string;
  xLabel?: string;
  format?: (value: number) => string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

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
  const padLeft = yLabel ? 54 : 40;
  const padRight = 8;
  const padTop = 10;
  const padBottom = xLabel ? 46 : 30;
  const plotW = Math.max(1, w - padLeft - padRight);
  const plotH = Math.max(1, height - padTop - padBottom);

  const step = niceStep(Math.max(0, ...values) / 4);
  const top = step * 4;
  const ticks = [0, 1, 2, 3, 4];

  const slot = plotW / Math.max(1, values.length);
  const barWidth = Math.max(6, Math.min(38, slot * 0.62));
  const xAt = (index: number) => padLeft + slot * index + slot / 2;
  const yAt = (value: number) => padTop + plotH - (value / top) * plotH;

  const labelEvery = Math.max(
    1,
    Math.ceil(labels.length / Math.max(2, Math.floor(plotW / 58))),
  );

  return (
    <div ref={containerRef} className="relative">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        role="img"
        aria-label={`${yLabel ?? "Values"} over ${labels.length} points`}
        className="block"
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((tick) => {
          const y = round(padTop + plotH - (tick / 4) * plotH);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                x2={padLeft + plotW}
                y1={y}
                y2={y}
                stroke="#e4e4e7"
              />
              <text
                x={padLeft - 8}
                y={y}
                dy="0.35em"
                textAnchor="end"
                fontSize={11}
                fill="#52525b"
              >
                {format(tick * step)}
              </text>
            </g>
          );
        })}

        {values.map((value, index) => {
          const barH = Math.max(1, padTop + plotH - yAt(value));
          const x = round(xAt(index) - barWidth / 2);
          return (
            <rect
              key={labels[index] ?? index}
              x={x}
              y={round(yAt(value))}
              width={round(barWidth)}
              height={round(barH)}
              rx={3}
              fill={color}
              opacity={hover === null || hover === index ? 1 : 0.45}
              onMouseEnter={() => setHover(index)}
            />
          );
        })}

        {labels.map((label, index) =>
          index % labelEvery === 0 ? (
            <text
              key={`${label}-${index}`}
              x={round(xAt(index))}
              y={padTop + plotH + 18}
              textAnchor="middle"
              fontSize={11}
              fill="#52525b"
            >
              {label}
            </text>
          ) : null,
        )}

        {yLabel && (
          <text
            transform={`rotate(-90 14 ${padTop + plotH / 2})`}
            x={14}
            y={padTop + plotH / 2}
            textAnchor="middle"
            fontSize={11}
            fill="#52525b"
          >
            {yLabel}
          </text>
        )}
        {xLabel && (
          <text
            x={padLeft + plotW / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize={11}
            fill="#52525b"
          >
            {xLabel}
          </text>
        )}
      </svg>

      {hover !== null && labels[hover] && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-sm whitespace-nowrap text-white shadow-lg"
          style={{ left: `${(xAt(hover) / w) * 100}%` }}
        >
          <p className="font-semibold">{labels[hover]}</p>
          <p>{format(values[hover])}</p>
        </div>
      )}
    </div>
  );
}
