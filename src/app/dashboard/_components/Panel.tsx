"use client";

import { GripHorizontal } from "lucide-react";
import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { PanelId } from "./types";

export type PanelDnd = {
  dragId: PanelId | null;
  overId: PanelId | null;
  startDrag: (id: PanelId) => void;
  dragOver: (id: PanelId) => void;
  drop: (id: PanelId) => void;
  endDrag: () => void;
  move: (id: PanelId, direction: -1 | 1) => void;
};

const PanelSlotContext = createContext<PanelId | null>(null);
const PanelDndContext = createContext<PanelDnd | null>(null);

export function PanelSlot({
  id,
  children,
}: {
  id: PanelId;
  children: ReactNode;
}) {
  return (
    <PanelSlotContext.Provider value={id}>{children}</PanelSlotContext.Provider>
  );
}

export const PanelDndProvider = PanelDndContext.Provider;

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const id = useContext(PanelSlotContext);
  const dnd = useContext(PanelDndContext);
  const droppable = id !== null && dnd !== null;
  const isOver = droppable && dnd.overId === id && dnd.dragId !== id;
  const isDragging = droppable && dnd.dragId === id;

  return (
    <section
      data-panel={id ?? undefined}
      onDragOver={
        droppable
          ? (event) => {
              if (!dnd.dragId) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              if (dnd.overId !== id) dnd.dragOver(id);
            }
          : undefined
      }
      onDrop={
        droppable
          ? (event) => {
              event.preventDefault();
              dnd.drop(id);
            }
          : undefined
      }
      className={`group/panel flex h-[600px] min-h-0 shrink-0 flex-col overflow-hidden rounded-2xl border bg-white transition-[box-shadow,opacity,border-color] duration-200 xl:h-full ${
        isOver ? "border-zinc-400 ring-2 ring-zinc-300" : "border-zinc-200"
      } ${isDragging ? "opacity-50" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function DragHandle({ className = "" }: { className?: string }) {
  const id = useContext(PanelSlotContext);
  const dnd = useContext(PanelDndContext);

  if (!id || !dnd) {
    return (
      <GripHorizontal
        className={`h-4 w-4 shrink-0 text-zinc-400 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      draggable
      aria-label="Drag to reorder this section. Use the arrow keys to move it."
      title="Drag to reorder"
      onDragStart={(event: DragEvent<HTMLButtonElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
        const section = event.currentTarget.closest("section");
        if (section) {
          const rect = section.getBoundingClientRect();
          event.dataTransfer.setDragImage(
            section,
            event.clientX - rect.left,
            event.clientY - rect.top,
          );
        }
        window.setTimeout(() => dnd.startDrag(id), 0);
      }}
      onDragEnd={() => dnd.endDrag()}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          dnd.move(id, -1);
        }
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          dnd.move(id, 1);
        }
      }}
      className={`flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-zinc-400 opacity-0 transition-[opacity,color,background-color] duration-200 group-hover/panel:opacity-100 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:opacity-100 active:cursor-grabbing ${className}`}
    >
      <GripHorizontal className="h-4 w-4" />
    </button>
  );
}

export function PanelHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-14 shrink-0 items-center gap-2 px-3 ${className}`}
    >
      <DragHandle className="absolute top-1 left-1/2 -translate-x-1/2" />
      {children}
    </div>
  );
}

export function IconButton({
  label,
  children,
  className = "",
  ...rest
}: {
  label: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900 ${className}`}
    >
      {children}
    </button>
  );
}
