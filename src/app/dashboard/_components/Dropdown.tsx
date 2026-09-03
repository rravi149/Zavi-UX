"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export const menuItemClass =
  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900";

export function Dropdown({
  trigger,
  children,
  align = "left",
  width = "w-56",
  placement = "bottom",
  label,
}: {
  trigger: (props: {
    open: boolean;
    toggle: () => void;
    id: string;
  }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  width?: string;
  placement?: "bottom" | "top";
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((value) => !value), id })}
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={label}
          className={`absolute z-30 ${
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
          } ${
            align === "right" ? "right-0" : "left-0"
          } ${width} rounded-xl border border-zinc-200 bg-white p-2 shadow-lg`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
