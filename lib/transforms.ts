/**
 * Convert Excel decimal fraction of a day to total minutes.
 * E.g. 0.0833... (2h) → 120 minutes
 */
export function excelToMinutes(value: string | number): number {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return 0;
  return Math.round(num * 24 * 60);
}

/**
 * Format minutes as "H:MM" string.
 */
export function formatTime(minutes: number): string {
  if (minutes <= 0) return "0:00";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

/**
 * Convert Excel decimal to formatted time string.
 */
export function excelToFormatted(value: string | number): string {
  return formatTime(excelToMinutes(value));
}

/**
 * Parse an Excel serial date number to a JS Date.
 * Excel epoch is 1900-01-01 (with the 1900 leap year bug).
 */
export function excelDateToJS(serial: number): Date {
  const utcDays = Math.floor(serial - 25569);
  return new Date(utcDays * 86400 * 1000);
}

/**
 * Format a Date as dd/mm/yyyy.
 */
export function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
