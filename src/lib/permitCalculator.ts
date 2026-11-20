export type PermitPath = "sport" | "sport_collection" | "hunting";

/** Stawki 2026 oraz zakresy suwaków. */
export const PERMIT_RATES = {
  club: { min: 200, max: 1500, step: 50, default: 600 },
  medical: { min: 350, max: 800, step: 50, default: 500 },
  safe: { min: 500, max: 5000, step: 50, default: 2200 },
  promise: { unit: 17, min: 0, max: 30, default: 5 },
  pzssPatent: 400,
  sportsDoctor: 100,
  pzssLicense: 70,
  stampDutyPerPermit: 242,
} as const;

export const PERMIT_PATHS: Record<
  PermitPath,
  { label: string; description: string; permits: number }
> = {
  sport: {
    label: "Sportowe",
    description: "Jedno pozwolenie, klub strzelecki i licencja PZSS",
    permits: 1,
  },
  sport_collection: {
    label: "Sportowe + Kolekcjonerskie",
    description: "Dwa pozwolenia, ta sama ścieżka klubowa",
    permits: 2,
  },
  hunting: {
    label: "Łowieckie",
    description: "Jedno pozwolenie, członkostwo w kole łowieckim",
    permits: 1,
  },
};

export interface PermitInput {
  path: PermitPath;
  clubFeePln: number;
  medicalPln: number;
  promiseCount: number;
  safeBudgetPln: number;
}

export type PermitStageId = "club" | "medical_wpa" | "safe";

export interface PermitCostItem {
  id: string;
  label: string;
  amountPln: number;
  /** Krótka adnotacja pod pozycją, np. wzór na wyliczenie. */
  note?: string;
}

export interface PermitStage {
  id: PermitStageId;
  label: string;
  items: PermitCostItem[];
  subtotalPln: number;
}

export interface PermitCostBreakdown {
  stages: PermitStage[];
  totalPln: number;
  /** Uwagi zależne od wybranej ścieżki. */
  notes: string[];
}

export const DEFAULT_PERMIT_INPUT: PermitInput = {
  path: "sport_collection",
  clubFeePln: PERMIT_RATES.club.default,
  medicalPln: PERMIT_RATES.medical.default,
  promiseCount: PERMIT_RATES.promise.default,
  safeBudgetPln: PERMIT_RATES.safe.default,
};

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function sum(items: PermitCostItem[]): number {
  return items.reduce((acc, item) => acc + item.amountPln, 0);
}

export function calculatePermitCost(input: PermitInput): PermitCostBreakdown {
  const { path } = input;
  const clubFee = clamp(input.clubFeePln, PERMIT_RATES.club.min, PERMIT_RATES.club.max);
  const medical = clamp(input.medicalPln, PERMIT_RATES.medical.min, PERMIT_RATES.medical.max);
  const promiseCount = Math.round(
    clamp(input.promiseCount, PERMIT_RATES.promise.min, PERMIT_RATES.promise.max),
  );
  const safeBudget = Math.max(0, Number.isFinite(input.safeBudgetPln) ? input.safeBudgetPln : 0);

  const isHunting = path === "hunting";
  const permits = PERMIT_PATHS[path].permits;
  const stampDuty = permits * PERMIT_RATES.stampDutyPerPermit;

  const clubItems: PermitCostItem[] = [
    {
      id: "club",
      label: isHunting ? "Koło łowieckie: wpisowe i składka" : "Klub strzelecki: wpisowe i składka",
      amountPln: clubFee,
    },
  ];
  if (!isHunting) {
    clubItems.push(
      { id: "patent", label: "Patent strzelecki PZSS", amountPln: PERMIT_RATES.pzssPatent },
      { id: "sports_doctor", label: "Lekarz sportowy", amountPln: PERMIT_RATES.sportsDoctor },
      { id: "license", label: "Licencja zawodnicza PZSS", amountPln: PERMIT_RATES.pzssLicense },
    );
  }

  const wpaItems: PermitCostItem[] = [
    { id: "medical", label: "Badania lekarskie i psychologiczne", amountPln: medical },
    {
      id: "stamp_duty",
      label: "Opłata skarbowa WPA",
      amountPln: stampDuty,
      note: `${permits} × ${PERMIT_RATES.stampDutyPerPermit} zł`,
    },
    {
      id: "promises",
      label: "Promesy",
      amountPln: promiseCount * PERMIT_RATES.promise.unit,
      note: `${promiseCount} × ${PERMIT_RATES.promise.unit} zł`,
    },
  ];

  const safeItems: PermitCostItem[] = [
    { id: "safe", label: "Szafa S1", amountPln: safeBudget },
  ];

  const stages: PermitStage[] = [
    {
      id: "club",
      label: isHunting ? "Koło / PZŁ" : "Klub / PZSS",
      items: clubItems,
      subtotalPln: sum(clubItems),
    },
    {
      id: "medical_wpa",
      label: "Badania / WPA",
      items: wpaItems,
      subtotalPln: sum(wpaItems),
    },
    { id: "safe", label: "Szafa S1", items: safeItems, subtotalPln: sum(safeItems) },
  ];

  const notes: string[] = [];
  if (isHunting) {
    notes.push(
      "Dla ścieżki łowieckiej patent i licencja PZSS nie obowiązują. Koszt egzaminu łowieckiego i stażu wlicz do pola wpisowego i składki.",
    );
  }

  return {
    stages,
    totalPln: stages.reduce((acc, stage) => acc + stage.subtotalPln, 0),
    notes,
  };
}
