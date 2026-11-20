const NBSP = "\u00A0";

/** Grupuje tysiące niełamliwą spacją (także dla liczb 4-cyfrowych, czego nie robi Intl w pl-PL). */
export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Np. 2450 -> "2 450 zł". */
export function formatPLN(value: number): string {
  return `${formatNumber(value)}${NBSP}zł`;
}

/** Np. 1300 -> "1 300 mm". */
export function formatMm(value: number): string {
  return `${formatNumber(value)}${NBSP}mm`;
}

/** Np. 68 -> "68 kg". */
export function formatKg(value: number): string {
  return `${formatNumber(value)}${NBSP}kg`;
}
