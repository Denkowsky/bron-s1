"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CounterProps {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const stepButton =
  "flex size-9 items-center justify-center text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-500";

export function Counter({ label, hint, value, min = 0, max = 10, onChange }: CounterProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm text-zinc-200">{label}</div>
        {hint ? <div className="mt-0.5 text-xs text-zinc-500">{hint}</div> : null}
      </div>
      <div
        role="group"
        aria-label={label}
        className="flex shrink-0 items-stretch divide-x divide-zinc-800 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950"
      >
        <button
          type="button"
          className={stepButton}
          aria-label={`Zmniejsz: ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-4" />
        </button>
        <output
          aria-live="polite"
          className={cn(
            "flex w-11 items-center justify-center font-mono text-sm font-medium tabular-nums",
            value > 0 ? "text-zinc-100" : "text-zinc-500",
          )}
        >
          {value}
        </output>
        <button
          type="button"
          className={stepButton}
          aria-label={`Zwiększ: ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
