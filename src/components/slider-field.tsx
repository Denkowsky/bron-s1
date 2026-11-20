"use client";

import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import { formatPLN } from "@/lib/format";

interface SliderFieldProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function SliderField({ label, hint, value, min, max, step, onChange }: SliderFieldProps) {
  const id = useId();
  return (
    <div className="px-4 py-3.5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label id={id} className="text-sm text-zinc-300">
          {label}
        </label>
        <output
          aria-labelledby={id}
          className="min-w-[6.5rem] text-right font-mono text-sm font-medium tabular-nums text-zinc-100"
        >
          {formatPLN(value)}
        </output>
      </div>
      <Slider
        aria-labelledby={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
      />
      <div className="mt-2 flex justify-between font-mono text-[11px] tabular-nums text-zinc-500">
        <span>{formatPLN(min)}</span>
        <span>{formatPLN(max)}</span>
      </div>
      {hint ? <p className="mt-2 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}
