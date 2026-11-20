import { SAFES, type SafeModel } from "@/data/safes";

export type AmmoVolume = "low" | "high";
export type LockType = "key" | "electronic";

export interface SafeMatchInput {
  pistolsCount: number;
  riflesNoScopeCount: number;
  riflesWithScopeCount: number;
  ammoVolume: AmmoVolume;
  lockType: LockType;
}

export type RecommendationKind = "matched" | "reserve";

export interface SafeRecommendation {
  kind: RecommendationKind;
  label: string;
  /** Krótkie uzasadnienie wyświetlane na karcie. */
  explanation: string;
  safe: SafeModel;
  lockType: LockType;
  pricePln: number;
  /** Dopłata za zamek elektroniczny względem kluczowego (0 dla zamka kluczowego). */
  lockSurchargePln: number;
  /** Wymagana pojemność, dla której dobrano szafę. */
  requiredRifles: number;
  requiredPistols: number;
  spareRifles: number;
  sparePistols: number;
}

export interface SafeMatchResult {
  matched: SafeRecommendation | null;
  reserve: SafeRecommendation | null;
  warnings: string[];
  /** Powód braku wyniku, jeśli `matched` jest `null`. */
  emptyReason: "no_weapons" | "no_fit" | null;
}

export const MIN_DEPTH_WITH_SCOPE_MM = 350;
export const PREFERRED_DEPTH_MANY_SCOPES_MM = 400;
export const MANY_SCOPES_THRESHOLD = 3;
export const RESERVE_FACTOR = 1.3;

export const MATCH_LABELS = {
  matched: "Dopasowana do obecnych planów",
  reserve: "Rekomendowana z zapasem (+30%)",
} as const;

export const SCOPE_DEPTH_WARNING =
  "Broń z lunetą stoi w szafie pionowo, a optyka z montażem wystaje ponad lufę o kilka centymetrów. W szafie płytszej niż 350 mm luneta zwykle opiera się o drzwi, a broń trzeba rozkładać lub zdejmować optykę przy każdym odkładaniu.";

/** Szafa przeniesiona z konfiguratora do kalkulatora. */
export interface AppliedSafe {
  safeId: string;
  name: string;
  lockType: LockType;
  pricePln: number;
}

export const LOCK_LABELS: Record<LockType, string> = {
  key: "Zamek kluczowy",
  electronic: "Zamek elektroniczny",
};

export function getLockLabel(lockType: LockType): string {
  return LOCK_LABELS[lockType];
}

export const DEFAULT_SAFE_INPUT: SafeMatchInput = {
  pistolsCount: 2,
  riflesNoScopeCount: 1,
  riflesWithScopeCount: 1,
  ammoVolume: "low",
  lockType: "key",
};

export function getSafePrice(safe: SafeModel, lockType: LockType): number {
  return lockType === "electronic" ? safe.priceElectronicLockPln : safe.priceKeyLockPln;
}

export function getLockSurcharge(safe: SafeModel): number {
  return safe.priceElectronicLockPln - safe.priceKeyLockPln;
}

/** Średnia dopłata za zamek elektroniczny w całej bazie, zaokrąglona do 10 zł. */
export function getAverageLockSurcharge(safes: readonly SafeModel[] = SAFES): number {
  if (safes.length === 0) return 0;
  const avg = safes.reduce((acc, s) => acc + getLockSurcharge(s), 0) / safes.length;
  return Math.round(avg / 10) * 10;
}

function clampCount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(10, Math.max(0, Math.round(value)));
}

interface Requirement {
  rifles: number;
  pistols: number;
  scoped: number;
}

function fits(safe: SafeModel, req: Requirement): boolean {
  return safe.capacityRifles >= req.rifles && safe.capacityPistols >= req.pistols;
}

/**
 * Wybiera najlepszą szafę spełniającą wymaganie.
 * Kolejność: (1) kategoria meblowa dla samych pistoletów, (2) głębokość dla optyki,
 * (3) półki przy dużej ilości amunicji, (4) najniższa cena z wybranym zamkiem.
 */
function pickSafe(
  req: Requirement,
  input: SafeMatchInput,
): { safe: SafeModel } | null {
  const pistolsOnly = req.rifles === 0 && req.pistols > 0;

  let candidates = SAFES.filter((s) => fits(s, req));

  if (pistolsOnly) {
    const furniture = candidates.filter((s) => s.category === "furniture");
    if (furniture.length > 0) candidates = furniture;
  } else {
    // Broń długa wymaga szafy na broń długą (meblowe mają capacityRifles = 0).
    candidates = candidates.filter((s) => s.category === "rifle");
  }

  if (req.scoped > 0) {
    candidates = candidates.filter((s) => s.externalDepthMm >= MIN_DEPTH_WITH_SCOPE_MM);
    if (req.scoped >= MANY_SCOPES_THRESHOLD) {
      const deep = candidates.filter((s) => s.externalDepthMm >= PREFERRED_DEPTH_MANY_SCOPES_MM);
      if (deep.length > 0) candidates = deep;
    }
  }

  if (input.ammoVolume === "high") {
    const withShelves = candidates.filter((s) => s.hasShelves);
    if (withShelves.length > 0) candidates = withShelves;
  }

  if (candidates.length === 0) return null;

  const sorted = [...candidates].sort(
    (a, b) =>
      getSafePrice(a, input.lockType) - getSafePrice(b, input.lockType) ||
      a.weightKg - b.weightKg,
  );
  return { safe: sorted[0] };
}

function buildRecommendation(
  kind: RecommendationKind,
  safe: SafeModel,
  req: Requirement,
  input: SafeMatchInput,
  sameAsMatched = false,
): SafeRecommendation {
  const spareRifles = safe.capacityRifles - req.rifles;
  const sparePistols = safe.capacityPistols - req.pistols;

  let explanation: string;
  if (kind === "matched") {
    explanation =
      spareRifles + sparePistols === 0
        ? "Pojemność równa dokładnie obecnemu planowi, bez wolnych miejsc."
        : "Najtańszy model, który pomieści zaplanowane sztuki broni.";
  } else {
    explanation = sameAsMatched
      ? `Większość strzelców dokupuje broń w pierwszym roku. Ten model ma już taki zapas: pomieści ${req.rifles} dł. i ${req.pistols} kr., czyli zestaw powiększony o 30%.`
      : "Większość strzelców dokupuje broń w pierwszym roku. Wymiana szafy po kilku miesiącach kosztuje zwykle więcej niż dopłata do większego modelu.";
  }

  return {
    kind,
    label: MATCH_LABELS[kind],
    explanation,
    safe,
    lockType: input.lockType,
    pricePln: getSafePrice(safe, input.lockType),
    lockSurchargePln: input.lockType === "electronic" ? getLockSurcharge(safe) : 0,
    requiredRifles: req.rifles,
    requiredPistols: req.pistols,
    spareRifles,
    sparePistols,
  };
}

export function matchSafe(rawInput: SafeMatchInput): SafeMatchResult {
  const input: SafeMatchInput = {
    ...rawInput,
    pistolsCount: clampCount(rawInput.pistolsCount),
    riflesNoScopeCount: clampCount(rawInput.riflesNoScopeCount),
    riflesWithScopeCount: clampCount(rawInput.riflesWithScopeCount),
  };

  const rifles = input.riflesNoScopeCount + input.riflesWithScopeCount;
  const warnings: string[] = [];

  if (rifles === 0 && input.pistolsCount === 0) {
    return { matched: null, reserve: null, warnings, emptyReason: "no_weapons" };
  }

  if (input.riflesWithScopeCount > 0) warnings.push(SCOPE_DEPTH_WARNING);

  const currentReq: Requirement = {
    rifles,
    pistols: input.pistolsCount,
    scoped: input.riflesWithScopeCount,
  };
  const reserveReq: Requirement = {
    rifles: rifles > 0 ? Math.ceil(rifles * RESERVE_FACTOR) : 0,
    pistols: input.pistolsCount > 0 ? Math.ceil(input.pistolsCount * RESERVE_FACTOR) : 0,
    // Zapas zakłada, że nowa broń może mieć optykę, gdy użytkownik już jej używa.
    scoped: input.riflesWithScopeCount,
  };

  const matchedPick = pickSafe(currentReq, input);
  if (!matchedPick) {
    return { matched: null, reserve: null, warnings, emptyReason: "no_fit" };
  }

  const reservePick = pickSafe(reserveReq, input);

  if (
    input.riflesWithScopeCount >= MANY_SCOPES_THRESHOLD &&
    matchedPick.safe.externalDepthMm < PREFERRED_DEPTH_MANY_SCOPES_MM
  ) {
    warnings.push(
      "Przy trzech lub więcej sztukach z lunetą zalecamy głębokość co najmniej 400 mm. W bazie nie ma modelu, który spełnia to wymaganie i pomieści Twój zestaw.",
    );
  }

  if (input.ammoVolume === "high" && !matchedPick.safe.hasShelves) {
    warnings.push(
      "Żaden model z półkami nie pomieści tego zestawu. Amunicję trzeba będzie przechowywać osobno lub w drugiej szafie.",
    );
  }

  return {
    matched: buildRecommendation("matched", matchedPick.safe, currentReq, input),
    reserve: reservePick
      ? buildRecommendation(
          "reserve",
          reservePick.safe,
          reserveReq,
          input,
          reservePick.safe.id === matchedPick.safe.id,
        )
      : null,
    warnings,
    emptyReason: null,
  };
}
