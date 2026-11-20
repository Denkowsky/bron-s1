"use client";

import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/panel";
import { formatKg, formatNumber, formatPLN } from "@/lib/format";
import { getLockLabel, type SafeRecommendation } from "@/lib/safeMatcher";
import { cn } from "@/lib/utils";

interface SafeCardProps {
  recommendation: SafeRecommendation;
  applied: boolean;
  onApply: () => void;
}

export function SafeCard({ recommendation, applied, onApply }: SafeCardProps) {
  const { safe, kind } = recommendation;
  const isReserve = kind === "reserve";

  const rows: [string, string][] = [
    [
      "Wymiary W×S×G",
      `${formatNumber(safe.externalHeightMm)} × ${formatNumber(safe.externalWidthMm)} × ${formatNumber(safe.externalDepthMm)} mm`,
    ],
    ["Pojemność", `${safe.capacityRifles} dł. / ${safe.capacityPistols} kr.`],
    ["Waga", formatKg(safe.weightKg)],
    ["Półki", safe.hasShelves ? "Tak" : "Nie"],
    ["Zamek", getLockLabel(recommendation.lockType)],
  ];

  return (
    <Panel className={cn(isReserve && "border-amber-500/40")}>
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5">
        <Badge
          variant="outline"
          className={cn(
            "h-5 rounded-sm px-2 font-mono text-[10px] uppercase tracking-wider",
            isReserve ? "border-amber-500/50 text-amber-500" : "border-zinc-600 text-zinc-300",
          )}
        >
          {recommendation.label}
        </Badge>
      </div>

      <div className="px-4 pt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-zinc-500">{safe.brand}</div>
            <h3 className="text-lg font-semibold leading-tight text-zinc-100">{safe.name}</h3>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl font-semibold tabular-nums text-zinc-100">
              {formatPLN(recommendation.pricePln)}
            </div>
            {recommendation.lockSurchargePln > 0 ? (
              <div className="font-mono text-[11px] tabular-nums text-zinc-500">
                w tym +{formatPLN(recommendation.lockSurchargePln)} za zamek elektroniczny
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{recommendation.explanation}</p>

        <dl className="mt-3 divide-y divide-zinc-800/80 border-y border-zinc-800/80 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 py-1.5">
              <dt className="text-zinc-500">{label}</dt>
              <dd className="font-mono tabular-nums text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-2 font-mono text-[11px] tabular-nums text-zinc-500">
          Wolne miejsca: {recommendation.spareRifles} dł., {recommendation.sparePistols} kr. · W = wysokość, S = szerokość,
          G = głębokość
        </p>

        <ul className="mt-2 space-y-0.5 text-xs text-zinc-400">
          {safe.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span aria-hidden className="mt-[7px] size-1 shrink-0 bg-zinc-600" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-2 px-4 pb-4 sm:grid-cols-2">
        <Button asChild className="h-10 rounded-md bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400">
          <a href={safe.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer">
            Sprawdź cenę (Afiliacja)
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={onApply}
          className="h-10 rounded-md border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800"
        >
          {applied ? <Check className="size-4 text-amber-500" /> : null}
          {applied ? "Użyto w kalkulatorze" : "Użyj tej ceny w kalkulatorze"}
        </Button>
      </div>
    </Panel>
  );
}

