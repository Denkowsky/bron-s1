/**
 * Baza szaf klasy S1 (MVP).
 *
 * UWAGA: wymiary, wagi i ceny są orientacyjne i pochodzą z uproszczonego
 * zestawienia na potrzeby MVP. Przed publikacją zweryfikuj każdy rekord
 * z kartą produktu producenta i podmień `affiliateUrl` na właściwy link.
 */

export type SafeCategory = "furniture" | "rifle";

export interface SafeModel {
  id: string;
  brand: string;
  name: string;
  category: SafeCategory;
  capacityRifles: number;
  capacityPistols: number;
  /** Głębokość zewnętrzna w mm (zakres w bazie: 280–440). */
  externalDepthMm: number;
  externalHeightMm: number;
  externalWidthMm: number;
  weightKg: number;
  hasShelves: boolean;
  priceKeyLockPln: number;
  priceElectronicLockPln: number;
  affiliateUrl: string;
  /** Maksymalnie 2 krótkie, techniczne fakty. */
  highlights: [string] | [string, string];
}

export const SAFES: readonly SafeModel[] = [
  {
    id: "konsmetal-koliber-s1",
    brand: "Konsmetal",
    name: "Koliber S1",
    category: "furniture",
    capacityRifles: 0,
    capacityPistols: 4,
    externalDepthMm: 280,
    externalHeightMm: 420,
    externalWidthMm: 350,
    weightKg: 24,
    hasShelves: false,
    priceKeyLockPln: 790,
    priceElectronicLockPln: 1090,
    affiliateUrl: "#ceneo-konsmetal-koliber-s1",
    highlights: [
      "Tylko broń krótka, gabaryt do szafki lub szuflady",
      "Otwory do kotwienia w podłożu lub ścianie",
    ],
  },
  {
    id: "novcan-g3",
    brand: "Novcan",
    name: "G3",
    category: "furniture",
    capacityRifles: 0,
    capacityPistols: 8,
    externalDepthMm: 300,
    externalHeightMm: 500,
    externalWidthMm: 400,
    weightKg: 38,
    hasShelves: true,
    priceKeyLockPln: 1190,
    priceElectronicLockPln: 1490,
    affiliateUrl: "#ceneo-novcan-g3",
    highlights: [
      "Wewnętrzna półka na amunicję i magazynki",
      "Wersja meblowa na broń krótką",
    ],
  },
  {
    id: "stalpol-gun-guard-4",
    brand: "Stalpol",
    name: "Gun Guard 4",
    category: "rifle",
    capacityRifles: 4,
    capacityPistols: 2,
    externalDepthMm: 300,
    externalHeightMm: 1000,
    externalWidthMm: 300,
    weightKg: 46,
    hasShelves: false,
    priceKeyLockPln: 1190,
    priceElectronicLockPln: 1590,
    affiliateUrl: "#ceneo-stalpol-gun-guard-4",
    highlights: [
      "Płytka szafa na broń długą bez optyki",
      "Otwory montażowe w tylnej ściance",
    ],
  },
  {
    id: "promet-4p",
    brand: "Promet",
    name: "Bravo 4p",
    category: "rifle",
    capacityRifles: 4,
    capacityPistols: 2,
    externalDepthMm: 320,
    externalHeightMm: 1100,
    externalWidthMm: 320,
    weightKg: 52,
    hasShelves: false,
    priceKeyLockPln: 1290,
    priceElectronicLockPln: 1690,
    affiliateUrl: "#ceneo-promet-bravo-4p",
    highlights: [
      "Na broń długą bez lunety, za płytka na optykę",
      "Zamek ryglujący w kilku punktach",
    ],
  },
  {
    id: "stalpol-gun-guard-6",
    brand: "Stalpol",
    name: "Gun Guard 6",
    category: "rifle",
    capacityRifles: 6,
    capacityPistols: 3,
    externalDepthMm: 350,
    externalHeightMm: 1300,
    externalWidthMm: 400,
    weightKg: 68,
    hasShelves: true,
    priceKeyLockPln: 1690,
    priceElectronicLockPln: 2090,
    affiliateUrl: "#ceneo-stalpol-gun-guard-6",
    highlights: [
      "Głębokość 350 mm: minimum dla broni z lunetą",
      "Półka wewnętrzna na amunicję",
    ],
  },
  {
    id: "promet-6p",
    brand: "Promet",
    name: "Bravo 6p",
    category: "rifle",
    capacityRifles: 6,
    capacityPistols: 2,
    externalDepthMm: 360,
    externalHeightMm: 1300,
    externalWidthMm: 400,
    weightKg: 74,
    hasShelves: false,
    priceKeyLockPln: 1790,
    priceElectronicLockPln: 2190,
    affiliateUrl: "#ceneo-promet-bravo-6p",
    highlights: [
      "Głębokość 360 mm: luneta mieści się przy drzwiach",
      "Bez półek, pełna wysokość na broń",
    ],
  },
  {
    id: "stalpol-gun-guard-8",
    brand: "Stalpol",
    name: "Gun Guard 8",
    category: "rifle",
    capacityRifles: 8,
    capacityPistols: 4,
    externalDepthMm: 400,
    externalHeightMm: 1400,
    externalWidthMm: 500,
    weightKg: 96,
    hasShelves: true,
    priceKeyLockPln: 2290,
    priceElectronicLockPln: 2690,
    affiliateUrl: "#ceneo-stalpol-gun-guard-8",
    highlights: [
      "Głębokość 400 mm: zapas na kilka sztuk z optyką",
      "Półka na amunicję i akcesoria",
    ],
  },
  {
    id: "novcan-8",
    brand: "Novcan",
    name: "8",
    category: "rifle",
    capacityRifles: 8,
    capacityPistols: 6,
    externalDepthMm: 440,
    externalHeightMm: 1500,
    externalWidthMm: 550,
    weightKg: 124,
    hasShelves: true,
    priceKeyLockPln: 2890,
    priceElectronicLockPln: 3290,
    affiliateUrl: "#ceneo-novcan-8",
    highlights: [
      "Największa głębokość w bazie: 440 mm",
      "Wydzielona część na broń krótką z półką",
    ],
  },
];
