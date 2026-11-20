"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Panel } from "@/components/panel";
import { Counter } from "@/components/counter";
import { Segmented } from "@/components/segmented";
import { SafeCard } from "@/components/safe-card";
import { formatPLN } from "@/lib/format";
import {
  getAverageLockSurcharge,
  matchSafe,
  type AmmoVolume,
  type AppliedSafe,
  type LockType,
  type SafeMatchInput,
  type SafeRecommendation,
} from "@/lib/safeMatcher";

interface SafeConfiguratorProps {
  input: SafeMatchInput;
  onChange: (patch: Partial<SafeMatchInput>) => void;
  appliedSafe: AppliedSafe | null;
  onApply: (recommendation: SafeRecommendation) => void;
}

export function SafeConfigurator({ input, onChange, appliedSafe, onApply }: SafeConfiguratorProps) {
  const result = useMemo(() => matchSafe(input), [input]);
  const surcharge = useMemo(() => getAverageLockSurcharge(), []);

  const isApplied = (rec: SafeRecommendation) =>
    appliedSafe?.safeId === rec.safe.id && appliedSafe.lockType === rec.lockType;

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
      <div className="space-y-4 lg:sticky lg:top-16 lg:col-span-5">
        <Panel title="Zestaw broni" className="divide-y divide-zinc-800">
          <Counter
            label="Pistolety i rewolwery"
            hint="Broń krótka"
            value={input.pistolsCount}
            onChange={(pistolsCount) => onChange({ pistolsCount })}
          />
          <Counter
            label="Karabiny bez optyki"
            hint="Broń długa, szybka w układaniu"
            value={input.riflesNoScopeCount}
            onChange={(riflesNoScopeCount) => onChange({ riflesNoScopeCount })}
          />
          <Counter
            label="Karabiny z lunetą"
            hint="Wymagają głębokości od 350 mm"
            value={input.riflesWithScopeCount}
            onChange={(riflesWithScopeCount) => onChange({ riflesWithScopeCount })}
          />
        </Panel>

        <Panel title="Wyposażenie" className="divide-y divide-zinc-800">
          <Segmented<AmmoVolume>
            label="Ilość amunicji"
            value={input.ammoVolume}
            onChange={(ammoVolume) => onChange({ ammoVolume })}
            options={[
              { value: "low", label: "Niewielka", detail: "bez półek" },
              { value: "high", label: "Duża", detail: "preferuj półki" },
            ]}
          />
          <Segmented<LockType>
            label="Rodzaj zamka"
            value={input.lockType}
            onChange={(lockType) => onChange({ lockType })}
            options={[
              { value: "key", label: "Kluczowy", detail: "cena bazowa" },
              { value: "electronic", label: "Elektroniczny", detail: `średnio +${formatPLN(surcharge)}` },
            ]}
          />
        </Panel>
      </div>

      <div className="space-y-4 lg:col-span-7">
        {result.warnings.map((warning) => (
          <div
            key={warning}
            role="note"
            className="flex gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-zinc-300">{warning}</p>
          </div>
        ))}

        {result.emptyReason === "no_weapons" ? (
          <EmptyState
            title="Dodaj przynajmniej jedną sztukę broni"
            body="Wybierz liczbę pistoletów lub karabinów, a dobierzemy szafę o odpowiedniej pojemności."
          />
        ) : null}

        {result.emptyReason === "no_fit" ? (
          <EmptyState
            title="Brak pojedynczej szafy dla tego zestawu"
            body="Żaden model w bazie nie pomieści tej liczby sztuk przy podanych wymaganiach. Rozważ podział broni na dwie szafy albo zmniejsz liczbę sztuk z lunetą."
          />
        ) : null}

        {result.matched ? (
          <SafeCard
            recommendation={result.matched}
            applied={isApplied(result.matched)}
            onApply={() => onApply(result.matched!)}
          />
        ) : null}

        {result.matched && result.reserve ? (
          <SafeCard
            recommendation={result.reserve}
            applied={isApplied(result.reserve)}
            onApply={() => onApply(result.reserve!)}
          />
        ) : null}

        {result.matched && !result.reserve ? (
          <EmptyState
            title="Brak wariantu z zapasem +30%"
            body="Żaden model w bazie nie pomieści zestawu powiększonego o 30%. Szafa dopasowana jest największą dostępną opcją."
          />
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-dashed border-zinc-800 px-4 py-8 text-center">
      <div className="text-sm font-medium text-zinc-200">{title}</div>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-zinc-500">{body}</p>
    </div>
  );
}
