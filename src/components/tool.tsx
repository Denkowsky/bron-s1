"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermitCalculator } from "@/components/permit-calculator";
import { SafeConfigurator } from "@/components/safe-configurator";
import { DEFAULT_PERMIT_INPUT, PERMIT_RATES, type PermitInput } from "@/lib/permitCalculator";
import {
  DEFAULT_SAFE_INPUT,
  type AppliedSafe,
  type SafeMatchInput,
  type SafeRecommendation,
} from "@/lib/safeMatcher";

type ModuleId = "permit" | "safe";

const triggerClass =
  "h-12 flex-none rounded-none border-0 px-3 text-[13px] font-medium text-zinc-500 data-active:bg-transparent data-active:text-zinc-100 dark:data-active:bg-transparent dark:data-active:border-transparent after:bottom-0! after:bg-amber-500! sm:px-4";

export function Tool() {
  const [module, setModule] = useState<ModuleId>("permit");
  const [permit, setPermit] = useState<PermitInput>(DEFAULT_PERMIT_INPUT);
  const [safeInput, setSafeInput] = useState<SafeMatchInput>(DEFAULT_SAFE_INPUT);
  const [appliedSafe, setAppliedSafe] = useState<AppliedSafe | null>(null);

  const patchPermit = useCallback((patch: Partial<PermitInput>) => {
    setPermit((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchSafe = useCallback((patch: Partial<SafeMatchInput>) => {
    setSafeInput((prev) => ({ ...prev, ...patch }));
  }, []);

  const applySafe = useCallback((rec: SafeRecommendation) => {
    setPermit((prev) => ({ ...prev, safeBudgetPln: rec.pricePln }));
    setAppliedSafe({
      safeId: rec.safe.id,
      name: `${rec.safe.brand} ${rec.safe.name}`,
      lockType: rec.lockType,
      pricePln: rec.pricePln,
    });
    setModule("permit");
  }, []);

  return (
    <Tabs
      value={module}
      onValueChange={(value) => setModule(value as ModuleId)}
      className="min-h-screen gap-0"
    >
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 sm:gap-8">
          <span className="shrink-0 font-mono text-sm font-semibold tracking-tight text-zinc-100">
            SEJF<span className="text-amber-500">{"//"}</span>S1
          </span>
          <TabsList variant="line" className="h-12 min-w-0 flex-1 justify-start gap-0 overflow-x-auto p-0">
            <TabsTrigger value="permit" className={triggerClass}>
              <span className="font-mono text-zinc-600 group-data-[variant=line]/tabs-list:data-active:text-amber-500">01.</span>
              <span className="hidden sm:inline">Kalkulator Pozwolenia</span>
              <span className="sm:hidden">Kalkulator</span>
            </TabsTrigger>
            <TabsTrigger value="safe" className={triggerClass}>
              <span className="font-mono text-zinc-600">02.</span>
              <span className="hidden sm:inline">Konfigurator Szafy S1</span>
              <span className="sm:hidden">Szafa S1</span>
            </TabsTrigger>
          </TabsList>
          <span
            aria-disabled="true"
            className="hidden shrink-0 cursor-not-allowed items-center gap-2 rounded-sm border border-zinc-800 px-2.5 py-1 text-xs text-zinc-600 md:inline-flex"
          >
            <span className="font-mono">03.</span> Baza Pytań
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Wkrótce</span>
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-5">
        <TabsContent value="permit" className="text-sm">
          <PermitCalculator
            input={permit}
            onChange={patchPermit}
            appliedSafe={appliedSafe}
            onManualSafeBudget={(safeBudgetPln) => {
              patchPermit({ safeBudgetPln });
              setAppliedSafe(null);
            }}
            onResetSafe={() => {
              patchPermit({ safeBudgetPln: PERMIT_RATES.safe.default });
              setAppliedSafe(null);
            }}
            onGoToConfigurator={() => setModule("safe")}
          />
        </TabsContent>
        <TabsContent value="safe" className="text-sm">
          <SafeConfigurator
            input={safeInput}
            onChange={patchSafe}
            appliedSafe={appliedSafe}
            onApply={applySafe}
          />
        </TabsContent>
      </main>

      <footer className="border-t border-zinc-800 px-4 py-4">
        <p className="mx-auto max-w-[1200px] text-xs leading-relaxed text-zinc-600">
          Kwoty mają charakter orientacyjny i nie stanowią porady prawnej. Ceny szaf pochodzą z bazy poglądowej, a linki
          w kartach są linkami afiliacyjnymi. Przed zakupem sprawdź aktualną cenę i parametry u sprzedawcy.
        </p>
      </footer>
    </Tabs>
  );
}
