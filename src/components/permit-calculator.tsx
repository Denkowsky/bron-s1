"use client";

import { useMemo } from "react";
import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Panel } from "@/components/panel";
import { SliderField } from "@/components/slider-field";
import {
  PERMIT_PATHS,
  PERMIT_RATES,
  calculatePermitCost,
  type PermitInput,
  type PermitPath,
} from "@/lib/permitCalculator";
import { formatPLN } from "@/lib/format";
import { getLockLabel, type AppliedSafe } from "@/lib/safeMatcher";
import { cn } from "@/lib/utils";

interface PermitCalculatorProps {
  input: PermitInput;
  onChange: (patch: Partial<PermitInput>) => void;
  appliedSafe: AppliedSafe | null;
  onManualSafeBudget: (value: number) => void;
  onResetSafe: () => void;
  onGoToConfigurator: () => void;
}

const PATH_ORDER: PermitPath[] = ["sport_collection", "sport", "hunting"];

export function PermitCalculator({
  input,
  onChange,
  appliedSafe,
  onManualSafeBudget,
  onResetSafe,
  onGoToConfigurator,
}: PermitCalculatorProps) {
  const breakdown = useMemo(() => calculatePermitCost(input), [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
      <div className="space-y-4 lg:col-span-7">
        <Panel title="Ścieżka pozwolenia">
          <div role="radiogroup" aria-label="Ścieżka pozwolenia" className="grid gap-px bg-zinc-800 sm:grid-cols-3">
            {PATH_ORDER.map((path) => {
              const meta = PERMIT_PATHS[path];
              const active = input.path === path;
              const fee = meta.permits * PERMIT_RATES.stampDutyPerPermit;
              return (
                <button
                  key={path}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ path })}
                  className={cn(
                    "relative flex flex-col gap-1.5 bg-zinc-950 px-4 py-3 text-left transition-colors first:rounded-bl-md last:rounded-br-md hover:bg-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-500",
                    active && "bg-zinc-900",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 top-0 h-0.5",
                      active ? "bg-amber-500" : "bg-transparent",
                    )}
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-medium", active ? "text-zinc-100" : "text-zinc-300")}>
                      {meta.label}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "size-2.5 shrink-0 rounded-full border",
                        active ? "border-amber-500 bg-amber-500" : "border-zinc-600",
                      )}
                    />
                  </span>
                  <span className="text-xs leading-snug text-zinc-500">{meta.description}</span>
                  <span className="mt-auto flex items-center gap-2 pt-1">
                    <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                      Opłata WPA {formatPLN(fee)}
                    </span>
                    {path === "sport_collection" ? (
                      <Badge variant="outline" className="h-4 rounded-sm border-amber-500/40 px-1.5 text-[10px] text-amber-500">
                        Najczęstszy
                      </Badge>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Parametry kosztów" className="divide-y divide-zinc-800">
          <SliderField
            label={input.path === "hunting" ? "Koło łowieckie: wpisowe i składka" : "Klub strzelecki: wpisowe i składka"}
            hint={
              input.path === "hunting"
                ? "Wlicz tu także szkolenie i egzamin łowiecki, bo nie mają stałej stawki."
                : "Stawki klubów różnią się w zależności od miasta i oferty."
            }
            value={input.clubFeePln}
            min={PERMIT_RATES.club.min}
            max={PERMIT_RATES.club.max}
            step={PERMIT_RATES.club.step}
            onChange={(clubFeePln) => onChange({ clubFeePln })}
          />
          <SliderField
            label="Badania lekarskie i psychologiczne"
            value={input.medicalPln}
            min={PERMIT_RATES.medical.min}
            max={PERMIT_RATES.medical.max}
            step={PERMIT_RATES.medical.step}
            onChange={(medicalPln) => onChange({ medicalPln })}
          />
          <div>
            <SliderField
              label="Budżet na szafę S1"
              value={input.safeBudgetPln}
              min={PERMIT_RATES.safe.min}
              max={PERMIT_RATES.safe.max}
              step={PERMIT_RATES.safe.step}
              onChange={onManualSafeBudget}
            />
            {appliedSafe ? (
              <div className="mx-4 mb-3.5 flex items-center justify-between gap-3 rounded-sm border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                <span className="text-xs text-zinc-300">
                  Cena z konfiguratora: <span className="font-medium text-zinc-100">{appliedSafe.name}</span>,{" "}
                  {getLockLabel(appliedSafe.lockType).toLowerCase()}
                </span>
                <button
                  type="button"
                  onClick={onResetSafe}
                  className="inline-flex shrink-0 items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  <RotateCcw className="size-3" />
                  Przywróć {formatPLN(PERMIT_RATES.safe.default)}
                </button>
              </div>
            ) : null}
          </div>
          <PromiseInput value={input.promiseCount} onChange={(promiseCount) => onChange({ promiseCount })} />
        </Panel>

        <Panel title="Stałe stawki 2026">
          <dl className="grid grid-cols-1 gap-px bg-zinc-800 text-sm sm:grid-cols-2">
            {[
              ["Patent strzelecki PZSS", PERMIT_RATES.pzssPatent],
              ["Lekarz sportowy", PERMIT_RATES.sportsDoctor],
              ["Licencja zawodnicza PZSS", PERMIT_RATES.pzssLicense],
              ["Opłata skarbowa WPA (za pozwolenie)", PERMIT_RATES.stampDutyPerPermit],
            ].map(([label, amount]) => (
              <div key={label} className="flex items-baseline justify-between gap-3 bg-zinc-950/60 px-4 py-2.5">
                <dt className="text-zinc-400">{label}</dt>
                <dd className="font-mono tabular-nums text-zinc-100">{formatPLN(Number(amount))}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <aside className="lg:sticky lg:top-16 lg:col-span-5" aria-label="Podsumowanie kosztów">
        <Panel title="Podsumowanie">
          <div className="px-4 pt-3">
            {breakdown.stages.map((stage, index) => (
              <div key={stage.id} className={cn(index > 0 && "mt-4")}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                    <span className="text-amber-500">{String(index + 1).padStart(2, "0")}</span> {stage.label}
                  </h3>
                  <span className="font-mono text-xs font-medium tabular-nums text-zinc-300">
                    {formatPLN(stage.subtotalPln)}
                  </span>
                </div>
                <ul className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
                  {stage.items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
                      <span className="text-zinc-400">
                        {item.label}
                        {item.note ? (
                          <span className="ml-2 font-mono text-[11px] tabular-nums text-zinc-600">{item.note}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 font-mono tabular-nums text-zinc-100">
                        {formatPLN(item.amountPln)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {breakdown.notes.map((note) => (
            <p key={note} className="mx-4 mt-3 text-xs leading-relaxed text-zinc-500">
              {note}
            </p>
          ))}

          <Separator className="mt-4 bg-zinc-800" />
          <div className="px-4 py-4">
            <div className="text-xs text-zinc-400">Całkowity koszt na start</div>
            <div className="mt-1 font-mono text-4xl font-semibold tabular-nums tracking-tight text-zinc-100">
              {formatPLN(breakdown.totalPln)}
            </div>
            <Button
              onClick={onGoToConfigurator}
              className="mt-4 h-11 w-full rounded-md bg-amber-500 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
            >
              Dobierz konkretną szafę S1
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Panel>
      </aside>
    </div>
  );
}

function PromiseInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { min, max, unit } = PERMIT_RATES.promise;
  const set = (next: number) => onChange(Math.min(max, Math.max(min, Math.round(next) || 0)));
  const stepButton =
    "flex size-9 items-center justify-center text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-500";
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div>
        <label htmlFor="promise-count" className="text-sm text-zinc-300">
          Liczba promes na start
        </label>
        <div className="mt-0.5 font-mono text-xs tabular-nums text-zinc-500">
          {formatPLN(unit)} / szt., łącznie {formatPLN(value * unit)}
        </div>
      </div>
      <div className="flex shrink-0 items-stretch divide-x divide-zinc-800 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
        <button type="button" className={stepButton} aria-label="Zmniejsz liczbę promes" disabled={value <= min} onClick={() => set(value - 1)}>
          <Minus className="size-4" />
        </button>
        <input
          id="promise-count"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => set(event.target.valueAsNumber)}
          className="w-14 bg-transparent text-center font-mono text-sm font-medium tabular-nums text-zinc-100 outline-none [appearance:textfield] focus-visible:bg-zinc-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button type="button" className={stepButton} aria-label="Zwiększ liczbę promes" disabled={value >= max} onClick={() => set(value + 1)}>
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
