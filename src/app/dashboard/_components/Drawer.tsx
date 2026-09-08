"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

export function Drawer({
  open,
  title,
  onClose,
  children,
  width = "max-w-2xl",
  expanded,
  onToggleExpand,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-zinc-900/30 [animation:fade-in_200ms_ease-out]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-y-0 right-0 flex w-full ${width} flex-col overflow-hidden rounded-l-3xl bg-white shadow-2xl transition-[max-width] duration-200 [animation:drawer-in_220ms_ease-out]`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          <div className="flex shrink-0 items-center gap-1">
            {onToggleExpand && (
              <button
                type="button"
                aria-label={expanded ? "Collapse panel" : "Expand panel — use the extra horizontal space"}
                title={expanded ? "Collapse panel" : "Expand panel — use the extra horizontal space"}
                onClick={onToggleExpand}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {expanded ? (
                  <Minimize2 className="h-4.5 w-4.5" />
                ) : (
                  <Maximize2 className="h-4.5 w-4.5" />
                )}
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </aside>
    </div>
  );
}
