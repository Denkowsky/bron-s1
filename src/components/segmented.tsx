"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  detail?: string;
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
}

/** Dwu- lub kilkustanowy przełącznik w formie radiogroup. */
export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  const labelId = useId();
  return (
    <div className="px-4 py-3">
      <div className="mb-2 text-sm text-zinc-200" id={labelId}>
        {label}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="grid gap-px overflow-hidden rounded-md border border-zinc-800 bg-zinc-800"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-500",
                active ? "bg-zinc-100 text-zinc-950" : "bg-zinc-950 text-zinc-300 hover:bg-zinc-900",
              )}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {option.detail ? (
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    active ? "text-zinc-600" : "text-zinc-500",
                  )}
                >
                  {option.detail}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
